import React, { Component } from 'react';
import IntroSlider from '../components/IntroSlider'

export default class Info extends Component {
  static navigationOptions = {
    header: null,
  }


  handleCloseSlider = () => {
    const { navigation } = this.props;
    navigation.navigate('App')
  }

  render () {
    return <IntroSlider onPress={this.handleCloseSlider}/>
  }
}
