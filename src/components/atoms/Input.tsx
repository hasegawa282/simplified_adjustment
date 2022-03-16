// -- basic library --
import React from 'react';
import {InputGroup, FormControl, FormControlProps} from 'react-bootstrap';

// -- external components --

interface Param {
    label_name?: string;
}
export default class Input extends React.Component<FormControlProps & Param & React.InputHTMLAttributes<HTMLInputElement>> {
  render() {
    return (
        <InputGroup size="sm">
            {this.props.label_name ? <InputGroup.Text id={this.props.id}>{this.props.label_name}</InputGroup.Text> : null}
            <FormControl {...this.props} aria-label="Small"/>
        </InputGroup>
    )
  }
}

// -- styled components --
