// -- basic library --
import React from 'react';
import { CSVDownload, } from "react-csv";

// -- external components --

interface Param {
    headers?: {
        label: string;
        key: string;
    }[];
    datas: any[];
}
export default class CSVDownloader extends React.Component<Param> {
  render() {
    return (
      <CSVDownload data={this.props.datas} target="_blank" />
    )
  }
}

// -- styled components --

