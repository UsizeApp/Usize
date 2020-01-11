
/*
https://stackoverflow.com/questions/49706823/what-is-this-props-children-and-when-you-should-use-it
*/

import React from 'react'

import { StyleSheet, View, Text, ActivityIndicator, } from 'react-native'

import { COLOR_USIZE } from 'styles/colores'

export const Contenedor = (props) => {
	return (
		<View style={estilos.Contenedor}>
			{props.children}
		</View>
	)
}

export const Marco = (props) => {
	return (
		<View style={estilos.Marco}>
			{props.children}
		</View>
	)
}

export const Titulo = (props) => {
	return (
		<Text style={estilos.Titulo}>
			{props.children}
		</Text>
	)
}

export const Cargando = (props) => {
	return (
		<View style={estilos.Cargando}>
			<Text style={estilos.TextoCargando}>{props.texto}</Text>
			<ActivityIndicator size="large" color={COLOR_USIZE} />
		</View>
	);
}

const estilos = StyleSheet.create({
	Contenedor: {
		margin: 15,
		alignItems: 'center',
		justifyContent: 'center',
	},
	Marco: {
		padding: 15,
		marginBottom: 10,
		width: '95%',
		borderWidth: 1,
		borderRadius: 15,
		borderColor: '#ddd',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.8,
		shadowRadius: 2,
	},
	Titulo: {
		fontSize: 16,
		fontWeight: 'bold',
		marginTop: 5,
		marginBottom: 15
	},
	Cargando: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	TextoCargando: {
		color: '#8E8E8E'
	}
})
