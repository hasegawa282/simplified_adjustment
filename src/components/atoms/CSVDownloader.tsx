// -- basic library --
import React from 'react';
import { CSVDownload, CSVLink, } from "react-csv";

// -- external components --

interface Param {
    headers?: {
        label: string;
        key: string;
    }[];
    datas: any[];
    onClick: (event: React.MouseEventHandler<HTMLAnchorElement>, done: (proceed?: boolean | undefined) => void) => Promise<void>;
}
export default class SaCSVLink extends React.Component<Param> {
  render() {
    return (
      <CSVLink {...this.props} data={this.props.datas} target="_blank" onClick={this.props.onClick} asyncOnClick={true}/>
    )
  }
}

// -- styled components --

