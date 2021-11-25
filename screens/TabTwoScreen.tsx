import * as React from "react";
import { FlatList, StyleSheet, AsyncStorage } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

const Item = ({ title,updatedAt,lat,lng }) => (
  <View style={styles.item}>
    {/* <Text style={styles.title}>{title}</Text> */}
    <Text style={styles.title}>DATE: {updatedAt}</Text>
    {/* <Text >{updatedAt}</Text> */}
    <Text >Latitude: {lat}</Text>
    <Text >Longitude: {lng}</Text>
  </View>
);

_retrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem("location");
    if (value !== null) {
      // Our data is fetched successfully
      console.log(value);
    }
  } catch (error) {
    // Error retrieving data
  }
};

export default function TabTwoScreen() {
  const renderItem = ({ item }) => <Item title={item.title} updatedAt={item.updatedAt} lat={item.lat} lng={item.lng} />;
  let x = _retrieveData();
  console.log(x, "!!!!!!");
  return (
    <View style={styles.container}>
      <Text style={styles.title}>History</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {/* <EditScreenInfo path="/screens/TabTwoScreen.tsx" /> */}
      <View>
        <FlatList data={DATA} renderItem={renderItem} />
      </View>
    </View>
  );
}

const DATA = [
  {
    id: "1",
    title: "Isaac Madera",
    updatedAt: "2021-11-21T22:24:50.694Z",
    lat: 20.691212415088874,
    lng: -103.84911954851161,
  },
  {
    id: "2",
    title: "Clemente Kadar rodriguez",
    updatedAt: "2021-11-24T22:24:50.694Z",
    lat: 20.691905445088874,
    lng: -103.42532354851161,
  },
  {
    id: "3",
    title: "Guillermina Mena",
    updatedAt: "2021-11-24T22:24:50.694Z",
    lat: 20.691905445088874,
    lng: -103.42532354851161,
  },
  {
    id: "4",
    title: "Renata Griego",
    updatedAt: "2021-11-24T22:24:50.694Z",
    lat: 20.691905445088874,
    lng: -103.42532354851161,
  },
  {
    id: "5",
    title: "Alan Cruz",
    updatedAt: "2021-11-24T22:24:50.694Z",
    lat: 20.691905445088874,
    lng: -103.42532354851161,
  },
  {
    id: "6",
    title: "Saúl Urbina",
    updatedAt: "2021-11-24T22:24:50.694Z",
    lat: 20.691905445088874,
    lng: -103.42532354851161,
  },
  {
    id: "7",
    title: "Daniel Velázquez",
    updatedAt: "2021-11-24T22:24:50.694Z",
    lat: 20.6912,
    lng: -103.4991,
  },
  {
    id: "8",
    title: "Adolfo Miclaco",
    updatedAt: "2021-11-24T22:24:50.694Z",
    lat: 20.691905445088874,
    lng: -103.42532354851161,
  },
  {
    id: "9",
    title: "Diego Miclaco",
    updatedAt: "2021-11-24T22:24:50.694Z",
    lat: 20.691905445088874,
    lng: -103.42532354851161,
  },
  {
    id: "10",
    title: "Luis Delgado",
    updatedAt: "2021-11-24T22:24:50.694Z",
    lat: 20.6911,
    lng: -103.4290,
  },
  {
    id: "11",
    title: "Paola Benral",
    updatedAt: "2021-11-21T22:24:50.694Z",
    lat: 20.691905445088874,
    lng: -103.42532354851161,
  },
  {
    id: "12",
    title: "Bernardo Pérez",
    updatedAt: "2021-11-23T22:24:50.694Z",
    lat: 20.6921,
    lng: -103.425,
  },
];

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
  item: {
    backgroundColor: "#57b07a",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});
