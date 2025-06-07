import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Signup from './components/Signup'
import MainLayout from './components/MainLayout'
import Home from './components/Home'
import Login from './components/Login'
import Profile from './components/Profile'
import Search from './components/Search'
import Explore from './components/Explore'
import Messages from './components/Messages'
import Notifications from './components/Notifications'
import CreatePost from './components/CreatePost'


const browserRouter=createBrowserRouter([
  {
    path: '/',
    element: <MainLayout/>,
    children:[
      {
        path: '/',
        element:<Home/> 
      },
      {
        path: '/profile',
        element:<Profile/>
      },
      {
        path: '/search',
        element:<Search/>
      },
      {
        path: '/explore',
        element:<Explore/>
      },
      {
        path: '/messages',
        element:<Messages/>
      },
      {
        path: '/notifications',
        element:<Notifications/>
      },
      {
        path: '/createPost',
        element:<CreatePost/>
      }
    ]
  },
  {
    path: '/signup',
    element: <Signup/>
  },
  {
    path:'/login',
    element:<Login/>
  }
])


function App()  {
 

  return (
   <>
    <div >
      <RouterProvider router={browserRouter} />
    </div>
   </>
  )
}

export default App
