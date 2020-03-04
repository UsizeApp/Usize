
import React from 'react';
import { Camera } from 'expo-camera'
import { Ionicons } from '@expo/vector-icons';
import { Col, Row, Grid } from "react-native-easy-grid";
import { View, TouchableWithoutFeedback, TouchableOpacity, Text } from 'react-native';
import styles from '../../styles/styles';

const { FlashMode: CameraFlashModes, Type: CameraTypes } = Camera.Constants;

export default ({
    capturing = false,
    cameraType = CameraTypes.back,
    flashMode = CameraFlashModes.off,
    setFlashMode, setCameraType,
    onCaptureIn, onCaptureOut, onLongCapture, onShortCapture,
    beta,
}) => {
    const bRenderBeta = true
    let botonCapturar = <Text style={{ textAlign: 'center', color: "white" }}>Debes sostener el dispositivo verticalmente {bRenderBeta && beta}</Text>
    
    const tolerancia = 0.075
    if (beta >= (1.50 - tolerancia) && beta <= (1.50 + tolerancia))
        botonCapturar = (
            <TouchableWithoutFeedback
                onPressIn={onCaptureIn}
                onPressOut={onCaptureOut}
                onLongPress={onLongCapture}
                onPress={onShortCapture}>
                <View style={[styles.captureBtn, capturing && styles.captureBtnActive]}>
                    {capturing && <View style={styles.captureBtnInternal} />}
                </View>
            </TouchableWithoutFeedback>
        )

    return (
        <Grid style={styles.bottomToolbar}>
            <Row>
                <Col style={styles.alignCenter}>
                    <TouchableOpacity onPress={() => setFlashMode(
                        flashMode === CameraFlashModes.on ? CameraFlashModes.off : CameraFlashModes.on
                    )}>
                        <Ionicons
                            name={flashMode == CameraFlashModes.on ? "md-flash" : 'md-flash-off'}
                            color="white"
                            size={30}
                        />
                    </TouchableOpacity>
                </Col>
                <Col size={2}>
                    <View style={styles.alignCenter}>
                        {botonCapturar}
                    </View>
                </Col>
                <Col style={styles.alignCenter}>
                    <TouchableOpacity onPress={() => setCameraType(
                        cameraType === CameraTypes.back ? CameraTypes.front : CameraTypes.back
                    )}>
                        <Ionicons
                            name="md-reverse-camera"
                            color="white"
                            size={30}
                        />
                    </TouchableOpacity>
                </Col>
            </Row>
        </Grid>
    )
};
