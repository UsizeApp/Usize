import { createStackNavigator } from 'react-navigation-stack';

import Medidas1Home from './Home';
import Medidas2Altura from './Altura';
import Medidas3Foto from './Foto';
import Medidas4FotoLateral from './FotoLateral';
import Medidas5Resultados from './Resultados';

export default createStackNavigator(
  {
    Home: Medidas1Home,
    Altura: Medidas2Altura,
    Foto: Medidas3Foto,
    FotoLateral: Medidas4FotoLateral,
    Resultados: Medidas5Resultados,
  },
  /*
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  }
  */
);
