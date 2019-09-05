/*
Logica del negocio
Llamadas a la API en Flask
*/
function callAPI(body, redirect, method, log) {
	var serverURL = "http://10.0.0.22:5000" + redirect

	var xhr = new XMLHttpRequest();
	xhr.open(method, serverURL);

	xhr.onload = function (e) {
		if (log)
			console.log(xhr.responseText);
	}.bind(this);

	xhr.onerror = function (e) {
		console.error(xhr);
	};

	if (!body)
		xhr.send();
	else
		xhr.send(body);

	return xhr;
}

export function login(email, pwd) {
	var body = new FormData();
	body.append('email', email);
	body.append('pwd', pwd);
	body.append('source', 'app');

	callAPI(body, '/login', method = 'POST', log = true);
}

export function profile() {
	callAPI(null, '/profile', method = 'GET', log = true);
}

// Funcion asincrona que llama a la API
export async function fetchData(p) {
	const URL2 = 'http://10.0.0.22:5000/profile'
	const response2 = await fetch(URL2, { credentials: 'same-origin' });
	const json2 = await response2.json();
	const email = json2.email;

	console.log(email);

	// Cuando se obtengan las respuestas, seteamos las variables de la clase
	// El render cambia automaticamente usando this.state.done
	p.setState({ email: email, done: true });
}
