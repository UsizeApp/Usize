import React, { Component } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
} from 'react-native';
import Button from '../../components/Utils/Button';
import { Email } from '../../models/API';

function FilaMedida(props) {
  const { tipo, medida } = props;
  let { bbw } = props;
  bbw = typeof bbw === 'undefined' ? 2 : 0;

  return (
    <View style={{
      flexDirection: 'row', marginVertical: 8, borderBottomWidth: bbw, paddingBottom: 5, borderColor: '#ddd',
    }}
    >
      <Text style={{ flex: 1, color: 'grey' }}>{tipo}</Text>
      <Text style={{ textAlign: 'right', color: 'grey' }}>{medida}</Text>
    </View>
  );
}

export default class MedidasHome extends Component {
  static navigationOptions = {
    title: 'Medidas',
    headerStyle: {
      backgroundColor: '#66CBFF',
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
    headerTintColor: 'white',
  }

  constructor(props) {
    super(props);
    this.state = {
      medidas: null,
      sexo: null,
      done: false,
    };
  }

  componentDidMount() {
    this.getMedidas(); // Obtenemos las medidas en el Home
  }

  async getMedidas() {
    console.log('Home::getMedidas');

    const u = new Email();
    const datosPersona = await u.storageGetDatosPersona()

    if (datosPersona == null) {
      console.error('Error de datos')
      return
    }

    const bTieneMedidas = await u.bTieneMedidas()
    let medidas = null;
    let bEsFemenino = false;

    if (bTieneMedidas) {
      medidas = await u.medidasParaTabla()
      bEsFemenino = await u.bEsFemenino()
    }

    this.setState({
      datosPersona,
      bTieneMedidas,
      medidas,
      bEsFemenino,
      done: true
    });
  }

  render() {
    const { done } = this.state;
    const { navigation } = this.props;

    if (done) {
      const { datosPersona, bTieneMedidas, medidas, bEsFemenino } = this.state;

      encabezado = null

      if (bTieneMedidas) {
        encabezado = (
          <View>
            <Text style={{ color: '#8E8E8E' }}>Ultima actualización:</Text>
            <Text style={{ color: '#8E8E8E' }}>{datosPersona.fecha_ultimas_medidas}</Text>
          </View>
        )

        filaP = <FilaMedida tipo="Pecho" medida={medidas.chest} bbw="0" />
        filaB = null

        if (bEsFemenino) {
          filaP = <FilaMedida tipo="Pecho" medida={medidas.chest} />
          filaB = <FilaMedida tipo="Busto" medida={medidas.bust} bbw="0" />
        }

        return (
          <View style={styles.container}>
            {encabezado}
            <View style={styles.marco}>
              <FilaMedida tipo="Brazo Izquierdo" medida={medidas.left_arm} />
              <FilaMedida tipo="Brazo Derecho" medida={medidas.right_arm} />

              <FilaMedida tipo="Pierna Izquierda" medida={medidas.left_leg} />
              <FilaMedida tipo="Pierna Derecha" medida={medidas.right_leg} />

              <FilaMedida tipo="Cintura" medida={medidas.waist} />
              <FilaMedida tipo="Cadera" medida={medidas.hips} />
              {filaP}
              {filaB}
            </View>
            <View>
              <Button text="Actualizar medidas" onPress={() => navigation.navigate('Altura')} />
              <Button text="RESULTADOS" onPress={() => {
                navigation.push('Resultados', {
                  height: 1,
                  frontal: null,
                  lateral: null,
                });
              }} />
            </View>
          </View>
        );
      }
      else {
        return (
          <View style={styles.container}>
            {encabezado}
            <Text style={{ color: '#8E8E8E' }}>¡Aún no has calculado tus medidas!</Text>
            <Button text="Obtén tus medidas" onPress={() => navigation.navigate('Altura')} />
            <Text style={{ color: '#8E8E8E' }}>Si lo prefieres, puedes ingresar tus medidas manualmente</Text>
            <Button text="Ingresar manualmente" onPress={() => navigation.navigate('Altura')} />
          </View>
        )
      }
    }

    // Else
    return (
      <View style={styles.FormContainer}>
        <Text style={{ color: '#8E8E8E' }}>Obteniendo medidas...</Text>
        <ActivityIndicator size="large" color="#66CBFF" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  FormContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    marginTop: "10%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  marco: {
    padding: 20,
    width: '70%',
    borderWidth: 0,
    borderRadius: 10,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 1,
    elevation: 2,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 15,
  },
});
