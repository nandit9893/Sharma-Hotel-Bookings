import React from 'react'
import { useParams } from 'react-router-dom'

const UpdateRoomData = () => {
    const {roomID, hotelID} = useParams();
    console.log(hotelID, roomID)
  return (
    <div>

    </div>
  )
}

export default UpdateRoomData