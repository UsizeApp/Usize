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
			done: false,
			email: "?"
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
		const email = json2.email;

		console.log(email);

		// Cuando se obtengan las respuestas, seteamos las variables de la clase
		// El render cambia automaticamente usando this.state.done
		this.setState({ email: email, done: true });
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
					<Text style={{ color: '#8E8E8E' }}>{this.state.email}</Text>
					<Button text="Calcular mis medidas" icon="ios-contact" to="Home" onPress={this.handlePress} />
					<Button text="Cerrar sesión" icon="ios-contact" to="Home" onPress={this.handlePress} />
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