import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import Button from '../../components/Utils/Button';
import { Email } from '../../models/API';
import { Ionicons } from '@expo/vector-icons';

import { NavigationActions, StackActions } from 'react-navigation';

import { Contenedor, Marco } from 'components/MisComponentes'


const FilaModal = (props) => {
  const { tipo, nombre, handleChange } = props;
  let { bbw } = props;
  bbw = typeof bbw === 'undefined'
    ? 1
    : 0;

  return (
    <View style={{
      flexDirection: 'row',
      marginVertical: 8,
      paddingBottom: 5
    }} keyboardShouldPersistTaps='handled'>
      <Text
        style={{
          flex: 1,
          color: 'grey'
        }}>{nombre}</Text>
      <TextInput
        placeholder={`    0  `}
        keyboardType='numeric'
        maxLength={3}
        onChangeText={(medida) => handleChange(tipo, medida)}
        onBlur={Keyboard.dismiss}
        style={{
          textAlign: 'right',
          color: 'grey',
          borderBottomWidth: bbw,
          borderColor: '#ddd'
        }}>{}</TextInput>
    </View>
  )
}

function FilaMedida(props) {
  const { tipo, medida } = props;
  let { bbw } = props;
  bbw = typeof bbw === 'undefined'
    ? 2
    : 0;

  return (
    <View
      style={{
        flexDirection: 'row',
        marginVertical: 8,
        borderBottomWidth: bbw,
        paddingBottom: 5,
        borderColor: '#ddd'
      }}>
      <Text
        style={{
          flex: 1,
          color: 'grey'
        }}>{tipo}</Text>
      <Text
        style={{
          textAlign: 'right',
          color: 'grey'
        }}>{medida}</Text>
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
      borderBottomWidth: 0
    },
    headerTintColor: 'white'
  }

  constructor() {
    super();

    this.state = {
      medidasManuales: {
        left_arm: '0',
        right_arm: '0',
        left_leg: '0',
        right_leg: '0',
        waist: '0',
        hips: '0',
        bust: '0',
        chest: '0',
      },
      modalVisible: false,
      done: false,
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(tipo, medida) {
    let { medidasManuales } = this.state
    //console.log(tipo, medida)
    //console.log(medidasManuales)
    medidasManuales[tipo] = medida
    this.setState({ medidasManuales })
  }

  openModal() {
    this.setState({ modalVisible: true });
  }

  closeModal() {
    console.log("Home::closeModal")
    this.setState({ modalVisible: false });
  }

  async guardarMedidas() {
    const { medidasManuales } = this.state
    console.log(medidasManuales)

    const u = new Email();
    await u.guardarMedidasManuales(medidasManuales)

    this.closeModal()

    // Reiniciamos el Stack
    const { navigation } = this.props

    resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "Home" })],
    });

    navigation.dispatch(resetAction);

    ToastAndroid.show('Medidas actualizadas', ToastAndroid.SHORT);
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

    this.setState({ datosPersona, bTieneMedidas, medidas, bEsFemenino, done: true });
  }

  renderModal() {
    return (
      <Modal
        visible={this.state.modalVisible}
        animationType={'slide'}
        onPress={Keyboard.dismiss}
        onRequestClose={() => this.closeModal()}>
        <View style={styles.containerModal}>

          <View style={styles.exitModal}>
            <TouchableOpacity
              onPress={() => {
                this.closeModal()
              }}>
              <Ionicons name="md-close" size={30} color='grey' />
            </TouchableOpacity>
          </View>

          <Text
            style={{
              color: 'grey',
              fontSize: 15,
              alignItems: 'center'
            }}>
            Ingrese todas las medidas correspondientes en centímetros:</Text>

          <Marco>
            <ScrollView style={{ height: '75%', paddingHorizontal: 15 }}>
              <FilaModal handleChange={this.handleChange} tipo="left_arm" nombre="Brazo Izquierdo" />
              <FilaModal handleChange={this.handleChange} tipo="right_arm" nombre="Brazo Derecho" />

              <FilaModal handleChange={this.handleChange} tipo="left_leg" nombre="Pierna Izquierda" />
              <FilaModal handleChange={this.handleChange} tipo="right_leg" nombre="Pierna Derecha" />

              <FilaModal handleChange={this.handleChange} tipo="waist" nombre="Cintura" />
              <FilaModal handleChange={this.handleChange} tipo="hips" nombre="Cadera" />
              <FilaModal handleChange={this.handleChange} tipo="bust" nombre="Busto" />
              <FilaModal handleChange={this.handleChange} tipo="chest" nombre="Pecho" />
            </ScrollView>
          </Marco>

          <View style={styles.marcoBoton}>
            <Button onPress={() => { this.guardarMedidas() }}
              title="Guardar medidas"
              text="Guardar medidas"></Button>
          </View>

        </View>
      </Modal>
    )
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
            <Text
              style={{
                color: '#8E8E8E'
              }}>Ultima actualización:</Text>
            <Text
              style={{
                color: '#8E8E8E'
              }}>{datosPersona.fecha_ultimas_medidas}</Text>
          </View>
        )

        filaP = <FilaMedida tipo="Pecho" medida={medidas.chest} bbw="0" />
        filaB = null

        if (bEsFemenino) {
          filaP = <FilaMedida tipo="Pecho" medida={medidas.chest} />
          filaB = <FilaMedida tipo="Busto" medida={medidas.bust} bbw="0" />
        }

        return (
          <Contenedor>
            <Marco>
              <FilaMedida tipo="Brazo Izquierdo" medida={medidas.left_arm} />
              <FilaMedida tipo="Brazo Derecho" medida={medidas.right_arm} />

              <FilaMedida tipo="Pierna Izquierda" medida={medidas.left_leg} />
              <FilaMedida tipo="Pierna Derecha" medida={medidas.right_leg} />

              <FilaMedida tipo="Cintura" medida={medidas.waist} />
              <FilaMedida tipo="Cadera" medida={medidas.hips} />
              {filaP}
              {filaB}
            </Marco>
            <Button text="Actualizar medidas" onPress={() => navigation.navigate('Altura')} />
            <Button text="Ingresar manualmente" onPress={() => this.openModal()} />
            {this.renderModal()}
          </Contenedor>
        );
      } else {
        return (
          <Contenedor>
            {encabezado}
            <Text
              style={{
                color: '#8E8E8E'
              }}>¡Aún no has calculado tus medidas!</Text>
            <Button text="Obtén tus medidas" onPress={() => navigation.navigate('Altura')} />
            <Text
              style={{
                color: '#8E8E8E'
              }}>Si lo prefieres, puedes ingresar tus medidas manualmente</Text>
            <Button text="Ingresar manualmente" onPress={() => this.openModal()} />

            {this.renderModal()}

          </Contenedor>
        )
      }
    }

    // Else
    return (
      <View style={styles.FormContainer}>
        <Text style={{
          color: '#8E8E8E'
        }}>Obteniendo medidas...</Text>
        <ActivityIndicator size="large" color="#66CBFF" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Container: (isValid) => ({
    backgroundColor: isValid
      ? '#66CBFF'
      : "#8E8E8E",
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
    justifyContent: 'center'
  },
  container: {
    marginTop: "15%",
    alignItems: 'center',
    justifyContent: 'center'
  },
  containerModal: {
    paddingTop: "15%",
    paddingHorizontal: "10%",
    justifyContent: 'center',
  },
  exitModal: {
    paddingBottom: 15
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
      height: 2
    },
    shadowOpacity: 0.23,
    shadowRadius: 1,
    elevation: 2
  },
  marcoModal: {
    padding: 15,
    width: '70%',
    borderWidth: 0,
    borderRadius: 10,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.23,
    shadowRadius: 1,
    elevation: 1,
  },
  marcoBoton: {
    alignItems: 'center'
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 15
  }
});