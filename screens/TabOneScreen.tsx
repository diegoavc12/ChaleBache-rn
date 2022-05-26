import * as React from "react";
import { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, ImageBackground } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import Loc from "../components/Loc";
import Detect from "../components/Detect";
//import { WeatherWidget } from "react-native-weather";

   

export default function TabOneScreen() {
  
  const image = { uri: "https://www.tranbc.ca/wp-content/uploads/2011/04/pothole-2.jpg" };
  
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Tab One</Text> */}
      {/*<WeatherWidget
        api={"2f0b98dce3356ae266677c11184ed85a"}
        lat={"20.6969"}
        lng={"20.6969"}
         style={styles.weather}
  />*/}
      
        <ImageBackground source={image} resizeMode="cover"  style={styles.image}>
        
          

          <View style={{ backgroundColor: "white",borderWidth: 5, bottom:100, height:150, marginBottom:-300}}>
          <Text style={{textAlign: "center", fontSize:18, padding: 10,position:"relative", color:"#000000"}}>
            Bienvenido a la app de ChaleBache. Utilice el botón redondo para activar la detección
            automática de baches o presione el botón "Reportar Bache" para notificar que hay un bache en 
            su ubicación actual. 
            </Text>
          </View >

          <Detect />

          
      {/* <EditScreenInfo path="/screens/TabOneScreen.tsx" /> */}
      
        </ImageBackground>
      
      
     
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
  image: {
    flex: 1,
    justifyContent: "center",
    width: '100%',
    height: '100%',
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
