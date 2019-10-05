import React, { Component } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
} from 'react-native';
import Button from '../../components/Utils/Button';
import { Usuario } from '../../models/API';

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
      <Text style={{ textAlign: 'right', color: 'blue' }}>{medida}</Text>
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
      // metodo: null,
      done: false,
    };
  }

  componentDidMount() {
    this.getMedidas();
  }

  async getMedidas() {
    console.log('Medidas::getMedidas');
    const u = new Usuario();

    const medidas = await u.getMedidas();
    // const metodo = await u.getMetodoAuth();

    this.setState({
      medidas,
      // metodo,
      done: true,
    });
  }

  render() {

    const { done } = this.state;
    const { navigation } = this.props;

    if (done) {
      const { medidas } = this.state;

      return (
        <View style={styles.container}>
          <View style={styles.marco}>
            <Text style={styles.titulo}>Sus medidas:</Text>
            <FilaMedida tipo="Brazo Izquierdo" medida={medidas.left_arm} />
            <FilaMedida tipo="Brazo Derecho" medida={medidas.right_arm} />

            <FilaMedida tipo="Pierna Izquierda" medida={medidas.left_leg} />
            <FilaMedida tipo="Pierna Derecha" medida={medidas.right_leg} />

            <FilaMedida tipo="Cintura" medida={medidas.waist} />
            <FilaMedida tipo="Cadera" medida={medidas.hip} />
            <FilaMedida tipo="Pecho" medida={medidas.chest} />
            <FilaMedida tipo="Busto" medida={medidas.bust} bbw="0" />
          </View>
          <Button text="Actualizar medidas" onPress={() => navigation.navigate('Altura')} />
        </View>
      );
    }

    return (
      <View style={styles.FormContainer}>
        <Text style={{ color: '#8E8E8E' }}>Obteniendo perfil...</Text>
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
    margin: 10,
  },
  marco: {
    padding: 20,
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
