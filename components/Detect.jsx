import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  View,
  AsyncStorage,
  Switch,
} from "react-native";
import { Accelerometer } from "expo-sensors";
// import Toast from 'react-native-simple-toast';
import * as Location from "expo-location";
import AwesomeButton from "react-native-really-awesome-button";
import * as Device from 'expo-device';
import Toast from 'react-native-toast-message';
// Toast.show('This is a long toast.', Toast.LONG);
const THRESHOLD = 140;
var prevLat=0;
var prevLng=0;

const getLocN = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    return location
  };

const addListener = async (handler) => {
  console.log("Detection Activated");
  Alert.alert("Detección Activada");
  let location = await getLocN()
  console.log(location);
  let prevX, prevY, prevZ;
  let lastUpdate = 0;
  Accelerometer.addListener((accelerometerData) => {
    
    let { x, y, z } = accelerometerData;
    let currTime = Date.now();
    if (currTime - lastUpdate > 100) {
      let diffTime = currTime - lastUpdate;
      lastUpdate = currTime;
      let speed =
        (Math.abs(x + y + z - prevX - prevY - prevZ) / diffTime) * 10000;
      if (speed > THRESHOLD) {
        console.log("Pothole Detected!");
        //Alert.alert("Pothole Detected!");
        
        Toast.show({
          type: 'info',
          text1: 'Bache Detectado'
        });
        postPotHole(location, "Automatic");
        
      }
      prevX = x;
      prevY = y;
      prevZ = z;
    }
  });
};

const removeListener = () => {
  Alert.alert("Deteccion Desactivada")
  Accelerometer.removeAllListeners();
};

_storeData = async () => {
  try {
    await AsyncStorage.setItem("name", "John");
  } catch (error) {
    // Error saving data
  }
};
_retrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem("name");
    if (value !== null) {
      // Our data is fetched successfully
      console.log(value);
    }
  } catch (error) {
    // Error retrieving data
  }
};

 const fetchEvents = async () => {
   const rawData = await fetch("https://chalebache-json-server.herokuapp.com/potholes");
  const info =  await rawData.json()
  return info;
 }

const postPotHole = async (location, type) => {
  var TooNear= await isTooNear(location);
  console.log(TooNear);
  if(TooNear==true){
  Toast.show({
    type: 'info',
    text1: 'Bache ya reportado'
    });
  }else{
    console.log("Sending Pothole UPDATE Request");
  const id =Device.brand+Device.manufacturer+Device.totalMemory;
  const potHoleLoc = location.coords;
  const potHoleDate = new Date();
  const data = await fetchEvents();
  console.log(potHoleLoc);
  let newData;
  let equal= false;
  data.forEach(element => {
    if (element.lat.toFixed(5)===potHoleLoc.latitude.toFixed(5) && element.lng.toFixed(5)===potHoleLoc.longitude.toFixed(5)) {
      // element.lastIncident=potHoleDate.toISOString()
      //element.numIncidents+=1;
      // element.updatedAt=potHoleDate.toISOString()
      newData=element;
      equal=true;
    }
  });
  //console.log(newData);
  //console.log(equal)
  // console.log(potHoleLoc)
  // console.log(data)
    if (equal) {
         fetch("https://chalebache-json-server.herokuapp.com/potholes/"+newData.id, {
     method: "PATCH",
     headers: {
       Accept: "application/json",
       "Content-Type": "application/json",
     },
     body: JSON.stringify({
       lastIncident: potHoleDate.toISOString(),
       numIncidents: parseInt(newData.numIncidents)+1,
       updatedAt: potHoleDate.toISOString(),
     }),
   });
   console.log("Sent PATCH");  
  } else {
     fetch("https://chalebache-json-server.herokuapp.com/potholes", {
     method: "POST",
     headers: {
       Accept: "application/json",
       "Content-Type": "application/json",
     },
     body: JSON.stringify({
       firstIncident: potHoleDate.toISOString(),
       lastIncident: potHoleDate.toISOString(),
       numIncidents: 1,
       createdAt: potHoleDate.toISOString(),
       updatedAt: potHoleDate.toISOString(),
       lat: potHoleLoc.latitude,
       lng: potHoleLoc.longitude,
       __v: 0,
       hardwareId:id,
       type: type,
     }),
   });
   console.log("Sent POST"); 
  }
  }
  
};

const getDistance=(location, pothole)=>{
  const R=6378;
  //Formula de Haversine para calcular distancia entre dos puntos geograficos en kilometros
  var difLat=(Math.PI/180)*(location.coords.latitude-pothole.lat);
  var difLng=(Math.PI/180)*(location.coords.longitude-pothole.lng);
  var a=Math.pow(Math.sin(difLat),2)+Math.cos(location.coords.latitude)*Math.cos(pothole.lat)*Math.pow(Math.sin(difLng),2);
  var c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
  var distancia=R*c*1000;
  //console.log("Distancia: "+distancia+" metros");
  return distancia;
  
};



const isTooNear=async (location)=>{
  const data= await fetchEvents();
  var found=false;
  data.every(pothole =>{
    var distance=getDistance(location,pothole);
    console.log("Distancia: "+distance+" metros");
    if((distance)<=50){
      found=true;
      return false;
    }
    return true;
  });
  return found;
}

const checkWarning= async (location) =>{
  const data= await fetchEvents();
  data.forEach(pothole =>{
    var distance= getDistance(location, pothole);
    if((distance)<=50){
      if(prevLat!=pothole.lat || prevLng!=pothole.lng){
        console.log("Advertencia: Bache cercano");
        Toast.show({
          type: 'info',
          text1: 'Advertencia: Bache cercano'
        });
      }
      prevLat=pothole.lat;
      prevLng=pothole.lng;
    }  
  });
}

const Detect = () => {
  const [subscription, setSubscription] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const getLoc = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    
  };
  useEffect(() => {
    addListener();
    getLoc();
  }, []);
  setTimeout(() => {
    getLoc();
    checkWarning(location);
    
    
  }, 5000);

  // const [data, setData] = useState({
  //   x: 0,
  //   y: 0,
  //   z: 0,
  // });

  // const _slow = () => {
  //   Accelerometer.setUpdateInterval(1000);
  // };
  // const _fast = () => {
  //   Accelerometer.setUpdateInterval(16);
  // };
  // const _subscribe = () => {
  //   let prevX, prevY, prevZ;
  //   let lastUpdate = 0;
  //   setSubscription(
  //     Accelerometer.addListener((accelerometerData) => {
  //       setData(accelerometerData);
  //     })
  //   );
  // };
  // const _unsubscribre = () => {
  //   subscription && subscription.remove();
  //   setSubscription(null);
  // };

  // useEffect(() => {
  //   _subscribe();
  //   return () => _unsubscribre();
  // }, []);

  // const { x, y, z } = data;

  return (

    <View style={styles.flexContainer}>
      {/* <Text>
        x :{x.toFixed(4)} y:{y.toFixed(4)} z:{z.toFixed(4)}
      </Text> */}

   {/*<Switch
            style={styles.btnOnOFF}
            trackColor={{ false: "#767577", true: "#2b961f" }}
            thumbColor={subscription ? "#57b07a" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              setSubscription(!subscription)
              if (subscription) {
                removeListener();
              } else {
                addListener();
              }
            }}
            value={subscription}
            
          />*/}
      {<AwesomeButton
      
      
          style={{marginTop:200}}
          backgroundColor={subscription ? "#ff0000" : "#008000"}
          type="primary"
          width={300}
          height={300}
          borderRadius={200}
          textSize={20}
          title="Activar"
          

          onPress={next=>{
            setSubscription(!subscription)
              if (subscription) {
                removeListener();
              } else {
                addListener();
              }
              next()
            }}
            //value={subscription}
          
      >
      Activar/Desactivar Detección
          </AwesomeButton>}

          
          {/* <Text style={{ fontSize: 40 }}>{subscription ? "ON" : "OFF"}</Text> */}
      {/* <TouchableOpacity
        style={styles.btnOnOFF}
        // onPress={subscription ? _unsubscribre : _subscribe}
        onPress={() => {
          setSubscription(!subscription);
          if (subscription) {
            removeListener();
          } else {
            addListener();
          }
        }}
      >
        <Text style={{ fontSize: 40 }}>{subscription ? "ON" : "OFF"}</Text>
      </TouchableOpacity> */}
      <View>
        <Text></Text>
        <Text></Text>
        <Text></Text>
        <Text></Text>
        <Text></Text>
        <Text></Text>
        <Text></Text>
      </View>
      <AwesomeButton 
      style={{marginBottom:0}}
      backgroundColor="#ff0000"
      width={250}
      textSize={30}
            onPress={next => {
              postPotHole(location, "Manual");
          // _storeData();
          let x = _retrieveData()
          console.log(x)
          // savePotHole();
         Alert.alert("Pothole Submitted");
        next();
      }}
      >
        Reportar Bache
        </AwesomeButton>
      {/* <TouchableOpacity
        style={styles.button}
        onPress={() => {
          postPotHole(location);
          // _storeData();
          let x = _retrieveData()
          console.log(x)
          // savePotHole();
        }}
      >
        <Text style={{ fontSize: 50 }}>Submit Pothole</Text>
      </TouchableOpacity> */}
      {/* <Button onPress={_fast} title="fast" /> */}
    </View>
  );
};

export default Detect;

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  flexContainer: {
    // flexDirection: "row",
    paddingTop: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  flexItemA: {
    flexGrow: 0,
    backgroundColor: "green",
  },
  flexItemB: {
    flexGrow: 1,
    backgroundColor: "blue",
  },
  btnOnOFF: {
    alignItems: "center",
    transform: [{ scaleX: 4.5 }, { scaleY: 4.5 }],
  },
  button: {
    // alignItems: "center",
    // backgroundColor: "#57b07a",
    // padding: 10,
    marginBottom:-200,
  },
});
//
