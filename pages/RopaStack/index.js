import { createStackNavigator } from 'react-navigation-stack';

import Perfil1Home from './Home';

export default createStackNavigator(
  {
    Home: Perfil1Home
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
