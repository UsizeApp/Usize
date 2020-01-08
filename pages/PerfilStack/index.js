import React, { Component } from 'react';
//import react in our code.
import { Text, View } from 'react-native';

import { createStackNavigator } from 'react-navigation-stack';

import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

import Perfil1Home from './Home';
import Perfil2CambiarItem from './CambiarItem';

class FirstPage extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home Screen</Text>
      </View>
    );
  }
}

class SecondPage extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Setting Screen</Text>
      </View>
    );
  }
}

let a = createStackNavigator(
  {
    Home: FirstPage,
    CambiarItem: Perfil2CambiarItem,
  },
  /*
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
  */
);



const TabScreen = createMaterialTopTabNavigator(
  {
    Email: { screen: FirstPage },
    PersonaActiva: { title: 'Persona activa', screen: SecondPage },
    Personas: { screen: SecondPage },
  },
  {
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: '#FFFFFF',
      inactiveTintColor: '#F8F8F8',
      style: {
        backgroundColor: '#633689',
      },
      labelStyle: {
        textAlign: 'center',
      },
      indicatorStyle: {
        borderBottomColor: '#87B56A',
        borderBottomWidth: 2,
      },
    },
  }
);

//making a StackNavigator to export as default
export default createStackNavigator({
  TabScreen: {
    screen: TabScreen,
    navigationOptions: {
      title: 'Perfil',
      headerStyle: {
        backgroundColor: '#66CBFF',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTintColor: 'white',
    }
  }
});

//export default App;