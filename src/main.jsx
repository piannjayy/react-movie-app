import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { Provider } from 'react-redux'
import store from './store'
import { SoundProvider } from './context/SoundContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <SoundProvider>
          <BrowserRouter>
            <Navbar />
            <App />
          </BrowserRouter>
        </SoundProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
