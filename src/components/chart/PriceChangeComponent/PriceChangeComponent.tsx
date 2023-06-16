import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { COLORS, FONTS } from '../../../constants/theme';
const PriceChangeComponent = React.memo(
  ({ formattedPriceDiffPercentage, icon, sign }: any) => {
    return (
      <View style={styles.container}>
        <Icon
          name={icon}
          size={20}
          color={sign === '-' ? COLORS.redPrimary : COLORS.greenPrimary}
          style={sign !== '-' ? styles.iconMargin : null}
        />
        <Text style={styles.text}>
          {' ' + sign}
          {formattedPriceDiffPercentage}
        </Text>
      </View>
    );
  }
);

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

export default PriceChangeComponent;

