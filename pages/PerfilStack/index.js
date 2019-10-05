import { createStackNavigator } from 'react-navigation-stack';

import Perfil1Home from './Home';
import Perfil2CambiarItem from './CambiarItem';

export default createStackNavigator(
  {
    Home: Perfil1Home,
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
