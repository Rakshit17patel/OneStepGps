/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {Platform, StatusBar, StyleSheet, useColorScheme} from 'react-native';

import {
  SaveData as StoreItem,
  RetrieveData as getItemData,
} from './src/utils/AsyncStorageHandeler';
import Theme from './src/utils/themeColors';
import SplashScreen from 'react-native-splash-screen';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeContext} from './src/context/Theme';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import NavigationServices from './src/utils/NavigationServices';
import Router from './src/routing/Router';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

function App(): React.JSX.Element {
  const [appColorTheme, setAppColorTheme] = useState('');
  const systemThemeMode = useColorScheme();
  const colors =
    Theme[appColorTheme === 'systemDefault' ? systemThemeMode : appColorTheme];

  useEffect(() => {
    checkThemeMode();
  }, []);

  useEffect(() => {
    assignThemeMode();
  }, [appColorTheme]);

  const checkThemeMode = async () => {
    let theme = await getItemData('theme');

    setAppColorTheme(theme);
    SplashScreen.hide();
  };

  const assignThemeMode = async () => {
    if (!appColorTheme) {
      let theme = 'systemDefault';
      setAppColorTheme(theme);
      await saveAppColorTheme(theme); // systemThemeMode
    } else {
      await saveAppColorTheme(appColorTheme);
    }
  };

  const saveAppColorTheme = async (value: any) => {
    await StoreItem('theme', JSON.stringify(value));
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBarStyle('light-content'); // Set the bar style if not working by default
      StatusBar.setBackgroundColor(colors?.appThemePrimary || '#000'); // Set the status bar color
    }
  }, []);

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors?.backgroundColor,
      text: colors?.heading,
    },
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors?.backgroundColor}}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{flex: 1}}>
          <StatusBar
            backgroundColor={colors?.appThemePrimary}
            translucent={false}
          />
          <ThemeContext.Provider
            value={{systemThemeMode, appColorTheme, setAppColorTheme}}>
            <NavigationContainer
              theme={navTheme}
              ref={ref => NavigationServices.setTopLevelNavigator(ref)}>
              <Router />
            </NavigationContainer>
          </ThemeContext.Provider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
