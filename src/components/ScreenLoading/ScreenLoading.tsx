import { Spin, type SpinProps } from 'antd';
import React from 'react';

const ScreenLoading: React.FC<SpinProps> = props => {
  const _props = { fullscreen: true, tip: 'Loading...', props };
  return <Spin {..._props} />;
};

export default ScreenLoading;
