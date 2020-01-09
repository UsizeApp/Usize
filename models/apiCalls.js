
/****************
Llamadas a la API
*****************/

function getAPI() {
	const type = 'ale_LAN';

	switch (type) {
		case 'ale_LAN':
			return 'http://10.0.0.23:5000';
		case 'ale_INTERNET':
			return 'http://190.161.250.69:5000';
		case 'anibal':
			return 'http://192.168.0.14:5000';
		case 'diego':
			return 'http://192.168.0.6:5000';
		default:
			return 'http://localhost:5000';
	}
}

// Funcion base para llamar a la API usando GET o POST
async function callAPI(args) {
	const pagina = args.pagina || '/';
	console.log('API::callAPI:', pagina)

	const metodo = args.metodo || 'GET';
	const headers = args.headers || null;
	const body = args.body || null;

	const logging = args.logging || 0;

	if (logging) {
		console.log('headers', headers);
		console.log('body', body);
	}

	const url = getAPI() + pagina;

	const data = await fetch(url, {
		method: metodo,
		headers: headers,
		body: body,
	})
		.then((response) => {
			if (response.status !== 200) {
				// console.error();
				return {
					status: 'error',
					token: null,
				};
			} else {
				if (logging) {
					console.log("callAPI::response")
					console.log('status:', response.status);
				}
				return response.json();
			}
		})
		.then((data) => {

			if (logging) {
				console.log("callAPI::responseJSON")
				console.log('data:', data);
			}
			return data;
		})
		.catch((error) => console.error(error));

	return data;
}

export async function apiLogin(email, pwd) {
	let body = new FormData();
	body.append('email', email);
	body.append('pwd', pwd);

	const resp = await callAPI({
		pagina: '/login',
		metodo: 'POST',
		body: body,
	});

	return resp.token
}

export async function apiDatosEmail(token) {
	let headers = {
		'token': token,
	};

	const resp = await callAPI({
		pagina: '/datosEmail',
		metodo: 'POST',
		headers: headers,
	});

	return resp.datosEmail
}

export async function apiDatosPersona(id_persona) {
	let headers = {
		'id': id_persona,
	};

	const resp = await callAPI({
		pagina: '/datosPersona',
		metodo: 'POST',
		headers: headers,
	});

	return resp.datosPersona;
}

export async function apiUpload(id_persona, height, frontalURI, lateralURI) {
	let headers = {
		'id': id_persona,
	};

	let body = new FormData();
	body.append('frontalphoto', {
		uri: frontalURI,
		type: 'image/jpg',
		name: 'frontal_photo.jpg',
	});
	body.append('lateralphoto', {
		uri: lateralURI,
		type: 'image/jpg',
		name: 'lateral_photo.jpg',
	});
	body.append('height', height);

	resp = await callAPI({
		pagina: '/upload',
		metodo: 'POST',
		headers: headers,
		body: body,
	});

	return resp
}

export async function apiRegister(email, pwd, nombre, rut, gender) {
	let body = new FormData();

	body.append('email', email);
	body.append('pwd', pwd);
	body.append('nombre', nombre);
	body.append('rut', rut);
	body.append('gender', gender);

	const resp = await callAPI({
		pagina: '/register',
		metodo: 'POST',
		body: body,
	});

	return resp
}

export async function apiValidarToken(token) {
	let headers = {
		'token': token,
	};

	const resp = await callAPI({
		pagina: '/validarToken',
		metodo: 'POST',
		headers: headers,
		body: null,
	});

	return resp.respuesta
}

export async function apiNuevaPersona(token, alias, gender) {
	let headers = {
		'token': token,
	};

	let body = new FormData();
	body.append('alias', alias);
	body.append('gender', gender);

	const resp = await callAPI({
		pagina: '/nuevaPersona',
		metodo: 'POST',
		headers: headers,
		body: body,
	});

	return resp.id
}

export async function apiMedidasManuales(id_persona, medidas) {
	let headers = {
		'id': id_persona,
	};

	let body = new FormData();
	body.append('left_arm', medidas.left_arm)
	body.append('right_arm', medidas.right_arm)

	body.append('left_leg', medidas.left_leg)
	body.append('right_leg', medidas.right_leg)

	body.append('waist', medidas.waist)
	body.append('hips', medidas.hips)
	body.append('chest', medidas.chest)
	body.append('bust', medidas.bust)

	const resp = await callAPI({
		pagina: '/medidasManuales',
		metodo: 'POST',
		headers: headers,
		body: body,
	});

	return resp.nuevosDatosPersona
}

