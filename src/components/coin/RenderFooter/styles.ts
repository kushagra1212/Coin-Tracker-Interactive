import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../../constants/theme';
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: -20,
  },
  reachedEndContainer: {
    display: 'flex',
    height: 30,
    position: 'absolute',
    backgroundColor: COLORS.black,
    width: '100%',
    elevation: 30,
  },
  reachedEndText: {
    color: COLORS.GrayPrimary,
    textAlign: 'center',
    fontWeight: 'bold',
    opacity: 0.6,
  },
});

export default styles;
