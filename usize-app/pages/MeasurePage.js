import React from 'react'
import { View, Text, Image } from 'react-native'
import Button from '../components/Utils/Button'

export default class MeasurePage extends React.Component {
  static navigationOptions = {
    title: 'Home',
    headerStyle: {
      backgroundColor: '#66CBFF',
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
    headerTintColor: 'white',
  }

  state = {
    isLoading: true,
  }

  handlePress = (to) => {
    const { navigation } = this.props
    navigation.push(to)
  }

  componentDidMount() {
    // su await para recibir del backend lo necesario
    //cambiar valor de state isLoading a false una vez obtenida la data
  }

  render () {

    return (
      <View>
        <View style={{alignItems: 'center', marginTop: 30}}>
          <Text style={{color: '#66CBFF', fontWeight: 'bold', fontSize: 18}}>¿Son estas tus medidas?</Text>
        </View>
        {this.renderGallery()}
        {this.renderOptions()}
      </View>
    )
  }

  renderGallery = () => {
    return (
      <View style={{flexDirection: 'row', marginTop: 30}}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Image source={{uri: 'http://placehold.it/100x100'}} style={{width: 100, height: 100}}/>
          <Text style={{marginTop: 10, color: '#66CBFF', fontWeight: 'bold'}}>Brazo Izquierdo</Text>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Image source={{uri: 'http://placehold.it/100x100'}} style={{width: 100, height: 100}}/>
          <Text style={{marginTop: 10, color: '#66CBFF', fontWeight: 'bold'}}>Brazo Derecho</Text>
        </View>
      </View>
    )
  }

  renderOptions = () => {
    return (
      <View style={{alignItems: 'center', marginTop: 50}}>
        <Button text="Confirmar Medidas" icon="ios-checkmark-circle" to="Access" onPress={this.handlePress}/>
        <Button text="Recalcular" icon="ios-aperture" to="Scanner" onPress={this.handlePress}/>
      </View>
    )
  }
}
