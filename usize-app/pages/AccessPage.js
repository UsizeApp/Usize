import React from 'react';
import { View, Image, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native'
import Button from '../components/Utils/Button'
import Layout from '../components/Layout'
import { Formik } from 'formik'
import * as yup from 'yup'
import DropdownAlert from 'react-native-dropdownalert'

export default class AccessPage extends React.Component {
  static navigationOptions = {
    title: 'Access',
    header: null,
  }

  // Constructor y variables de la clase
  constructor() {
    super();
    this.state = {
      status: -1,
    }
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
          <DropdownAlert ref={ref => this.dropdown = ref} />
        </Layout>
      </React.Fragment>
    )
  }

  renderHeader = () => {
    return (
      <View style={styles.HeaderContainer}>
        <Image source={require('../assets/index.jpeg')} style={{ width: 230, height: 80 }} />
      </View>
    )
  }

  async loginAPI(email, pwd) {
    const URL1 = 'http://10.0.0.22:5000/login'

    const formData = new FormData()
    formData.append('email', email);
    formData.append('pwd', pwd);
    //formData.append('source', 'app');

    const response = await fetch(URL1, {
      credentials: 'same-origin',
      method: 'POST',
      body: formData,
    });

    var json;

    try {
      json = await response.json();
      console.log(json)
    }
    catch (e) {
      console.log(e)
    }

    var respuesta = json.response
    var status = -1

    switch (respuesta) {
      case "logueado":
        status = 1;
        break;
      case "pwd incorrecta":
        status = 2;
        break;
      case "email no existe":
        status = 3;
        break;
      default:
        status = -1;
    }

    // Cuando se obtengan las respuestas, seteamos las variables de la clase
    this.setState({ status: status });
  }

  renderLogin = () => {
    return (
      <View style={styles.FormContainer}>
        <Formik
          initialValues={{ email: '', password: '', confirmPassword: '' }}
          //onSubmit={values => Alert.alert(JSON.stringify(values))}
          onSubmit={values => {
            // Falta encapsular todo esto con un icono de cargando
            // Y hacer el "handle" para cuando el login falla, o cuando esta todo ok
            this.loginAPI(values.email, values.password).done(() => {
              switch (this.state.status) {
                case 1:
                  //this.dropdown.alertWithType('success', 'Sesión iniciada')
                  this.props.navigation.navigate('Perfil')
                  break;
                case 2:
                  this.dropdown.alertWithType('error', 'Error de autenticación', 'Usuario o contraseña incorrectos')
                  break;
                case 3:
                  this.dropdown.alertWithType('error', 'Error de autenticación', 'El email ingresado no existe en nuestra base de datos')
                  break;
                default:
                  break;
              }
            });
          }}
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
            <View style={{ margin: 10 }}>
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
              <TouchableOpacity style={{ flexDirection: 'row', marginVertical: 5 }} onPress={() => this.handlePress('Register')}>
                <Text style={{ color: '#8E8E8E' }}>¿No tienes una cuenta? </Text><Text style={{ color: '#66CBFF' }}>Regístrate</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.ButtonHolder(isValid)} disabled={!isValid} onPress={handleSubmit}>
                <Text style={styles.ButtonText}>Ingresar</Text>
              </TouchableOpacity>

              <Button text="Usar sin registarse" icon="ios-contact" to="Home" onPress={this.handlePress} />
              {/*<Button text="Perfil" icon="ios-contact" to="Perfil" onPress={this.handlePress} />*/}
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
    backgroundColor: isValid ? '#66CBFF' : "#8E8E8E",
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
