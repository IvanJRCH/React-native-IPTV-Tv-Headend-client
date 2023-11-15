import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button } from 'react-native';

const logo = require('../assets/logo.png');

export default function Inicio({ setPantallaActual, vs }) {
  return (<>
    <View style={styles.container}>
      <Image source={logo} style={{width:'50%',height:'50%',resizeMode:'contain'}} />
      <Text style={{ fontWeight: 'bold' }}>Cargando...</Text>
      <Button title="Cambiar pantalla" onPress={()=>{setPantallaActual(vs.dashboard)}} />
      <StatusBar style="auto" />
    </View>
  </>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:'100%',
    backgroundColor: '#222222',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

