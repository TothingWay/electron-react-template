import { memo } from 'react'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'

function Layout({ route }: RouteConfigComponentProps) {
  return renderRoutes(route?.routes)
}

export default memo(Layout)
