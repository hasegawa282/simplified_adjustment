// -- basic library --
import React, { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

import styles from "utils/styles"

// -- external components --
export default class IconButton extends React.Component<ButtonHTMLAttributes<HTMLButtonElement>> {
  render() {
    return (
        <CustomIconButton {...this.props}>
            {this.props.children}
        </CustomIconButton>
    )
  }
}

// -- styled components --
const CustomIconButton = styled.button`
    border: none;
    background: none;
    &:hover{
        opacity: ${styles.opacity_hover};
    }
`;

