import React, { lazy, Suspense } from 'react'
import { Redirect } from 'react-router'
import Layout from '../view/layout'

const SuspenseComponent = (
  Component: React.LazyExoticComponent<React.MemoExoticComponent<any>>,
) => (props: any) => {
  return (
    <Suspense fallback={null}>
      <Component {...props}></Component>
    </Suspense>
  )
}

const Login = lazy(() => import('../view/login/'))
const Main = lazy(() => import('../view/main/'))
const Order = lazy(() => import('../view/order/'))
const OrderDetail = lazy(() => import('../view/orderDetail/'))

export default [
  {
    path: '/',
    component: Layout,
    routes: [
      {
        path: '/',
        exact: true,
        render: () => <Redirect to={'/login'} />,
      },
      {
        path: '/login',
        component: SuspenseComponent(Login),
        key: 'login',
      },
      {
        path: '/main',
        component: SuspenseComponent(Main),
        key: 'main',
      },
      {
        path: '/order',
        component: SuspenseComponent(Order),
        key: 'order',
      },
      {
        path: '/orderDetail',
        component: SuspenseComponent(OrderDetail),
        key: 'orderDetail',
      },
    ],
  },
]
