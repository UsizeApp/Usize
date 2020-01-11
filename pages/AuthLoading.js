import React, { Component } from 'react';

import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { Email } from 'models/API';

import { Cargando } from 'components/MisComponentes';

export default class AuthLoadingScreen extends Component {
  constructor() {
    super();

    this.state = {
      comprobandoToken: false,
      obteniendoPerfil: false
    }

    this.validarAuthGuardado();
  }

  async validarAuthGuardado() {
    console.log("AuthLoading::validarAuthGuardado")

    u = new Email();
    // Obtenemos el token de la app
    const token = await u.storageGetToken()

    // Si es un token aceptable, consultamos a la API
    if (token !== null && token.length > 0) {
      console.log("Comprobando token en la API...")
      this.setState({ comprobandoToken: true });

      bTokenValido = await u.validarToken(token);

      if (bTokenValido) {
        console.log("Token valido")
        this.setState({ obteniendoPerfil: true });
        // Se descargan los datos guardados
        await u.bajarDatosEmail()
        await u.bajarDatosPersona()
        this.props.navigation.navigate('App');
      }
      else {
        console.log("Token guardado invalido; borrando storage")
        // Como el token no sirvió, borramos el storage por seguridad
        u.reiniciarStorage();
        this.props.navigation.navigate('Auth');
      }
    }
    else {
      console.log("No hay token guardado")
      u.reiniciarStorage();
      this.props.navigation.navigate('Auth');
    }
  };

  render() {
    if (this.state.obteniendoPerfil) {
      return (
        <Cargando texto='Obteniendo perfil...' />
      )
    }
    else if (this.state.comprobandoToken) {
      return (
        <Cargando texto='Validando credenciales guardadas...' />
      );
    }
    else {
      return (
        <Cargando texto='¡Bienvenido a Usize!' />
      );
    }
  }
}
