import React, {useContext, useLayoutEffect, useRef, useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CustomMarker from '../../Assets/CustomMarker';
import {mapDarkMode} from '../../utils/mapDarkMode';
import {ThemeContext} from '../../context/Theme';
import themeColors from '../../utils/themeColors';
import {scale} from '../../utils/scaling';
import ApiService from '../../utils/apiService';
import {RetrieveData as getItemData} from '../../utils/AsyncStorageHandeler';
import config from '../../utils/config';

const DEFAULT_COORDINATES = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 40,
  longitudeDelta: 40,
};

export default function Track({route}) {
  const mapRef = useRef(null);
  const navigation = useNavigation();
  const {systemThemeMode, appColorTheme} = useContext(ThemeContext);
  const theme =
    themeColors[
      appColorTheme === 'systemDefault' ? systemThemeMode : appColorTheme
    ];

  const [apiData, setApiData] = useState([]);
  const [coordinates] = useState({
    latitude: route?.params?.latitude || DEFAULT_COORDINATES.latitude,
    longitude: route?.params?.longitude || DEFAULT_COORDINATES.longitude,
    latitudeDelta: DEFAULT_COORDINATES.latitudeDelta,
    longitudeDelta: DEFAULT_COORDINATES.longitudeDelta,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitleAlign: 'center',
      title: 'Tracking',
      headerStyle: {backgroundColor: theme.navColor},
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Ionicons
            name="arrow-back"
            style={[styles.backIcon, {color: theme.heading}]}
          />
        </TouchableOpacity>
      ),
    });
  }, [theme]);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const loadDevices = async () => {
        try {
          let enriched = [];
          const api = `${config.API_URL}/device?latest_point=true&api-key=${config.API_KEY}`;
          const response = await ApiService.get(api);
          const localData = await getItemData('apiData');
          if (localData && localData.length > 0) {
            enriched = response?.result_list?.map(apiItem => {
              const localItem = localData?.find(
                l => l.device_id === apiItem.device_id,
              );
              return localItem
                ? {
                    ...apiItem,
                    display_name: localItem?.display_name,
                    make: localItem?.make,
                    model: localItem?.model,
                    factory_id: localItem?.factory_id,
                  }
                : apiItem;
            });
          }

          if (isActive) {
            setApiData(
              enriched.length > 0 ? enriched : response?.result_list || [],
            );
          }
        } catch (e) {
          console.log('Map fetch error:', e);
        }
      };

      loadDevices();
      const intervalId = setInterval(loadDevices, 5000);
      return () => {
        clearInterval(intervalId);
        isActive = false;
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={coordinates}
        region={coordinates}
        customMapStyle={
          appColorTheme === 'systemDefault'
            ? systemThemeMode === 'dark'
              ? mapDarkMode
              : []
            : appColorTheme === 'dark'
            ? mapDarkMode
            : []
        }
        showsUserLocation
        showsMyLocationButton
        zoomEnabled
        rotateEnabled
        showsCompass
        showsBuildings
        zoomControlEnabled
        loadingEnabled
        loadingIndicatorColor={theme.appThemePrimary}
        mapType="standard">
        {apiData.map((device, index) => {
          const lat = device?.latest_device_point?.lat;
          const lng = device?.latest_device_point?.lng;

          if (typeof lat !== 'number' || typeof lng !== 'number') return null;

          return (
            <Marker
              key={device.device_id}
              coordinate={{latitude: lat, longitude: lng}}
              pinColor={theme.appThemeSecondary}
              tracksViewChanges={false}>
              <View style={styles.markerWrapper}>
                <CustomMarker
                  index={index}
                  width={40}
                  height={40}
                  status={
                    device?.latest_device_point?.device_state?.drive_status
                  }
                />

                <View style={styles.textWrapper}>
                  <Text style={styles.markerText}>{device.display_name}</Text>
                </View>
              </View>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  map: {height: '100%', width: '100%'},
  backButton: {padding: scale(10)},
  backIcon: {fontSize: scale(25), fontWeight: 'bold'},

  // NEW MARKER WRAPPER STYLES
  markerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
    maxWidth: 240,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  textWrapper: {
    marginLeft: 6,
    maxWidth: 160,
  },
  markerText: {
    fontSize: 12,
    color: '#000',
    flexWrap: 'wrap',
  },
});
