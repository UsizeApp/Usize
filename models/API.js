/*
Logica del negocio
Llamadas a la API en Flask
*/

import { AsyncStorage } from 'react-native';

export function getAPI() {
  const type = 'anibal';

  //return 'http://10.0.0.22:5000';

  switch (type) {
    case 'ale':
      return 'http://190.45.47.176:5000';
    case 'anibal':
      return 'http://192.168.0.14:5000';
    case 'diego':
      return 'http://192.168.0.11:5000';
    default:
      return 'http://localhost:5000';
  }
}

// Utils
async function callAPI(args) {
  const pagina = args.pagina || '/';
  const metodo = args.metodo || 'GET';
  const headers = args.headers || null;
  const body = args.body || null;
  const logging = args.logging || 1;

  const url = getAPI() + pagina;

  const data = await fetch(url, {
    method: metodo,
    headers,
    body,
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
          console.log(`[callAPI] ${pagina}.response.status: ${response.status}`);
        }
        return response.json();
      }
    })
    .then((data) => {
      if (logging) {
        console.log(`[callAPI] ${pagina}.data:`);
        console.log(data);
      }
      return data;
    })
    .catch((error) => console.error(error));

  return data;
}


// Usuario
export class Usuario {
  // Token
  async tryLogin(email, pwd) {
    await this.resetToken();
    let status, token;

    if (this.fakeEnabled) {
      status = 'ok'
      token = await this.setFakeToken()
    } else {
      let body = new FormData();
      body.append('email', email);
      body.append('pwd', pwd);
      const resp = await callAPI({
        pagina: '/login',
        metodo: 'POST',
        body
      });
      status = resp.status
      token = resp.token;
    }

    if (status == 'ok') {
      await this.setToken(token);
      await this.fetchDatosUsuario();
      return token;
    }
    return null;
  }

  getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    return token;
  }

  async setToken(token) {
    await AsyncStorage.setItem('token', token);
    return token;
  }


  // Medidas: {left_arm, right_arm, ...}
  async getMedidasAPI() {
    let headers = {
      'token': await this.getToken(),
    };
    const resp = await callAPI({
      pagina: '/medidas',
      metodo: 'POST',
      headers,
    });
    const { medidas } = resp;
    await this.setMedidas(medidas);
    return await this.getMedidas();
  }

  async setMedidas(medidas) {
    await AsyncStorage.setItem('medidas', JSON.stringify(medidas));
  }

  async getMedidas(datosCM) {
    datosCM = datosCM || false;
    let medidas = await AsyncStorage.getItem('medidas');
    medidas = JSON.parse(medidas);
	
	if (datosCM) {
		return {
		  right_arm: `${medidas.right_arm} cm`,
		  left_arm: `${medidas.left_arm} cm`,
		  right_leg: `${medidas.right_leg} cm`,
		  left_leg: `${medidas.left_leg} cm`,
		  waist: `${medidas.waist} cm`,
		  hip: `${medidas.hip} cm`,
		  chest: `${medidas.chest} cm`,
		  bust: `${medidas.bust} cm`,
		}
	}
	return {
		  right_arm: medidas.right_arm,
		  left_arm: medidas.left_arm,
		  right_leg: medidas.right_leg,
		  left_leg: medidas.left_leg,
		  waist: medidas.waist,
		  hip: medidas.hip,
		  chest: medidas.chest,
		  bust: medidas.bust,	  
		}	
  }

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


  // Perfil: {email, nombre, RUT, ...}
  async getPerfilAPI() {
    let headers = {
      'token': await this.getToken(),
    };
    const resp = await callAPI({
      pagina: '/perfil',
      metodo: 'POST',
      headers,
    });
    const { perfil } = resp;
    await this.setPerfil(perfil);
    return await this.getPerfil();
  }

  async getPerfil() {
    const perfil = await AsyncStorage.getItem('perfil');
    return JSON.parse(perfil);
  }

  async setPerfil(perfil) {
    await AsyncStorage.setItem('perfil', JSON.stringify(perfil));
  }

  async resetToken() {
    await AsyncStorage.multiRemove(['token']);
  }

  async resetUsuario() {
    await AsyncStorage.multiRemove(['medidas', 'perfil']);
  }

  async resetAll() {
    await AsyncStorage.multiRemove(['token', 'medidas', 'perfil']);
  }

  fakeEnabled = 1;

  fakeToken = '99999999';

  fakePerfil = {
    email: 'example@email.com',
    nombre: 'Juan Perez',
    rut: 333333333,
    sexo: 'masculino'
  };

  fakeMedidas = {
    right_arm: '67.4',
    left_arm: '64,6',
    right_leg: '89,5',
    left_leg: '84,9',
    waist: '0,0',
    hip: '42,8',
    chest: '0,0',
    bust: '0,0',
  };

  async setFakeToken() {
    return await this.setToken(this.fakeToken);
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

  async setMetodoAuth(metodo) {
    await AsyncStorage.setItem('metodo', metodo);
  }

  async doUploadPhoto(frontalphotoURI, lateralphotoURI, height) {
    let resp = null

    if (this.fakeEnabled) {
      resp = {
        medidas: this.fakeMedidas,
        mensaje: "success",
      }
    } else {
      let headers = {
        'token': await this.getToken(),
      };

      let body = new FormData();
      body.append('frontalphoto', {
        uri: frontalphotoURI,
        type: 'image/jpeg',
        name: 'frontal_photo.jpg',
      });
      body.append('lateralphoto', {
        uri: lateralphotoURI,
        type: 'image/jpeg',
        name: 'lateral_photo.jpg',
      });
      body.append('height', height);

      resp = await callAPI({
        pagina: '/upload',
        metodo: 'POST',
        headers,
        body,
      });
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
}
