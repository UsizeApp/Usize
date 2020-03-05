import React, { Component } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Email } from '../../models/API';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import { Ionicons } from '@expo/vector-icons';

class Edit extends Component {
  render() {
    return (
      <View>
        <Ionicons onPress={() => navigation.navigate('Edit')} style={styles.mainHeader} name="md-create" size={30}/>
      </View>
    );
  }
}

export default class MarcasHome extends Component {
  static navigationOptions = {
    title: 'Tallas',
    //headerRight: <Edit />,
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
        "basement":        <Image style={styles.image} source={require("../../assets/brands/basement.jpg")} />,
        "universityclub":  <Image style={styles.image} source={require("../../assets/brands/universityclub.png")} />,
        "sybilla":         <Image style={styles.image} source={require("../../assets/brands/sybilla.png")} />,
        "americaneagle":   <Image style={styles.image} source={require("../../assets/brands/americaneagle.jpg")} />,
        "alaniz":          <Image style={styles.image} source={require("../../assets/brands/alaniz.png")} />,
        "aussie":          <Image style={styles.image} source={require("../../assets/brands/aussie.png")} />,
        "cyan":            <Image style={styles.image} source={require("../../assets/brands/cyan.png")} />,
        "efesis":          <Image style={styles.image} source={require("../../assets/brands/efesis.jpg")} />,
        "ellus":           <Image style={styles.image} source={require("../../assets/brands/ellus.jpg")} />,
        "espirit":         <Image style={styles.image} source={require("../../assets/brands/espirit.png")} />,
        "foster":          <Image style={styles.image} source={require("../../assets/brands/foster.jpg")} />,
        "io":              <Image style={styles.image} source={require("../../assets/brands/io.png")} />,
        "jjo":             <Image style={styles.image} source={require("../../assets/brands/jjo.png")} />,
        "marittimo":       <Image style={styles.image} source={require("../../assets/brands/marittimo.png")} />,
        "maui":            <Image style={styles.image} source={require("../../assets/brands/maui.jpg")} />,
        "opposite":        <Image style={styles.image} source={require("../../assets/brands/opposite.png")} />,
        "rainforest":      <Image style={styles.image} source={require("../../assets/brands/rainforest.png")} />,
        "reef":            <Image style={styles.image} source={require("../../assets/brands/reef.png")} />,
        "umbrale":         <Image style={styles.image} source={require("../../assets/brands/umbrale.jpg")} />,
        "viaressa":        <Image style={styles.image} source={require("../../assets/brands/viaressa.png")} />,
        "wados":           <Image style={styles.image} source={require("../../assets/brands/wados.jpg")} />,
        "dooaustralia":    <Image style={styles.image} source={require("../../assets/brands/dooaustralia.png")} />,
        "polo":            <Image style={styles.image} source={require("../../assets/brands/polo.jpg")} />,
        "mossimo":         <Image style={styles.image} source={require("../../assets/brands/mossimo.jpg")} />,
        "levis":           <Image style={styles.image} source={require("../../assets/brands/levis.png")} />,
        "lacoste":         <Image style={styles.image} source={require("../../assets/brands/lacoste.jpg")} />,
        "lamartina":       <Image style={styles.image} source={require("../../assets/brands/lamartina.png")} />,
        "ecko":            <Image style={styles.image} source={require("../../assets/brands/ecko.png")} />,
        "dockers":         <Image style={styles.image} source={require("../../assets/brands/dockers.png")} />,
        "americanino":     <Image style={styles.image} source={require("../../assets/brands/americanino.png")} />,
        "bearcliff":       <Image style={styles.image} source={require("../../assets/brands/bearcliff.png")} />,
        "topman":          <Image style={styles.image} source={require("../../assets/brands/topman.jpg")} />
      },
      userBrands: [],
      tableData: []
    }
  }

  componentDidMount() {
    this.getTallas();
  }

  async getTallas() {
    console.log('Marcas::getTallas');

    const u = new Email();
    const datosPersona = await u.storageGetDatosPersona()

    if (datosPersona == null) {
      console.error('Error de datos')
      return
    }

    const bTieneMedidas = await u.bTieneMedidas()
    let marcas = null;

    if (bTieneMedidas) {
      marcas = await u.tallasPorMarca()
    }
    userBrands = marcas[0]
    tableData = marcas[1]

    this.setState({
      userBrands,
      tableData
    });
  }

  render() {
    const state = this.state;
    function brandsImages(brands_list) {
      var arr = [];
      brands_list.forEach(brand_code => {
        arr.push(state.brands[brand_code]);
      });
      return arr;
    };
    function tableHeader() {
      header = [
        "Marcas",
        <Ionicons style={{left:"35%"}} name="md-shirt" size={30}/>,
        <Image style={styles.headerIcons} source={require("../../assets/pants.png")} />
      ];
      return header;
    }

    return (
      <View style={styles.container}>
        <Table borderStyle={{borderColor: 'transparent'}}>
          <Row data={tableHeader()} flexArr={[2, 1, 1]} style={styles.head} textStyle={styles.text}/>
          <TableWrapper style={styles.wrapper}>
            <Col data={brandsImages(state.userBrands)} style={styles.title} heightArr={[100, 100]} textStyle={styles.textTitle}/>
            <Rows data={state.tableData} flexArr={[1, 1]} style={styles.row} textStyle={styles.textData}/>  
          </TableWrapper>
        </Table>
        <Ionicons onPress={() => this.props.navigation.navigate('Edit')} style={styles.mainHeader} name="md-create" size={30}/>
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
    color: "black",
    marginRight: 30
  }
});
