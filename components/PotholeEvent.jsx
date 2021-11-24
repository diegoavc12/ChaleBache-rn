import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import { Accelerometer } from "expo-sensors";

const THRESHOLD = 130;

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
        Alert.alert("Pothole Detected!")
        setTimeout(() => {
          console.log("Cool down");
        }, 2000);
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

const PotholeEvent = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    addListener();
    console.log("Shake Listener");
    return () => {
      console.log("Removed Listener");
      removeListener();
    };
  }, []);

  return (
    <View>
    </View>
  );
};

export default PotholeEvent;
