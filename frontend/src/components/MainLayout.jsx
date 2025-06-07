import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

const MainLayout = () => {
  return (
    <>
    <div className='flex w-screen'>
         <div className="hidden md:block">
            <LeftSidebar/>
        </div>
        <div className='flex-1'>
            <Outlet />
        </div>
    </div>
       
    </>
  )
}

export default MainLayout