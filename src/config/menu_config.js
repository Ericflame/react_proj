import {
    AppstoreOutlined,
    BarChartOutlined,
    AreaChartOutlined,
    LineChartOutlined,
    PieChartOutlined,
    DesktopOutlined,
    ContainerOutlined,
    MailOutlined,
    UserOutlined
  } from '@ant-design/icons';
  
  const menuList = [
      {
        title: '首页', //菜单标题名称
        key: '/Admin/Home',  //对应的path
        icon: <DesktopOutlined />,  //图标名称
        isPublic: true,  //这是为公开的界面 所有用户都可以看到
        path:'Home'
      },
      {
        path:'prod_about',
        title: '商品', 
        key: '/prod_about',  
        icon: <AppstoreOutlined /> ,
        children: [  //子菜单列表
          {
            path:'Category',
            title: '品类管理', 
            key: '/Admin/prod_about/Category',  
            icon: <MailOutlined />  
          },
          {
            path:'Product',
            title: '商品管理', 
            key: '/Admin/prod_about/Product',  
            icon: <MailOutlined />  
          }
        ]
      },
      {
          path:'User',
          title: '用户管理', 
          key: '/Admin/User',  
          icon: <UserOutlined />,  
      },
      {
          path:'Role',
          title: '角色管理', 
          key: '/Admin/Role',  
          icon: <ContainerOutlined />,  
      },
      {
        path:'charts',
        title: '图形图表', 
        key: '/charts',  
        icon: <AreaChartOutlined />,
        children: [
          {
            path:'Bar',
            title: '柱形图',
            key: '/Admin/charts/Bar',
            icon: <BarChartOutlined />
          },
          {
            path:'Line',
            title: '折线图',
            key: '/Admin/charts/Line',
            icon:   <LineChartOutlined />
          },
          {
            path:'Pie',
            title: '饼型图',
            key: '/Admin/charts/Pie',
            icon: <PieChartOutlined />
          }
        ]  
    }
  ]
  
export default menuList