import { ReduxSystemState } from './slices/systemSlice';

export default interface RootState {
  system: ReduxSystemState;

  // (ここにStateを追加)
}
