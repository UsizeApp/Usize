import React, { Component } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, TouchableOpacity
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Layout from '../../components/Layout';
import Button from '../../components/Utils/Button';

import { Email } from '../../models/API';

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

    const u = new Email();
    const datosEmail = await u.storageGetDatosEmail()
    const datosPersona = await u.storageGetDatosPersona()

    this.setState({
      datosEmail,
      datosPersona,
      done: true,
    });
  }

  cambiarItem = (item) => {
    const { navigation } = this.props;
    navigation.navigate('CambiarItem', { item });
  }

  formatearRUT (RUT){
    RUT = RUT.replace("-","")
    DV = RUT[RUT.length - 1];
    RUTSinDV = RUT.substr(0,RUT.length-1);
    RUTSinDV = RUTSinDV.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    RUTfinal = RUTSinDV.concat("-".concat(DV));
    return RUTfinal;
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
      const { datosEmail, datosPersona } = this.state;

      return (
        <View style={styles.container}>
          <View style={styles.marco}>
            <Text style={styles.titulo}>Datos del Email:</Text>
            {this.ElementoPerfil('E-mail', datosEmail.email)}<Separador />
            {this.ElementoPerfil('Nombre', datosEmail.nombre)}<Separador />
            {this.ElementoPerfil('RUT', this.formatearRUT(datosEmail.rut.toString()))}<Separador />
            
            <Text style={styles.titulo}>Datos de la Persona activa:</Text>
            {this.ElementoPerfil('Alias', datosPersona.alias)}<Separador />
            {this.ElementoPerfil('Género', datosPersona.gender)}<Separador />
            {this.ElementoPerfil('fecha_ultimas_medidas', datosPersona.fecha_ultimas_medidas)}
          </View>
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
