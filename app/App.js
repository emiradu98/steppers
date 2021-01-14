import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {StatusBar} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {AppLoading} from './navigation/AppLoading';
import MainNavigator from './navigation/MainNavigator';
import configureStore from './helpers/store/configureStore';
import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import messaging from '@react-native-firebase/messaging';


async function onMessageReceived(message) {
    // Do something
}

messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);

const {store} = configureStore();
export const App = () => {
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const routeNameRef = React.useRef();
    const navigationRef = React.useRef();
    const loadingOptions = ['The other lad was eventually hit by a train.', 'One of the men told the other that he wants to do that as well',
        'After pointing at the man, he shouted whether he was a kami.'];

    useEffect(() => {
        async function requestUserPermission() {
            const authorizationStatus = await messaging().requestPermission();

            if (authorizationStatus) {
                console.log('Permission status:', authorizationStatus);
            }
        }
        requestUserPermission()
        crashlytics().log('App mounted.');
        setLoadingText(loadingOptions[Math.floor(Math.random() * loadingOptions.length)]);
        setProgress(progress => progress + 0.1);
        const interval = setInterval(() => {
            setProgress(progress => progress + 0.02);
        }, 100);
        const textInterval = setInterval(() => {
            setLoadingText(loadingOptions[Math.floor(Math.random() * loadingOptions.length)]);
        }, 3000);
        setTimeout(() => {
            clearInterval(interval);
            clearInterval(textInterval);
            setIsLoading(false);
        }, 1000);
        setTimeout(() => SplashScreen.hide(), 100);

    }, []);

    return (
        <NavigationContainer ref={navigationRef}
                             // onReady={() => routeNameRef.current = navigationRef.current.getCurrentRoute().name}
                             onStateChange={() => {
                                 const previousRouteName = routeNameRef.current;
                                 const currentRouteName = navigationRef.current.getCurrentRoute().name;
                                 if (previousRouteName !== currentRouteName) {
                                     analytics().logScreenView({
                                         screen_name: currentRouteName,
                                         screen_class: currentRouteName,
                                     });
                                 }
                                 routeNameRef.current = currentRouteName;
                             }}
        >
            <SafeAreaProvider>
                <Provider store={store}>
                    <StatusBar barStyle={'light-content'}/>
                    <AppLoading isLoading={isLoading} progress={progress} text={loadingText}/>
                    <MainNavigator/>
                </Provider>
            </SafeAreaProvider>
        </NavigationContainer>
    );
};


