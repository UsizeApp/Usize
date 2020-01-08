
import { AsyncStorage } from 'react-native';

/*********
Funciones del storage
**********/

// Get
export async function storageGet(PK) {
	const valor = await AsyncStorage.getItem(PK);
	if (0)
		console.log('storageGet:', PK, valor)
	return valor;
}

// Set
export async function storageSet(PK, valor) {
	if (0)
		console.log('storageSet:', PK, valor)
	await AsyncStorage.setItem(PK, valor);
}

// Reset
export async function storageReset(PK) {
	await AsyncStorage.multiRemove([PK]);
}