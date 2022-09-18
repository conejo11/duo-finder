
import { StatusBar } from 'react-native';
import { Background } from './src/components/Background';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold, Inter_900Black } from '@expo-google-fonts/inter';
import { Loading } from './src/components/Loading';
import { Routes } from './src/routes';
import * as Notifications from 'expo-notifications';
import './src/service/notificationConfigs'
import {getPushNotificationToken} from './src/service/getPushNotificationToken'
import { useEffect, useRef } from 'react';
import { Subscription } from 'expo-modules-core';

export default function App() {
  const getNotificationListener = useRef<Subscription>()
  const responseNotificationListener = useRef<Subscription>()
  const [fontsLoaded] = useFonts({
    Inter_400Regular, 
    Inter_600SemiBold, 
    Inter_700Bold, 
    Inter_900Black
  })

  useEffect(() => {
    getPushNotificationToken()
  }, []);

  useEffect(() => {
    getNotificationListener.current = Notifications
      .addNotificationReceivedListener(notif => console.log(notif))
    responseNotificationListener.current = Notifications
      .addNotificationResponseReceivedListener(res => console.log(res))
    
    return () => {
      if (getNotificationListener.current && responseNotificationListener.current) {
        Notifications.removeNotificationSubscription(getNotificationListener.current)
        Notifications.removeNotificationSubscription(responseNotificationListener.current)
      }
    }
  }, []); 


  return (
    <Background>
      <StatusBar 
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      {fontsLoaded ? <Routes/> : <Loading/>}
    </Background>
  )
}
