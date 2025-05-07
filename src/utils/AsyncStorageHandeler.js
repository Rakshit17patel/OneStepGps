import AsyncStorage from '@react-native-async-storage/async-storage';

// Save data
export const SaveData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    //console.log('Error saving data:', error);
  }
};
export const RemoveData = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    //console.log('Error saving data:', error);
  }
};

// Retrieve data
export const RetrieveData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    // //console.log("🚀 ~ RetrieveData ~ value: ", key, value)
    //
    if (value !== null) {
      return JSON.parse(value);
    } else {
      //
      return null;
    }
  } catch (error) {
    //console.log('Error retrieving data:', error);
    return null;
  }
};

export const ClearAllData = async () => {
  try {
    await AsyncStorage.clear();
    return null;
  } catch (error) {
    //console.log('Error retrieving data:', error);
    return null;
  }
};
export const RemoveAllItems = async () => {
  try {
    // Get all keys in AsyncStorage
    const keys = await AsyncStorage.getAllKeys();

    // Use Promise.all() to delete all items asynchronously
    await Promise.all(
      keys.map(async key => await AsyncStorage.removeItem(key)),
    );
  } catch (error) {
    //console.log('Error removing items from AsyncStorage:', error);
  }
};

// ['locationInfo','addressInfo','loginInfo','notificationsAccess','remeberLoginInfo','isLocationServicable','premiumMembershipMessage','allCustomerTypes','defaultCustomerType']
