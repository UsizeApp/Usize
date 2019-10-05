import { createStackNavigator } from 'react-navigation-stack';

import Auth1Login from './Login'
import Auth2Register from './Register'
// Auth3Forgot

export default createStackNavigator(
  {
    Login: Auth1Login,
    Register: Auth2Register,
    // Foto: Medidas3Foto,
  },
);
