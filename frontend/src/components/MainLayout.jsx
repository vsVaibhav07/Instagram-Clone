import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';
import { AlignJustify } from 'lucide-react';
import { useSelector } from 'react-redux';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {selectedUser}=useSelector((store) => store.auth);

  return (
    <div className="flex w-full min-h-screen bg-gray-50   relative">
    
      <button
        className={ `${selectedUser || isSidebarOpen ? "hidden" : ""} sm:hidden  h-10 fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow-md`}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <AlignJustify />
      </button>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-40 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0 sm:block`}
      >
        <LeftSidebar setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      {/* Main Content */}
      <div className="w-full sm:ml-64 p-4 h-screen overflow-y-scroll   ">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
