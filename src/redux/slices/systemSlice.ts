import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import RootState from 'redux/rootState';

// state
export interface ReduxSystemState {
  loading: {
    isActive: boolean;
    preloading: boolean;
  };
  alert: {
    isActive: boolean;
    message: string | string[] | JSX.Element;
  };
  confirm: {
    isActive: boolean;
    message: string | string[] | JSX.Element;
    handleOKClick: () => void;
    handleCancelClick: () => void;
  };
  progress: {
    isActive: boolean;
    value: number;
  };
}

// state の初期値
const systemInitialState: ReduxSystemState = {
  loading: {
    isActive: false,
    preloading: false,
  },
  alert: {
    isActive: false,
    message: '',
  },
  confirm: {
    isActive: false,
    message: '',
    handleOKClick: () => console.log(''),
    handleCancelClick: () => console.log(''),
  },
  progress: {
    isActive: false,
    value: 0,
  },
};

// actions と reducers の定義
const slice = createSlice({
  name: 'system',
  initialState: systemInitialState,
  reducers: {
    loading: (state, action: PayloadAction<ReduxSystemState['loading']['isActive']>) => {
      state.loading.isActive = action.payload;
    },
    preloading: (state, action: PayloadAction<ReduxSystemState['loading']['preloading']>) => {
      state.loading.preloading = action.payload;
    },
    alert: (state, action: PayloadAction<ReduxSystemState['alert']['message']>) => {
      state.alert.isActive = true;
      state.alert.message = action.payload;
    },
    confirm: (
      state,
      action: PayloadAction<{
        message: ReduxSystemState['confirm']['message'];
        handleOKClick: ReduxSystemState['confirm']['handleOKClick'];
        handleCancelClick: ReduxSystemState['confirm']['handleCancelClick'];
      }>,
    ): void => {
      state.confirm.isActive = true;
      state.confirm.message = action.payload.message;
      state.confirm.handleOKClick = action.payload.handleOKClick;
      state.confirm.handleCancelClick = action.payload.handleCancelClick;
    },
    confirmClose: (state) => {
      state.confirm.isActive = false;
    },
    alertClose: (state) => {
      state.alert.isActive = false;
    },
    startProgress: (state) => {
      state.progress.isActive = true;
      state.progress.value = 0;
    },
    endProgress: (state) => {
      state.progress.isActive = false;
      state.progress.value = 0;
    },
    updateProgressValue: (state, action: PayloadAction<ReduxSystemState['progress']['value']>) => {
      state.progress.value = action.payload;
    },
  },
});

export default slice;
export const systemSelector = (state: RootState): ReduxSystemState => state.system;
export const systemActions = slice.actions;
