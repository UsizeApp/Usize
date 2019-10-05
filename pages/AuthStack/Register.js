import React from 'react';
import { View, Image, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native'
import Layout from 'components/Layout'
import { Formik } from 'formik'
import * as yup from 'yup'
import { AsyncStorage } from 'react-native';
import { getAPI } from '../../models/API'
import TriStateToggleSwitch from 'rn-tri-toggle-switch'

export default class Register extends React.Component {
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

  
  constructor() {
    super();
    this.state = {
      status: 0,
    }
  }

  async registroAPI(form) {
    console.log('registroAPI')

    var URL = getAPI() + "/register"

    const formData = new FormData()

    var email = form.email
    var pwd = form.password
    var nombre = form.first_name + ' ' + form.last_name
    var rut = form.rut
    if (form.gender == undefined) {
      var gender = undefined;
    } else {
      var gender = form.gender.choiceCode;
    }
    formData.append('email', email);
    formData.append('pwd', pwd);
    formData.append('nombre', nombre);
    formData.append('rut', rut);
    formData.append('gender', gender);
    formData.append('source', 'app');

    const response = await fetch(URL, {
      credentials: 'same-origin',
      method: 'POST',
      body: formData,
    });

    try {
      const json = await response.json();
      console.log(json)
      await AsyncStorage.setItem('token', json.token);
      await AsyncStorage.setItem('token', json.response);
    }
    catch (e) {
      console.log(e)
    }

    // Cuando se obtengan las respuestas, seteamos las variables de la clase
    this.setState({ status: 1 });
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
        onSubmit={values => {
          //Alert.alert(JSON.stringify(values))
          this.registroAPI(values).done(() => {
            if (this.state.status == 1)
              this.props.navigation.push('Perfil')
          });
        }}
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
            <Text style={{ color: '#c3c3c3', marginVertical: 30, fontSize: 15 }}>Género (opcional):</Text>
            <TriStateToggleSwitch 
                width={200} 
                height={35} 
                selectedNoneBgColor={'#999999'}
                selectedLeftBgColor={'#0027ff'}
                selectedRightBgColor={'#0027ff'}
                fontColor={'#fff'}
                fontSize={13}
                circleBgColor={'white'}
                choices={choicesProp}
                onChange={(value) => { values.gender = value; }}
            />
            <TouchableOpacity style={styles.Container(isValid)} disabled={!isValid} onPress={handleSubmit}>
              <Text style={styles.ButtonText}>Registrarse</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    )
  }
}

let choicesProp = [
  {
    choiceCode: 'M',
    choiceText: 'Hombre'
  },
  {
    choiceCode: 'F',
    choiceText: 'Mujer'
  }
]

const styles = StyleSheet.create({
  Container: (isValid) => ({
    backgroundColor: isValid ? '#66CBFF' : "#8E8E8E",
    padding: 15,
    borderRadius: 5,
    marginVertical: 100,
    justifyContent: 'center',
    flexDirection: 'row'
  }),
  ButtonText: {
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    marginLeft: 8
  },
  InputField: {
    marginVertical: 5
  }
})
