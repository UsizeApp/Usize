import React, { Component } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,Modal,Alert, TextInput, TouchableOpacity
} from 'react-native';
import Button from '../../components/Utils/Button';
import { Email } from '../../models/API';
import { Ionicons } from '@expo/vector-icons';

function FilaModal(props) {
  const {tipo, medida} = props;
  let { bbw } = props;
  bbw = typeof bbw === 'undefined' ? 2 : 0;

  const editText = (text) =>{
    console.log(text);
    
    this.setState.medida = text
   }

  return (
    <View style={{
      flexDirection: 'row', marginVertical: 8, paddingBottom: 5,
    }}
    >
      <Text style={{ flex: 1, color: 'grey' }}>{tipo}</Text>
      <TextInput placeholder={`       `} keyboardType='numeric' maxLength={3} onEndEditing={(text) => editText(text)} style={{ textAlign: 'right', color: 'grey', borderBottomWidth: bbw,borderColor: '#ddd' }}>{}</TextInput>
    </View>
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
  }
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
      done: true,
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
        filaP_Modal = <FilaModal tipo="Pecho" medida={medidas.chest} bbw="0" />
        filaB_Modal = null

        if (bEsFemenino) {
          filaP = <FilaMedida tipo="Pecho" medida={medidas.chest} />
          filaB = <FilaMedida tipo="Busto" medida={medidas.bust} bbw="0" />
          filaP_Modal = <FilaModal tipo="Pecho" medida={medidas.chest} />
          filaB_Modal = <FilaModal tipo="Busto" medida={medidas.bust} bbw="0" />
        }
        return (
          <View style={styles.container}>
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
                                            onPress={() => {
                                            this.closeModal()
                                        }}>
                                          <Ionicons name="md-close" size={20} color='grey' />
                                        
                                        </TouchableOpacity>
            <View style={styles.containerModal}>
                <Text style={{color:'grey', fontSize: 20, justifyContent: 'center'}}>Ingresar todas las medidas correspondientes</Text>
              <View style={styles.marcoModal}>
                <FilaModal tipo="Brazo Izquierdo" medida={medidas.left_arm} />
              <FilaModal tipo="Brazo Derecho" medida={medidas.right_arm} />

              <FilaModal tipo="Pierna Izquierda" medida={medidas.left_leg} />
              <FilaModal tipo="Pierna Derecha" medida={medidas.right_leg} />

              <FilaModal tipo="Cintura" medida={medidas.waist} />
              <FilaModal tipo="Cadera" medida={medidas.hips} />
              {filaP_Modal}
              {filaB_Modal}
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