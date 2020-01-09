import React, { Component } from 'react';
import {
  StyleSheet, Picker, Text, View, ToastAndroid
} from 'react-native';

import Layout from '../../components/Layout';
import Button from '../../components/Utils/Button';

import { Email } from 'models/API'

import { Contenedor, Marco, Titulo } from 'components/MisComponentes'

import { NavigationActions, StackActions } from 'react-navigation';

export default class Tab3Gestion extends Component {
  static navigationOptions = {
    title: 'Gestión personas',
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
      renderedOnce: false,
      id_persona: null,
      personas2: null,
    }
  }

  async obtenerPersonas() {
    u = new Email();
    const datosEmail = await u.storageGetDatosEmail()

    let personas2 = datosEmail.personas2
    personas2 = Object.entries(personas2)
    id_persona = personas2[0][0]

    this.setState({ id_persona, personas2, done: true })
  }

  componentDidMount() {
    this.obtenerPersonas()
  }

  nuevaPersona() {
    const { navigation } = this.props;
    navigation.navigate('P1NuevaPersona');
  }

  async cambiarPersona() {
    const { id_persona } = this.state
    u = new Email();
    await u.storageSetIDPersona(id_persona)
    await u.bajarDatosPersona()

    ToastAndroid.show('Persona cambiada', ToastAndroid.SHORT);

    const resetAction = StackActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: 'TabScreen' })]
    });

    const goToTransaction = NavigationActions.navigate({
      routeName: 'Medidas', params: {
        id_persona: id_persona
      }
    });

    const resetAction2 = StackActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: 'Home' })]
    });

    this.props.navigation.dispatch(resetAction);
    this.props.navigation.dispatch(goToTransaction);
    this.props.navigation.dispatch(resetAction2);
  }

  render() {
    if (this.state.done) {
      let { personas2 } = this.state

      return (
        <Contenedor>
          <Marco>
            <Titulo>Cambiar persona activa</Titulo>
            <View style={{
              borderBottomWidth: 1,
              borderColor: '#ddd',
            }}>
              <Picker
                mode="dropdown"
                selectedValue={this.state.id_persona}
                onValueChange={(id_persona) =>
                  this.setState({ id_persona })
                }>
                {personas2.map(entry => {
                  const [key, value] = entry
                  return (
                    <Picker.Item key={key} value={key} label={value} />
                  )
                })
                }
              </Picker>
            </View>
            <Button text="Cambiar persona" onPress={() => this.cambiarPersona()} />
          </Marco>

          <Marco>
            <Button text="Agregar nueva persona" onPress={() => this.nuevaPersona()} />
          </Marco>
        </Contenedor>
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
