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
          "nike":            <Image style={styles.image} source={require("../../assets/brands/nike.png")} />,
          "hm":              <Image style={styles.image} source={require("../../assets/brands/hm.png")} />,
          "adidas":          <Image style={styles.image} source={require("../../assets/brands/adidas.png")} />,
          "basement":        <Image style={styles.image} source={require("../../assets/brands/basement.png")} />,
          "universityclub":  <Image style={styles.image} source={require("../../assets/brands/universityclub.png")} />,
          "sybilla":         <Image style={styles.image} source={require("../../assets/brands/sybilla.png")} />,
          "americaneagle":   <Image style={styles.image} source={require("../../assets/brands/americaneagle.png")} />,
          "alaniz":          <Image style={styles.image} source={require("../../assets/brands/alaniz.png")} />,
          "aussie":          <Image style={styles.image} source={require("../../assets/brands/aussie.png")} />,
          "cyan":            <Image style={styles.image} source={require("../../assets/brands/cyan.png")} />,
          "efesis":          <Image style={styles.image} source={require("../../assets/brands/efesis.png")} />,
          "ellus":           <Image style={styles.image} source={require("../../assets/brands/ellus.png")} />,
          "espirit":         <Image style={styles.image} source={require("../../assets/brands/espirit.png")} />,
          "foster":          <Image style={styles.image} source={require("../../assets/brands/foster.png")} />,
          "greenfield":      <Image style={styles.image} source={require("../../assets/brands/greenfield.png")} />,
          "io":              <Image style={styles.image} source={require("../../assets/brands/io.png")} />,
          "jjo":             <Image style={styles.image} source={require("../../assets/brands/jjo.png")} />,
          "marittimo":       <Image style={styles.image} source={require("../../assets/brands/marittimo.png")} />,
          "maui":            <Image style={styles.image} source={require("../../assets/brands/maui.png")} />,
          "opposite":        <Image style={styles.image} source={require("../../assets/brands/opposite.png")} />,
          "rainforest":      <Image style={styles.image} source={require("../../assets/brands/rainforest.png")} />,
          "reef":            <Image style={styles.image} source={require("../../assets/brands/reef.png")} />,
          "umbrale":         <Image style={styles.image} source={require("../../assets/brands/umbrale.png")} />,
          "viaressa":        <Image style={styles.image} source={require("../../assets/brands/viaressa.png")} />,
          "wados":           <Image style={styles.image} source={require("../../assets/brands/wados.png")} />,
          "dooaustralia":    <Image style={styles.image} source={require("../../assets/brands/dooaustralia.png")} />,
          "polo":            <Image style={styles.image} source={require("../../assets/brands/polo.png")} />,
          "mossimo":         <Image style={styles.image} source={require("../../assets/brands/mossimo.png")} />,
          "levis":           <Image style={styles.image} source={require("../../assets/brands/levis.png")} />,
          "lacoste":         <Image style={styles.image} source={require("../../assets/brands/lacoste.png")} />,
          "lamartina":       <Image style={styles.image} source={require("../../assets/brands/lamartina.png")} />,
          "ecko":            <Image style={styles.image} source={require("../../assets/brands/ecko.png")} />,
          "dockers":         <Image style={styles.image} source={require("../../assets/brands/dockers.png")} />,
          "americanino":     <Image style={styles.image} source={require("../../assets/brands/americanino.png")} />,
          "bearcliff":       <Image style={styles.image} source={require("../../assets/brands/bearcliff.png")} />,
          "topman":          <Image style={styles.image} source={require("../../assets/brands/topman.png")} />
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
