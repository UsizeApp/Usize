import React, { Component } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, Button, TouchableOpacity
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Layout from '../../components/Layout';

import { Usuario } from '../../models/API';

function Separador() {
  return <View style={styles.separador} />;
}

export default class PerfilHome extends Component {
  static navigationOptions = {
    title: 'Perfil',
    headerStyle: {
      backgroundColor: '#66CBFF',
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
    headerTintColor: 'white',
  }

  constructor() {
    super();
    this.state = {
      perfil: null,
      done: false,
    };
  }

  componentDidMount() {
    this.getPerfil();
  }

  async getPerfil() {
    console.log('Perfil::getPerfil');

    const u = new Usuario();

    const perfil = await u.getPerfil();

    this.setState({
      perfil,
      done: true,
    });
  }

  cambiarItem = (item) => {
    const { navigation } = this.props;
    navigation.navigate('CambiarItem', { item });
  }

  ElementoPerfil = (item, valor) => (
    <TouchableOpacity onPress={() => this.cambiarItem(item)}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <Text style={{ fontWeight: 'bold' }}>{item}</Text>
          <Text>{valor}</Text>
        </View>

        <View style={{ justifyContent: 'center' }}>
          <AntDesign name="right" size={20} />
        </View>
      </View>
    </TouchableOpacity>
  )

  renderPerfil = () => {
    const { done } = this.state;

    if (done) {
      const { perfil } = this.state;

      return (
        <View style={styles.container}>
          <View style={styles.marco}>
            <Text style={styles.titulo}>Perfil de usuario:</Text>
            {this.ElementoPerfil('NOMBRE', perfil.nombre)}
            <Separador />
            {this.ElementoPerfil('RUT', perfil.rut)}
            <Separador />
            {this.ElementoPerfil('ALTURA', '174')}
            <Separador />
            {this.ElementoPerfil('FECHA REGISTRO', '10/09/2018')}
          </View>
          <Button title="Eliminar perfil" />
        </View>
      );
    }

    return (
      <View style={styles.FormContainer}>
        <Text style={{ color: '#8E8E8E' }}>Obteniendo perfil...</Text>
        <ActivityIndicator size="large" color="#66CBFF" />
      </View>
    );
  }

  render() {
    return (
      <Layout>
        {this.renderPerfil()}
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  FormContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separador: {
    marginVertical: 10,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  marco: {
    padding: 20,
    borderWidth: 0,
    borderRadius: 10,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 1,
    elevation: 2,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 15
  },
});
