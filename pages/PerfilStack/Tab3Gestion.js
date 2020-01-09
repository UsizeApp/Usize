import React, { Component } from 'react';
import {
  StyleSheet, Picker, Text, View
} from 'react-native';

import Layout from '../../components/Layout';
import Button from '../../components/Utils/Button';

import { Email } from 'models/API'

import { Marco } from 'components/MisComponentes'

export default class Tab3Gestion extends Component {
  static navigationOptions = {
    title: 'Gestión',
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
      done: false,
      languageValue: "java"
    }
  }

  async obtenerPersonas() {
    u = new Email();
    const datosEmail = await u.storageGetDatosEmail()

    const personas = datosEmail.personas

    this.setState({ personas, done: true })
  }

  componentDidMount() {
    this.obtenerPersonas()
  }

  nuevaPersona() {
    const { navigation } = this.props;
    navigation.navigate('P1NuevaPersona');
  }

  render() {
    langs = [
      {
        key: "java",
        label: "Java Lang"
      },
      {
        key: "js",
        label: "Javascript Lang"
      },
    ]

    if (this.state.done) {
      return (
        <View style={styles.container}>

          <Marco>
            <Text>Cambiar persona</Text>
            <Picker
              mode="dropdown"
              selectedValue={this.state.language}
              style={{}}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ language: itemValue })
              }>
              {this.state.personas.map(p => (
                <Picker.Item key={p} label={p} value={p} />
              ))
              }
            </Picker>
            <Button text="Cambiar" onPress={() => this.cambiarPersona()} />
          </Marco>

          <Button text="Nueva persona" onPress={() => this.nuevaPersona()} />
        </View>
      );
    }

    return <Text>Cargando personas...</Text>
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
