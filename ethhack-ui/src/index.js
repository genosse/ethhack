import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import Root from './containers/Root'

import './i18n'
import i18next from 'i18next'
window.t = i18next.t.bind(i18next);

require('../css/reset.css');
require('../css/style.less');

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  )
}

render(Root)

if (module.hot) {
  module.hot.accept('./containers/Root', () => { render(Root) })
}
