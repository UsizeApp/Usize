import React, { Component } from 'react';

import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { Email } from '../models/API';

export default class AuthLoadingScreen extends Component {
  constructor() {
    super();

    this.state = {
      comprobandoToken: false,
      obteniendoPerfil: false
    }

    // Esta pagina no renderiza nada, solo es el intermedio para validar el login
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
        <View style={styles.FormContainer}>
          <Text style={{ color: '#8E8E8E' }}>Obteniendo perfil...</Text>
          <ActivityIndicator size="large" color="#66CBFF" />
        </View>
      )
    }
    else if (this.state.comprobandoToken) {
      return (
        <View style={styles.FormContainer}>
          <Text style={{ color: '#8E8E8E' }}>Validando credenciales guardadas...</Text>
          <ActivityIndicator size="large" color="#66CBFF" />
        </View>
      );
    }
    else {
      return (
        <View style={styles.FormContainer}>
          <Text style={{ color: '#8E8E8E' }}>¡Bienvenido a Usize!</Text>
          <ActivityIndicator size="large" color="#66CBFF" />
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
  FormContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
