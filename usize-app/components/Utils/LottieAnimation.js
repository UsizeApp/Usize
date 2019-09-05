import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import Lottie from 'lottie-react-native'

export default class LottieAnimation extends React.Component {

  static defaultProps = {
    width: 100,
    height: 100,
  }

  state = {
    animation: null,
  }

  lottie = React.createRef()

  componentDidMount () {
    const { animation } = this.props
    this.setState({ animation }, () => {
      this.lottie.current.reset()
      this.lottie.current.play()
    })
  }

  render () {
    const { width, height, animationProps } = this.props
    const { animation } = this.state

    if (animation) {
      return (
        <View style={{ width, height }}>
          <Lottie
            ref={this.lottie}
            style={{
              width: '100%',
              height: '100%',
            }}
            source={animation}
            {...animationProps}
          />
        </View>
      )
    } else {
      return null
    }
  }
}
