import React from 'react';
import { AppLoading } from 'expo';
import AppNavigator from './navigation/AppNavigator';

import { useScreens } from 'react-native-screens';
useScreens();

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoadingComplete: false,
    };
  }

  _loadResourcesAsync = async () => {

  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    }
    return <AppNavigator />;
  }
}
