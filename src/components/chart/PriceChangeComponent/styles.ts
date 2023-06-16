import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../../constants/theme';
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    marginTop: 5,
    flexDirection: 'row',
  },
  iconMargin: {
    marginTop: 3,
  },
  text: {
    color: COLORS.white,
    fontWeight: '700',
    ...FONTS.body3,
  },
});

export default styles;
