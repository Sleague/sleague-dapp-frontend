import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

import 'antd/dist/antd.dark.css'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { RefreshControllerProvider } from './contexts/refresh-controller'

const queryClient = new QueryClient({})

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <RefreshControllerProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RefreshControllerProvider>
  </QueryClientProvider>
  , document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
