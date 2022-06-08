import * as React from "react";
import { StyleSheet, ImageBackground } from "react-native";
import { Text, View } from "../components/Themed";
import Detect from "../components/Detect";


export default function TabOneScreen() {

  const image = { uri: "https://www.tranbc.ca/wp-content/uploads/2011/04/pothole-2.jpg" };

  return (
    <View style={styles.container}>

      <ImageBackground source={image} resizeMode="cover" style={styles.image}>

        <View style={{ backgroundColor: "white", borderWidth: 5, bottom: 100, height: 150, marginBottom: -300 }}>
          <Text style={{ textAlign: "center", fontSize: 18, padding: 10, position: "relative", color: "#000000" }}>
            Bienvenido a la app de ChaleBache. Utilice el botón redondo para activar la detección
            automática de baches o presione el botón "Reportar Bache" para notificar que hay un bache en
            su ubicación actual.
          </Text>
        </View >

        <Detect />

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
  image: {
    flex: 1,
    justifyContent: "center",
    width: '100%',
    height: '100%',
  },
});
