import React from 'react'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import Home from '../pages/HomePage'
import Access from '../pages/AccessPage'
import Register from '../pages/RegisterPage'
import Scanner from '../pages/ScannerPage'
import Measure from '../pages/MeasurePage'

const AppNavigator = createStackNavigator(
  {
    Access: Access,
    Register: Register,
    Scanner: Scanner,
    Home: Home,
    Measure: Measure,
  },
  {
    initialRouteName: "Access"
  }
);

export default createAppContainer(AppNavigator);
