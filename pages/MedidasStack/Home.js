import React, { Component } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,Modal,Alert, TextInput, TouchableOpacity,ScrollView
} from 'react-native';
import Layout from 'components/Layout';
import Button from '../../components/Utils/Button';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Email } from '../../models/API';
import { Ionicons } from '@expo/vector-icons';
import DropdownAlert from 'react-native-dropdownalert';

function CreateModal(props) {
  const { tipo, medida } = props;
  const {
    bEsFemenino
  } = props;

  renderForm = () => {
      let validationSchema = yup.object().shape({
        brazo_izquierdo: yup
          .number()
          .label('Brazo izquierdo')
          .required('Ingrese el largo de su brazo izquierdo en cm'),
        brazo_derecho: yup
          .number()
          .label('Brazo derecho')
          .required('Ingrese el largo de su brazo derecho en cm'),
        pierna_izquierda: yup
          .number()
          .label('Pierna izquierda')
          .required('Ingrese el largo de su pierna izquierda en cm'),
        pierna_derecha: yup
          .number()
          .label('Pierna derecha')
          .required('Ingrese el largo de su pierna derecha en cm'),
        cintura: yup
          .number()
          .label('Cintura')
          .required('Ingrese la medida de su cintura en cm'),
        cadera: yup
          .number()
          .label('Cadera')
          .required('Ingrese la medida de su cadera en cm'),
      })

      if(bEsFemenino) {
        validationSchema.busto = yup
        .number()
        .label('Busto')
        .required('Ingrese la medida del busto en cm')

        validationSchema.pecho =  yup
        .number()
        .label('Pecho')
        .required('Ingrese la medida del pecho en cm')
            }

      return (
        <Formik
          isInitialValid={true}
          initialValues={{ brazo_izquierdo: '', brazo_derecho: '', pierna_derecha: '', 
          pierna_izquierda: '', cadera: '', cintura: '', pecho: '', busto: '' }}
          onSubmit={values => { console.log(values) }} //AGREGAAAR FUNCION LLAMADA DE MEDIDAS NUEVAS
          validationSchema={validationSchema}
        >
          {({ values, handleChange, errors, setValues, setFieldTouched, touched, isValid, handleSubmit }) => (
            <View style={{ margin: 10, paddingBottom: 100 }}>
              <Text>Pierna Izquierda:</Text>
              <TextInput
                style={styles.InputField}
                value={values.pierna_izquierda}
                onChangeText={handleChange('pierna_izquierda')}
                onBlur={() => setFieldTouched('pierna_izquierda')}
              />
              {touched.pierna_izquierda && errors.pierna_izquierda &&
                <Text style={{ fontSize: 15, color: 'red' }}>{errors.pierna_izquierda}</Text>
              }
              <Text>Pierna Derecha:</Text>
              <TextInput
                style={styles.InputField}
                value={values.pierna_derecha}
                onChangeText={handleChange('pierna_derecha')}
                onBlur={() => setFieldTouched('pierna_derecha')}
              />
              {touched.pierna_derecha && errors.pierna_derecha &&
                <Text style={{ fontSize: 10, color: 'red' }}>{errors.pierna_derecha}</Text>
              }
              <Text>Brazo Izquierdo:</Text>
              <TextInput
                style={styles.InputField}
                value={values.brazo_izquierdo}
                onChangeText={handleChange('brazo_izquierdo')}
                onBlur={() => setFieldTouched('brazo_izquierdo')}
              />
              {touched.brazo_izquierdo && errors.brazo_izquierdo &&
                <Text style={{ fontSize: 10, color: 'red' }}>{errors.brazo_izquierdo}</Text>
              }
              <Text>Brazo Derecho:</Text>
              <TextInput
                style={styles.InputField}
                value={values.brazo_derecho}
                onChangeText={handleChange('brazo_derecho')}
                onBlur={() => setFieldTouched('brazo_derecho')}
              />
              {touched.brazo_derecho && errors.brazo_derecho &&
                <Text style={{ fontSize: 10, color: 'red' }}>{errors.brazo_derecho}</Text>
              }
              <Text>Cintura:</Text>
              <TextInput
                style={styles.InputField}
                value={values.cintura}
                onChangeText={handleChange('cintura')}
                onFocus={() => this.refs['scroll'].scrollTo({ y: 60, animated: false })}
                onBlur={() => { setFieldTouched('cintura'); this.refs['scroll'].scrollTo({ y: 0, animated: false }) }}
                secureTextEntry={true}
              />
              {touched.cintura && errors.cintura &&
                <Text style={{ fontSize: 10, color: 'red' }}>{errors.cintura}</Text>
              }
              <Text>Cadera:</Text>
              <TextInput
                style={styles.InputField}
                value={values.cadera}
                onChangeText={handleChange('cadera')}
                onFocus={() => this.refs['scroll'].scrollTo({ y: 140, animated: false })}
                onBlur={() => { setFieldTouched('cadera'); this.refs['scroll'].scrollTo({ y: 0, animated: false }) }}
                secureTextEntry={true}
              />
              {touched.cadera && errors.cadera &&
                <Text style={{ fontSize: 10, color: 'red' }}>{errors.cadera}</Text>
              }
            <Text>Busto:</Text>
                <TextInput
                  style={styles.InputField}
                  value={values.busto}
                  onChangeText={handleChange('busto')}
                  onFocus={() => this.refs['scroll'].scrollTo({ y: 140, animated: false })}
                  onBlur={() => { setFieldTouched('busto'); this.refs['scroll'].scrollTo({ y: 0, animated: false }) }}
                  secureTextEntry={true}
                />
                {touched.busto && errors.busto &&
                  <Text style={{ fontSize: 10, color: 'red' }}>{errors.busto}</Text>
                }
            <Text>Pecho:</Text>
                <TextInput
                  style={styles.InputField}
                  value={values.pecho}
                  onChangeText={handleChange('pecho')}
                  onFocus={() => this.refs['scroll'].scrollTo({ y: 140, animated: false })}
                  onBlur={() => { setFieldTouched('pecho'); this.refs['scroll'].scrollTo({ y: 0, animated: false }) }}
                  secureTextEntry={true}
                />
                {touched.pecho && errors.pecho &&
                  <Text style={{ fontSize: 10, color: 'red' }}>{errors.pecho}</Text>
              }
              
              <View style={{ alignItems: 'center' }}>
                <TouchableOpacity style={styles.Container(isValid)} disabled={!isValid} onPress={handleSubmit}>
                  <Text style={styles.ButtonText}>Guardar Medidas</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      )
  }
return (
  <ScrollView ref={'scroll'} scrollEnabled={false}>
    <React.Fragment>
      <Layout>
        {this.renderForm()}
        <DropdownAlert ref={(ref) => { this.dropdown = ref; }} />
      </Layout>
    </React.Fragment>
  </ScrollView>
)
}

function FilaMedida(props) {
  const { tipo, medida } = props;
  let { bbw } = props;
  bbw = typeof bbw === 'undefined' ? 2 : 0;

  return (
    <View style={{
      flexDirection: 'row', marginVertical: 8, borderBottomWidth: bbw, paddingBottom: 5, borderColor: '#ddd',
    }}
    >
      <Text style={{ flex: 1, color: 'grey' }}>{tipo}</Text>
      <Text style={{ textAlign: 'right', color: 'grey' }}>{medida}</Text>
    </View>
  );
}

export default class MedidasHome extends Component {
  static navigationOptions = {
    title: 'Medidas',
    headerStyle: {
      backgroundColor: '#66CBFF',
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
    headerTintColor: 'white',
  }

  constructor(props) {
    super(props);
    this.state = {
      medidas: null,
      sexo: null,
      done: false,
      modalVisible: false,
    };
  }

  openModal() {
    this.setState({modalVisible:true});
  }

  closeModal(props) {
    const { navigation } = this.props;

    navigation.push('Medidas')
    this.setState({modalVisible:false});
  }


  componentDidMount() {
    this.getMedidas(); // Obtenemos las medidas en el Home
  }

  async getMedidas() {
    console.log('Home::getMedidas');

    const u = new Email();
    const datosPersona = await u.storageGetDatosPersona()

    if (datosPersona == null) {
      console.error('Error de datos')
      return
    }

    const bTieneMedidas = await u.bTieneMedidas()
    let medidas = null;
    let bEsFemenino = false;

    if (bTieneMedidas) {
      medidas = await u.medidasParaTabla()
      bEsFemenino = await u.bEsFemenino()
    }

    this.setState({
      datosPersona,
      bTieneMedidas,
      medidas,
      bEsFemenino,
      done: true
    });
  }

  render() {
    const { done } = this.state;
    const { navigation } = this.props;

    if (done) {
      const { datosPersona, bTieneMedidas, medidas, bEsFemenino } = this.state;

      encabezado = null

      if (bTieneMedidas) {
        encabezado = (
          <View>
            <Text style={{ color: '#8E8E8E' }}>Ultima actualización:</Text>
            <Text style={{ color: '#8E8E8E' }}>{datosPersona.fecha_ultimas_medidas}</Text>
          </View>
        )

        filaP = <FilaMedida tipo="Pecho" medida={medidas.chest} bbw="0" />
        filaB = null

        if (bEsFemenino) {
          filaP = <FilaMedida tipo="Pecho" medida={medidas.chest} />
          filaB = <FilaMedida tipo="Busto" medida={medidas.bust} bbw="0" />
        }

        return (
          <View style={styles.container}>
            {encabezado}
            <View style={styles.marco}>
              <FilaMedida tipo="Brazo Izquierdo" medida={medidas.left_arm} />
              <FilaMedida tipo="Brazo Derecho" medida={medidas.right_arm} />

              <FilaMedida tipo="Pierna Izquierda" medida={medidas.left_leg} />
              <FilaMedida tipo="Pierna Derecha" medida={medidas.right_leg} />

              <FilaMedida tipo="Cintura" medida={medidas.waist} />
              <FilaMedida tipo="Cadera" medida={medidas.hips} />
              {filaP}
              {filaB}
            </View>
            <View>
              <Button text="Actualizar medidas" onPress={() => navigation.navigate('Altura')} />
              <Button
                  onPress={() => this.openModal()}
                  title="Open modal"
                  text="Editar medidas manualmente"
              />
            </View>
            <View style={styles.container}>
            <Modal
              visible={this.state.modalVisible}
              animationType={'slide'}
              onRequestClose={() => this.closeModal()}
          >
            <TouchableOpacity 
                onPress={() => {this.closeModal()}}>
              <Ionicons name="md-close" size={20} color='grey' />
            </TouchableOpacity>
            <View style={styles.containerModal}>
                <Text style={{color:'grey', fontSize: 20, justifyContent: 'center'}}>
                  Ingresar todas las medidas correspondientes</Text>
            <CreateModal bEsFemenino={this.state.bEsFemenino} />
            <View style={styles.marcoModal}>
            <Button
                onPress={() => {
                  this.closeModal()}}
                title="Guardar medidas"
                text="Guardar medidas"
            >
            </Button>
              </View>
            </View>
          </Modal>
          </View>
          </View>
        );
      }
      else {
        return (
          <View style={styles.container}>
            {encabezado}
            <Text style={{ color: '#8E8E8E' }}>¡Aún no has calculado tus medidas!</Text>
            <Button text="Obtén tus medidas" onPress={() => navigation.navigate('Altura')} />
            <Text style={{ color: '#8E8E8E' }}>Si lo prefieres, puedes ingresar tus medidas manualmente</Text>
            <Button text="Ingresar manualmente" onPress={() => this.openModal()} />
            <View style={styles.container}>
            <Modal
              visible={this.state.modalVisible}
              animationType={'slide'}
              onRequestClose={() => this.closeModal()}
          >
            <TouchableOpacity 
                onPress={() => {this.closeModal()}}>
              <Ionicons name="md-close" size={20} color='grey' />
            </TouchableOpacity>
            <View style={styles.containerModal}>
                <Text style={{color:'grey', fontSize: 20, justifyContent: 'center'}}>
                  Ingresar todas las medidas correspondientes</Text>
              <View style={styles.marcoModal}>
                <Button
                    onPress={() => {
                      this.closeModal()}}
                    title="Guardar medidas"
                    text="Guardar medidas"
                >
                </Button>
              </View>
            </View>
          </Modal>
          </View>
          </View>
        )
      }
    }

    // Else
    return (
      <View style={styles.FormContainer}>
        <Text style={{ color: '#8E8E8E' }}>Obteniendo medidas...</Text>
        <ActivityIndicator size="large" color="#66CBFF" />
      </View>
    );
  }
}

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
  FormContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    marginTop: "10%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerModal: {
    paddingTop: "30%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitModal: {
    paddingTop: "500%",
    alignItems: 'center',
    borderRadius: 10,
    paddingRight: "17%",
    paddingLeft: "20%",
    justifyContent: 'center',
  },
  marco: {
    padding: 20,
    width: '70%',
    borderWidth: 0,
    borderRadius: 10,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 1,
    elevation: 2,
  },
  marcoModal: {
    marginTop: '10%',
    padding: 20,
    width: '70%',
    borderWidth: 0,
    borderRadius: 10,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 1,
    elevation: 1,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 15,
  },
});