import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import Button from '../../components/Utils/Button'
import FilaMedida from '../../components/FilaMedida';

import { Email } from '../../models/API'

import { NavigationActions, StackActions } from 'react-navigation';

import { Contenedor, Marco, Cargando } from 'components/MisComponentes'

export default class Resultados extends React.Component {
  static navigationOptions = {
    title: 'Resultados',
    headerLeft: null,
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
      reason: 'Error por defecto',
      medidas: null,
      error: false,

      done: false,
    }
  }

  volverAlInicio = () => {
    const { navigation } = this.props

    resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Home' })],
    });

    navigation.dispatch(resetAction);
  }

  reintentarMedidas = () => {
    const { navigation } = this.props

    resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Home' })],
    });

    navigation.dispatch(resetAction);

    nextAction = NavigationActions.navigate({ routeName: 'Altura' })

    navigation.dispatch(nextAction);
  }

  async componentDidMount() {
    this.getResultados();
  }

  getResultados = async () => {
    console.log("Resultados::getResultados")

    u = new Email()

    let mensaje = null
    let datosPersona = null

    if (u.fakeEnabled) {
      datosPersona = await u.storageGetDatosPersona()
    }
    else {
      const { height, frontal, lateral } = this.props.navigation.state.params;
      const resp = await u.subirFotos(height, frontal, lateral);
      mensaje = resp.mensaje
      datosPersona = resp.datosPersona
    }

    let medidas = null
    let bEsFemenino = false

    let error = true;
    if (datosPersona != null) {
      // Hay datos validos, se guardan en storage      
      await u.storageSetDatosPersona(datosPersona)

      medidas = await u.medidasParaTabla()
      bEsFemenino = await u.bEsFemenino()
      error = false
    }

    this.setState({
      error,
      mensaje,
      medidas,
      bEsFemenino,
      done: true
    })
  }

  renderResultados = () => {
    console.log("Resultados::renderResultados")

    const { medidas, bEsFemenino } = this.state;

    filaP = <FilaMedida tipo="Pecho" medida={medidas.chest} bbw="0" />
    filaB = null

    if (bEsFemenino) {
      filaP = <FilaMedida tipo="Pecho" medida={medidas.chest} />
      filaB = <FilaMedida tipo="Busto" medida={medidas.bust} bbw="0" />
    }

    return (
      <Contenedor>
        <Marco>
          <FilaMedida tipo="Brazo Izquierdo" medida={medidas.left_arm} />
          <FilaMedida tipo="Brazo Derecho" medida={medidas.right_arm} />

          <FilaMedida tipo="Pierna Izquierda" medida={medidas.left_leg} />
          <FilaMedida tipo="Pierna Derecha" medida={medidas.right_leg} />

          <FilaMedida tipo="Cintura" medida={medidas.waist} />
          <FilaMedida tipo="Cadera" medida={medidas.hips} />
          {filaP}
          {filaB}
        </Marco>
        <Button text="Volver al Inicio" onPress={this.volverAlInicio} />
      </Contenedor>
    );
  }

  renderError = () => {
    console.log("Resultados::error")

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', margin: 30 }}>
          <Text style={{ color: '#66CBFF', fontWeight: 'bold', fontSize: 18 }}>Error al obtener las medidas</Text>
          <Text style={{ color: '#66CBFF', fontWeight: 'bold', fontSize: 18 }}>{this.state.reason}</Text>
          <Button text="Reintentar" onPress={this.reintentarMedidas} />
          <Button text="Volver al Inicio" onPress={this.volverAlInicio} />
        </View>
    )
  }

  render() {
    if (this.state.done) {
      if (!this.state.error) {
        return this.renderResultados()
      }
      else {
        return this.renderError()
      }
    }
    else {
      return (
        <Cargando texto="Calculando medidas..." />
      );
    }
  }
}


const styles = StyleSheet.create({
  FormContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    marginTop: "20%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  marco: {
    padding: 20,
    width: '70%',
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
    marginBottom: 15,
  },
});
