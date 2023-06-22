import React, { Ref, useImperativeHandle, useEffect } from 'react';
import { COLORS } from '../../constants/theme';
import { SafeAreaView, Text } from 'react-native';
type Props = {};
export interface IRef {
  timeToRenderHandler: (timeToRender: string | undefined) => void;
}
const PerformanceComponent = React.forwardRef(({}, ref: Ref<IRef>) => {
  const [timeToRender, setTimeToRender] = React.useState<string | undefined>(
    undefined
  );
  const timeToRenderHandler = (timeToRender: string | undefined) => {
    setTimeToRender(timeToRender);
  };
  useImperativeHandle(ref, () => ({
    timeToRenderHandler,
  }));

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTimeToRender(undefined);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [timeToRender]);
  if (!timeToRender) return null;
  return (
    <SafeAreaView
      style={{
        position: 'absolute',
        zIndex: 100,
        height: 50,
        width: 200,
        right: 0,
      }}
    >
      <Text style={{ color: COLORS.white, fontWeight: '800' }}>
        Render Time{' '}
        <Text style={{ color: COLORS.greenPrimary }}>{timeToRender}</Text>
      </Text>
    </SafeAreaView>
  );
});

export default PerformanceComponent;
