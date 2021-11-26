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

// Toast.show('This is a long toast.', Toast.LONG);
const THRESHOLD = 110;

const addListener = (handler) => {
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
        Alert.alert("Pothole Detected!");
        // postPotHole(location);
      }
      prevX = x;
      prevY = y;
      prevZ = z;
    }
  });
};

const removeListener = () => {
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

const postPotHole = (location) => {
  console.log("Sending Pothole POST Request");
  const id =Device.brand+Device.manufacturer+Device.totalMemory;
  const potHoleLoc = location.coords;
  const potHoleDate = new Date();
  console.log(potHoleLoc);
  // console.log(potHoleLoc)

  fetch("https://chalebache-json-server.herokuapp.com/potholes", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstIncident: potHoleDate.toISOString(),
      lastIncident: potHoleDate.toISOString(),
      numIncidents: 87125,
      createdAt: potHoleDate.toISOString(),
      updatedAt: potHoleDate.toISOString(),
      lat: potHoleLoc.latitude,
      lng: potHoleLoc.longitude,
      __v: 0,
      hardwareId:id,
    }),
  });
  console.log("Sent");
  console.log(id)
};

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

   <Switch
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
            
          />
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
      backgroundColor="#57b07a"
      type="primary"
      width={250}
      textSize={30}
      style={styles.button}
            onPress={next => {
              postPotHole(location);
          // _storeData();
          let x = _retrieveData()
          console.log(x)
          // savePotHole();
         Alert.alert("Pothole Submitted");
        next();
      }}
      >
        Submit Pothole
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
