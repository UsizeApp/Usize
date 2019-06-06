import React from 'react';
import { View, Text, Linking } from 'react-native';
import { Camera, Permissions } from 'expo';
//import RNFS from 'react-native-fs';

import styles from './styles';
import Toolbar from './toolbar.component';
import Gallery from './gallery.component';

export default class CameraPage extends React.Component {
	camera = null;

	state = {
		captures: [],
		capturing: null,
		hasCameraPermission: null,
		cameraType: Camera.Constants.Type.back,
		flashMode: Camera.Constants.FlashMode.off,
	};

	setFlashMode = (flashMode) => this.setState({ flashMode });
	setCameraType = (cameraType) => this.setState({ cameraType });
	handleCaptureIn = () => this.setState({ capturing: true });

	handleCaptureOut = () => {
		if (this.state.capturing)
			this.camera.stopRecording();
	};

	handleShortCapture = async () => {
		console.log("Hola1a");
		const photoData = await this.camera.takePictureAsync();
		this.setState({ capturing: false })
		console.log(photoData.uri);

		var uri = photoData.uri;
		var serverURL = "http://192.168.0.5:3333/login"

		
		var photo = {
			uri: uri,
			type: 'image/jpeg',
			name: 'photo.jpg',
		};
		
		var body = new FormData();
		body.append('authToken', 'secret');
		body.append('photo', photo);
		body.append('title', 'A beautiful photo!');
		
		var xhr = new XMLHttpRequest();
		xhr.open('POST', serverURL);
		xhr.send(body);

		var data = {
			"username": "b",
		}

		/*
		fetch(serverURL, {
			method: "POST",
			headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		})
			.then(function (response) {
				console.log(response)
				return response.json();
			})
			.then(function (data) {
				console.log(data)
			});

		*/
		console.log("Hola1b");
	};

	handleLongCapture = async () => {
		console.log("Hola2a");
		const videoData = await this.camera.recordAsync();
		this.setState({ capturing: false, captures: [videoData, ...this.state.captures] });
		console.log("Hola2b");
		console.log("Hola2b");
	};

	async componentDidMount() {
		const camera = await Permissions.askAsync(Permissions.CAMERA);
		const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
		const hasCameraPermission = (camera.status === 'granted' && audio.status === 'granted');

		console.log("Hola3");
		console.log(hasCameraPermission);

		this.setState({ hasCameraPermission });
	};

	render() {
		const { hasCameraPermission, flashMode, cameraType, capturing, captures } = this.state;

		if (hasCameraPermission === null) {
			return <View />;
		} else if (hasCameraPermission === false) {
			return <Text>Access to camera has been denied.</Text>;
		}

		return (
			<React.Fragment>
				<View>
					<Camera
						type={cameraType}
						flashMode={flashMode}
						ratio={'16:9'}
						style={styles.preview}
						ref={camera => this.camera = camera}
					/>
				</View>

				{captures.length > 0 && <Gallery captures={captures} />}

				<Toolbar
					capturing={capturing}
					flashMode={flashMode}
					cameraType={cameraType}
					setFlashMode={this.setFlashMode}
					setCameraType={this.setCameraType}
					onCaptureIn={this.handleCaptureIn}
					onCaptureOut={this.handleCaptureOut}
					onLongCapture={this.handleLongCapture}
					onShortCapture={this.handleShortCapture}
				/>
			</React.Fragment>
		);
	};
};