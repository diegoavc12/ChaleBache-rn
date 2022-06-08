import * as React from "react";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, AsyncStorage } from "react-native";
import { Text, View } from "../components/Themed";
import AwesomeButton from "react-native-really-awesome-button";
import * as Device from 'expo-device';

const Item = ({ title, updatedAt, lat, lng }) => (
  <View style={styles.item}>
    <Text style={styles.title}>DATE: {updatedAt}</Text>
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
  const [data1, setdata] = useState([])
  const [baches, setbaches] = useState(0)



  useEffect(() => {
    const fetchEvents = async () => {
      const rawData = await fetch("https://chalebache-json-server.herokuapp.com/potholes");
      const info = await rawData.json()
      const id = Device.brand + Device.manufacturer + Device.totalMemory;
      let i = 0;
      info.forEach(pothole => {
        if (pothole.hardwareId == id) {
          i++;
        }
      });
      const filteredItems = info.filter((item) => {
        return item.hardwareId == id
      })
      setbaches(i)
      setdata(filteredItems)
    }
    fetchEvents();
  }, [baches])

  const renderItem = ({ item }) => <Item title={item.title} updatedAt={item.updatedAt} lat={item.lat} lng={item.lng} />;
  let x = _retrieveData();
  console.log(x, "!!!!!!");
  return (
    <View style={styles.container}>
      <Text style={styles.title}>History</Text>
      <View style={styles.label}>
        <Text style={{ textAlign: "center", fontSize: 20 }}> Personal Potholes </Text>
        <Text></Text>
        <AwesomeButton
          backgroundColor="#57b07a"
          type="primary"
          width={250}
          textSize={30}
        >
          <Text style={{ color: 'white', fontSize: 30 }}>{baches}</Text>
        </AwesomeButton>
      </View>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View>
        <FlatList data={data1} renderItem={renderItem} />
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
  item: {
    backgroundColor: "#57b07a",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  label: {
    marginTop: 200,

  },
});
