import React, { Component } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, TouchableOpacity
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Layout from '../../components/Layout';
import Button from '../../components/Utils/Button';

import { Usuario } from '../../models/API';

function Separador() {
  return <View style={styles.separador} />;
}

export default class Ropa1 extends Component {
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

  constructor() {
    super();
    this.state = {
      perfil: null,
      done: false,
    };
  }

  componentDidMount() {
    this.getMedidas();
  }

  async getMedidas() {
    console.log('Medidas::getMedidas');
    const u = new Usuario();

    const medidas = await u.getMedidas(false);
    // const metodo = await u.getMetodoAuth();

    this.setState({
      medidas,
      // metodo,
      done: true,
    });
  }

  cambiarItem = (item) => {
    const { navigation } = this.props;
    navigation.navigate('CambiarItem', { item });
  }

  ElementoPerfil = (item, valor) => (
    <TouchableOpacity onPress={() => this.cambiarItem(item)}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <Text style={{ fontWeight: 'bold' }}>{item}</Text>
          <Text>{valor}</Text>
        </View>

        <View style={{ justifyContent: 'center' }}>
        </View>
      </View>
    </TouchableOpacity>
  )

  renderPerfil = () => {
    const { done } = this.state;

    if (done) {
		const { medidas } = this.state;
		
		var talla_pantalon = 44
		var talla_polera = 'XS'
		var media_leg = (Number(medidas.left_leg) + Number(medidas.right_leg))/2
		var media_arms = Number(medidas.waist)
		
		console.log(media_leg)
		console.log(media_arms)
		var tallas_pantalon = [[44, 103.5], [46, 106.5], [48, 109.5], [50, 112.5], [52, 115.5], [54, 118.5], [56, 121.5], [58, 124.5]]
		//var tallas_polera = [['XS', 63.5], ['S', 64.25], ['M', 64.77], ['L', 65.28], ['XL', 64.04]]
		var tallas_polera = [['XS',71, 76], ['S',76, 83], ['M',83, 91], ['L', 91,100], ['XL',100, 110], ['XXL', 110,121]]
		
		for(let i = 0; i < tallas_polera.length; i += 1){
			console.log("Comprobando polera")
			if(media_arms >= tallas_polera[i][1] && media_arms <= tallas_polera[i][2]){
				var x = tallas_polera[i][0];
				console.log(x)
				talla_polera = x
				talla_pantalon = x
			}
		}


      return (
        <View style={styles.container}>
          <View style={styles.marco}>
            <Text style={styles.titulo}>Tus tallas de ropa son:</Text>
            <Text style={styles.titulo2}>Marca: Adidas</Text>
            {this.ElementoPerfil('Talla pantalón', talla_pantalon)}
            <Separador />
			{this.ElementoPerfil('Talla polera', talla_polera)}
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

  render() {
    return (
      <Layout>
        {this.renderPerfil()}
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  FormContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separador: {
    marginVertical: 10,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
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
    marginBottom: 15
  },
  titulo2: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 15
  },
});
