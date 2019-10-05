import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import styles from '../../styles/styles';

export default class Button extends React.Component {

  render () {
    const { onPress } = this.props

    return (
      <TouchableOpacity style={[styles.bottomToolbar, {alignItems: 'center'}]} onPress={onPress}>
          <Ionicons
              name="ios-checkmark-circle"
              color="white"
              size={45}
          />
      </TouchableOpacity>
    )
  }
}
