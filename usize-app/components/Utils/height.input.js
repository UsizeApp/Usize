import React, { Component } from 'react';  
import { Platform, StyleSheet, View, Button, TextInput, } from 'react-native';  
import styles from './styles';

export default class HeightInput extends Component {  

    render() {  
        return (  
            <View>  
                <TextInput  
                    placeholder="Ingresa la estatura de la persona"  
                    underlineColorAndroid='transparent'  
                    style={styles.TextInputStyle}  
                    **keyboardType={'numeric'}**  
                />  
            </View>  
        );  
    }  
}