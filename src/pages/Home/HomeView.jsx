import React from 'react'
import ListMovie from '../../components/Home/ListMovie'
import HeroVideo from '../../components/HeroVidio'
import ListNowPlaying from '../../components/Home/ListNowPlaying'
import ListSerie from '../../components/Home/ListSerie'
import ListTrending from '../../components/Home/ListTrending'

const HomeView = () => {
  return (
    <div>
      <HeroVideo />
      <ListMovie />
      <ListSerie />
      <ListTrending />
      <ListNowPlaying />
    </div>
  )
}

export default HomeView