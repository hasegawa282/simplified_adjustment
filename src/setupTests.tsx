/* eslint-disable */
import "jest-styled-components";
import "@testing-library/jest-dom/extend-expect";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store, persistor } from "redux/store";
import { PersistGate } from "redux-persist/integration/react";

const connected = (children: ReactNode) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default connected;
