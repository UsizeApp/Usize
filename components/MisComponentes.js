
/*
https://stackoverflow.com/questions/49706823/what-is-this-props-children-and-when-you-should-use-it
*/

import React from 'react'

import { StyleSheet, View } from 'react-native'

export const Contenedor = (props) => {
	return (
		<View style={estilos.Contenedor}>
			{props.children}
		</View>
	)
}

export const Marco = (props) => {
	return (
		<Contenedor>
			<View style={estilos.Marco}>
				{props.children}
			</View>
		</Contenedor>
	)
}

const estilos = StyleSheet.create({
	Contenedor: {
		margin: 20
	},
	Marco: {
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
})
