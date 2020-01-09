import React, { Component, Fragment } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ToastAndroid,
    Keyboard
} from 'react-native';

import { Formik } from 'formik';

import ChonseSelect from 'components/ChonseSelect'

import { Email } from 'models/API'

const genderData = [
    {
        value: 'M',
        label: 'Masculino',
    },
    {
        value: 'F',
        label: 'Femenino',
    },
];


export default class P1NuevaPersona extends Component {
    static navigationOptions = {
        title: 'Nueva persona',
        headerStyle: {
            backgroundColor: '#66CBFF',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
        },
        headerTintColor: 'white',
    };

    datosIniciales = {
        alias: 'Alias',
    };

    constructor() {
        super();

        this.state = {
            alias: 'Alias',
            gender: genderData[0].value,
        };
    }

    async guardarNuevaPersona() {
        console.log('NuevaPersona::guardarNuevaPersona')

        const { alias, gender } = this.state
        console.log(alias, gender)

        u = new Email();
        const id = await u.guardarNuevaPersona(alias, gender)

        if (id != null) {
            const { navigation } = this.props;
            navigation.navigate('TabScreen');
        } else {
            ToastAndroid.show('Error', ToastAndroid.SHORT);
        }

    };

    render() {
        const { gender } = this.state;

        return (
            <View>
                <Formik
                    isInitialValid={true}
                    initialValues={null}
                    onSubmit={values => this.guardarNuevaPersona(values)}
                    validationSchema={null}>
                    {({
                        values,
                        handleChange,
                        errors,
                        setValues,
                        setFieldTouched,
                        touched,
                        isValid,
                        handleSubmit,
                    }) => (
                            <View style={{ margin: 10, paddingBottom: 100 }}>
                                <Fragment>
                                    <Text>Alias:</Text>
                                    <TextInput style={styles.TextInput}
                                        placeholder="Ingresa un alias"
                                        maxLength={80}
                                        onBlur={Keyboard.dismiss}
                                        onChangeText={alias => this.setState({ alias: alias })}
                                        value={values.alias} />
                                </Fragment>

                                <Fragment>
                                    <Text>Género:</Text>
                                    <View
                                        style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                        <ChonseSelect
                                            height={35}
                                            style={{ margin: 20 }}
                                            data={genderData}
                                            initValue={gender}
                                            onPress={gender => this.setState({ gender: gender.value })}
                                        />
                                    </View>
                                </Fragment>

                                <View style={{ alignItems: 'center' }}>
                                    <TouchableOpacity
                                        style={styles.Container(isValid)}
                                        disabled={!isValid}
                                        onPress={handleSubmit}>
                                        <Text style={styles.ButtonText}>Guardar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                </Formik>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    Container: isValid => ({
        backgroundColor: isValid ? '#66CBFF' : '#8E8E8E',
        padding: 15,
        borderRadius: 5,
        marginVertical: 20,
        justifyContent: 'center',
        flexDirection: 'row',
    }),
    ButtonText: {
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        marginHorizontal: 50,
    },
    TextInput: {
        marginVertical: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 4,
    },
});
