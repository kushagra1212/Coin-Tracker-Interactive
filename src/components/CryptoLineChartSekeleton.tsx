import { View, Dimensions } from 'react-native';
import SkeletonLoader from './SkeletonLoader';
import { FlatList } from 'react-native';
import LineGraphSkeleton from './LineChartSekeleton';
import { COLORS } from '../constants/theme';
import { TIME_RANGE_LIST } from '../utils';

const CryptoLineGraphSekeleton = () => {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.blackPure }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: 100,
          backgroundColor: COLORS.blackPure,
          padding: 5,
          marginTop: 10,
          paddingLeft: 15,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}
        >
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}
      >
        <FlatList
          data={TIME_RANGE_LIST}
          renderItem={({ item }) => (
            <View
              style={{
                marginHorizontal: 15,
                marginLeft: 7,
                borderColor: COLORS.lightGraySecondary,
                elevation: 5,
                height: 30,
                marginTop: 10,
              }}
            >
              <SkeletonLoader height={40} width={100} />
            </View>
          )}
          keyExtractor={(item) => item.value.toString()}
          horizontal
          style={{ marginBottom: 10 }}
        />
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          marginVertical: 50,
        }}
      >
        <View style={{ height: 60, width: 60 }}>
          <SkeletonLoader height={60} width={60} roundness={30} />
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <SkeletonLoader height={40} width={150} />
          <View style={{ height: 20, marginTop: 10 }}>
            <SkeletonLoader height={20} width={120} roundness={4} />
          </View>
        </View>
      </View>
    </View>
  );
};
export default CryptoLineGraphSekeleton;
