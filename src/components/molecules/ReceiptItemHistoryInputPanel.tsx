// -- basic library --
import { Table, Button, Stack, Form } from 'react-bootstrap';
import React, { useState, useRef } from 'react';
// import {ImageAnnotatorClient} from "@google-cloud/vision"
import * as Icon from 'react-bootstrap-icons'

// -- external components --
import Input from 'components/atoms/Input';
import Select from 'components/atoms/Select';

// -- external types --
import { ReceiptItemHistory, postReceiptItemHistory, getReceiptItemHistories } from 'api/receipt'
import IconButton from 'components/atoms/IconButton';
// -- external functions --
import { validatePostString, validatePostNumber } from 'functions/validations'
import AlertDialog from 'components/atoms/AlertDialog';
import styles from 'utils/styles';
import { convertDateIntoYMDHM } from 'functions/operateDate';
import { detectReceipt } from 'functions/detectReceipt';
import getMode from 'functions/getMode';
import convertStringToNumber from 'functions/convertStringToNumber';
// -- external types --
import { SizeWH } from 'utils/types'

interface Param {
  onDialogClose: () => void;
}


// -- main component --
const ReceiptItemHistoryInputPanel: React.FC<Param> = (param) => {
  const [input_datas, setInputDatas] = useState<ReceiptItemHistory[]>([{
    date: Math.floor(new Date().getTime() / 1000),
    category: '',
    buyer: '',
    user: '',
    name: '',
    price: 0,
    tax: 1,
  }])
  const [file, setFile] = useState<File | null>(null)
  const [size, setSize] = useState<SizeWH>({
    width: 100,
    height: 100,
  })

  const canvasRef = useRef(null)
  const setReceiptOCRData = async () => {
    const res = await detectReceipt({
      file: file, 
      canvasRef:canvasRef, 
      setSize: setSize
    })
    console.log(res)
    if(!res) return
    const new_items: ReceiptItemHistory[] = []
    // DBのデータを取得する
    const res_receipt_item_histories = await getReceiptItemHistories({})
    let receipt_item_histories: ReceiptItemHistory[] = []
    if(res_receipt_item_histories.statusCode === 200){
      receipt_item_histories = res_receipt_item_histories.body
    }

    // 自動補完部分
    for(const item of res.items){
      const same_name_items = receipt_item_histories.filter((r) => {
        return r.name === item.name
      })
      // 自動保管したい要素 user buyer tax category
      const mode_user = getMode(same_name_items, 'user')
      const mode_buyer = getMode(same_name_items, 'buyer')
      const mode_category = getMode(same_name_items, 'category')
      const mode_tax = getMode(same_name_items, 'tax')
      const new_item = {
        date: item.date,
        category: mode_category || item.category || '',
        buyer: mode_buyer || item.buyer || '',
        user: mode_user || item.user || '',
        name: item.name || '',
        price: item.price || 0,
        tax: Number(mode_tax) || item.tax || 1,
      }
      new_items.push(new_item)
    }
    setInputDatas(new_items)
  }

  // 入力行を1つ追加する
  const addInputDatas = () => {
    const dt = new Date()
    const timestamp = dt.getTime();
    const unixtime = Math.floor(timestamp / 1000)
    const initial_input_data: ReceiptItemHistory = {
      date: unixtime,
      category: '',
      buyer: '',
      user: '',
      name: '',
      price: 0,
      tax: 1,
    }
    setInputDatas([...input_datas, initial_input_data])
  }

  // レシートの項目を減らす関数
  const decreaseInputDatas = () => {
    if (input_datas.length <= 1) {
      return
    }
    setInputDatas(input_datas.slice(0, -1))
  }

  const deleteInputData = (index: number) => {
    if(input_datas.length <= index || index < 0){
      return
    }
    if (input_datas.length <= 1) {
      return
    }
    setInputDatas([...input_datas.slice(0, index), ...input_datas.slice(index+1)])
  }

  // レシートの入力が変化した時を担う関数
  const onChangeInputDatas = (prop: {
    key: string;
    value: string;
    index: number;
  }) => {
    let new_input_datas = input_datas.slice()
    if (prop.key === 'date') {
      const dt = new Date(prop.value)
      new_input_datas[prop.index].date = Math.floor(dt.getTime() / 1000)
    } else if (prop.key === 'category') {
      new_input_datas[prop.index].category = prop.value
    } else if (prop.key === 'buyer') {
      new_input_datas[prop.index].buyer = prop.value
    } else if (prop.key === 'user') {
      new_input_datas[prop.index].user = prop.value
    } else if (prop.key === 'name') {
      new_input_datas[prop.index].name = prop.value
    } else if (prop.key === 'price') {
      new_input_datas[prop.index].price = convertStringToNumber(prop.value)
    } else if (prop.key === 'tax') {
      new_input_datas[prop.index].tax = convertStringToNumber(prop.value)
    }

    setInputDatas(new_input_datas)
  }

  // ファイルの入力の変化を担う関数
  const onfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const new_file = e.currentTarget.files?.item(0) || null
    setFile(new_file)
  }

  // get api通信をする関数
  const postReceiptItemHistories = async (input_datas: ReceiptItemHistory[]) => {
    console.log(input_datas)
    //validation
    for (let i = 0; i < input_datas.length; i++) {
      if (!validatePostNumber(input_datas[i].date)) {
        AlertDialog.show('日付は必須項目です');
        return
      }
      if (!validatePostString(input_datas[i].name)) {
        AlertDialog.show('商品名は必須項目です');
        return
      }
      if (!validatePostString(input_datas[i].category)) {
        AlertDialog.show('カテゴリーは必須項目です');
        return
      }
      if (!validatePostString(input_datas[i].buyer)) {
        AlertDialog.show('購入者は必須項目です');
        return
      }
      if (!validatePostString(input_datas[i].user)) {
        AlertDialog.show('使用者は必須項目です');
        return
      }
      if (!validatePostNumber(input_datas[i].price)) {
        AlertDialog.show('価格は必須項目です');
        return
      }
      if (!validatePostNumber(input_datas[i].tax)) {
        AlertDialog.show('税は必須項目です');
        return
      }
    }
    //API送信部分
    let error_flag = false
    for (let i = 0; i < input_datas.length; i++) {
      const post_param = input_datas[i]
      console.log(post_param)
      const res = await postReceiptItemHistory(post_param)
      console.log(res)
      if (res.statusCode !== 200) {
        error_flag = true
      }
    }
    if (!error_flag) {
      AlertDialog.show('レシート項目の追加に成功しました', () => {
        console.log('閉じる')
        param.onDialogClose()
      });
    }
  }

  // -- render part --
  return (
    <Stack gap={2} style={{ width: '100%' }} direction="horizontal">
      <Stack gap={2}>
        <Stack gap={2}>
        <Form.Group controlId="formFile" className="mb-3">
            <Form.Control type="file" onChange={onfileChange} accept="image/png, image/jpeg" />
          </Form.Group>
          <Button onClick={setReceiptOCRData} variant="outline-dark">OCR</Button>
        </Stack>
        <Stack>
          <Stack>
            <canvas 
            className="canvas" 
            ref={canvasRef} 
            height={size.height}
            width={size.width}
            style={{width: size.width, height: 'auto'}}/>
          </Stack>
        </Stack>
      </Stack>
      <div className="vr" />
      <Stack>
        <Stack direction="horizontal" gap={2}>
          <IconButton onClick={addInputDatas} className="ms-auto"><Icon.PlusCircleFill size={styles.icon_size} /></IconButton>
          {/* <IconButton onClick={decreaseInputDatas}><Icon.DashCircleFill size={styles.icon_size} color="red" /></IconButton> */}
        </Stack>
        <Stack>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                {['', '日付', '商品名', 'カテゴリー', '購入者', '使用者', '価格', '税'].map((head, index) => {
                  return <th key={`${index}_${head}`}>{head}</th>
                })}
              </tr>
            </thead>
            <tbody>
              {input_datas.map((input_data, index) => (
                <tr key={index}>
                  <td>
                    <IconButton onClick={() => deleteInputData(index)}><Icon.DashCircleFill size={styles.icon_size} color="red" /></IconButton>
                  </td>
                  <td>
                    <Input
                      id="date"
                      type="datetime-local"
                      value={convertDateIntoYMDHM(input_data.date * 1000)}
                      onChange={(e) => onChangeInputDatas({
                        key: 'date',
                        value: e.currentTarget.value,
                        index: index,
                      })}
                    />
                  </td>
                  <td>
                    <Input
                      id="name"
                      value={input_data.name}
                      onChange={(e) => onChangeInputDatas({
                        key: 'name',
                        value: e.currentTarget.value,
                        index: index,
                      })}
                    />
                  </td>
                  <td>
                  <Select
                      onChange={(e) => onChangeInputDatas({
                        key: 'category',
                        value: e.currentTarget.value,
                        index: index,
                      })}
                      value={input_data.category}
                      options={[
                        { value: "", name: '選択してください' },
                        { value: "food_expenses", name: '食費' },
                        { value: "amusement_expenses", name: '遊び' },
                        { value: "miscellaneous_expenses", name: '雑費' },
                      ]}
                    />
                  </td>
                  <td>
                    <Select
                      onChange={(e) => onChangeInputDatas({
                        key: 'buyer',
                        value: e.currentTarget.value,
                        index: index,
                      })}
                      value={input_data.buyer}
                      options={[
                        { value: "", name: '選択してください' },
                        { value: "hase", name: 'はせ' },
                        { value: "kanachan", name: 'かなちゃん' },
                      ]}
                    />
                  </td>
                  <td>
                    <Select
                      onChange={(e) => onChangeInputDatas({
                        key: 'user',
                        value: e.currentTarget.value,
                        index: index,
                      })}
                      value={input_data.user}
                      options={[
                        { value: "", name: '選択してください' },
                        { value: "hase", name: 'はせ' },
                        { value: "kanachan", name: 'かなちゃん' },
                        { value: "half", name: '半分' },
                      ]}
                    />
                  </td>
                  <td>
                    <Input
                      id="price"
                      value={String(input_data.price)}
                      onChange={(e) => onChangeInputDatas({
                        key: 'price',
                        value: e.currentTarget.value,
                        index: index,
                      })}
                      type="number"
                    />
                  </td>
                  <td>
                    <Input
                      id="tax"
                      value={String(input_data.tax)}
                      onChange={(e) => onChangeInputDatas({
                        key: 'tax',
                        value: e.currentTarget.value,
                        index: index,
                      })}
                      type="number"
                      step="0.01"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="outline-dark" onClick={() => postReceiptItemHistories(input_datas)} className="col-md-5 mx-auto">追加する</Button>
        </Stack>
      </Stack>
    </Stack>
  );
};


// -- finally export part --

export default ReceiptItemHistoryInputPanel;
