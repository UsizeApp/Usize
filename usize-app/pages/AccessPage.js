import React from 'react';
import { View, Image, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import Button from '../components/Utils/Button'
import Layout from '../components/Layout'
import { Formik } from 'formik'
import * as yup from 'yup'

export default class AccessPage extends React.Component {
  static navigationOptions = {
    header: null,
  }

  handlePress = (to) => {
    const { navigation } = this.props
    navigation.push(to)
  }

  render() {
    return (
      <React.Fragment>
        <Layout>
          <KeyboardAvoidingView style={styles.GlobalContainer} keyboardVerticalOffset={-100} behavior="position" enabled>
            {this.renderHeader()}
            {this.renderLogin()}
          </KeyboardAvoidingView>
        </Layout>
      </React.Fragment>
    )
  }

  renderHeader = () => {

    return (
      <View style={styles.HeaderContainer}>
        <Image source={require('../assets/index.jpeg')} style={{width: 230, height: 80}}/>
      </View>
    )
  }

  renderLogin = () => {
    return (
      <View style={styles.FormContainer}>
        <Formik
          initialValues={{ email: '', password: '', confirmPassword: '' }}
          onSubmit={values => Alert.alert(JSON.stringify(values))}
          validationSchema={yup.object().shape({
            email: yup
              .string()
              .email()
              .required('Ingrese un Correo'),
            password: yup
              .string()
              .min(8, 'Contraseña debe ser de al menos 8 caracteres')
              .required('Ingrese una Contraseña'),
          })}
        >
          {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
            <View style={{margin: 10}}>
              <TextInput
                style={styles.InputField}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={() => setFieldTouched('email')}
                placeholder="Correo"
              />
              {touched.email && errors.email &&
                <Text style={{ fontSize: 10, color: 'red' }}>{errors.email}</Text>
              }
              <TextInput
                style={styles.InputField}
                value={values.password}
                onChangeText={handleChange('password')}
                placeholder="Contraseña"
                onBlur={() => setFieldTouched('password')}
                secureTextEntry={true}
              />
              {touched.password && errors.password &&
                <Text style={{ fontSize: 10, color: 'red' }}>{errors.password}</Text>
              }
              <TouchableOpacity style={{flexDirection: 'row', marginVertical: 5}} onPress={() => this.handlePress('Register')}>
                <Text style={{color: '#8E8E8E'}}>¿No tienes una cuenta? </Text><Text style={{color: '#66CBFF'}}>Regístrate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.ButtonHolder(isValid)} disabled={!isValid} onPress={handleSubmit}>
                <Text style={styles.ButtonText}>Ingresar</Text>
              </TouchableOpacity>
              <Button text="Usar sin registarse" icon="ios-contact" to="Home" onPress={this.handlePress}/>
            </View>
          )}
        </Formik>
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
  HeaderContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  FormContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ButtonHolder: (isValid) => ({
    backgroundColor: isValid ? '#66CBFF': "#8E8E8E",
    padding: 8,
    borderRadius: 5,
    marginVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center'
  }),
  ButtonText: {
    fontSize: 17,
    color: 'white',
    marginLeft: 8,
  },
  InputField: {
    marginVertical: 5,
    borderWidth: 1,
    paddingLeft: 5,
    borderColor: "#8E8E8E",
    borderRadius: 4
  },
})
