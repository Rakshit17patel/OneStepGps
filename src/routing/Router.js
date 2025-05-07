import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useContext, useEffect} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Theme from '../utils/themeColors';
import {scale} from '../utils/scaling';
import {useNavigation} from '@react-navigation/native';
import {ThemeContext} from '../context/Theme';
import getScreenBuilder from './ScreenRegistry';

const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function Router() {
  const {systemThemeMode, appColorTheme} = useContext(ThemeContext);
  const appTheme =
    Theme[appColorTheme == 'systemDefault' ? systemThemeMode : appColorTheme];
  const navigationObj = useNavigation();

  useEffect(() => {
    navigationObj.navigate('Home');
  }, []);

  // This is the stack navigator for the DeviceDetailsPage
  const HomePageStack = () => {
    return (
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerMode: 'screen',
        }}>
        <Stack.Screen
          key="Home"
          name="Home"
          component={getScreenBuilder(`HomePage`)()}
          options={{headerShown: false}}
        />
        {/* <Stack.Screen key="Home" name="Home" component={HomePage} options={{headerShown: false }} /> */}
        <Stack.Screen
          key="DeviceDetails"
          name="DeviceDetails"
          component={getScreenBuilder('DeviceDetailsPage')()}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  };

  return (
    <BottomTab.Navigator
      initialRouteName={'Home'}
      // tabBarOptions={{
      // }}
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: scale(12),
          marginBottom: scale(5),
          color: appTheme?.white,
        },
        tabBarStyle: {
          height: scale(60),
          padding: scale(10),
          backgroundColor: appTheme?.appThemePrimary,
        },
        keyboardHidesTabBar: true,
        headerShown: false,
        tabBarShowLabel: true, //hide the labels of bootm tab bar
        tabBarActiveTintColor: appTheme?.appThemePrimary,
      }}>
      <BottomTab.Screen
        name="Home"
        // getScreenBuilder(`DeviceDetailsPage`)
        component={HomePageStack}
        options={{
          // tabBarShowLabel:true,
          tabBarIcon: ({focused, color}) => (
            <TouchableOpacity
              activeOpacity={0.5}
              style={{flexDirection: 'column', alignItems: 'center'}}>
              <MaterialCommunityIcons
                name={'home'}
                style={{
                  fontSize: scale(25),
                  fontWeight: 'bold',
                  color: focused
                    ? appTheme?.appThemeSecondary
                    : appTheme?.white,
                }}
                color={appTheme?.white}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <BottomTab.Screen
        name="Track"
        component={getScreenBuilder('MapView')()}
        options={{
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({focused}) => (
            <TouchableOpacity
              activeOpacity={0.5}
              style={{flexDirection: 'column', alignItems: 'center'}}>
              <MaterialCommunityIcons
                name={'map-marker-multiple'}
                style={{
                  fontSize: scale(25),
                  fontWeight: 'bold',
                  color: focused
                    ? appTheme?.appThemeSecondary
                    : appTheme?.white,
                }}
                color={appTheme?.white}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
