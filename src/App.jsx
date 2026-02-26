import React from 'react'
import './App.css'
import { Route, Router, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home/Home'
import { Provider } from 'react-redux'
import store from './store'
import Search from './pages/Search/Search'
import Favorite from './pages/Favorite/Favorite'
import DetailMovie from './pages/Detail/DetailMovie/DetailMovie'
import DetailTrending from './pages/Detail/DetailTrending/DetailTrending'
import DetailSeries from './pages/Detail/DetailSeries/DetailSeries'
import Footer from './components/Footer'
import { SoundProvider } from './context/SoundContext'

function App() {
  const location = useLocation();

  console.log(location)

  return (
    <SoundProvider>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<DetailMovie />} />
          <Route path="/trending/:media_type/:id" element={<DetailTrending />} />
          <Route path="/movie/:id" element={<DetailMovie key={window.location.pathname} />} />
          <Route path="/trending/:media_type/:id" element={<DetailTrending key={window.location.pathname} />} />
          <Route path="/series/:id" element={<DetailSeries key={window.location.pathname} />} />
          <Route path="/series/:id" element={<DetailSeries />} />
          <Route path="/Search" element={<Search />} />
          <Route path="/Favorite" element={<Favorite />} />
        </Routes>
        <Footer />
      </Provider>
    </SoundProvider>
  )
}

export default App
