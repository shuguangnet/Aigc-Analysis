// 负责处理默认重定向
import { useEffect } from 'react';
import { useModel } from 'umi';
import { history } from '@@/core/history';
export default () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  
  useEffect(() => {
      if (currentUser) {
        // 获取用户角色，优先使用 currentUser.userRole
        const userRole = currentUser?.userRole || currentUser?.data?.userRole;
        // 根据用户角色重定向到不同页面
        history.push(userRole === 'user' ? '/add_chart' : '/home');
      
    } else {
      history.push('/user/login');
    }
  }, [currentUser]);

  return <div>Loading...</div>;
};
