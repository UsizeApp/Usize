/*
Logica del negocio
Llamadas a la API en Flask
*/

import { storageGet, storageSet, storageReset } from './storage';

import { apiLogin, apiDatosEmail, apiDatosPersona, apiUpload, apiRegister, apiValidarToken, apiNuevaPersona, apiMedidasManuales } from './apiCalls';

export class Email {
  /************************************
  Si se quiere utilizar datos falsos, ignorando la API
  ************************************/
  fakeEnabled = 1;

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

    // Guardamos el token en storage
    await this.storageSetToken(token);

    // Descargar los datos del Email y de la primera Persona
    await u.bajarDatosEmail()
    await u.bajarDatosPersona()

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

    mostrar_bienvenida: false,
    personas: ['1', '2', '3'],
    personas2: {
      '1': 'Alias1',
      '2': 'Alias2',
      '3': 'Alias3',
    }
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

  async storageGetDatosEmail() {
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
    alias: 'Fake Alias',
    gender: 'F',
    fecha_ultimas_medidas: 'Fake Fecha',
    medidas: {
      left_arm: 58.46,
      right_arm: 58.29,

      left_leg: 73.33,
      right_leg: 73.24,

      waist: 84.91,
      hips: 93.77,
      chest: 92.49,
      bust: 91.98,
    },
    tallas: {
      "adidas": ['A', 'D'],
      "hm": ['H', 'M'],
      "nike": ['N', 'K']
    }
  }
  PK_DATOS_PERSONA = 'datosPersona'

  bajarDatosPersona = async () => {
    console.log("API::bajarDatosPersona")

    let datosPersona = null;

    let id_persona = await this.storageGetIDPersona()

    if (this.fakeEnabled) {
      id_persona = this.fakeIDPersona
      datosPersona = this.fakeDatosPersona
    }
    else {
      if (id_persona == null) {
        // Si la id_persona guardada es inválida
        // Entonces se usa y setea la primera persona del Email
        const datosEmail = await this.storageGetDatosEmail()
        const { personas } = datosEmail
        console.log(personas)
        id_persona = personas[0];
      }
      // Descargamos los datos segun la id_persona definida
      datosPersona = await apiDatosPersona(id_persona)
    }

    await this.storageSetIDPersona(id_persona)
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

    const datosPersona = await this.storageGetDatosPersona()

    if (datosPersona != null) {
      medidas = datosPersona.medidas
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
  Tallas
  */

  tallasEnBruto = async () => {
    console.log("API::tallasEnBruto")

    let tallas = null;

    const datosPersona = await this.storageGetDatosPersona()

    if (datosPersona != null) {
      tallas = datosPersona.tallas
    }

    return tallas
  }

  tallasPorMarca = async () => {
    console.log("API::tallasPorMarca")

    let marcas = null;
    let tallas = null;

    const tallasBruto = await this.tallasEnBruto()

    if (tallasBruto != null) {
      marcas = [];
      tallas = [];
      Object.entries(tallasBruto).forEach(([key, value]) => {
        if (!!value[0] && !!value[1]) {
          marcas.push(key)
          tallas.push(value)
        }
      })
    }

    return [marcas, tallas];
  }

  filtroMarcas = async () => {
    console.log("API::filtroMarcas")

    let marcas = null;

    const tallasBruto = await this.tallasEnBruto()
    if (tallasBruto != null) {
      marcas = [];
      Object.entries(tallasBruto).forEach(([key, value]) => {
        marcas.push([key, !!value[0] && !!value[1]])
      })
    }

    return marcas;
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

  async reiniciarStorage() {
    await this.storageResetToken()
    await this.storageResetIDPersona()
  }

  async setFakeUsuario() {
    await this.setMedidas(this.fakeMedidas);
    await this.setPerfil(this.fakePerfil);
  }

  async subirFotos(height, frontal, lateral) {
    console.log('API::subirFotos')

    let resp = null

    if (this.fakeEnabled) {
      resp = {
        mensaje: "fakeSuccess",
        datosPersona: this.fakeDatosPersona,
      }
      await u.storageSetDatosPersona(datosPersona)
    } else {
      const frontalURI = frontal.uri;
      const lateralURI = lateral.uri;
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

  async validarToken(token) {
    if (this.fakeEnabled)
      return true

    const respuesta = await apiValidarToken(token);

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

  registrarEmail = async (email, pwd, nombre, rut, gender) => {
    resp = await apiRegister(email, pwd, nombre, rut, gender)

    return resp
  }

  async guardarNuevaPersona(alias, gender) {
    if (0)
      return '1'

    const token = await this.storageGetToken()

    id_persona = await apiNuevaPersona(token, alias, gender)

    if (id_persona != null) {
      await this.storageSetIDPersona(id_persona)
      await this.bajarDatosEmail()
      await this.bajarDatosPersona()
    }

    return id_persona
  }

  async guardarMedidasManuales(medidas) {
    console.log("API::guardarMedidasManuales")

    let id_persona = await this.storageGetIDPersona()

    const nuevosDatosPersona = await apiMedidasManuales(id_persona, medidas)

    await this.storageSetDatosPersona(nuevosDatosPersona)

    return nuevosDatosPersona
  }
}
