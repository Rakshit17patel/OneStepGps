import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ThemeContext} from '../../context/Theme';
import themeColors from '../../utils/themeColors';
import {scale} from '../../utils/scaling';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import ApiService from '../../utils/apiService';
import Search from '../../ui-components/Search/Search';
import {
  SaveData as StoreItem,
  RetrieveData as getItemData,
} from '../../utils/AsyncStorageHandeler';
import config from '../../utils/config';

const HomePage = () => {
  const {systemThemeMode, appColorTheme, setAppColorTheme} =
    useContext(ThemeContext);
  const colors =
    themeColors[
      appColorTheme == 'systemDefault' ? systemThemeMode : appColorTheme
    ];
  const [apiData, setApiData] = useState([]);
  const [filterApiData, setFilterApiData] = useState([]);
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchInitalLoadData();
    }, []),
  );

  const fetchInitalLoadData = async () => {
    setLoader(true);
    await fetchDevicesData();
    setLoader(false);
  };

  useEffect(() => {
    if (search?.trim()?.length > 0) {
      const filteredData = apiData.filter(device => {
        const deviceName = device?.display_name || '';
        return (
          deviceName?.toLowerCase()?.includes(search?.toLowerCase()) ||
          device?.device_id?.toLowerCase()?.includes(search?.toLowerCase()) ||
          device?.model?.toLowerCase()?.includes(search?.toLowerCase()) ||
          device?.latest_device_point?.device_state?.drive_status
            ?.toLowerCase()
            ?.includes(search?.toLowerCase()) ||
          device?.active_state?.toLowerCase()?.includes(search?.toLowerCase())
        );
      });
      setFilterApiData(filteredData);
    }
  }, [search]);

  const fetchDevicesData = async () => {
    try {
      let localData = await getItemData('apiData');
      let mergedData = [];
      const api = `${config.API_URL}/device?latest_point=true&api-key=${config.API_KEY}`;
      const response = await ApiService.get(api);

      if (localData && localData.length > 0) {
        mergedData = response?.result_list?.map(apiItem => {
          const localItem = localData.find(
            local => local.device_id === apiItem.device_id,
          );
          return localItem ? {...apiItem, ...localItem} : apiItem;
        });
      }

      const finalData =
        mergedData.length > 0 ? mergedData : response?.result_list || [];
      setApiData(finalData);
      setFilterApiData(finalData);
      setRefreshing(false);
      await StoreItem('apiData', JSON.stringify(finalData));
    } catch (error) {
      console.log('Error fetching devices:', error);
    }
  };

  const DeviceCard = ({device, index}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('DeviceDetails', {device, apiData})}
      style={[styles.card, {backgroundColor: colors?.cardBg}]}>
      <Text style={[styles.deviceName, {color: colors?.heading}]}>
        {device?.display_name} (#{index + 1})
      </Text>

      <View style={styles.deviceInfoContainer}>
        <Text style={[styles.deviceInfo, {color: colors?.heading}]}>
          Device ID: {device?.device_id}
        </Text>
        <Text style={[styles.deviceInfo, {color: colors?.heading}]}>
          Model: {device?.model}
        </Text>
        <Text style={[styles.deviceInfo, {color: colors?.heading}]}>
          Drive Status:{' '}
          {device?.latest_device_point?.device_state?.drive_status}
        </Text>
        <Text style={[styles.deviceInfo, {color: colors?.heading}]}>
          Drive Distance:{' '}
          {
            device?.latest_device_point?.device_state
              ?.drive_status_lat_lng_distance?.display
          }
        </Text>
        <Text style={[styles.deviceInfo, {color: colors?.heading}]}>
          Odometer:{' '}
          {device?.latest_device_point?.device_state?.odometer?.display}
        </Text>
      </View>

      <Text
        style={[
          styles.statusText,
          {
            color:
              device?.active_state === 'active'
                ? colors?.success
                : colors?.pending,
          },
        ]}>
        {device?.active_state}
      </Text>
    </TouchableOpacity>
  );

  let Logo = require('../../Assets/toolbar-logo.png');

  return (
    <View style={[styles.page, {backgroundColor: colors?.backgroundColor}]}>
      <View style={[styles.header, {backgroundColor: colors?.navColor}]}>
        <Image source={Logo} style={styles.logo} />
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            setAppColorTheme(
              (appColorTheme == 'systemDefault'
                ? systemThemeMode
                : appColorTheme) == 'light'
                ? 'dark'
                : 'light',
            );
          }}>
          <MaterialIcons
            style={[styles.themeIcon, {color: colors?.themeIcon}]}
            name={
              (appColorTheme == 'systemDefault'
                ? systemThemeMode
                : appColorTheme) == 'light'
                ? 'light-mode'
                : 'dark-mode'
            }
          />
        </TouchableOpacity>
      </View>

      {!loader && (
        <Search
          customStyle={{width: scale(340)}}
          setSearch={setSearch}
          search={search}
        />
      )}

      {!loader ? (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchDevicesData()}
            />
          }
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={[
            styles.container,
            {backgroundColor: colors?.backgroundColor},
          ]}>
          {filterApiData.map((device, index) => (
            <DeviceCard key={device.device_id} index={index} device={device} />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors?.appThemeSecondary} />
        </View>
      )}

      {filterApiData.length === 0 && !loader && (
        <View style={styles.noItemsView}>
          <Text style={styles.noItemsText}>No Items</Text>
        </View>
      )}
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(5),
    paddingHorizontal: scale(10),
  },
  logo: {
    height: scale(40),
    width: scale(150),
    resizeMode: 'contain',
  },
  themeIcon: {
    fontSize: scale(25),
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: scale(10),
    borderRadius: scale(10),
    marginVertical: scale(5),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    position: 'relative',
  },
  deviceName: {
    fontSize: scale(16),
    fontWeight: 'bold',
    marginBottom: scale(5),
  },
  deviceInfoContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  deviceInfo: {
    fontSize: scale(12),
    color: '#333',
    marginBottom: scale(3),
  },
  statusText: {
    fontSize: scale(14),
    fontWeight: 'bold',
    position: 'absolute',
    bottom: scale(8),
    right: scale(8),
  },
  noItemsView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scale(400),
  },
  noItemsText: {
    textAlign: 'center',
  },
});
