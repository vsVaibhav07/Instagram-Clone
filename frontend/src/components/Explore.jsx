import { setSelectedUser } from '@/redux/authSlice';
import React from 'react'
import { useDispatch } from 'react-redux';

const Explore = () => {
    const dispatch=useDispatch();

  dispatch(setSelectedUser(null))
  return (
    <div>Explore</div>
  )
}

export default Explore