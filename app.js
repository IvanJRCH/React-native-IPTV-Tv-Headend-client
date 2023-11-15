import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef  } from 'react';
import base64 from 'react-native-base64';
import { StyleSheet, Text, View, Image, Pressable, Button, useWindowDimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { Video, Audio  } from 'expo-av';
import Inicio from './vistas/inicio';
import { DeviceMotion } from 'expo-sensors';

const vs = {
  inicio:0,
  dashboard:1
};

async function obtenerURL(currentChannel){
  const username = 'usuario';
  const password = 'usuario';
  const credentials = `${username}:${password}`;
  const encodedCredentials = base64.encode(credentials);


  const authHeaders = {
    Authorization: `Basic ${encodedCredentials}`
  };

  await fetch(`http://TU_IP:9981/api/stream/service/${currentChannel.services[0]}`,{
    headers: authHeaders
  })
    .then(response => response.json())
    .then(data => {
      // Obtiene la URL de transmisión del servicio
      const urlTransmision = data.streamurl;
      console.log('transmision url');
      console.log(data.streamurl);

    })
    .catch(error => {
      console.error('Error al obtener la URL de transmisión del canal:', error);
    });

}
var pantalla = null;

export default function App() {

try{

  const [pantallaActual,setPantallaActual] = useState(vs.inicio);
  pantalla = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      zIndex: pantallaActual,
      position: 'absolute',
      left:'0px',
      top:'0px',
      width:'100%',
      height:'100%',
      color:'red',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });


  const [currentChannel, setCurrentChannel] = useState(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {

    // Función para autenticarse en el servidor Tvheadend
    const authenticate = async () => {
      const username = 'usuario';
      const password = 'usuario';
      const credentials = `${username}:${password}`;
      const encodedCredentials = base64.encode(credentials);


      const authHeaders = {
        Authorization: `Basic ${encodedCredentials}`
      };

      try {
        const response = await fetch('http://TU_IP:9981/api/channel/grid', {
          headers: authHeaders
        });

        if (response.ok) {
          const data = await response.json();

          setCurrentChannel(data.entries[0]); // Reproducir el primer canal de la lista
          console.log(data.total);
          setPantallaActual(vs.dashboard);
          
        } else {
          console.log('Error de autenticació 1n:', response.status);
          alert('Error de autenticación');
        }
      } catch (error) {
        //console.log('Error de conexión:', error);
        alert('Error de conexion');
      }
    };

    authenticate();
  }, []);

  if( pantallaActual == vs.inicio ) {
    return (
        <View style={styles.container}>
        <Inicio setPantallaActual={setPantallaActual} vs={vs} />
        </View>
    );
  }else
  if( pantallaActual == vs.dashboard ) {
/*
    const subscription = DeviceMotion.addListener(({ rotation }) => {
      setRotation(rotation);
    });
*/
    console.log(currentChannel.uuid);

    const username = 'usuario';
    const password = 'usuario';
  
    const videoHeaders = {
      Authorization: `Basic ${base64.encode(`${username}:${password}`)}`,
      // Otros encabezados personalizados si son necesarios
    };

    
    console.log(pantalla);
    
    // aspectRatio: 16 / 9, 16:9
    // aspectRatio: 4 / 3,  4:3
    // aspectRatio: 1, 1:1
    // aspectRatio: 3 / 2, 3:2
    // aspectRatio: 2, 2:1

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      videoContainer: {
        flex: 1,
        width: '100%',
        aspectRatio: 1,
        marginBottom: 10,
      },
      video: {
        flex: 1,
      },
    });


    // webtv-h264-aac-matroska
    return (
      <View style={styles.container}>
        <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>{currentChannel.name}</Text>
    
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: `http://TU_IP:9981/stream/channel/${currentChannel.uuid}`, headers: videoHeaders }}
            shouldPlay={true}
            resizeMode="contain"
            isMuted={false}
            rotation={90}
            useNativeControls={true}
            playsInSilentLockedModeIOS={true}
            ignoreSilentSwitch={'ignore'}
            volume={1.0}
            style={styles.video}
            onError={(error) => console.log('Error reproduciendo el video:', error)}
          />
        </View>
    
        <Button title="Cambiar pantalla" onPress={() => { setPantallaActual(vs.inicio) }} />
      </View>
    );

  }

}catch(e) {
  alert(e.message);
}

}
/*.
      


          <Video
             source={{uri:`http://TU_IP:9981/stream/channel/a45d7380f5d04b56a765c15c5d086044?profile=webtv-vp8-vorbis-webm`}}
            style={{ flex: 1 }}
            resizeMode="contain"
            controls
          />

     <html>
        <body> 
          <video muted autoplay="true" playsinline style="position:fixed;left:0px;top:0px;width:100%;height:100%;" controls>
            <source src="http://TU_IP:9981/stream/channel/${currentChannel2.uuid}?profile=webtv-vp8-vorbis-webm" type="video/webm" >
            Tu navegador no admite la etiqueta de video HTML5.
          </video>
        </body>
      </html>
 
    const currentChannel2 = {
      uuid: currentChannel.uuid
    };
  
    const username = 'usuario';
    const password = 'usuario';
    const encodedCredentials = base64.encode(`${username}:${password}`);
  
    const htmlContent = `
      <html>
        <body>
          <video autoplay="true" src="http://TU_IP:9981/stream/channel/${currentChannel2.uuid}?profile=webtv-h264-aac-matroska" type="video/mp4" headers="Authorization: Basic ${encodedCredentials}" style="position:fixed;left:0px;top:0px;width:100%;height:100%;" controls>
            <source src="http://TU_IP:9981/stream/channel/${currentChannel2.uuid}?profile=webtv-h264-aac-matroska" type="video/webm" headers="Authorization: Basic ${encodedCredentials}">
            Tu navegador no admite la etiqueta de video HTML5.
          </video>
        </body>
      </html>
    `;


    return (<>
          <Text style={{fontWeight:'bold'}}>{currentChannel.name}</Text>

          <View style={{ flex: 1 }}>
      <WebView
        source={{ html: htmlContent }}
        style={{ flex: 1 }}
      />
    </View>

          <Button title="Cambiar pantalla" onPress={()=>{setPantallaActual(vs.inicio)}} />

      </>
    );



         <View style={{ flex: 1 }}>
            <WebView
              source={{
                uri: `http://TU_IP:9981/stream/channel/${currentChannel.uuid}?profile=webtv-h264-aac-matroska`,
                headers: {
                  Authorization: 'Basic ' + base64.encode('usuario:usuario')
                }
              }}
              style={{ flex: 1 }}
            />
          </View>
  



          <Video
             source={`TU_IP:9981/stream/channel/${currentChannel.uuid}?profile=webtv-h264-aac-matroska`}
            style={{ flex: 1 }}
            resizeMode="contain"
            controls
          />





          <Image source={vari} style={{backgroundColor:'red',width:500,height:500,resizeMode:'contain'}} />

          <Video
            source={{ uri: currentChannel. }} // Reemplaza 'URL_DEL_CANAL' con el enlace de streaming del canal deseado
            style={{ flex: 1 }}
            resizeMode="contain"
            controls
          />

          <View style={{ flex: 1 }}>
              <WebView
                source={{ uri: currentChannel.streamUrl }}
                style={{ flex: 1 }}
              />
          </View>*/

/*
          <Text style={{fontWeight:'bold'}}>{currentChannel.name}</Text>
          <Image source={currentChannel.icon} style={{width:16,height:16,resizeMode:'contain'}} />


          <Video
            source={{ uri: currentChannel.icon }} // Reemplaza 'URL_DEL_CANAL' con el enlace de streaming del canal deseado
            style={{ flex: 1 }}
            resizeMode="contain"
            controls
          />
*/


