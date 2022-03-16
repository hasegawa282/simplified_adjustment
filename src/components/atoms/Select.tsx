// -- basic library --
import React from 'react';
import { Form, FormSelectProps, InputGroup } from 'react-bootstrap';

// -- external components --

interface Param {
    label_name?: string;
    options: {
        value: string;
        name: string;
    }[];
}
export default class Select extends React.Component<FormSelectProps & Param> {

    render() {
        return (
                <InputGroup size="sm" className="mb-3">
                    {this.props.label_name?<InputGroup.Text id={this.props.id}>{this.props.label_name}</InputGroup.Text>: null}
                    <Form.Select
                        {...this.props}
                    >
                        {this.props.options.map((option, index) => {
                            return (<option value={option.value} key={index}>{option.name}</option>)
                        })}
                    </Form.Select>
                </InputGroup>
        )
    }
}

// -- styled components --
