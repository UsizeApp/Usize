import React, { Component } from 'react';
import { Email } from '../../models/API';
import { Image, View, StyleSheet } from 'react-native';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import { CheckBox } from 'react-native-elements';

export default class Edit extends Component {
    static navigationOptions = {
        title: 'Filtro de marcas de ropa',
        headerStyle: {
            backgroundColor: '#66CBFF',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
        },
        headerTintColor: 'white',
    }

    constructor(props) {
      super(props);
      this.state = {
        brands: {
          "nike":   <Image style={styles.image} source={require("../../assets/brands/nike.png")} />,
          "hm":     <Image style={styles.image} source={require("../../assets/brands/hm.png")} />,
          "adidas": <Image style={styles.image} source={require("../../assets/brands/adidas.png")} />
        },
        header: ["Marcas", "Mostrar"],
        checks: {},
        marcas: []
      }
    }

    async componentDidMount() {
        this.getMarcas();
    }

    async getMarcas() {
      console.log('Marcas::getMarcas');

      const u = new Email();
      const datosPersona = await u.storageGetDatosPersona()

      if (datosPersona == null) {
        console.error('Error de datos')
        return
      }

      const bTieneMedidas = await u.bTieneMedidas()
      let marcas = null;

      if (bTieneMedidas) {
        marcas = await u.filtroMarcas()
      }

      this.setState({
        marcas
      });
    }

    render() {
        const state = this.state;
        function checkMarcas(brands_filter) {
          var arr = [];
          brands_filter.forEach(brand => {
            var code = brand[0]
            var show = brand[1]
            arr.push([
                state.brands[code],
                <CheckBox
                    id={code}
                    checked={show}
                    containerStyle={styles.CheckboxContainer}
                />
            ]);
            state.checks[code] = show
          });
          return arr;
        };
        return (
          <View style={styles.container}>
            <Table borderStyle={{borderColor: 'transparent'}}>
              <Row data={state.header} flexArr={[1, 1]} style={styles.head} textStyle={styles.text}/>
              <TableWrapper style={styles.wrapper}>
                <Rows data={checkMarcas(state.marcas)} flexArr={[1, 1]} style={styles.row} textStyle={styles.textData}/>  
              </TableWrapper>
            </Table>
          </View>
        )
    }
}
 
const styles = StyleSheet.create({
  container:  { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head:       { 
    height: 50,
    backgroundColor: '#f1f8ff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  wrapper:    { flexDirection: 'row' },
  title:      { flex: 2 },
  row:        { height: 100 },
  text:       { textAlign: 'center' },
  textTitle:  { textAlign: 'center', fontSize: 20 },
  textData:   { textAlign: 'center', fontSize: 20, fontWeight: 'bold' },
  image: {
    height: 50,
    width: 100,
    left: "25%",
    resizeMode: "contain",
  },
  headerIcons: {
    left:   "35%",
    height: 30,
    width:  30,
    resizeMode: "contain",
  },
  mainHeader: {
    color: "white",
    marginRight: 30
  },
  CheckboxContainer: {
    left: "33%"
  }
});
