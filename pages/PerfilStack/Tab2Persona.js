import React, { Component } from 'react';

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { Email } from '../../models/API';

import { Contenedor, Marco, Cargando } from 'components/MisComponentes'

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
    console.log(datos)

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

  render() {
    if (this.state.done) {
      const { datos } = this.state;

      return (
        <Contenedor>
          <Marco>
            <Text style={styles.titulo}>Datos de la Persona activa</Text>
            {this.ElementoPerfil('Alias', datos.alias)}<Separador />
            {this.ElementoPerfil('Género', datos.gender)}<Separador />
            {this.ElementoPerfil('Fecha última medición', datos.fecha_ultimas_medidas)}
          </Marco>
        </Contenedor>
      );
    }
    else {
      return (
        <Cargando texto='Obteniendo datos' />
      );
    }
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
