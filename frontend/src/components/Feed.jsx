import { useDispatch } from 'react-redux'
import Posts from './Posts'
import { setSelectedUser } from '@/redux/authSlice';

const Feed = () => {
  const dispatch=useDispatch();

  dispatch(setSelectedUser(null))
  return (

    <div className='w-full flex justify-center  align-middle xl:max-w-[72%]  '>
        <div className=' w-full lg:w-[60%] flex  sm:px-4 justify-center  '>
            <Posts/>
        </div>
    </div>
  )
}

export default Feed