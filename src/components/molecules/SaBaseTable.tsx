// -- basic library --
import React from 'react';
import { Table } from 'react-bootstrap';
import styled from 'styled-components';
import styles from 'utils/styles';
import { ObjectType } from 'utils/types';

// -- redux library --

// -- external components --
// import { new_colors } from 'utils/colors';

// -- main component --

export interface BaseTableHeaderType {
    id: string;
    text: string;
    style?: React.CSSProperties;
}

export interface BaseTableBodyType extends ObjectType<any> {
    id: string;
    
}
interface Param {
  headers: BaseTableHeaderType[];
  bodies: BaseTableBodyType[];
}

const BaseWrapper: React.FC<Param> = (params) => {
    // ヘッダーの表示するデータのidを取得
  const getIdsFromHeaders = (headers: BaseTableHeaderType[], id_abridgement?: boolean) => {
    const return_ids: string[] = [];
    for (let i = 0; i < headers.length; i++) {
      if (id_abridgement && headers[i].id === 'id') continue;
      return_ids.push(headers[i].id);
    }
    return return_ids;
  };
  // ボディーに表示するデータを得る関数
  const getDisplayBody = (body: BaseTableBodyType, ids: string[]) => {
    const return_body: {
      [key: string]: any;
    } = {};
    // bodyの情報をheaderの並び順に変える && headerにないものはskip
    for (let i = 0; i < ids.length; i++) {
      const key = ids[i]
      return_body[key] = body[key] || ''
    }
    return return_body;
  };
  // bodiesのデータからidの配列を生成する関数
  const getBodiesIds = (bodies: BaseTableHeaderType[]) => {
    const bodies_ids = bodies.map((body) => {
      return body.id;
    });
    return bodies_ids;
  };

  // -- render part --
  return (
      <Table responsive>
          <thead>
              <tr>
                  {params.headers.map((head, index) => (
                      <th key={index}>{head.text}</th>
                  ))}
              </tr>
          </thead>
          <tbody>
              {params.bodies.map((body, index) => {
                  
              })}
              <tr>
                  <td>1</td>
                  {Array.from({ length: 12 }).map((_, index) => (
                      <td key={index}>Table cell {index}</td>
                  ))}
              </tr>
              <tr>
                  <td>2</td>
                  {Array.from({ length: 12 }).map((_, index) => (
                      <td key={index}>Table cell {index}</td>
                  ))}
              </tr>
              <tr>
                  <td>3</td>
                  {Array.from({ length: 12 }).map((_, index) => (
                      <td key={index}>Table cell {index}</td>
                  ))}
              </tr>
          </tbody>
      </Table>
  )
};

// -- styled components --

// -- finally export part --

export default BaseWrapper;
