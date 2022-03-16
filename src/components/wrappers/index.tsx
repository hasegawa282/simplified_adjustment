// -- basic library --
import React from 'react';
import styled from 'styled-components';
import styles from 'utils/styles';

// -- redux library --

// -- external components --
import TopMenu from './TopMenu';
import AlertDialog from 'components/atoms/AlertDialog';
// import { new_colors } from 'utils/colors';

// -- main component --
interface Param {
  onSignOut: () => void;
}

const BaseWrapper: React.FC<Param> = (params) => {

  // -- render part --
  return (
    <Wrap className="base">
      <TopMenu {...params}/>
      <Body>{params.children}</Body>
      <AlertDialog />
    </Wrap>
  )
};

// -- styled components --
const Wrap = styled.div`
  height: 100vh;
  width: 100vw;
  height: auto;
  width: auto;
  display: block;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - ${styles.topmenu_height});
  width: 100%;
  padding: 15px;
`;

// -- finally export part --

export default BaseWrapper;
