import { StyleSheet, Dimensions } from 'react-native';
const styles = StyleSheet.create({
  toolTipContainer: {
    position: 'absolute',
    zIndex: 100,
    width: 2,
    backgroundColor: 'rgba(255,0,0,1)',
    left: 60,
  },
  toolTipValue: {
    position: 'absolute',
    height: 15,
    width: 15,
    right: 0,
    left: -6,
    borderRadius: 30,
    backgroundColor: 'white',
    top: -5,
    zIndex: 10,
  },
  invisibleBackground: {
    height: Dimensions.get('screen').height,
    top: -400,
    zIndex: 100,
    width: 30,
    right: -15,
    backgroundColor: 'white',
    opacity: 0,
    position: 'absolute',
  },
});

export default styles;
