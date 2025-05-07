const colorsCollection = {
  primary: '#C4DAFE',
  white: '#FFFFFF',
  black: '#000000',
  whiteSmoke: '#f5f5f5',
  grey: 'grey',
  lightGrey: '#C4C7C5',

  appThemePrimary: '#28344B',
  appThemeSecondary: '#1ba6ff',

  success: '#6CC51D',
  favorite: '#ff4c4c',
  fail: '#F35E52',
  pending: '#FBBB00',

  pallateColor1: '#262626',
};

const light = {
  ...colorsCollection,
  heading: colorsCollection.black,
  cardBg: colorsCollection.white,
  backgroundColor: colorsCollection.whiteSmoke,
  navColor: colorsCollection.white,
  themeIcon: colorsCollection.appThemePrimary,
};

const dark = {
  ...colorsCollection,
  heading: colorsCollection.white,
  cardBg: colorsCollection.pallateColor1,
  backgroundColor: colorsCollection.black,
  navColor: colorsCollection.appThemePrimary,
  themeIcon: colorsCollection.white,
};

export default {light, dark, colorsCollection};
