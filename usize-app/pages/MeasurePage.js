import React from 'react'
import { View, Text, Image, ActivityIndicator } from 'react-native'
import Button from '../components/Utils/Button'
import Spinner from 'react-native-loading-spinner-overlay'

export default class MeasurePage extends React.Component {
  static navigationOptions = {
    title: 'Measure',
    headerStyle: {
      backgroundColor: '#66CBFF',
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
    headerTintColor: 'white',
  }

  state = {
    data: 0,
    validData: false,
    isLoading: true,
    medidas: {},
  }

  fetchFunction = async () => {
    await this.setState({
      data: 2
    })
  }

  timeout = (ms) => {
      return new Promise(resolve => setTimeout(resolve, ms));
  }

  checkData = async () => {

    const { navigation } = this.props;
    json = navigation.state.params.json;

    await this.timeout(1);
    //console.log('Intentando');
    this.fetchFunction()
    const { data } = this.state

    if (data === 0){
      this.checkData()
    } else if (data === 1) {
      this.setState({isLoading: false})
      navigation.navigate('Home', {
        error: true,
      })
    } else if (data === 2) {
      this.setState({validData: true, isLoading: false, medidas: json})
    }
  }

  async componentDidMount() {
    this.checkData()
  }

  render () {
    const { validData, isLoading, medidas } = this.state

    return (
      <View>
        <Spinner
          visible={isLoading}
          customIndicator={
            <View style={{flexDirection: 'row'}}>
              <ActivityIndicator color="white" />
              <Text style={{fontSize: 16, color: 'white'}}>Calculando...</Text>
            </View>
          }
        />
        <View style={{alignItems: 'center', marginTop: 30}}>
          <Text style={{color: '#66CBFF', fontWeight: 'bold', fontSize: 18}}>Tus medidas son:</Text>
        </View>
        {this.renderGallery()}
        {this.renderOptions()}
      </View>
    )
  }

  renderGallery = () => {
    return (
      <View style={{flexDirection: 'column', flex: 1, marginTop: 30, justifyContent: 'space-between'}}>
        <View style={{alignItems: 'stretch'}}>
          <Text style={{marginTop: 10, color: '#32CD32', fontWeight: 'bold'}}>Brazo Izquierdo: {this.state.medidas.left_arm} [cm]</Text>
          <Text style={{marginTop: 10, color: '#32CD32', fontWeight: 'bold'}}>Brazo Derecho: {this.state.medidas.right_arm} [cm]</Text>
          <Text style={{marginTop: 10, color: '#32CD32', fontWeight: 'bold'}}>Brazo Derecho: {this.state.medidas.right_arm} [cm]</Text>
          <Text style={{marginTop: 10, color: '#32CD32', fontWeight: 'bold'}}>Pierna Izquierda: {this.state.medidas.left_leg} [cm]</Text>
          <Text style={{marginTop: 10, color: '#32CD32', fontWeight: 'bold'}}>Pierna Derecha: {this.state.medidas.right_leg} [cm]</Text>
          <Text style={{marginTop: 10, color: '#000000', fontWeight: 'bold'}}>Cintura: {this.state.medidas.waist} [cm]</Text>
          <Text style={{marginTop: 10, color: '#000000', fontWeight: 'bold'}}>Cadera: {this.state.medidas.hip} [cm]</Text>
          <Text style={{marginTop: 10, color: '#000000', fontWeight: 'bold'}}>Pecho: {this.state.medidas.chest} [cm]</Text>
          <Text style={{marginTop: 10, color: '#000000', fontWeight: 'bold'}}>Busto: {this.state.medidas.bust} [cm]</Text>
        </View>
      </View>
    )
  }

  renderOptions = () => {
    return (
      <View style={{alignItems: 'center', marginTop: 300}}>
        <Button text="Confirmar Medidas" icon="ios-checkmark-circle" to="Access" onPress={this.handlePress}/>
        <Button text="Recalcular" icon="ios-aperture" to="Scanner" onPress={this.handlePress}/>
      </View>
    )
  }
}
