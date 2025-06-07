import Posts from './Posts'

const Feed = () => {
  return (
    <div className='w-full flex justify-center align-middle xl:max-w-[72%]'>
        <div className=' w-[90%] lg:w-[60%] flex  px-2 sm:px-4 justify-center '>
            <Posts/>
        </div>
    </div>
  )
}

export default Feed