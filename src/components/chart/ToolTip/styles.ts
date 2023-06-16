import { StyleSheet } from 'react-native';
import { FONTS } from '../../../constants/theme';
const styles = StyleSheet.create({
  toolTipContainer: {
    height: 30,
    left: -50,
    width: 100,
    borderRadius: 10,
    position: 'absolute',
    top: -50,
    zIndex: 20,
    elevation: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  toolTipText: {
    ...FONTS.h4,
    color: 'rgba(255,255,255,1)',
    textAlign: 'center',
    fontWeight: '800',
  },
});

export default styles;