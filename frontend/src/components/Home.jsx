import { Outlet } from 'react-router-dom';
import Feed from './Feed';
import RightSidebar from './RightSidebar';
import useGetAllPost from '@/hooks/useGetAllPosts';
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers';

const Home = () => {
useGetAllPost();
useGetSuggestedUsers();

  return (
    <div className="flex w-full h-[calc(92vh)] relative">
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
