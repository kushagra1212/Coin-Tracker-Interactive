import React from 'react';
import { Text, Touchable, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { SortBy } from '../../types';
import Icon from 'react-native-vector-icons/FontAwesome5';

type CoinListHeaderProps = {
  handleSortBy: ({ type, order }: SortBy) => void;
  type: SortBy['type'];
  order: SortBy['order'];
};

const CoinListHeader: React.FC<CoinListHeaderProps> = ({
  type,
  order,
  handleSortBy,
}) => {
  return (
    <View
      style={{
        height: 120,
        padding: 10,
        backgroundColor: COLORS.blackPure,
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Text style={[FONTS.h1, { color: COLORS.white, fontWeight: 'bold' }]}>
        Market
      </Text>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <Text style={[FONTS.h4, { color: COLORS.GrayPrimary, padding: 10 }]}>
          Sort By:
        </Text>
        <TouchableOpacity
          style={{
            borderRadius: 10,
            borderColor: type === 'lastPrice' ? COLORS.blackPure : COLORS.white,
            borderWidth: 1,
            marginLeft: 0,
            padding: 10,
            backgroundColor:
              type === 'lastPrice' ? COLORS.white : COLORS.blackPure,
          }}
          onPress={() => handleSortBy({ type: 'lastPrice', order: order })}
        >
          <Text
            style={[
              FONTS.h4,
              {
                fontWeight: '900',
                color: type === 'lastPrice' ? COLORS.blackPure : COLORS.white,
              },
            ]}
          >
            Last Price
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderRadius: 10,
            borderColor: type === 'volume' ? COLORS.blackPure : COLORS.white,
            borderWidth: 1,
            marginLeft: 20,
            padding: 10,
            backgroundColor:
              type === 'volume' ? COLORS.white : COLORS.blackPure,
          }}
          onPress={() => handleSortBy({ type: 'volume', order: order })}
        >
          <Text
            style={[
              FONTS.h4,
              {
                fontWeight: '900',
                color: type === 'volume' ? COLORS.blackPure : COLORS.white,
              },
            ]}
          >
            Volume
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginLeft: 20,
            borderColor:
              order === 'asc' ? COLORS.redPrimary : COLORS.greenPrimary,
            borderWidth: 0.2,
            borderRadius: 5,
            padding: 5,
            paddingLeft: 5,
            paddingRight: 5,
            backgroundColor: COLORS.blackPure,
          }}
          onPress={() =>
            handleSortBy({
              type: type,
              order: order === 'asc' ? 'desc' : 'asc',
            })
          }
        >
          <Icon
            name={order === 'asc' ? 'sort-amount-down' : 'sort-amount-up'}
            size={40}
            color={order === 'asc' ? COLORS.redPrimary : COLORS.greenPrimary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(CoinListHeader);
