import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  Alert,
  View,
  AsyncStorage,
} from "react-native";
import { Accelerometer } from "expo-sensors";
import * as Location from "expo-location";
import AwesomeButton from "react-native-really-awesome-button";
import * as Device from 'expo-device';
import Toast from 'react-native-toast-message';

const THRESHOLD = 140;
var prevLat = 0;
var prevLng = 0;

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
  const info = await rawData.json()
  return info;
}

const postPotHole = async (location, type) => {
  var TooNear = await isTooNear(location);
  if (TooNear == true) {
    Toast.show({
      type: 'info',
      text1: 'Bache ya reportado'
    });
  } else {
    console.log("Sending Pothole UPDATE Request");
    const id = Device.brand + Device.manufacturer + Device.totalMemory;
    const potHoleLoc = location.coords;
    const potHoleDate = new Date();
    const data = await fetchEvents();
    console.log(potHoleLoc);
    let newData;
    let equal = false;
    data.forEach(element => {
      if (element.lat.toFixed(5) === potHoleLoc.latitude.toFixed(5) && element.lng.toFixed(5) === potHoleLoc.longitude.toFixed(5)) {
        newData = element;
        equal = true;
      }
    });
    if (equal) {
      fetch("https://chalebache-json-server.herokuapp.com/potholes/" + newData.id, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lastIncident: potHoleDate.toISOString(),
          numIncidents: parseInt(newData.numIncidents) + 1,
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
          hardwareId: id,
          type: type,
        }),
      });
      console.log("Sent POST");
    }
  }

};

const getDistance = (location, pothole) => {
  const R = 6378;
  //Formula de Haversine para calcular distancia entre dos puntos geograficos en kilometros
  var difLat = (Math.PI / 180) * (location.coords.latitude - pothole.lat);
  var difLng = (Math.PI / 180) * (location.coords.longitude - pothole.lng);
  var a = Math.pow(Math.sin(difLat), 2) + Math.cos(location.coords.latitude) * Math.cos(pothole.lat) * Math.pow(Math.sin(difLng), 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var distancia = R * c * 1000;
  return distancia;

};



const isTooNear = async (location) => {
  const data = await fetchEvents();
  var found = false;
  data.every(pothole => {
    var distance = getDistance(location, pothole);
    if ((distance) <= 50) {
      found = true;
      return false;
    }
    return true;
  });
  return found;
}

const checkWarning = async (location) => {
  const data = await fetchEvents();
  data.forEach(pothole => {
    var distance = getDistance(location, pothole);
    if ((distance) <= 50) {
      if (prevLat != pothole.lat || prevLng != pothole.lng) {
        Toast.show({
          type: 'info',
          text1: 'Advertencia: Bache cercano'
        });
      }
      prevLat = pothole.lat;
      prevLng = pothole.lng;
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

  return (

    <View style={styles.flexContainer}>

      {<AwesomeButton


        style={{ marginTop: 200 }}
        backgroundColor={subscription ? "#ff0000" : "#008000"}
        type="primary"
        width={300}
        height={300}
        borderRadius={200}
        textSize={20}
        title="Activar"


        onPress={next => {
          setSubscription(!subscription)
          if (subscription) {
            removeListener();
          } else {
            addListener();
          }
          next()
        }}

      >
        Activar/Desactivar Detección
      </AwesomeButton>}

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
        style={{ marginBottom: 0 }}
        backgroundColor="#ff0000"
        width={250}
        textSize={30}
        onPress={next => {
          postPotHole(location, "Manual");
          let x = _retrieveData()
          console.log(x)

          Alert.alert("Pothole Submitted");
          next();
        }}
      >
        Reportar Bache
      </AwesomeButton>
    </View>
  );
};

export default Detect;

const styles = StyleSheet.create({
  flexContainer: {
    paddingTop: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

