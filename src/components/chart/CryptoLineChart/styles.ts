import { COLORS, FONTS } from '../../../constants/theme';
import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.blackPure,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  // Time Range Buttons
  timeRangeButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginLeft: 7,
    borderRadius: 5,
    borderWidth: 0.2,
    borderColor: COLORS.lightGraySecondary,
    elevation: 5,
  },
  timeRangeButtonText: {
    ...FONTS.body3,
    fontWeight: '700',
  },
  headerContainer: {
    flexDirection: 'row',
    height: 100,
    backgroundColor: COLORS.blackPure,
    padding: 5,
    paddingLeft: 15,
  },
  // Header
  headerContent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  headerText: {
    ...{ color: COLORS.white, fontWeight: '700' },
    ...FONTS.h1,
  },
  // Footer
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 40,
  },
  footerImage: {
    width: 60,
    height: 60,
    opacity: 0.9,
  },
  footerContent: {
    flexDirection: 'column',
  },
  footerText: {
    color: COLORS.white,
    fontWeight: '700',
    ...FONTS.h1,
  },
});
export default styles;
