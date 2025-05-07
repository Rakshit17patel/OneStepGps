import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;
const scale = size => (width / guidelineBaseWidth) * size;
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;
const itemWidthInRow = columns => {
  const marginWidth = scale(10) * (columns + 1); // Adjust margin between items
  const itemWidth = (width - marginWidth) / columns;
  return itemWidth;
};
export {scale, verticalScale, moderateScale, itemWidthInRow};
