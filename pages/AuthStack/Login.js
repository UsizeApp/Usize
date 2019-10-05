import React from 'react';
import {
  View, Image, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, AsyncStorage,
} from 'react-native';
import Button from 'components/Utils/Button';
import Layout from 'components/Layout';
import { Formik } from 'formik';
import * as yup from 'yup';

import DropdownAlert from 'react-native-dropdownalert';

import { Usuario } from '../../models/API';

export default class Login extends React.Component {
  static navigationOptions = {
    title: 'Access',
    header: null,
  }

  // Constructor y variables de la clase
  constructor() {
    super();
    this.state = {
      status: -1,
    };
  }

  async componentDidMount() {
    const initToken = async () => {
      try {
        // El token comienza en 0 hasta obtener uno valido
        // await AsyncStorage.setItem('token', 0);
      } catch (error) {
        // Error saving data
      }
    };
  }

  handlePress = (to) => {
    const { navigation } = this.props;
    navigation.navigate(to);
  }

  renderHeader = () => (
    <View style={styles.HeaderContainer}>
      <Image source={require('../../assets/index.jpeg')} style={{ width: 230, height: 80 }} />
    </View>
  )

  async handleLogin(email, pwd) {
    console.log('Login::handleLogin');
    u = new Usuario();

    const token = await u.tryLogin(email, pwd);

    if (token != null) {
      const { navigation } = this.props;
      navigation.navigate('Info');
    } else {
      this.dropdown.alertWithType('error', 'Error de autenticación', 'E-mail o contraseña incorrectos')
    }
  }

  renderLogin = () => (
    <View style={styles.FormContainer}>
      <Formik
        isInitialValid={true}
        initialValues={{ email: 'ale@usm.cl', password: '12345678' }}
        onSubmit={(values) => this.handleLogin(values.email, values.password)}
        validationSchema={yup.object().shape({
          email: yup
            .string()
            .email()
            .required('Ingrese un Correo'),
          password: yup
            .string()
            .min(8, 'Contraseña debe ser de al menos 6 caracteres')
            .required('Ingrese una Contraseña'),
        })}
      >
        {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
          <View style={{ margin: 10 }}>
            <TextInput
              style={styles.InputField}
              keyboardType="email-address"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={() => setFieldTouched('email')}
              placeholder="Correo"
            />
            {touched.email && errors.email
              && <Text style={{ fontSize: 10, color: 'red' }}>{errors.email}</Text>}
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

            <TouchableOpacity style={{ flexDirection: 'row', marginVertical: 5 }} onPress={() => this.handlePress('Register')}>
              <Text style={{ color: '#8E8E8E' }}>¿No tienes una cuenta? </Text>
              <Text style={{ color: '#66CBFF' }}>Regístrate</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.ButtonHolder(isValid)} disabled={!isValid} onPress={handleSubmit}>
              <Text style={styles.ButtonText}>Ingresar</Text>
            </TouchableOpacity>

          </View>
        )}
      </Formik>
    </View>
  )

  render() {
    return (
      <>
        <Layout>
          <KeyboardAvoidingView style={styles.GlobalContainer} keyboardVerticalOffset={-100} behavior="position" enabled>
            {this.renderHeader()}
            {this.renderLogin()}
          </KeyboardAvoidingView>
          <DropdownAlert ref={(ref) => { this.dropdown = ref; }} />
        </Layout>
      </>
    );
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
    backgroundColor: isValid ? '#66CBFF' : '#8E8E8E',
    padding: 8,
    borderRadius: 5,
    marginVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
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
    borderColor: '#8E8E8E',
    borderRadius: 4,
  },
});
