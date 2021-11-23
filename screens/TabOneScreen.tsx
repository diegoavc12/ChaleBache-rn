import * as React from "react";
import { StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import Loc from "../components/Loc";
import Detect from "../components/Detect";
import PotholeEvent from "../components/PotholeEvent";
import {WeatherWidget} from 'react-native-weather'

// export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
// }

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Tab One</Text> */}
       <WeatherWidget
      api={"your-DarkSky.net-api-here"}
      lat={"20.6969"}
      lng={"20.6969"}
      />
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {/* <EditScreenInfo path="/screens/TabOneScreen.tsx" /> */}
      <View>
        {/* <Text>On</Text> */}
        {/* <Loc /> */}
        <Detect/>
        <PotholeEvent/>
      </View>
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
});
