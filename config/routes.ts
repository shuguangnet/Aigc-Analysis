export default [
  {path: '/user',layout: false,routes: [
    { name: '登录', path: '/user/login', component: './User/Login' },
    { name: '注册', path: '/user/register', component: './User/Register' },
    { name :"权限引导",path: '/user/access',  component: './Access'},
  ]},
  {path:"/", redirect: "/user/access"},

  { path: '/home', name :"首页", icon: "PieChartOutlined", component: './HomePage',access: 'canAdmin', },
  // { path: '/access', name :"权限引导", icon: "PieChartOutlined", component: './Access',hidden: true},
  { path: '/add_chart', name :"智能分析", icon: "barChart", component: './AddChart' },
  { path: '/add_async', name: "异步分析", icon: "DotChartOutlined", component: './AddChartAsync' },
  { path: '/my_chart', name: "我的图表", icon: "PictureOutlined", component: './MyChart' },
  { path: '/code', name: "代码分析", icon: "GithubOutlined", component: './Code' },
  { path: '/report', name: "数据报告", icon: "commentOutlined", component: './Report' },
  { path: '/Forecast', name :"数据分析", icon: "ApiOutlined", component: './Forecast' },
  { path: '/open_platform', name :"开放中心", icon: "ApiOutlined", component: './OpenPlatform' },
  { path: '/forum', name: "交流论坛", icon: "CrownOutlined", component: './Forum' },
  { path: '/user/center', name: "个人中心", icon: "UserOutlined", component: './User/Info' },
  {
  path: '/forum',
  component: '@/pages/Forum',
  routes: [
    { path: '/forum', redirect: '/forum/list' },
    { path: '/forum/list', component: '@/pages/Forum/List' },
    { path: '/forum/detail/:id', component: '@/pages/Forum/Detail' },
    { path: '/forum/publish', component: '@/pages/Forum/Publish' },
  ],
},
  {
    path: '/admin',
    name: '后台管理',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name: '论坛管理', component: './Admin' },
      { path: '/admin/user-manage', name: '用户管理', component: './Admin_UserManage' },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
