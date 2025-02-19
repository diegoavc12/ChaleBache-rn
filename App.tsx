import { StatusBar } from 'expo-status-bar';
import React, {useContext, useState, useEffect} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import Toast from 'react-native-toast-message';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
        <Toast />
      </SafeAreaProvider>
    );
  }
}
