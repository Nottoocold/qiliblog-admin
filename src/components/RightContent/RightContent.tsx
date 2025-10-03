import { Space } from 'antd';
import type React from 'react';
import ThemeSwitch from '../ThemeSwitch/ThemeSwitch';
import HeaderUserInfo from '../HeaderUserInfo/HeaderUserInfo';

const RightContent: React.FC = () => {
  return (
    <Space size={2} styles={{ item: { display: 'flex', alignContent: 'center' } }}>
      <ThemeSwitch />
      <HeaderUserInfo />
    </Space>
  );
};

export default RightContent;
