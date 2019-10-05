import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const FilaMedida = (props) => {
  const { tipo, medida } = props;
  let { bbw } = props;
  bbw = typeof bbw === 'undefined' ? 2 : 0;

  return (
    <View style={styles.fila(bbw)}>
      <Text style={styles.tipo}>{tipo}</Text>
      <Text style={styles.medida}>{medida}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  fila: (bbw) => ({
    flexDirection: 'row',
    marginVertical: 8,
    borderBottomWidth: bbw,
    paddingBottom: 5,
    borderColor: '#ddd',
  }),
  tipo: {
    flex: 1,
    color: 'grey',
  },
  medida: {
    textAlign: 'right',
    color: 'blue',
  },
});

export default FilaMedida;
