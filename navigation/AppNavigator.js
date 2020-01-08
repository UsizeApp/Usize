import React from 'react';
import { AsyncStorage } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { MaterialCommunityIcons, Ionicons, FontAwesome } from '@expo/vector-icons';

import AuthLoadingScreen from '../pages/AuthLoading';
import AuthStack from '../pages/AuthStack';
import MedidasStack from '../pages/MedidasStack';
import RopaStack from '../pages/RopaStack';
import PerfilStack from '../pages/PerfilStack';
import Info from '../pages/Info'
import Ropa from '../pages/Ropa';

class CerrarSesion extends React.Component {
  constructor() {
    super();
  }

  async componentDidMount() {
    await this.logout();
  }

  logout = async () => {
    const { navigation } = this.props;
    console.log('logout');
    await AsyncStorage.clear();
    navigation.navigate('Auth');
  };

  render() {
    return null;
  }
}

const AppMainTabs = createBottomTabNavigator(
  {
    Medidas: {
      screen: MedidasStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <MaterialCommunityIcons name="ruler" size={17} color={tintColor} />
        ),
      },
    },
    Ropa: { // RopaTabsStack
      screen: Ropa,
      navigationOptions: {
        title: 'Tallas',
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="md-shirt" size={17} color={tintColor} />
        ),
      },
    },
    RopaStack: { // RopaTabsStack
      screen: RopaStack,
      navigationOptions: {
        title: 'Marcas',
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="ios-shirt" size={17} color={tintColor} />
        ),
      },
    },
    Perfil: {
      screen: PerfilStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="md-person" size={17} color={tintColor} />
        ),
      },
    },
	/*
    Ajustes: { // AjustesStack
      screen: CerrarSesion,
      navigationOptions: {
        title: 'Ajustes',
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name="cog" size={17} color={tintColor} />
        ),
      },
    },
	*/
    CerrarSesion: {
      screen: CerrarSesion,
      navigationOptions: {
        title: 'Cerrar sesión',
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="md-power" size={17} color={tintColor} />
        ),
      },
    },
  },
);

const OcultarTabBar = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

MedidasStack.navigationOptions = OcultarTabBar;
//RopaStack.navigationOptions = OcultarTabBar;
PerfilStack.navigationOptions = OcultarTabBar;

const RootSwitch = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
    App: AppMainTabs,
    Info,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);

export default createAppContainer(RootSwitch);
