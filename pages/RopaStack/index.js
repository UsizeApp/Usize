import { createStackNavigator } from 'react-navigation-stack';

import Perfil1Home from './Home';
import EditMarca   from './Edit';

export default createStackNavigator(
  {
    Home: Perfil1Home,
    Edit: EditMarca
  },
);
