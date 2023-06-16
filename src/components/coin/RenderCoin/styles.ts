import { COLORS, FONTS } from '../../../constants/theme';
import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.blackPure,
    height: 100,
    padding: 10,
    paddingRight: 0,
    marginTop: 5,
    borderRadius: 10,
  },
  coinImage: {
    width: 60,
    height: 60,
    opacity: 0.8,
    borderRadius: 50,
  },
  coinInfoContainer: {
    width: 100,
  },
  coinSymbol: {
    ...FONTS.h4,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  coinName: {
    ...FONTS.h4,
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
    opacity: 0.8,
    textAlign: 'left',
  },
  priceInfoContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: 200,
  },
  priceText: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});
export default styles;
