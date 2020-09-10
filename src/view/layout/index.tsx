import React from 'react'
import { memo } from 'react'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'
import './index.scss'

function Layout({ route }: RouteConfigComponentProps) {
  return <div className="titlebar">{renderRoutes(route?.routes)}</div>
}

export default memo(Layout)
