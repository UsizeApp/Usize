import { createStackNavigator } from 'react-navigation-stack';

import Ropa1 from './Home';

export default createStackNavigator(
  {
    Home: Ropa1,
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
