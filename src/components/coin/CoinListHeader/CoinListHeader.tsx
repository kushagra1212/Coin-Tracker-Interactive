import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../constants/theme';
import { SortBy } from '../../../types';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './styles';

type CoinListHeaderProps = {
  handleSortBy: ({ type, order }: SortBy) => void;
  type: SortBy['type'];
  order: SortBy['order'];
};

const CoinListHeader: React.FC<CoinListHeaderProps> = React.memo(
  ({ type, order, handleSortBy }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Market</Text>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Text style={styles.sortByText}>Sort By:</Text>
          <TouchableOpacity
            style={[
              styles.sortByButton,
              {
                borderColor:
                  type === 'lastPrice' ? COLORS.blackPure : COLORS.white,
                backgroundColor:
                  type === 'lastPrice' ? COLORS.white : COLORS.blackPure,
              },
            ]}
            onPress={() => handleSortBy({ type: 'lastPrice', order })}
          >
            <Text
              style={[
                styles.sortByButtonText,
                {
                  color: type === 'lastPrice' ? COLORS.blackPure : COLORS.white,
                },
              ]}
            >
              Last Price
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortByButton,
              {
                borderColor:
                  type === 'volume' ? COLORS.blackPure : COLORS.white,
                backgroundColor:
                  type === 'volume' ? COLORS.white : COLORS.blackPure,
                marginLeft: 20,
              },
            ]}
            onPress={() => handleSortBy({ type: 'volume', order })}
          >
            <Text
              style={[
                styles.sortByButtonText,
                {
                  color: type === 'volume' ? COLORS.blackPure : COLORS.white,
                },
              ]}
            >
              Volume
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortIconContainer,
              {
                borderColor:
                  order === 'asc' ? COLORS.redPrimary : COLORS.greenPrimary,
              },
            ]}
            onPress={() =>
              handleSortBy({
                type,
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
  }
);

export default CoinListHeader;
