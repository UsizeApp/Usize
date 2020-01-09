import React, { Component } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ToastAndroid
} from 'react-native';
import Layout from '../../components/Layout';

import DialogInput from 'react-native-dialog-input';

import { Email } from '../../models/API';

import { Contenedor, Marco } from 'components/MisComponentes'

function Separador() {
  return <View style={styles.separador} />;
}

export default class Tab1Email extends Component {
  static navigationOptions = {
    title: 'Cuenta usuario',
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
    headerTintColor: 'white',
  }

  constructor() {
    super();

    const datosDialogo = {
      tituloDialogo: 'Title',
      mensajeDialogo: 'Message',
      valorDialogo: null,
      pkDialogo: null,
    }

    this.state = {
      datosDialogo,
      isDialogVisible: false,
      done: false,
    };
  }

  componentDidMount() {
    this.datos();
  }

  async datos() {
    console.log('Tab1Email::datos');

    const u = new Email();
    const datos = await u.storageGetDatosEmail()

    this.setState({
      datos,
      done: true,
    });
  }

  formatearRUT(RUT) {
    RUT = RUT.replace("-", "")
    DV = RUT[RUT.length - 1];
    RUTSinDV = RUT.substr(0, RUT.length - 1);
    RUTSinDV = RUTSinDV.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    RUTfinal = RUTSinDV.concat("-".concat(DV));
    return RUTfinal;
  }

  /*
  DialogInput
  */

  mostrarDialogo = (pk, valorActual) => {
    switch (pk) {
      case 'email':
        ToastAndroid.show('El e-mail es una clave primaria', ToastAndroid.SHORT);
        break;
      case 'nombre':
        const datosDialogo = {
          tituloDialogo: 'Cambiar nombre',
          mensajeDialogo: 'Ingresa tu nombre',
          valorDialogo: valorActual,
          pkDialogo: pk,
        }
        this.setState({ datosDialogo })
        this.showDialog(true);
        break;
      case 'rut':
        ToastAndroid.show('No se puede cambiar el RUT', ToastAndroid.SHORT);
        break;
      default:
        break
    }
  }

  guardarValor(pk, valor) {
    this.showDialog(false)
    console.log(pk)
    console.log(valor)
  }

  showDialog(bool) {
    this.setState({
      isDialogVisible: bool
    })
  }

  ElementoPerfil = (item, valor, pk) => (
    <TouchableOpacity onPress={() => this.mostrarDialogo(pk, valor)}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <Text style={{ fontWeight: 'bold' }}>{item}</Text>
          <Text>{valor}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  renderPerfil = () => {
    console.log('renderPerfil')

    const { done } = this.state;

    if (done) {
      const { datos, isDialogVisible } = this.state;

      const { tituloDialogo, mensajeDialogo, valorDialogo, pkDialogo } = this.state.datosDialogo

      return (
        <Contenedor>
          <Marco>
            <Text style={styles.titulo}>Datos del Email</Text>
            {this.ElementoPerfil('E-mail', datos.email, 'email')}<Separador />
            {this.ElementoPerfil('Nombre', datos.nombre, 'nombre')}<Separador />
            {this.ElementoPerfil('RUT', this.formatearRUT(datos.rut.toString()), 'rut')}<Separador />
          </Marco>
          <DialogInput
            isDialogVisible={isDialogVisible}
            title={tituloDialogo}
            message={mensajeDialogo}
            submitInput={(input) => { this.guardarValor(pkDialogo, input) }}
            closeDialog={() => { this.showDialog(false) }}>
          </DialogInput>
        </Contenedor>
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
