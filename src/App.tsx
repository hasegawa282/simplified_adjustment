// ----- import ------
// basics
import React, { useEffect } from 'react';
import './App.css';
import { Route, Switch, Router } from 'react-router-dom';
import browserHistory from 'browserHistory';

// components
import Wrappers from 'components/wrappers'
import Homes from 'pages/Homes';
import Receipts from 'pages/Receipts';

// aws-amplify
import {Auth} from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignIn, } from '@aws-amplify/ui-react'
import { AuthState, onAuthUIStateChange, } from "@aws-amplify/ui-components";

// images
import bg_image from 'assets/hase_appli_bg_image.png';
// -------------

const App: React.FC = () => {
  const [auth_state, setAuthState] = React.useState<string>('');

  const signOut = async() => {
    try {
        await Auth.signOut();
        setAuthState('')
    } catch (error) {
        console.log('error signing out: ', error);
    }
}

  useEffect(() => {
    onAuthUIStateChange((nextAuthState: any, authData: any) => {
      setAuthState(nextAuthState);
    });
  }, []);

  // -- render part --
  return auth_state !== AuthState.SignedIn ?
  <div style={{
    backgroundImage: `url(${bg_image})`,
    backgroundSize: "100% auto",
  }}>
    {/* <img src={bg_image} /> */}
    <AmplifyAuthenticator>
      <AmplifySignIn slot="sign-in" hideSignUp={false} />
    </AmplifyAuthenticator>
    </div>
    :
    <Router history={browserHistory}>
      <Switch>
        <Wrappers onSignOut={signOut}>
          <Route exact path="/homes" component={Homes} />
          <Route exact path="/receipts" component={Receipts} />
        </Wrappers>
      </Switch>
      {/* <button onClick={signOut}>sign out</button> */}
    </Router>

};

export default App;
