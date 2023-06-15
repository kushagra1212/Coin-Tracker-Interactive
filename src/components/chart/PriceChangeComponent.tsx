import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { COLORS, FONTS } from '../../constants/theme';
const PriceChangeComponent = React.memo(
    ({ formattedPriceDiffPercentage, icon, sign }: any) => {
        return (
            <View style={{ display: 'flex', marginTop: 5, flexDirection: 'row' }}>
                <Icon
                    name={icon}
                    size={20}
                    color={sign === '-' ? COLORS.redPrimary : COLORS.greenPrimary}
                    style={sign !== '-' ? { marginTop: 3 } : {}}
                />
                <Text
                    style={[
                        {
                            color: COLORS.white,
                            fontWeight: '700',
                        },
                        FONTS.body3,
                    ]}
                >
                    {' ' + sign}
                    {formattedPriceDiffPercentage}
                </Text>
            </View>
        );
    }
);

export default PriceChangeComponent;