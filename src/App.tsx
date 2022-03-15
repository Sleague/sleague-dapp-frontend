import { Breadcrumb, Layout, Menu, PageHeader, Select } from 'antd'
import React, { useMemo } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import Assets from './pages/assets'
import AddGroup from './pages/add-group'
import styled from 'styled-components'
import { PlusSquareOutlined   } from '@ant-design/icons'
import Proposal from './pages/proposal'
import Group from './pages/group'

const { Sider, Content } = Layout
const { SubMenu } = Menu

const TopMenu = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 10px;
  width: 100%;
  .selection {
    display: flex;
    justify-content: space-around;
    width: 100%;
    align-items: center;
    
    .add-icon {
      font-size: 15px;
      cursor: pointer;
    }
    
    .ant-select {
      width: 80%;
    }
  }
  
  
`

type AppRouteBase = {
  key: string
  path: string

  title?: string
  hide?: boolean
}

type AppEndpointRoute = AppRouteBase & {
  component?: JSX.Element
}

type AppSubRoute = AppRouteBase & {
  children?: Array<AppRoute>
}

type AppRoute = AppSubRoute & AppEndpointRoute

const routes: AppRoute[] = [
  {
    key: 'crawlers',
    path: '/assets',
    title: 'Assets',
    component: <Assets />
  },
  {
    key: 'addGroup',
    path: '/add-group',
    component: <AddGroup />,
    hide: true
  },
  {
    key: 'group',
    path: '/group',
    title: 'Group',
    component: <Group />,
  },
  // {
  //   key: 'collection-detail',
  //   path: '/collections/:slug',
  //   component: <CollectionDetail />
  // },
  // {
  //   key: 'collection-detail',
  //   path: '/collections/:slug/asset/:assetPublicKey',
  //   component: <AssetDetail />
  // },
  // {
  //   key: 'node-accounts',
  //   path: '/api-key',
  //   component: <NodeAccountsPage />,
  //   title: 'Nodes API-KEY'
  // },
  {
    key: 'proposal',
    path: '/proposal',
    component: <Proposal />,
    title: 'Proposal'
  }
]

const App: React.FC = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const buildMenu = (route: AppRoute, parentPath?: string) => {
    const path = [parentPath, route.path].join('')

    const hasChildren = route.children && route.children.some(child => !!child.title)

    return (
      hasChildren ? (
        <SubMenu
          key={path}
          title={route.title}
        >
          {
            route.children?.map(childRoute => buildMenu(childRoute, path))
          }
        </SubMenu>
      ) : (
        <Menu.Item
          key={path}
          onClick={() => navigate(path)}
        >
          {route.title}
        </Menu.Item>
      )
    )
  }

  const buildRoute = (route: AppRoute) => {
    return (
      <Route
        key={route.path}
        path={route.path}
        element={route.component}
      >
        {
          route.children?.map(childRoute => buildRoute(childRoute))
        }
      </Route>
    )
  }

  const activeKey = useMemo(() => {
    return routes.find(route => {
      if (route.path === pathname || pathname.startsWith(route.path)) {
        return route
      }
    })?.path
  }, [pathname])

  return (
    <Layout>
      <Sider width={200} className="site-layout-background">
        <TopMenu>
          <div className="selection">
            <Select   />
            <PlusSquareOutlined className="add-icon" onClick={() => navigate('/add-group')} />
          </div>

        </TopMenu>
        <Menu
          mode="inline"
          activeKey={activeKey}
          style={{ height: '100%', borderRight: 0 }}
        >
          {
            routes
              .filter(route => !!route.title)
              .map(route => buildMenu(route))
          }
        </Menu>
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <PageHeader onBack={() => navigate(-1)} title={'Back'} />
        </Breadcrumb>
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          <Routes>
            {
              routes.map(route => buildRoute(route))
            }
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
