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
      <Text style={{ textAlign: 'right', color: 'blue' }}>{medida}</Text>
    </View>
  );
}

export default class MedidasHome extends Component {


  static navigationOptions = {
    title: 'Tallas',
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
      tallas: null,
      // metodo: null,
      done: false,
    };
  }

  componentDidMount() {
    this.getTallas();
  }

  async getTallas() {
    console.log('Tallas::getTallas');
    const u = new Email();

    const tallas = await u.getTallas();
    console.log(tallas);
    console.log("ctmallas");
    this.setState({
      tallas,
      // metodo,
      done: true,
    });
  }

  render() {

    const { done } = this.state;
    const { navigation } = this.props;

    if (done) {
      const { tallas } = this.state;

      return (
        <View style={styles.container}>
          <View style={styles.marco}>
          </View>
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
