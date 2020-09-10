import React from 'react'
import { renderRoutes } from 'react-router-config'
import routes from './routes'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
// const fs = window.require('fs')

function App() {
  return (
    <Provider store={store}>
      <HashRouter>{renderRoutes(routes)}</HashRouter>
    </Provider>
  )
}

export default App
