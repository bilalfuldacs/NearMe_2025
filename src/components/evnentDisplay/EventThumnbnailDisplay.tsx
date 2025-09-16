import React from 'react'
import EventCard from '../common/EventCard'
function EventThumnbnailDisplay({Image}: {Image: string}) {
  return (
    <div><EventCard Image={Image}/></div>
  )
}

export default EventThumnbnailDisplay