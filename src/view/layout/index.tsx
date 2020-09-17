import React from 'react'
import { memo } from 'react'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'
import './index.scss'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { useLocation } from 'react-router-dom'

function Layout({ route }: RouteConfigComponentProps) {
  const location = useLocation()
  return (
    <div className="titlebar">
      <TransitionGroup>
        <CSSTransition
          key={location.pathname}
          timeout={500}
          classNames={'fade'}
          mountOnEnter={true}
          unmountOnExit={true}
          appear
        >
          {renderRoutes(route?.routes, null, {
            location,
          })}
        </CSSTransition>
      </TransitionGroup>
    </div>
  )
}

export default memo(Layout)
