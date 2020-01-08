/*
Logica del negocio
Llamadas a la API en Flask
*/

import { AsyncStorage } from 'react-native';

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
      return 'http://192.168.0.11:5000';
    default:
      return 'http://localhost:5000';
  }
}

/****************
Llamadas a la API
*****************/

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

async function apiLogin(email, pwd) {
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

async function apiDatosEmail(token) {
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

async function apiDatosPersona(id_persona) {
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

async function apiUpload(id_persona, height, frontalURI, lateralURI) {
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


/*********
Funciones del storage
**********/

// Get
async function storageGet(PK) {
  const valor = await AsyncStorage.getItem(PK);
  if (0)
    console.log('storageGet:', PK, valor)
  return valor;
}

// Set
async function storageSet(PK, valor) {
  if (0)
    console.log('storageSet:', PK, valor)
  await AsyncStorage.setItem(PK, valor);
}

// Reset
async function storageReset(PK) {
  await AsyncStorage.multiRemove([PK]);
}

export class Email {
  // Si se quiere utilizar datos falsos, ignorando la API
  fakeEnabled = 0;

  /*
  Token / id_email
  */

  fakeToken = '999999';
  PK_TOKEN = 'token'

  // Hace login para obtener un token
  iniciarSesion = async (email, pwd) => {
    console.log("API::iniciarSesion")

    // Como estamos iniciando sesion, borramos el storage de los accesos
    await this.storageResetToken();
    await this.storageResetIDPersona();

    let token;
    if (this.fakeEnabled) {
      token = this.fakeToken;
    } else {
      token = await apiLogin(email, pwd)
    }

    await this.storageSetToken(token);
    return token;
  }

  // Obtiene el token guardado en la app
  storageGetToken = async () => {
    return await storageGet(this.PK_TOKEN);
  }

  // Guarda un token en la app
  storageSetToken = async (token) => {
    await storageSet(this.PK_TOKEN, token);
  }

  // Borra el token guardado en la app
  storageResetToken = async () => {
    await storageReset(this.PK_TOKEN);
  }

  PK_DATOS_EMAIL = 'datosEmail'
  fakeDatosEmail = {
    email: 'example@email.com',
    nombre: 'Juan Perez',
    rut: 333333333,
    sexo: 'masculino'
  };

  /*
  Datos Email
  */

  // Bajar los datos del Email
  // Se guardan en storage y se retornan
  bajarDatosEmail = async () => {
    console.log("API::bajarDatosEmail")

    let datosEmail = null;
    let token;

    if (this.fakeEnabled) {
      token = this.fakeToken;
      datosEmail = this.fakeDatosEmail
    } else {
      token = await this.storageGetToken();

      if (token != null) {
        datosEmail = await apiDatosEmail(token);
      }
    }

    await this.storageSetDatosEmail(datosEmail);
    return datosEmail;
  }

  storageGetDatosEmail = async () => {
    const datos = await storageGet(this.PK_DATOS_EMAIL)
    return JSON.parse(datos);
  }

  storageSetDatosEmail = async (datos) => {
    await storageSet(this.PK_DATOS_EMAIL, JSON.stringify(datos));
  }

  /*
  id_persona
  */

  fakeIDPersona = '999999';
  PK_PERSONA = 'id_persona'

  storageGetIDPersona = async () => {
    return await storageGet(this.PK_PERSONA)
  }

  storageSetIDPersona = async (id_persona) => {
    await storageSet(this.PK_PERSONA, id_persona);
  }

  storageResetIDPersona = async () => {
    await storageReset(this.PK_PERSONA);
  }

  /*
  Datos Persona
  */

  fakeDatosPersona = {
    right_arm: '67.4',
    left_arm: '64.6',
    right_leg: '89,5',
    left_leg: '84,9',
    waist: '0,0',
    hip: '42,8',
    chest: '0,0',
    bust: '0,0',


  };
  PK_DATOS_PERSONA = 'datosPersona'

  bajarDatosPersona = async () => {
    console.log("API::bajarDatosPersona")

    let datosPersona = null;

    let id_persona = await this.storageGetIDPersona()
    // Si la id_persona guardada es invalida
    // se utiliza y setea la primera persona del Email
    if (id_persona == null) {
      const datosEmail = await this.storageGetDatosEmail()
      const personas = datosEmail.personas
      id_persona = personas[0]
      await this.storageSetIDPersona(id_persona)      
    }

    datosPersona = await apiDatosPersona(id_persona)

    await this.storageSetDatosPersona(datosPersona)
    return datosPersona
  }

  storageGetDatosPersona = async () => {
    const datos = await storageGet(this.PK_DATOS_PERSONA)
    return JSON.parse(datos);
  }

  storageSetDatosPersona = async (datos) => {
    await storageSet(this.PK_DATOS_PERSONA, JSON.stringify(datos));
  }

  /*
  Medidas
  */

  medidasEnBruto = async () => {
    console.log("API::medidasEnBruto")

    let medidas = null;
    let medidasEnBruto = null

    const datosPersona = await this.storageGetDatosPersona()

    if (datosPersona != null) {
      medidas = datosPersona.medidas
      //medidas = JSON.parse(medidas);

      medidasEnBruto = {
        right_arm: medidas.right_arm,
        left_arm: medidas.left_arm,
        right_leg: medidas.right_leg,
        left_leg: medidas.left_leg,
        waist: medidas.waist,
        hips: medidas.hips,
        chest: medidas.chest,
        bust: medidas.bust,
      }
    }

    return medidas
  }

  medidasParaTabla = async () => {
    console.log("API::medidasParaTabla")

    let medidasParaTabla = null;

    const medidas = await this.medidasEnBruto()
    if (medidas != null) {
      medidasParaTabla = {
        right_arm: `${parseInt(medidas.right_arm)} cm`,
        left_arm: `${parseInt(medidas.left_arm)} cm`,
        right_leg: `${parseInt(medidas.right_leg)} cm`,
        left_leg: `${parseInt(medidas.left_leg)} cm`,
        waist: `${parseInt(medidas.waist)} cm`,
        hips: `${parseInt(medidas.hips)} cm`,
        chest: `${parseInt(medidas.chest)} cm`,
        bust: `${parseInt(medidas.bust)} cm`,
      }
    }

    return medidasParaTabla
  }

  /*
  Otros
  */




  async getTallasAPI() {
    let headers = {
      'token': await this.getToken(),
    };
    const resp = await callAPI({
      pagina: '/tallas',
      metodo: 'POST',
      headers,
    });
    const { tallas } = resp;
    console.log("tallas api");
    console.log(tallas);
    await this.setTallas(tallas);
    return await this.getTallas();
  }

  async setTallas(tallas) {
    await AsyncStorage.setItem('tallas', JSON.stringify(tallas));
  }

  async getTallas() {
    let tallas = await AsyncStorage.getItem('tallas');
    tallas = JSON.parse(tallas);
    console.log("get tallas");
    console.log(tallas);
    return tallas
  }


  async resetUsuario() {
    await AsyncStorage.multiRemove(['medidas', 'perfil']);
  }

  async resetAll() {
    await AsyncStorage.multiRemove(['token', 'medidas', 'perfil']);
  }

  async setFakeUsuario() {
    await this.setMedidas(this.fakeMedidas);
    await this.setPerfil(this.fakePerfil);
  }

  async doFakeLogin() {
    await this.setFakeToken();
    await this.setFakeUsuario();
  }

  fakeSleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  async getMetodoAuth() {
    const metodo = await AsyncStorage.getItem('metodo');
    return metodo;
  }

  async subirFotos(height, frontal, lateral) {
    console.log('API::subirFotos')

    let resp = null

    const frontalURI = frontal.uri;
    const lateralURI = lateral.uri;

    if (this.fakeEnabled) {
      resp = {
        mensaje: "success",
        datosPersona: this.fakeDatosPersona,
      }
    } else {
      const id_persona = await this.storageGetIDPersona()
      resp = await apiUpload(id_persona, height, frontalURI, lateralURI)
    }

    return resp;
  }

  async fetchDatosUsuario() {
    if (this.fakeEnabled) {
      console.log("fetchDatosUsuario::fakeEnabled!")
      await this.setFakeUsuario()
    } else {
      await this.getMedidasAPI();
      await this.getPerfilAPI();
    }
  }

  validarToken = async (token) => {
    let headers = {
      'token': token,
    };

    resp = await callAPI({
      pagina: '/validarToken',
      metodo: 'POST',
      headers: headers,
      body: null,
    });

    const respuesta = resp.respuesta;

    return (respuesta == 'valido')
  }

  bEsFemenino = async () => {
    const datosPersona = await this.storageGetDatosPersona()
    const bForzar = false

    return (datosPersona.gender == 'F' || bForzar)
  }

  bTieneMedidas = async () => {
    const datosPersona = await this.storageGetDatosPersona()
    const bForzar = false

    return (datosPersona.fecha_ultimas_medidas != null || bForzar)
  }

  registrarEmailAPI = async (email, pwd, nombre, rut, gender) => {
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

    console.log(resp)
    return resp
  }
}
