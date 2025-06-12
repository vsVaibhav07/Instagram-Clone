import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

const MainLayout = () => {
  return (
    <div className="flex w-full min-h-screen">
      {/* Sidebar */}
      <div className="hidden md:block md:w-64 fixed left-0 top-0 bottom-0">
        <LeftSidebar />
      </div>

      {/* Outlet */}
      <div className="flex-1 md:ml-64 w-full">
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout