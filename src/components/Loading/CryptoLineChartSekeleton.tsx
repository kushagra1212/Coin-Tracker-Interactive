import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import SkeletonLoader from './SkeletonLoader';
import { FlatList } from 'react-native';
import LineGraphSkeleton from './LineChartSekeleton';
import { COLORS } from '../../constants/theme';
import { TIME_RANGE_LIST } from '../../utils';

const CryptoLineGraphSekeleton = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <SkeletonLoader height={50} width={300} />
          <SkeletonLoader height={20} width={200} roundness={4} />
        </View>
      </View>
      <LineGraphSkeleton
        width={Dimensions.get('window').width}
        height={500}
        duration={500}
        lineColor={`rgba(255, 40, 40, 0.3)`}
      />
      <View style={styles.timeRangeContainer}>
        <FlatList
          data={TIME_RANGE_LIST}
          renderItem={({ item }) => (
            <View style={styles.timeRangeItem}>
              <SkeletonLoader height={40} width={100} />
            </View>
          )}
          keyExtractor={(item) => item.value.toString()}
          horizontal
          style={styles.timeRangeList}
        />
      </View>
      <View style={styles.footerContainer}>
        <View style={styles.footerContent}>
          <View style={styles.footerIcon}>
            <SkeletonLoader height={60} width={60} roundness={30} />
          </View>
          <View style={styles.footerText}>
            <SkeletonLoader height={40} width={150} />
            <View style={styles.footerSubText}>
              <SkeletonLoader height={20} width={120} roundness={4} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.blackPure,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: 100,
    backgroundColor: COLORS.blackPure,
    padding: 5,
    marginTop: 10,
    paddingLeft: 15,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  timeRangeItem: {
    marginHorizontal: 15,
    marginLeft: 7,
    borderColor: COLORS.lightGraySecondary,
    elevation: 5,
    height: 30,
    marginTop: 10,
  },
  timeRangeList: {
    marginBottom: 10,
  },
  footerContainer: {
    marginVertical: 50,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
      justifyContent: 'space-around',
  },
  footerIcon: {
    height: 60,
    width: 60,
  },
  footerText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  footerSubText: {
    height: 20,
    marginTop: 10,
  },
});

export default CryptoLineGraphSekeleton;
