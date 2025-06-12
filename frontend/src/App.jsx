import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signup from './components/Signup';
import MainLayout from './components/MainLayout';
import Home from './components/Home';
import Login from './components/Login';
import Profile from './components/Profile';
import Search from './components/Search';
import Explore from './components/Explore';
import Messages from './components/Messages';
import Notifications from './components/Notifications';
import CreatePost from './components/CreatePost';
import EditProfile from './components/EditProfile';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from './redux/socketSlice';
import { setOnlineUsers } from './redux/chatSlice';
import { useEffect, useRef } from 'react';
import { setLikeNotification } from './redux/RTNSlice';
import ProtectedRoute from './components/ProtectedRoute';

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute><MainLayout /></ProtectedRoute> ,
    children: [
     
      { path: '/', element:<ProtectedRoute><Home /></ProtectedRoute>  },
      { path: '/profile/:id', element:<ProtectedRoute><Profile /></ProtectedRoute>  },
      { path: '/search', element:<ProtectedRoute><Search /></ProtectedRoute>  },
      { path: '/explore', element:<ProtectedRoute><Explore /> </ProtectedRoute> },
      { path: '/messages', element:<ProtectedRoute><Messages /></ProtectedRoute>  },
      { path: '/notifications', element: <ProtectedRoute><Notifications /></ProtectedRoute> },
      { path: '/createPost', element:<ProtectedRoute><CreatePost /></ProtectedRoute>},
      { path: '/account/edit', element:<ProtectedRoute><EditProfile /> </ProtectedRoute> },
       { path: '*', element:<ProtectedRoute><Home /></ProtectedRoute>  },
    ]
  },
  { path: '/signup', element: <Signup /> },
  { path: '/login', element: <Login /> },
  { path: '*', element: <ProtectedRoute><MainLayout /></ProtectedRoute> }
]);

function App() {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const socketRef = useRef(null); // ✅ Keep reference across re-renders

  useEffect(() => {
    if (user && !socketRef.current) {
      const socketIo = io('http://localhost:8000', {
        query: { userId: user._id },
        transports: ['websocket'],
      });

      socketRef.current = socketIo;

      dispatch(setSocket(socketIo));

       socketIo.on('connect', () => {
      
    });

      socketIo.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketIo.on('notification',(notification)=>{
        
        dispatch(setLikeNotification(notification));
      })
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        dispatch(setSocket(null));
        socketRef.current = null;
      }
    };
  }, [user, dispatch]);

  return (
    <div>
      <RouterProvider router={browserRouter} />
    </div>
  );
}

export default App;
