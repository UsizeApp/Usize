import React from 'react';
import { View, Image, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native'
import Layout from '../components/Layout'
import { Formik } from 'formik'
import * as yup from 'yup'

export default class RegisterPage extends React.Component {
  static navigationOptions = {
    title: 'Registro',
    headerStyle: {
      backgroundColor: '#66CBFF',
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
    headerTintColor: 'white',
  }

  handleSubmit = (form) => {
    const { navigation } = this.props

    var serverURL = "http://192.168.0.11:3333/register"

    var user_data = {
      first_name: form.first_name,
      last_name: form.last_name,
      rut: form.rut,
      email: form.email,
      password: form.password,
    };

//    // 1. Create a new XMLHttpRequest object
    var xhr = new XMLHttpRequest();

//    // 2. Configure it: POST-request for the server URL
    xhr.open("POST", serverURL);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

//    // 3. Send the request over the network
    xhr.send(JSON.stringify(user_data));

    // 4. This will be called after the response is received
    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var json_res = JSON.parse(xhr.responseText);
          if (json_res.result == "fatal_error") {
            alert("Ha ocurrido un problema en el registro.");
            navigation.push("Register")
          } else if (json_res.result == "success") {
            alert("Registrado correctamente!");
            navigation.push("Access")
          }
        } else {
          console.error(xhr.statusText);
        }
      }
    };

    xhr.onerror = function (e) {
      alert("Request failed");
    };

    xhr.onprogress = function(event) { // triggers periodically
      alert('Received ${event.loaded} of ${event.total}');
    };

  }

  render() {
    return (
      <React.Fragment>
        <Layout>
          {this.renderForm()}
        </Layout>
      </React.Fragment>
    )
  }

  renderForm = () => {
    return (
      <Formik
        initialValues={{ first_name: '', last_name: '', rut: '', email: '', password: '', confirmPassword: '' }}
        onSubmit={values => Alert.alert(JSON.stringify(values))}
        validationSchema={yup.object().shape({
          first_name: yup
            .string()
            .label('Nombres')
            .required('Ingrese su nombre'),
          last_name: yup
            .string()
            .label('Apellidos')
            .required('Ingrese su apellido'),
          rut: yup
            .string()
            .label('RUT')
            .required('Ingrese su RUT'),
          email: yup
            .string()
            .email()
            .label('Correo')
            .required('Ingrese un Correo'),
          password: yup
            .string()
            .label('Contraseña')
            .min(8, 'Contraseña debe ser de al menos 8 caracteres')
            .required('Ingrese una Contraseña'),
          confirmPassword: yup
            .string()
            .label('Confirme su contraseña')
            .required('Ingrese una Contraseña')
            .test('passwords-match', 'Las contraseñas deben coincidir', function(value) {
              return this.parent.password === value;
            }),
        })}
      >
        {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
          <View style={{margin: 10}}>
            <TextInput
              style={styles.InputField}
              value={values.first_name}
              onChangeText={handleChange('first_name')}
              onBlur={() => setFieldTouched('first_name')}
              placeholder="Nombres"
            />
            {touched.first_name && errors.first_name &&
              <Text style={{ fontSize: 10, color: 'red' }}>{errors.first_name}</Text>
            }
            <TextInput
              style={styles.InputField}
              value={values.last_name}
              onChangeText={handleChange('last_name')}
              onBlur={() => setFieldTouched('last_name')}
              placeholder="Apellidos"
            />
            {touched.last_name && errors.last_name &&
              <Text style={{ fontSize: 10, color: 'red' }}>{errors.last_name}</Text>
            }
            <TextInput
              style={styles.InputField}
              value={values.rut}
              onChangeText={handleChange('rut')}
              onBlur={() => setFieldTouched('rut')}
              placeholder="RUT"
            />
            {touched.rut && errors.rut &&
              <Text style={{ fontSize: 10, color: 'red' }}>{errors.rut}</Text>
            }
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
            <TextInput
              style={styles.InputField}
              value={values.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              placeholder="Confirme su contraseña"
              onBlur={() => setFieldTouched('confirmPassword')}
              secureTextEntry={true}
            />
            {touched.confirmPassword && errors.confirmPassword &&
              <Text style={{ fontSize: 10, color: 'red' }}>{errors.confirmPassword}</Text>
            }
            <TouchableOpacity style={styles.Container(isValid)} disabled={!isValid} onPress={() => this.handleSubmit(values)}  >
              <Text style={styles.ButtonText}>Registrarse</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    )
  }
}

const styles = StyleSheet.create({
  Container: (isValid) => ({
    backgroundColor: isValid ? '#66CBFF': "#8E8E8E",
    padding: 8,
    borderRadius: 5,
    marginVertical: 15,
    flexDirection: 'row'
  }),
  ButtonText: {
    fontSize: 17,
    color: 'white',
    marginLeft: 8,
  },
  InputField: {
    marginVertical: 5,
  }
})
