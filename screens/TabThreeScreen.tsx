import * as React from "react";
import { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Image } from "react-native";
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

export default function Map() {

  const [data1, setdata] = useState([])

  useEffect(() => {
    const fetchEvents = async () => {
      const rawData = await fetch("https://chalebache-json-server.herokuapp.com/potholes");
      const info = await rawData.json()
      setdata(info)
    }
    fetchEvents();
  }, [])

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 20.6736,
          longitude: -103.344,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
      >
        {data1.map((marker, index) => {
          if (marker.type === "Automatic") {
            return (
              <Marker
                key={index}
                coordinate={{ latitude: marker.lat, longitude: marker.lng }}
                title={marker.id}
                description={marker.lastIncident}
              >
                <Image source={require('./imgs/chale3.png')} style={{ height: 35, width: 35 }} />
              </Marker>
            )

          } else {
            return (
              <Marker
                key={index}
                coordinate={{ latitude: marker.lat, longitude: marker.lng }}
                title={marker.id}
                description={marker.lastIncident}
              >
                <Image source={require('./imgs/chale2.png')} style={{ height: 35, width: 35 }} />
              </Marker>
            )
          }
        })}

      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});