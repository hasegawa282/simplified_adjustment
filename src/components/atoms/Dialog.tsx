// -- basic library --
import React from 'react';
import styled from 'styled-components';
import {Button, Modal, ModalProps } from 'react-bootstrap';

// -- external components --
// import styles from 'utils/styles';

interface Param {
  title_text?: string;
}
export default class Dialog extends React.Component<ModalProps & Param> {
  render() {
    return (
        <CustomModal
        {...this.props}
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            {this.props.title_text}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.children}
        </Modal.Body>
      </CustomModal>
    )
  }
}

// -- styled components --
const CustomModal = styled(Modal)`
　.modal-dialog{
    max-width: none!important;
    width: 90%;
  }
`;

