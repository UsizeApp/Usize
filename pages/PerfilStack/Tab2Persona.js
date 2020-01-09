import React, { Component } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, TouchableOpacity
} from 'react-native';
import Layout from '../../components/Layout';
import Button from '../../components/Utils/Button';

import { Email } from '../../models/API';

function Separador() {
  return <View style={styles.separador} />;
}

export default class Tab2Persona extends Component {
  static navigationOptions = {
    title: 'Persona activa',
    headerStyle: {
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
    this.getDatos();
  }

  async getDatos() {
    console.log('Perfil::getDatos');

    const u = new Email();
    const datos = await u.storageGetDatosPersona()

    this.setState({
      datos,
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
        </View>
      </View>
    </TouchableOpacity>
  )

  renderPerfil = () => {
    const { done } = this.state;

    if (done) {
      const { datos } = this.state;

      return (
        <View style={styles.container}>
          <View style={styles.marco}>
            <Text style={styles.titulo}>Datos de la Persona activa:</Text>
            {this.ElementoPerfil('Alias', datos.alias)}<Separador />
            {this.ElementoPerfil('Género', datos.gender)}<Separador />
            {this.ElementoPerfil('fecha_ultimas_medidas', datos.fecha_ultimas_medidas)}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.FormContainer}>
        <Text style={{ color: '#8E8E8E' }}>Obteniendo datos...</Text>
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
