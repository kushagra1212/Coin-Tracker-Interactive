import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../../constants/theme';
const styles = StyleSheet.create({
  container: {
    height: 120,
    padding: 10,
    backgroundColor: COLORS.blackPure,
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    ...FONTS.h1,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  sortByText: {
    ...FONTS.h4,
    color: COLORS.GrayPrimary,
    padding: 10,
  },
  sortByButton: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
  },
  sortByButtonText: {
    ...FONTS.h4,
    fontWeight: '900',
  },
  sortIconContainer: {
    marginLeft: 20,
    borderWidth: 0.2,
    borderRadius: 5,
    padding: 5,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: COLORS.blackPure,
  },
});
export default styles;
