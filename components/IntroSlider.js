import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider';

const slides = [
  {
    key: '1',
    title: 'Title 1',
    text: 'Esta aplicación permite medir tu cuerpo por medio de fotografías y ayudarte a elegir ropa de tu talla',
    image: require('../assets/intro4.png'),
    backgroundColor: 'rgb(126, 202, 250)',
  },
  {
    key: '2',
    title: 'Title 1',
    text: 'Solo toma dos fotografías de tu cuerpo. Una de frente y la otra de costado y calcularemos tus medidas',
    image: require('../assets/intro3.png'),
    backgroundColor: 'rgb(126, 202, 250)',
  }
]

export default class IntroSlider extends React.Component {
  static navigationOptions = {
    header: null
  }

  customDoneButton = () => {
    return (
      <View style={{alignSelf:'center', width: '50%', height: '50%', borderRadius: 5, marginBottom: 50, backgroundColor: 'rgb(126, 202, 250)', justifyContent:'center'}}>
        <Text style={{color: 'white', textAlign:'center'}}>¡Entendido!</Text>
      </View>
    )
  }

  customNextButton = () => {
    return (
      <View style={{alignSelf:'center', width: '50%', height: '50%',borderRadius: 5, marginBottom: 50, backgroundColor: 'rgb(126, 202, 250)', justifyContent:'center'}}>
        <Text style={{color: 'white', textAlign:'center'}}>Siguiente</Text>
      </View>
    )
  }

  _renderItem = (item) => {
    return (
      <React.Fragment>
        <View style={[styles.mainContent, {backgroundColor: item.item.backgroundColor}]}>
          <View style={{width: 180, height: 300, borderRadius: 60, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
          <Image
            style={styles.image}
            source={item.item.image}
          />
          </View>
          <Text style={styles.text}>{item.item.text}</Text>
        </View>
        <View style={styles.mainContentFix}/> 
      </React.Fragment>
    );
  }

  render() {
    return (
      <AppIntroSlider renderItem={this._renderItem} slides={slides} renderDoneButton={this.customDoneButton} renderNextButton={this.customNextButton} onDone={this.props.onPress} bottomButton activeDotStyle={{backgroundColor: 'rgb(126, 202, 250)'}}/>
    )
  }
}

const styles = StyleSheet.create({
  mainContent: {
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: '5%',
    height: '70%',
    width: '100%',
  },
  mainContentFix: {
    width: '11%',
    height: '10%',
    marginLeft: '45%',
    marginTop: '-6%',
    backgroundColor: 'rgb(126, 202, 250)',
    borderRadius: 50,
    transform: [
      {scaleX: 10}
    ]
  },
  image: {
    width: 300,
    height: 300,
    resizeMode:'contain'
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 16,
  },
})
