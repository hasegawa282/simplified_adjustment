import { ReceiptItemHistory } from 'api/receipt'
import { SizeWH, VectorXY } from 'utils/types'

export interface AnnotationVector {
  top_left: VectorXY;
  top_right: VectorXY;
  bottom_right: VectorXY;
  bottom_left: VectorXY;
}


// google vision apiから帰ってくるresponseを1行ごとの情報に変換する関数
const get_sorted_lines = (responses: any[]) => {
  let width = 1
  let height = 1
  if (responses.length <= 0) {
    return {
      lines: [],
      width: width,
      height: height,
    }
  }
  const res = responses[0].fullTextAnnotation
  console.log(res)
  const bounds = []
  for (let i = 0; i < res.pages.length; i++) {
    for (let j = 0; j < res.pages[i].blocks.length; j++) {
      width = res.pages[i].width
      height = res.pages[i].height
      for (let k = 0; k < res.pages[i].blocks[j].paragraphs.length; k++) {
        for (let l = 0; l < res.pages[i].blocks[j].paragraphs[k].words.length; l++) {
          for (let m = 0; m < res.pages[i].blocks[j].paragraphs[k].words[l].symbols.length; m++) {
            const symbol = res.pages[i].blocks[j].paragraphs[k].words[l].symbols[m]
            const x = symbol.boundingBox.vertices[0].x
            const y = symbol.boundingBox.vertices[0].y
            const text = symbol.text

            bounds.push([x, y, text, symbol.boundingBox])
          }
        }
      }
    }
  }
  bounds.sort((a, b) => {
    if (a[1] < b[1]) return -1;
    if (a[1] > b[1]) return 1;
    return 0
  })
  let old_y = -1
  let line: any[] = []
  const lines: any[] = []
  //閾値
  const threshold = 15
  for (let i = 0; i < bounds.length; i++) {
    const bound = bounds[i]
    // const x = bound[0]
    const y = bound[1]
    if (old_y === -1) {
      old_y = y
    } else if ((old_y - threshold <= y) && (y <= old_y + threshold)) {
      old_y = y
    } else {
      old_y = -1
      line.sort((a, b) => {
        if (a[0] < b[0]) return -1;
        if (a[0] > b[0]) return 1;
        return 0
      })
      lines.push(line)
      line = []
    }
    line.push(bound)
  }
  line.sort((a, b) => {
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
    return 0
  })
  lines.push(line)
  return {
    lines: lines,
    width: width,
    height: height,
  }
}
// レシートの商品情報で適さないものを除外する関数
const get_unmatched_string = (black_patterns: string[], str: string) => {
  let flag = false
  for (let i = 0; i < black_patterns.length; i++) {
    if (str.match(black_patterns[i])) {
      console.log(str.match(black_patterns[i]))
      flag = true
      break
    }
  }
  return flag
}

const get_matched_string = (type: 'date' | 'time', str: string) => {
  const patterns: any = {}
  patterns['date'] = /[0-9]{4}[\/年](0[1-9]|1[0-2]|[1-9])[\/月](0[1-9]|[12][0-9]|3[01]|[1-9])日*/u;
  patterns['time'] = /([01][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])*/u;
  const result = str.match(patterns[type])
  if (result){
    console.log(result)
    return result[0]
  }else{
    return null
  }
}

// canvasにアノテーション画像を埋める関数
const setAnnotationImageToCanvas = (
  p: {
    canvasRef: React.MutableRefObject<null>, 
    annotation_datas: AnnotationVector[], 
    img_src: string, 
    setSize: (size: { width: number, height: number }) => void, 
  }
  ) => {
  if (p.canvasRef === null) return null
  const canvas: any = p.canvasRef.current
  if (canvas === null) return null
  const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
  // imageの読み込み同期処理
  // const promise =  new Promise(() => {
  let img = new Image()
  // 読み込み開始
  img.src = p.img_src;
  console.log(img.width)

  // 読み込み完了後
  img.onload = () => {
    const image_ratio = 200 / img.width
    p.setSize({
      width: image_ratio * img.width,
      height: image_ratio * img.height,
    })
    ctx.drawImage(img, 0, 0, image_ratio * img.width, image_ratio * img.height)
    const ads = p.annotation_datas
    for (let j = 0; j < ads.length; j++) {
      ctx.strokeStyle = '#5AFF19'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(image_ratio * ads[j].top_left.x, image_ratio * p.annotation_datas[j].top_left.y)
      ctx.lineTo(image_ratio * ads[j].top_right.x, image_ratio *ads[j].top_right.y)
      ctx.lineTo(image_ratio * ads[j].bottom_right.x, image_ratio * ads[j].bottom_right.y)
      ctx.lineTo(image_ratio * ads[j].bottom_left.x, image_ratio * ads[j].bottom_left.y)
      ctx.lineTo(image_ratio * ads[j].top_left.x, image_ratio * ads[j].top_left.y)
      ctx.stroke()
    }
    ctx.save()
  }
}


// レシートをgoogle vision apiに送信して情報を抜き取り、アノテーション画像を描画する関数
export const detectReceipt = async (p: {
  file: File | null, 
  canvasRef: React.MutableRefObject<null>, 
  setSize: (size: SizeWH) => void
}) => {
  const file = p.file
  if (!file) {
    console.log('file入力は必須')
    return
  }
  console.log(file)
  const api_key = process.env.REACT_APP_GOOGLE_API_KEY
  const url = `https://vision.googleapis.com/v1/images:annotate`;
  let result: any = ""
  let base64result: string = ""
  const fileLoader = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      result = reader.result;
      resolve(result);
    };
    try {
      reader.readAsDataURL(file)
    } catch {
      console.log('fileの読み込みに失敗');
    }
  });
  await fileLoader;
  base64result = result
  if (typeof result === 'string') {
    result = result.replace(/^data:image\/(png|jpg|jpeg);base64,/, "")
  }
  let body = {
    requests: [
      {
        image: {
          content: result
        },
        features: [
          {
            type: "TEXT_DETECTION",
            maxResults: 1
          }
        ]
      }
    ]
  }

  let xhr = new XMLHttpRequest();
  xhr.open('POST', `${url}?key=${api_key}`, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  const pro = new Promise((resolve, reject) => {
    xhr.onreadystatechange = () => {
      console.log(xhr)
      if (xhr.readyState !== XMLHttpRequest.DONE) return;
      if (xhr.status >= 400) return reject({ message: `Failed with ${xhr.status}:${xhr.statusText}` });
      resolve(JSON.parse(xhr.responseText));
    };
  })
  xhr.send(JSON.stringify(body));
  const res: any = await pro
  console.log(res)
  const lines = get_sorted_lines(res.responses)
  const items: ReceiptItemHistory[] = []
  const annotations: AnnotationVector[] = []
  let date = ''
  let time = ''
  let unixtime = 0 // 秒

  // 金額の部分の型:ここに存在しているパターンであれば商品と金額として読み取る
  const white_patterns = [/^[\d,]+[%*＊xX※※]+$/u, /^¥[\d,]+$/u, /^[%*＊xX※※¥]+[\d,]+$/u, /^[\d,]+$/u,]
  // 金額の中でも税金や合計などを抜くためのブラックリスト
  // const black_patterns = ['合計', '小計', '現計', '代金', '金額', '値引', '税', '預', '釣', '交通系IC', '残高', '支払', 'QUIC', 'PAY', 'Pay']
  const black_patterns = ['合計', '小計', '現計', '計']
  //このflagが立ったらそれより下の項目に関しては読み取らない
  let red_flag = false
  for (let i = 0; i < lines.lines.length; i++) {
    if (red_flag) break
    const line = lines.lines[i]
    console.log(line)
    const texts: string[] = []
    // 隣のx座標が1番離れている部分を取得
    let margin = 0
    let max_margin_index = 0
    for (let j = 0; j < line.length; j++) {
      //流石にレシートの最後の文字は画像の右端25%以内だろうという読み
      texts.push(line[j][2])
      if(line[line.length - 1][0] <= lines.width * 0.75) continue
      if (j === line.length - 1) {
        continue
      }
      if ((margin < line[j + 1][0] - line[j][0]) && (line[j + 1][0] > lines.width / 2)) {
        margin = line[j + 1][0] - line[j][0]
        max_margin_index = j
      }
    }
    console.log(texts, max_margin_index)
    let k = texts.join('')
    if (!date.length) {
      // マイバスはレジ0000が日付につながるからその部分を消す
      let new_k = k
      if(new_k[0] === 'レ' && new_k[1] === 'ジ'){
        new_k = new_k.slice(6)
        console.log(new_k)
      }
      const d = get_matched_string('date', new_k)
      console.log(d)
      if (d) {
        date = d
        console.log(date)
      }
    }
    if (!time.length) {
      const t = get_matched_string('time', k)
      if (t) {
        time = t
      }
    }
    console.log(`date=${date}, time=${time}`)
    // 想定しているレシートは日付の後にレシートの項目が存在するので、日付と時間が読み込まれるまではcontinue
    if(!time.length && !date.length) continue
    if(unixtime <= 0){
      date = date.replace('年', '/')
      date = date.replace('月', '/')
      date = date.replace('日', '')
      // time += ':00'
      // 一旦timeは無視する
      let dt_str = date + ' ' + '00:00:00'
      const dt = new Date(dt_str)
      unixtime = Math.floor(dt.getTime() / 1000)
    }

    // 文章中にblack_patternsの文字が含まれていればそれ以降は読み取らない
    const unmatched_string = get_unmatched_string(black_patterns, texts.join(k))
    console.log(`unmatched_string=${unmatched_string}`)
    if (unmatched_string) {
      red_flag = true
      break
    }
    // max_margin_indexが最初の要素の場合は不適切

    if(max_margin_index <= 0) continue
    const names = texts.slice(0, max_margin_index + 1)
    const prices = texts.slice(max_margin_index + 1)
    console.log(names, prices)
    const text_name = names.join('')
    const text_price = prices.join('')
    // 商品名：価格の両方の情報がなければcontinue
    if (text_name.length <= 1 || text_price.length <= 0) continue
    let is_draw = false
    for (let j = 0; j < white_patterns.length; j++) {
      const result1 = white_patterns[j].test(text_price);
      console.log(text_price, result1)
      if (result1) {
        const price = text_price.replace(/\D/u, '')
        is_draw = true
        let new_item = {
          date: unixtime,
          category: 'food_expenses',
          buyer: '',
          user: '',
          name: text_name,
          price: Number(price),
          tax: 1.08,
        }
        items.push(new_item)
        // 一回でもwhite_patternsが成功するとbreak
        break
      }
    }
    if (!is_draw) {
      continue
    }

    // boundingBoxの座標取得
    const bounds = line.map((l: any) => {
      return l[3]
    })
    const bounds_length = bounds.length
    const top_left = {
      x: bounds[0].vertices[0].x,
      y: bounds[0].vertices[0].y,
    }
    const top_right = {
      x: bounds[bounds_length - 1].vertices[1].x,
      y: bounds[bounds_length - 1].vertices[1].y,
    }
    const bottom_right = {
      x: bounds[bounds_length - 1].vertices[2].x,
      y: bounds[bounds_length - 1].vertices[2].y,
    }
    const bottom_left = {
      x: bounds[0].vertices[3].x,
      y: bounds[0].vertices[3].y,
    }
    annotations.push({
      top_left: top_left,
      top_right: top_right,
      bottom_right: bottom_right,
      bottom_left: bottom_left,
    })
  }
  console.log(date, time)
  console.log(items)
  console.log(annotations)
  const r = setAnnotationImageToCanvas({
    canvasRef: p.canvasRef, 
    annotation_datas: annotations, 
    img_src: base64result, 
    setSize: p.setSize, 
  })
  console.log(r)
  return {
    items: items,
  }
}