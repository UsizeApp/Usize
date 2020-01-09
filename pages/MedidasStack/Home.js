import React, {Component} from 'react';
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
    ScrollView
} from 'react-native';
import Button from '../../components/Utils/Button';
import {Email} from '../../models/API';
import {Ionicons} from '@expo/vector-icons';


function FilaModal(props) {
    const {tipo, medidas, nombre, handleChange} = props;
    let {bbw} = props;
    bbw = typeof bbw === 'undefined'
        ? 1
        : 0;

    const editMedida = (medida) => {
      //DESDE ACA IR MODIFICANDO LA VARIABLE CADA VEZ QUE SE LLAMA
        handleChange(tipo, medida)

        console.log(nombre);
        console.log(tipo);
        console.log(medidas)
        console.log(medida);
    }

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
                onChangeText={(medida) => editMedida(medida)}
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
    const {tipo, medida} = props;
    let {bbw} = props;
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

    constructor(props) {
        super(props);
        this.state = {
            medidas: null,
            sexo: null,
            done: false,
            modalVisible: false
        };
      }
      handleChange(tipo, medida) {
        // AQUIII NECESITO QUE LA FUNCION MODIFIQUE LAS MEDIDAS Y QUE QUEDEN ASI
        // medidas: {
        //   left-arm: 20,
        //   right-arm:20,
        //   etc
        // }
        console.log(this.state.medidas)
        let medidasNew = { ...medidas};
        medidasNew[`${tipo}`] = medida;
  
        this.setState({medidas: medidasNew});
      }

    openModal() {
        this.setState({modalVisible: true});
    }

    closeModal(props) {
        const {navigation} = this.props;

        navigation.push('Medidas')
        this.setState({modalVisible: false});
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

        this.setState({datosPersona, bTieneMedidas, medidas, bEsFemenino, done: true});
    }

    render() {
        const {done} = this.state;
        const {navigation} = this.props;

        if (done) {
            const {datosPersona, bTieneMedidas, medidas, bEsFemenino} = this.state;

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

                filaP = <FilaMedida tipo="Pecho" medida={medidas.chest} bbw="0"/>
                filaB = null

                if (bEsFemenino) {
                    filaP = <FilaMedida tipo="Pecho" medida={medidas.chest}/>
                    filaB = <FilaMedida tipo="Busto" medida={medidas.bust} bbw="0"/>
                }

                return (
                    <View style={styles.container}>
                        {encabezado}
                        <View style={styles.marco}>
                            <FilaMedida tipo="Brazo Izquierdo" medida={medidas.left_arm}/>
                            <FilaMedida tipo="Brazo Derecho" medida={medidas.right_arm}/>

                            <FilaMedida tipo="Pierna Izquierda" medida={medidas.left_leg}/>
                            <FilaMedida tipo="Pierna Derecha" medida={medidas.right_leg}/>

                            <FilaMedida tipo="Cintura" medida={medidas.waist}/>
                            <FilaMedida tipo="Cadera" medida={medidas.hips}/> {filaP}
                            {filaB}
                        </View>
                        <View>
                            <Button
                                text="Actualizar medidas"
                                onPress={() => navigation.navigate('Altura')}/>
                        </View>
                    </View>
                );
            } else {
                return (
                    <View style={styles.container}>
                        {encabezado}
                        <Text
                            style={{
                            color: '#8E8E8E'
                        }}>¡Aún no has calculado tus medidas!</Text>
                        <Button text="Obtén tus medidas" onPress={() => navigation.navigate('Altura')}/>
                        <Text
                            style={{
                            color: '#8E8E8E'
                        }}>Si lo prefieres, puedes ingresar tus medidas manualmente</Text>
                        <Button text="Ingresar manualmente" onPress={() => this.openModal()}/>
                        <View style={styles.container}>
                            <Modal
                                visible={this.state.modalVisible}
                                animationType={'slide'}
                                onPress = {Keyboard.dismiss}
                                onRequestClose={() => this.closeModal()}>
                                <View style={styles.containerModal}>
                                    <View style={styles.exitModal}>
                                      <TouchableOpacity
                                        onPress={() => {
                                        this.closeModal()
                                    }}>
                                        <Ionicons name="md-close" size={30} color='grey'/>
                                    </TouchableOpacity>
                                      </View>
                                    <Text
                                        style={{
                                        color: 'grey',
                                        fontSize: 20,
                                        justifyContent: 'center'
                                    }}>
                                        Ingrese todas las medidas correspondientes en (cm)</Text>
                                    <ScrollView style={styles.marcoModal}>
                                        <FilaModal handleChange={this.handleChange} tipo="left_arm" nombre="Brazo Izquierdo" medidas={this.state.medidas}/>
                                        <FilaModal handleChange={this.handleChange} tipo="right_arm" nombre="Brazo Derecho" medidas={this.state.medidas}/>

                                        <FilaModal handleChange={this.handleChange} tipo="left_leg" nombre="Pierna Izquierda" medidas={this.state.medidas}/>
                                        <FilaModal handleChange={this.handleChange} tipo="right_leg" nombre="Pierna Derecha" medidas={this.state.medidas}/>

                                        <FilaModal handleChange={this.handleChange} tipo="waist" nombre="Cintura" medidas={this.state.medidas}/>
                                        <FilaModal handleChange={this.handleChange} tipo="hips"nombre="Cadera"  medidas={this.state.medidas}/>
                                        <FilaModal handleChange={this.handleChange} tipo="bust" nombre="Busto" medidas={this.state.medidas}/>
                                        <FilaModal handleChange={this.handleChange} tipo="chest" nombre="Pecho" medidas={this.state.medidas}/>
                                    </ScrollView>
                                    <View style={styles.marcoBoton}>
                                        <Button
                                            onPress={() => {
                                            this.closeModal()
                                        }}
                                            title="Guardar medidas"
                                            text="Guardar medidas"></Button>
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
                <Text style={{
                    color: '#8E8E8E'
                }}>Obteniendo medidas...</Text>
                <ActivityIndicator size="large" color="#66CBFF"/>
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
        marginTop: "10%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    containerModal: {
        paddingTop: "10%",
        paddingLeft: "20%",
        justifyContent: 'center'
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
      marginTop: '10%',
      width: '70%',
      height: '20%'
  },
    titulo: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 15
    }
});