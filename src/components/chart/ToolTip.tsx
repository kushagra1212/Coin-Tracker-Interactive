import { memo } from 'react';
import { View, Text } from 'react-native';
import { FONTS } from '../../constants/theme';
type props = {
    value: number;
};

const ToolTip: React.FC<props> = memo(({ value }) => {
    return (
        <View
            style={{
                height: 30,
                left: -50,
                width: 100,
                borderRadius: 10,
                position: 'absolute',
                top: -50,
                zIndex: 20,
                elevation: 30,
                backgroundColor: 'rgba(0,0,0,0.5)',
            }}
        >
            <Text
                style={[
                    FONTS.h4,
                    { color: 'rgba(255,255,255,1)', textAlign: 'center', fontWeight: '800' },
                ]}
            >
                {value}
            </Text>
        </View>
    );
});

export default ToolTip;
