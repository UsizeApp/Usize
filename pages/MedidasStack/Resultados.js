import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import Button from '../../components/Utils/Button'
import Spinner from 'react-native-loading-spinner-overlay'
import { Usuario } from '../../models/API'
import estilos from '../../styles/estilos';
import FilaMedida from '../../components/FilaMedida';

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
    }
  }

  handlePress = (to) => {
    const { navigation } = this.props
    navigation.navigate(to)
  }

  async componentDidMount() {
    this.getResultados();
  }

  getResultados = async () => {
    console.log("Resultados::getResultados")
    const { navigation } = this.props;
    var height = navigation.state.params.height
    var frontal = navigation.state.params.frontal
    var lateral = navigation.state.params.lateral
    var frontalURI = frontal.uri;
    var lateralURI = lateral.uri;

    u = new Usuario();
    const resp = await u.doUploadPhoto(frontalURI, lateralURI, height);
    const { medidas, mensaje } = resp;
    let error = true;
    if (medidas != null) {
      await u.setMedidas(medidas);
      error = false;
    }

    this.setState({ error: error, reason: mensaje, medidas: medidas, done: true })
  }

  renderResultados = () => {
    const { medidas } = this.state;
    return (
      <View style={estilos.marco}>
        <FilaMedida tipo="Brazo Izquierdo" medida={medidas.left_arm} />
        <FilaMedida tipo="Brazo Derecho" medida={medidas.right_arm} />

        <FilaMedida tipo="Pierna Izquierda" medida={medidas.left_leg} />
        <FilaMedida tipo="Pierna Derecha" medida={medidas.right_leg} />

        <FilaMedida tipo="Cadera" medida={medidas.hips_length} />
        <FilaMedida tipo="Pecho" medida={medidas.chest_length} />
        <FilaMedida tipo="Busto" medida={medidas.bust_length} bbw="0" />
      </View>
    )
  }

  renderOptions = () => {
    return (
      <View style={{ alignItems: 'center' }}>
        <Button text="Volver al Inicio" icon="ios-checkmark-circle" to="Home" onPress={this.handlePress} />
      </View>
    )
  }

  render() {
    if (!this.state.done) {
      return (
        <View>
          <Spinner
            visible={true}
            customIndicator={
              <View style={{ flexDirection: 'row' }}>
                <ActivityIndicator color="white" />
                <Text style={{ fontSize: 16, color: 'white' }}>Calculando medidas...</Text>
              </View>
            }
          />
        </View>
      )
    }
    else {
      if (this.state.error) {
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
      else {
        console.log("Resultados::renderResultados")
        return (
          <View style={{ margin: 10 }}>
            <View style={{ alignItems: 'center', marginTop: 30 }}>
              <Text style={{ color: '#66CBFF', fontWeight: 'bold', fontSize: 18 }}>Sus medidas son:</Text>
            </View>
            {this.renderResultados()}
            {this.renderOptions()}
          </View>
        )
      }
    }
  }
}
