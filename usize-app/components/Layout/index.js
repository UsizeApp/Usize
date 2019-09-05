import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'

export default class Layout extends React.Component {

  render () {
    const { children, style } = this.props

    return (
      <View style={[styles.Container, style]}>
        {children}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#f9f9fe',
  }
})
