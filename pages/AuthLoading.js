import React, { Component } from 'react';

import {
  View,
  Text,
  ActivityIndicator,
  AsyncStorage,
  StyleSheet,
} from 'react-native';

import { Usuario } from '../models/API';

export default class AuthLoadingScreen extends Component {
  constructor() {
    super();
    this.state = {
      validToken: false
    }
    this.validarAuthGuardado();
  }

  async validarAuthGuardado() {
    u = new Usuario();
    let savedToken = await u.getToken()

    if (savedToken) {
      console.log("AuthLoading::getToken = " + savedToken)
      this.setState({ validToken: true });      
      await u.fetchDatosUsuario();
      // const promesa = u.fetchDatosUsuario()
      // await u.setMetodoAuth('login');
      this.props.navigation.navigate('App');
    } else {
      console.log("AuthLoading::Sin token; al login")
      this.props.navigation.navigate('Auth');
    }
  };

  render() {
    if (this.state.validToken) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
          <Text>Obteniendo perfil...</Text>
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
          <Text>Validando credenciales guardadas...</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
