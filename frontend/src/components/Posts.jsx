import { useSelector } from 'react-redux'
import Post from './Post'


const Posts = () => {
const {posts}=useSelector(store=>store.post);

  return (
    <div className="w-full sm:w-[90%]  md:w-full space-y-4 md:space-y-6">
        {
            posts.map((post)=> <Post key={post._id} post={post}/>)
        }
    </div>
  )
}

export default Posts