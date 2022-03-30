// -- basic library --
import React from 'react';
import { CSVDownload} from "react-csv";

// -- external components --

interface Param {
    headers?: {
        label: string;
        key: string;
    }[];
    datas: any[];
    // onClick: (event: React.MouseEventHandler<HTMLAnchorElement>, done: (proceed?: boolean | undefined) => void) => Promise<void>;
}
export default class SaCSVLink extends React.Component<Param> {
  render() {
    console.log(this.props.datas)
    return (
      <CSVDownload {...this.props} data={this.props.datas} target="_blank" />
    )
  }
}

// -- styled components --

