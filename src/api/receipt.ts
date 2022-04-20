import { API, Auth } from 'aws-amplify';

const getToken = async () => {
  const user = await Auth.currentAuthenticatedUser();
  const token = user.signInUserSession.idToken.jwtToken;
  return token
}

// types
export interface ReceiptItem {
  name: string;
  person: {
    hase: number;
    kanachan: number;
  };
  price: number;
}

export interface PostReceiptItem {
  name: string;
  person: string;
  price: number;
}

export interface ReceiptItemHistory {
  date: number; // unix time
  category: string;
  buyer: string;
  user: string;
  name: string;
  price: number;
  tax: number;
}

// get api通信をする関数
export const getReceiptItemHistories = async (param: {
  start?: number;
  end?: number;
}) => {
  const token = await getToken()
  const myInit = {
    headers: {
      Authorization: token,
    },
    queryStringParameters: param,
  };
  const res = await API.get('receipt', '/receipt', myInit)
  return res
}

// // get api通信をする関数
// export const getReceiptItems = async () => {
//   const token = await getToken()
//   const myInit = {
//     headers: {
//       Authorization: token,
//     },
//   };
//   const res = await API.get('dev', '/operationreceiptitemtable', myInit)
//   console.log(res)
//   return res
// }

// [POST] /receiptItemHistoryPost
export const postReceiptItemHistory = async (param: ReceiptItemHistory) => {
  const token = await getToken()
  const myInit = {
    headers: {
      Authorization: token,
    },
    body: {
      param: param,
    },
  };
  const res = await API.post('receipt', '/receipt', myInit)
  return res
}