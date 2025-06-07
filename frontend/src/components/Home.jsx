import { Outlet } from 'react-router-dom';
import Feed from './Feed';
import RightSidebar from './RightSidebar';
import useGetAllPost from '@/hooks/useGetAllPosts';

const Home = () => {
useGetAllPost();

  return (
    <div className="flex w-full h-screen relative">
      <div className="flex-1 overflow-y-auto">
        <Feed />
        <Outlet/>
      </div>
      <div className="w-86 hidden xl:block fixed right-5 top-0 h-screen">
        <RightSidebar />
      </div>
    </div>
  );
}

export default Home;
