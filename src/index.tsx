import React from 'react'
import ReactDOM from 'react-dom'
import Main from './pages/Main/main'
import './styles/index.scss'

import '../node_modules/@ionic/core/css/structure.css'
import '../node_modules/@ionic/core/css/text-alignment.css'
import './styles/roboto.scss'

ReactDOM.render(<Main />, document.querySelector('#root'))
