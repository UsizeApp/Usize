import React from 'react';
import { View, Image, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Layout from 'components/Layout';
import { Formik } from 'formik';
import * as yup from 'yup';
import { AsyncStorage } from 'react-native';
import { getAPI } from '../../models/API';
import {CheckBox} from 'react-native-elements';
import TriStateToggleSwitch from 'rn-tri-toggle-switch';

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
      offset: 0,
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
    if (form.male == true) {
      var gender = 'masculino';
    } else {
      var gender = 'femenino';
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
      console.log(formData)
      //const json = await response.json();
      //console.log(json)
      //await AsyncStorage.setItem('token', json.token);
      //await AsyncStorage.setItem('token', json.response);
    }
    catch (e) {
      console.log(e)
    }

    // Cuando se obtengan las respuestas, seteamos las variables de la clase
    this.setState({ status: 1 });
  }

  render() {
    return (
      <ScrollView ref={'scroll'} scrollEnabled={false}>
        <React.Fragment>
          <Layout>    
            {this.renderForm()}
          </Layout>
        </React.Fragment>
      </ScrollView>
    )
  }

  renderForm = () => {

    let validationSchema = yup.object().shape({
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
        .email('Ingrese un correo válido')
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
        
      male: yup.bool().required(),
      female: yup.bool().required(),
    })

    /*validationSchema.test(
      'checkbox-test',
      null,
      (obj) => {
        if ( obj.male || obj.female) {
          return true;
        }
        return new yup.ValidationError(
          'Seleccione su genero',
          null,
          'checkbox-failed'
        );
      }
    );*/

    return (
      <Formik
        onSubmit={values => {
          //Alert.alert(JSON.stringify(values))
          this.registroAPI(values).done(() => {
            if (this.state.status == 1)
              this.props.navigation.push('Perfil')
          });
        }}
        
        validationSchema = {validationSchema}

      >
        {({ values, handleChange, errors, setValues, setFieldTouched, touched, isValid, handleSubmit }) => (
          <View style={{margin: 10,paddingBottom: 100}}>
            <Text>Nombres:</Text>
            <TextInput
              style={styles.InputField}
              value={values.first_name}
              onChangeText={handleChange('first_name')}
              onBlur={() => setFieldTouched('first_name')}
            />
            {touched.first_name && errors.first_name &&
              <Text style={{ fontSize: 10, color: 'red' }}>{errors.first_name}</Text>
            }
            <Text>Apellidos:</Text>
            <TextInput
              style={styles.InputField}
              value={values.last_name}
              onChangeText={handleChange('last_name')}
              onBlur={() => setFieldTouched('last_name')}
            />
            {touched.last_name && errors.last_name &&
              <Text style={{ fontSize: 10, color: 'red' }}>{errors.last_name}</Text>
            }
            <Text>RUT (sin puntos ni guión):</Text>
            <TextInput
              style={styles.InputField}
              value={values.rut}
              onChangeText={handleChange('rut')}
              onBlur={() => setFieldTouched('rut')}
            />
            {touched.rut && errors.rut &&
              <Text style={{ fontSize: 10, color: 'red' }}>{errors.rut}</Text>
            }
            <Text>Correo:</Text>
            <TextInput
              style={styles.InputField}
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={() => setFieldTouched('email')}
            />
            {touched.email && errors.email &&
              <Text style={{ fontSize: 10, color: 'red' }}>{errors.email}</Text>
            }
            <Text>Contraseña:</Text>
            <TextInput
              style={styles.InputField}
              value={values.password}
              onChangeText={handleChange('password')}
              onFocus = {() => this.refs['scroll'].scrollTo({y: 60, animated:false})}
              onBlur={() => {setFieldTouched('password'); this.refs['scroll'].scrollTo({y: 0, animated:false})}}
              secureTextEntry={true}
            />
            {touched.password && errors.password &&
              <Text style={{ fontSize: 10, color: 'red' }}>{errors.password}</Text>
            }
            <Text>Confirme su contraseña:</Text>
            <TextInput
              style={styles.InputField}
              value={values.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              onFocus = {() => this.refs['scroll'].scrollTo({y: 140, animated:false})}
              onBlur={() => {setFieldTouched('confirmPassword'); this.refs['scroll'].scrollTo({y: 0, animated:false})}}
              secureTextEntry={true}
            />
            {touched.confirmPassword && errors.confirmPassword &&
              <Text style={{ fontSize: 10, color: 'red' }}>{errors.confirmPassword}</Text>
            }
            <Text>Sexo:</Text>
            <View style = {{flexDirection:'row', marginLeft:'7%'}}>
              <CheckBox
                title = "Masculino"
                checked = {values.male}
                onPress = {() => setValues({...values, 'male':true, 'female':false})}
                containerStyle = {styles.CheckboxContainer}
              />
              <CheckBox
                title = "Femenino"
                checked = {values.female}
                onPress = {() => setValues({...values,'male':false, 'female':true})}
                containerStyle = {styles.CheckboxContainer}
              />
            </View>
            {/*<TriStateToggleSwitch 
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
            />*/}
            <View style = {{alignItems: 'center'}}>
              <TouchableOpacity style={styles.Container(isValid)} disabled={!isValid} onPress={handleSubmit}>
                <Text style={styles.ButtonText}>Registrarse</Text>
              </TouchableOpacity>
            </View>
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
    marginVertical: 20,
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
  InputContainer:{
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'space-between'
  },
  InputField: {
    marginVertical: 10,
    borderColor: 'gray',
    borderWidth: 1, 
    borderRadius: 4
  },
  CheckboxContainer:{
    borderWidth:0,
    margin:0
  }
})
