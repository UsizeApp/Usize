import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import Button from '../components/Utils/Button'
import Layout from '../components/Layout'

export default class PerfilPage extends Component {
	static navigationOptions = {
		title: 'Perfil',
		headerStyle: {
			backgroundColor: '#66CBFF',
			elevation: 0,
			shadowOpacity: 0,
			borderBottomWidth: 0,
		},
		headerTintColor: 'white',
	}

	handlePress = (to) => {
		const { navigation } = this.props
		navigation.push(to)
	}

	// Constructor y variables de la clase
	constructor() {
		super();
		this.state = {
			email: '',
			right_arm: '',
			left_arm: '',
			right_leg: '',
			left_leg: '',
			waist: '',
			hip: '',
			chest: '',
			bust: '',
			nombre: '',
			rut: '',
			done: false,
		}
	}

	// Callback que se llama automaticamente "cuando un componente queda montado"
	// i.e. cuando la vista termina de cargarse?
	// Se usa aqui para obtener el perfil apenas cargue la vista, "porque ya que estamos logueados"
	componentDidMount() {
		this.perfilAPI();
	}

	// Funcion asincrona que llama a la API
	async perfilAPI() {
		const URL2 = 'http://10.0.0.22:5000/profile'
		const response2 = await fetch(URL2, { credentials: 'same-origin' });
		const json2 = await response2.json();

		var email = json2.email;
		var right_arm = json2.right_arm;
		var left_arm = json2.left_arm;
		var right_leg = json2.right_leg;
		var left_leg = json2.left_leg;
		var waist = json2.waist;
		var hip = json2.hip;
		var chest = json2.chest;
		var bust = json2.bust;
		var nombre = json2.nombre;
		var rut = json2.rut;

		console.log(email);

		// Cuando se obtengan las respuestas, seteamos las variables de la clase
		// El render cambia automaticamente usando this.state.done
		this.setState({
			email: email,
			right_arm: right_arm || 0,
			left_arm: left_arm || 0,
			right_leg: right_leg || 0,
			left_leg: left_leg || 0,
			waist: waist || 0,
			hip: hip || 0,
			chest: chest || 0,
			bust: bust || 0,
			nombre: nombre || 'Sin nombre',
			rut: rut || 'Sin RUT',
			done: true
		});
	}

	render() {
		return (
			<Layout>
				{this.renderPerfil()}
			</Layout>
		)
	}

	renderPerfil = () => {
		if (!this.state.done) {
			return (
				<View style={styles.FormContainer}>
					<Text style={{ color: '#8E8E8E' }}>Obteniendo perfil...</Text>
					<ActivityIndicator size="large" color="#66CBFF" />
				</View>
			)
		}
		else {
			return (
				<View style={styles.FormContainer}>
					<Text style={{ color: '#8E8E8E' }}>E-mail: {this.state.email}</Text>
					<Text style={{ marginTop: 10, color: '#32CD32', fontWeight: 'bold' }}>Brazo Izquierdo: {this.state.left_arm} [cm]</Text>
					<Text style={{ marginTop: 10, color: '#32CD32', fontWeight: 'bold' }}>Brazo Derecho: {this.state.right_arm} [cm]</Text>
					<Text style={{ marginTop: 10, color: '#32CD32', fontWeight: 'bold' }}>Pierna Izquierda: {this.state.left_leg} [cm]</Text>
					<Text style={{ marginTop: 10, color: '#32CD32', fontWeight: 'bold' }}>Pierna Derecha: {this.state.right_leg} [cm]</Text>
					<Text style={{ marginTop: 10, color: '#000000', fontWeight: 'bold' }}>Cintura: {this.state.waist} [cm]</Text>
					<Text style={{ marginTop: 10, color: '#000000', fontWeight: 'bold' }}>Cadera: {this.state.hip} [cm]</Text>
					<Text style={{ marginTop: 10, color: '#000000', fontWeight: 'bold' }}>Pecho: {this.state.chest} [cm]</Text>
					<Text style={{ marginTop: 10, color: '#000000', fontWeight: 'bold' }}>Busto: {this.state.bust} [cm]</Text>
					<Text style={{ marginTop: 10, color: '#8E8E8E', fontWeight: 'bold' }}>Nombre: {this.state.nombre}</Text>
					<Text style={{ marginTop: 10, color: '#8E8E8E', fontWeight: 'bold' }}>RUT: {this.state.rut}</Text>
					<Button text="Calcular mis medidas" icon="ios-contact" to="Home" onPress={this.handlePress} />
					<Button text="Cerrar sesión" icon="ios-contact" to="Access" onPress={this.handlePress} />
				</View>
			)
		}
	}
}

const styles = StyleSheet.create({
	GlobalContainer: {
		flex: 1,
		display: 'flex',
		alignItems: 'center',
	},
	OptionsContainer: {
		flex: 3,
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	FormContainer: {
		flex: 3,
		alignItems: 'center',
		justifyContent: 'center',
	},
	InputField: {
		marginVertical: 5,
		borderWidth: 1,
		paddingLeft: 5,
		borderColor: "#8E8E8E",
		borderRadius: 4
	},
	Container: (disabled) => ({
		backgroundColor: disabled ? '#8E8E8E' : '#66CBFF',
		padding: 10,
		borderRadius: 5,
		marginVertical: 15,
		flexDirection: 'row',
		justifyContent: 'center'
	}),
	ButtonText: {
		fontSize: 17,
		color: 'white',
		marginLeft: 8,
	}
})