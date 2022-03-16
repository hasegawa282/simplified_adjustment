// -- basic library --
import { Button, Stack } from 'react-bootstrap';
import React, { useState} from 'react';

// -- external components --
import Dialog from 'components/atoms/Dialog';
import CSVDownloader from 'components/atoms/CSVDownloader';
import ReceiptItemHistoryInputPanel from 'components/molecules/ReceiptItemHistoryInputPanel';

// -- external functions --

// -- external types --
import { ReceiptItemHistory, getReceiptItemHistories } from 'api/receipt'
import Input from 'components/atoms/Input';
import { convertDateIntoYMDHM } from 'functions/operateDate';
import AlertDialog from 'components/atoms/AlertDialog';
import { category_dict, name_dict } from 'utils/consts';
import { convertDict } from 'functions/converts';


// -- main component --
const Receipts: React.FC = () => {
  const [is_open, setIsOpen] = useState<boolean>(false)
  const [start, setStart] = useState<number>(0)
  const [end, setEnd] = useState<number>(0)
  const [csvs, setCsvs] = useState<any[][] | null>(null)


  const getCsvHeaders = () => {
    const headers = []
    //エクセルとの整合性を取るために順番大事
    const categories = ['食費', '遊び', '雑費']
    const buyers = ['はせ', 'かなこ']
    const users = ['はせ', 'かなこ', '半分']
    const taxes = ['1', '1.08']
    for (const category of categories) {
      for (const buyer of buyers) {
        for (const user of users) {
          if (buyer === user) continue
          for (const tax of taxes) {
            headers.push(`${category}_${buyer}_${user}_${tax}`)
          }
        }
      }
    }
    return headers
  }

  const getCsvs = async () => {
    if (!start) {
      AlertDialog.show('開始時刻は必須項目です');
      return
    }
    if (!end) {
      AlertDialog.show('終了時刻は必須項目です');
      return
    }
    if (start >= end) {
      AlertDialog.show('「開始時刻 < 終了時刻」である必要があります');
      return
    }
    console.log(start)
    console.log(end)
    const items = await getReceiptItemHistoryItems({
      start: start,
      end: end,
    })

    console.log(items)
    const headers = getCsvHeaders()
    // 各項目で配列を作成して、それに積み上げて最後にcsv化するのが良いか?
    const stacks: { [key: string]: number[] } = {}
    // initial
    // とりあえずは３カテゴリ*8項目
    for (const header of headers) {
      stacks[header] = []
    }
    console.log(stacks)
    for (const item of items) {
      const c = convertDict(item.category, category_dict)
      const b = convertDict(item.buyer, name_dict)
      const u = convertDict(item.user, name_dict)
      const key_name = `${c}_${b}_${u}_${item.tax}`
      if (stacks[key_name]) {
        stacks[key_name].push(item.price)
      }
    }
    const bodies: number[][] = []
    // csv化
    for (let i = 0; i < 50; i++) {
      let all_none_flag = true
      const body: number[] = []
      // headersの順番通りにbodiesに格納
      for (const header of headers) {
        if (stacks[header] && stacks[header].length > i) {
          body.push(stacks[header][i])
          all_none_flag = false
        } else {
          body.push(0)
        }
      }
      if (all_none_flag) break
      bodies.push(body)
    }
    console.log(bodies)
    setCsvs([headers, ...bodies])
    console.log([headers, ...bodies])
  }


  // get api通信をする関数
  const getReceiptItemHistoryItems = async (param: {
    start?: number;
    end?: number;
  }) => {
    let new_receipt_item_histories: ReceiptItemHistory[] = []
    const res = await getReceiptItemHistories(param)
    console.log(res)
    if (res.statusCode === 200) {
      new_receipt_item_histories = res.body
    }
    return new_receipt_item_histories
  }


  // -- render part --
  return (
    <Stack gap={3} className="col-md-10 mx-auto">
      <Stack gap={3} direction="horizontal">
        <Button onClick={() => setIsOpen(true)} variant="outline-dark">レシートアイテム追加</Button>
      </Stack>
      <Stack direction="horizontal" gap={3}>
        {csvs ? <CSVDownloader
          datas={csvs}
        /> : null}
          <Input
            id="start"
            type="datetime-local"
            value={start ? convertDateIntoYMDHM(start * 1000) : ''}
            onChange={(e) => {
              const dt = new Date(e.currentTarget.value)
              setStart(Math.floor(dt.getTime() / 1000))
            }}
          />
          <div>〜</div>
          <Input
            id="end"
            type="datetime-local"
            value={end ? convertDateIntoYMDHM(end * 1000) : ''}
            onChange={(e) => {
              const dt = new Date(e.currentTarget.value)
              setEnd(Math.floor(dt.getTime() / 1000))
            }}
          />
        <Button onClick={getCsvs} variant="outline-dark" className="ms-auto">CSV</Button>
      </Stack>
      <Dialog
        title_text="レシートアイテム追加"
        show={is_open}
        onHide={() => setIsOpen(false)}
      >
        <ReceiptItemHistoryInputPanel onDialogClose={() => setIsOpen(false)} />
      </Dialog>
    </Stack>
  );
};


// -- finally export part --

export default Receipts;
