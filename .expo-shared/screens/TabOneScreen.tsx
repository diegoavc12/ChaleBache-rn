import * as React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import Loc from "../components/Loc";
import Detect from "../components/Detect";
import { WeatherWidget } from "react-native-weather";

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Tab One</Text> */}
      <WeatherWidget
        api={"2f0b98dce3356ae266677c11184ed85a"}
        lat={"20.6969"}
        lng={"20.6969"}
         style={styles.weather}
      />
      
      
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      <Detect />

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {/* <EditScreenInfo path="/screens/TabOneScreen.tsx" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  weather: {
    marginTop: -30,
  },
});
