import React from 'react';
import { View, Image, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity, TextInput } from 'react-native'
import Layout from '../../components/Layout'
import LottieAnimation from '../../components/Utils/LottieAnimation'
import measureAnimation from '../../assets/animations/measure'
import Button from '../../components/Utils/Button'
import DropdownAlert from 'react-native-dropdownalert'
import { NavigationEvents } from 'react-navigation'
import { Formik } from 'formik'
import * as yup from 'yup'
import { Ionicons } from '@expo/vector-icons'

export default class Altura extends React.Component {
  static navigationOptions = {
    title: 'Medir',
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
    navigation.navigate(to, {
      height: height
    })
  }

  withError = () => {
    const { navigation } = this.props;
    const error = navigation.getParam('error');
    if (error) {
      const { dropdown } = this
      dropdown.alertWithType('error', 'No se pudo calcular las medidas', 'No se ha detectado una persona')
      navigation.setParams({ error: null })
    }
  }

  // Ojo! Uso de CPU elevado
  renderAnimation = () => {
    return (
      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <LottieAnimation
          height={150}
          width={150}
          animation={measureAnimation}
          animationProps={{ loop: true }}
        />
      </View>
    )
  }

  renderHeightRequest = () => {
    return (
      <View style={styles.FormContainer}>
        <Text style={{ color: '#8E8E8E' }}>Ingrese su altura en centímetros:</Text>
        <Formik
          onSubmit={values => Alert.alert(JSON.stringify(values))}
          validationSchema={yup.object().shape({
            height: yup
              .number().typeError('Altura no válida')
              .required('Ingrese su altura')
              .min(100, 'La altura debe ser entre 100 y 200 centímetros')
              .max(200, 'La altura debe ser entre 100 y 200 centímetros')
          })}
        >
          {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
            <View style={{ margin: 10, alignItems: 'center', }}>
              <TextInput
                style={styles.InputField}
                value={values.height}
                autoFocus={true}
                onChangeText={handleChange('height')}
                onBlur={() => setFieldTouched('height')}
                maxLength={3}
                placeholder="cm"
                keyboardType="numeric"
                textAlign={'center'}
              />
              {touched.height && errors.height &&
                <Text style={{ fontSize: 12, color: 'red' }}>Error: {errors.height}</Text>
              }
              <TouchableOpacity disabled={!isValid} style={styles.Container(!isValid)} onPress={() => this.handlePress("Foto", values.height)}>
                <Ionicons name="ios-aperture" color="white" size={25} />
                <Text style={styles.ButtonText}>Tomar fotos</Text>
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
        <Button text="Conozco mis medidas" icon="ios-add-circle" to="Home" onPress={this.handlePress} />
      </View>
    )
  }

  render() {
    return (
      <Layout style={styles.GlobalContainer}>
        {/*<KeyboardAvoidingView behavior="position" enabled>*/}
        {this.renderAnimation()}
        {this.renderHeightRequest()}
        {/*this.renderOptions()*/}
        {/*</KeyboardAvoidingView>*/}
        <DropdownAlert ref={ref => this.dropdown = ref} />
        <NavigationEvents
          onWillFocus={() => this.withError()}
        />
      </Layout>
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
    flex: 1,
    alignItems: 'center',
  },
  InputField: {
    width: 60,
    marginVertical: 5,
    borderBottomWidth: 1,
    padding: 5,
    borderColor: "#8E8E8E",
    alignItems: 'center',
    justifyContent: "center",
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
