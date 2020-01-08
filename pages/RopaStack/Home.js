import React, { Component } from 'react';
import { Image, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import Button from '../../components/Utils/Button';
import { Usuario } from '../../models/API';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import { Ionicons } from '@expo/vector-icons';

export default class BrandSizes extends Component {
  static navigationOptions = {
    title: 'Tallas',
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
      tableHead: ['Marcas', 'Polera', 'Pantalón'],
      brands: {
        "nike":   <Image style={styles.image} source={require("../../assets/brands/nike.png")} />,
        "hm":     <Image style={styles.image} source={require("../../assets/brands/hm.png")} />,
        "adidas": <Image style={styles.image} source={require("../../assets/brands/adidas.png")} />
      },
      userBrands: ["hm", "nike", "adidas"],
      tableData: [
        ['S', 'M'  ],
        ['S', 'M'  ],
        ['M', '42' ]
      ]
    }
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
  }
});





















///function FilaMedida(props) {
//  const { tipo, medida } = props;
//  let { bbw } = props;
//  bbw = typeof bbw === 'undefined' ? 2 : 0;
//
//  return (
//    <View style={{
//      flexDirection: 'row', marginVertical: 8, borderBottomWidth: bbw, paddingBottom: 5, borderColor: '#ddd',
//    }}
//    >
//      <Text style={{ flex: 1, color: 'grey' }}>{tipo}</Text>
//      <Text style={{ textAlign: 'right', color: 'blue' }}>{medida}</Text>
//    </View>
//  );
//}
//
//export default class MedidasHome extends Component {
//
//
//  static navigationOptions = {
//    title: 'Tallas',
//    headerStyle: {
//      backgroundColor: '#66CBFF',
//      elevation: 0,
//      shadowOpacity: 0,
//      borderBottomWidth: 0,
//    },
//    headerTintColor: 'white',
//  }
//
//  constructor(props) {
//    super(props);
//    this.state = {
//      tallas: null,
//      // metodo: null,
//      done: false,
//    };
//  }
//
//  componentDidMount() {
//    this.getTallas();
//  }
//
//  async getTallas() {
//    console.log('Tallas::getTallas');
//    const u = new Usuario();
//
//    const tallas = await u.getTallas();
//    console.log(tallas);
//    console.log("ctmallas");
//    this.setState({
//      tallas,
//      // metodo,
//      done: true,
//    });
//  }
//
//  render() {
//
//    const { done } = this.state;
//    const { navigation } = this.props;
//
//    if (done) {
//      const { tallas } = this.state;
//
//      return (
//        <View style={styles.container}>
//          <View style={styles.marco}>
//          </View>
//        </View>
//      );
//    }
//
//    return (
//      <View style={styles.FormContainer}>
//        <Text style={{ color: '#8E8E8E' }}>Obteniendo perfil...</Text>
//        <ActivityIndicator size="large" color="#66CBFF" />
//      </View>
//    );
//  }
//}
//
//const styles = StyleSheet.create({
//  FormContainer: {
//    flex: 3,
//    alignItems: 'center',
//    justifyContent: 'center',
//  },
//  container: {
//    margin: 10,
//  },
//  marco: {
//    padding: 20,
//    borderWidth: 0,
//    borderRadius: 10,
//    borderColor: '#ddd',
//    shadowColor: '#000',
//    shadowOffset: {
//      width: 0,
//      height: 2,
//    },
//    shadowOpacity: 0.23,
//    shadowRadius: 1,
//    elevation: 2,
//  },
//  titulo: {
//    fontSize: 16,
//    fontWeight: 'bold',
//    marginTop: 5,
//    marginBottom: 15,
//  },
//});
