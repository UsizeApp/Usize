import React from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import Button from '../../components/Utils/Button'
import Spinner from 'react-native-loading-spinner-overlay'
import { Email } from '../../models/API'
import estilos from '../../styles/estilos';
import FilaMedida from '../../components/FilaMedida';

import { NavigationActions, StackActions } from 'react-navigation';

export default class Resultados extends React.Component {
  static navigationOptions = {
    title: 'Resultados',
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
      error: false,
      done: false,
      reason: '',
      medidas: null,
      sexo: null
    }
  }

  handlePress = (to) => {
    const { navigation } = this.props

    resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: to })],
    });

    navigation.dispatch(resetAction);
  }

  async componentDidMount() {
    this.getResultados();
  }

  getResultados = async () => {
    console.log("Resultados::getResultados")
    const { height, frontal, lateral } = this.props.navigation.state.params;

    u = new Email();

    const resp = await u.subirFotos(height, frontal, lateral);

    if (resp == null) {
      console.log('Error de API')
      return
    }

    const { mensaje, datosPersona } = resp;

    let medidas = null;
    let bEsFemenino = false;

    let error = true;
    if (datosPersona != null) {
      // Hay datos validos, se guardan en storage      
      await u.storageSetDatosPersona(datosPersona);

      medidas = await u.medidasParaTabla()
      bEsFemenino = await u.bEsFemenino();
      error = false;
    }

    this.setState({
      error,
      reason: mensaje,
      medidas,
      bEsFemenino,
      done: true
    })
  }

  renderResultados = () => {
    const { medidas, bEsFemenino } = this.state;

    busto = null
    if (bEsFemenino) {
      busto = <FilaMedida tipo="Busto" medida={medidas.bust} bbw="0" />;
    }

    return (
      <View style={styles.container}>
        <View style={styles.marco}>
          <FilaMedida tipo="Brazo Izquierdo" medida={medidas.left_arm} />
          <FilaMedida tipo="Brazo Derecho" medida={medidas.right_arm} />

          <FilaMedida tipo="Pierna Izquierda" medida={medidas.left_leg} />
          <FilaMedida tipo="Pierna Derecha" medida={medidas.right_leg} />

          <FilaMedida tipo="Cintura" medida={medidas.waist} />
          <FilaMedida tipo="Cadera" medida={medidas.hips} />
          <FilaMedida tipo="Pecho" medida={medidas.chest} />
          {busto}
        </View>
      </View>
    );
  }

  renderOptions = () => {
    return (
      <View style={{ alignItems: 'center' }}>
        <Button text="Volver al Inicio" to="Home" onPress={this.handlePress} />
      </View>
    )
  }

  render() {
    if (this.state.done) {
      if (!this.state.error) {        
        console.log("Resultados::renderResultados")
        
        return (
          <View style={{ margin: 10 }}>
            <View style={{ alignItems: 'center', marginTop: 30, justifyContent: 'center' }}>
              <Text style={{ color: '#66CBFF', fontWeight: 'bold', fontSize: 18 }}>Sus medidas son:</Text>
              {this.renderResultados()}
            </View>
            {this.renderOptions()}
          </View>
        )        
      }
      else {
        console.log("Resultados::error")

        return (
          <View>
            <View style={{ alignItems: 'center', marginTop: 30 }}>
              <Text style={{ color: '#66CBFF', fontWeight: 'bold', fontSize: 18 }}>Error al obtener las medidas</Text>
              <Text style={{ color: '#66CBFF', fontWeight: 'bold', fontSize: 18 }}>{this.state.reason}</Text>
              <Button text="Reintentar" icon="ios-add-circle" to="Home" onPress={this.handlePress} />
            </View>
          </View>
        )
      }
    }
    // Else
    return (
      <View style={styles.FormContainer}>
        <Text style={{ color: '#8E8E8E' }}>Calculando medidas...</Text>
        <ActivityIndicator size="large" color="#66CBFF" />
      </View>
    );    
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
