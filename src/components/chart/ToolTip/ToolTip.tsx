import { memo } from 'react';
import { View, Text } from 'react-native';
import { FONTS } from '../../../constants/theme';
type props = {
  value: number;
};
import { StyleSheet } from 'react-native';
import styles from './styles';
const ToolTip: React.FC<props> = memo(({ value }) => {
  return (
    <View style={styles.toolTipContainer}>
      <Text style={styles.toolTipText}>{value}</Text>
    </View>
  );
});


export default ToolTip;
