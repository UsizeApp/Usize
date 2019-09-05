import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default class Button extends React.Component {

  render () {
    const { icon, text, onPress, to } = this.props

    return (
      <TouchableOpacity style={styles.Container} onPress={() => onPress(to)}>
        <Ionicons name={icon} color="white" size={25}/>
        <Text style={styles.ButtonText}>{text}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  Container: {
    backgroundColor: '#66CBFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  ButtonText: {
    fontSize: 17,
    color: 'white',
    marginLeft: 8,
  }
})
