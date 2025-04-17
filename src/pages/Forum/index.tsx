import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Outlet } from '@umijs/max';

const ForumLayout: React.FC = () => {
  return (
    <PageContainer>
      <Outlet />
    </PageContainer>
  );
};

export default ForumLayout;