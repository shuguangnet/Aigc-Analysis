//控制页面访问权限

/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  console.log('currentUser',currentUser)
  return {
    canAdmin: currentUser && currentUser.userRole === 'admin',
  };
}
