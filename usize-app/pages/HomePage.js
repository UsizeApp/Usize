import React from 'react';
import { View, Image, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity, TextInput } from 'react-native'
import Layout from '../components/Layout'
import LottieAnimation from '../components/Utils/LottieAnimation'
import measureAnimation from '../assets/animations/measure'
import Button from '../components/Utils/Button'
import DropdownAlert from 'react-native-dropdownalert'
import { NavigationEvents } from 'react-navigation'
import { Formik } from 'formik'
import * as yup from 'yup'
import { Ionicons } from '@expo/vector-icons'

export default class AccessPage extends React.Component {
  static navigationOptions = {
    title: 'Home',
    headerStyle: {
      backgroundColor: '#66CBFF',
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
    headerTintColor: 'white',
  }

  handlePress = (to, height) => {
    const { navigation } = this.props
    navigation.push(to, {
      height: height
    })
  }

  withError = () => {
    const { navigation } = this.props;
    const error = navigation.getParam('error');
    if (error){
      const { dropdown } = this
      dropdown.alertWithType('error', 'No se pudo calcular las medidas', 'No se ha detectado una persona')
      navigation.setParams({error: null})
    }
  }

  render() {
    return (
      <Layout>
        <KeyboardAvoidingView style={styles.GlobalContainer} behavior="position" enabled>
          {this.renderAnimation()}
          {this.renderHeightRequest()}
          {this.renderOptions()}
        </KeyboardAvoidingView>
        <DropdownAlert ref={ref => this.dropdown = ref} />
        <NavigationEvents
          onWillFocus={() => this.withError()}
        />
      </Layout>
    )
  }

  renderHeightRequest = () => {

    return (
      <View style={styles.FormContainer}>
        <Text style={{color: '#8E8E8E'}}>Ingrese su altura en centimetros</Text>
        <Formik
          initialValues={{ height: '' }}
          onSubmit={values => Alert.alert(JSON.stringify(values))}
          validationSchema={yup.object().shape({
            height: yup
              .number().typeError('Altura no válida')
              .required('Ingrese su altura'),
          })}
        >
          {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
            <View style={{margin: 10}}>
              <TextInput
                style={styles.InputField}
                value={values.height}
                onChangeText={handleChange('height')}
                onBlur={() => setFieldTouched('height')}
                placeholder="Altura"
              />
              {touched.height && errors.height &&
                <Text style={{ fontSize: 12, color: 'red' }}>{errors.height}</Text>
              }
              <TouchableOpacity disabled={!isValid} style={styles.Container(!isValid)} onPress={() => this.handlePress("Scanner", values.height)}>
                <Ionicons name="ios-aperture" color="white" size={25}/>
                <Text style={styles.ButtonText}>"Calcular mis medidas"</Text>
              </TouchableOpacity>

            </View>
          )}
        </Formik>
      </View>
    )
  }

  renderOptions = () => {

    return (
      <View style={styles.OptionsContainer}>
        <Button text="Conozco mis medidas" icon="ios-add-circle" to="Home" onPress={this.handlePress}/>
      </View>
    )
  }

  renderAnimation = () => {
    return (
      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <LottieAnimation
          height={300}
          width={300}
          animation={measureAnimation}
          animationProps={{ loop: true }}
        />
      </View>
    )
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
