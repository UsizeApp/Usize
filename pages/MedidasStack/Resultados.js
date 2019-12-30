import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import Button from '../../components/Utils/Button'
import Spinner from 'react-native-loading-spinner-overlay'
import { Usuario } from '../../models/API'
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

	this.props.navigation.dispatch(resetAction); 
    //navigation.navigate(to)
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
    const perfil = await u.getPerfil(true)
    const resp = await u.doUploadPhoto(frontalURI, lateralURI, height);
    const { medidas, mensaje } = resp;
    let error = true;
    if (medidas != null) {
      await u.setMedidas(medidas);
      error = false;
    }

    this.setState({ error: error, reason: mensaje, medidas: medidas, done: true, sexo: perfil.sexo })
  }

  renderResultados = () => {
    const { medidas } = this.state;
    busto = null
    if (this.state.sexo == "femenino"){
      busto = <FilaMedida tipo="Busto" medida={medidas.bust} bbw="0" />;
    }
    return (
    <View style={estilos.marco}>
      <FilaMedida tipo="Brazo Izquierdo" medida={medidas.left_arm + ' cm'} />
      <FilaMedida tipo="Brazo Derecho" medida={medidas.right_arm + ' cm'} />
      <FilaMedida tipo="Pierna Izquierda" medida={medidas.left_leg + ' cm'} />
      <FilaMedida tipo="Pierna Derecha" medida={medidas.right_leg + ' cm'} />
		  <FilaMedida tipo="Cintura" medida={medidas.waist + ' cm'} />
      <FilaMedida tipo="Cadera" medida={medidas.hips_length + ' cm'} />
      <FilaMedida tipo="Pecho" medida={medidas.chest_length + ' cm'} />
      {busto}
    </View>
    )
  }

  renderOptions = () => {
    return (
      <View style={{ alignItems: 'center' }}>
        <Button text="Volver" to="Home" onPress={this.handlePress} />
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
            <View style={{ alignItems: 'center', marginTop: 30 , justifyContent: 'center'}}>
              <Text style={{ color: '#66CBFF', fontWeight: 'bold', fontSize: 18 }}>Sus medidas son:</Text>
            {this.renderResultados()}
            </View>
            {this.renderOptions()}
          </View>
        )
      }
    }
  }
}
