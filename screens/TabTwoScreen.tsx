import * as React from 'react';
import { FlatList, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

export default function TabTwoScreen() {
  const renderItem = ({ item }) => (
    <Item title={item.title} />
  );
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {/* <EditScreenInfo path="/screens/TabTwoScreen.tsx" /> */}
      <View>
        <FlatList data={DATA} renderItem={renderItem}/>
      </View>
    </View>
  );
}

const DATA = [
  {
    id: '1',
    title: 'Isaac Madera',
  },
  {
    id: '2',
    title: 'Clemente Kadar rodriguez',
  },
  {
    id: '3',
    title: 'Guillermina Mena',
  },
  {
    id: '4',
    title: 'Renata Griego',
  },
  {
    id: '5',
    title: 'Alan Cruz',
  },
  {
    id: '6',
    title: 'Saúl Urbina',
  },
  {
    id: '7',
    title: 'Daniel Velázquez',
  },
  {
    id: '8',
    title: 'Adolfo Miclaco',
  },
  {
    id: '9',
    title: 'Adolfo Miclaco',
  },
  {
    id: '10',
    title: 'Luis Delgado',
  },
  {
    id: '11',
    title: 'Paola Velazquez',
  },
  {
    id: '12',
    title: 'Bernardo Pérez',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});
