import {ActivityIndicator, View, } from 'react-native'
import React, { useContext } from 'react'
import Theme from '../utils/themeColors';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/Theme';

const AppLoader = ({ navigation }) => {
  const { systemThemeMode,appColorTheme, setAppColorTheme} = useContext(ThemeContext)
  const currentTheme = Theme[appColorTheme=='systemDefault'?systemThemeMode:appColorTheme];
  const navigationObj = useNavigation();

  useFocusEffect(React.useCallback(() => {
    onAppLoaded()
    return (()=>{})
  },[]))

  const onAppLoaded = ()=>{
    // On app loaded we can make some authentication process over here and then load the next screens
    navigationObj.navigate("HomePage")
  }



  return (
    <>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator
          size="large"
          color={currentTheme?.white}
          style={{ backgroundColor: 'transparent' }}
        />
      </View>
    </>
  )
}

export default AppLoader
