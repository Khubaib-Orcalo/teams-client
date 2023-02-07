import { useEffect, useState } from 'react'
import socket from './socket'
import './App.css'
import Chat from './components/Chat'
import Login from './components/Login'
import Sidebar from './components/Sidebar'
import { users } from './data/users'

function App() {
  const [login, setLogin] = useState(true)
  const [creds, setCreds] = useState<any>({ username: '', password: '' })
  const [loggedInUser, setLoggedInUser] = useState<any>({})
  const [onlineUsers, setOnlineUsers] = useState<any>([])

  useEffect(() => {
    socket.emit('getOnlineUsers', () => {
      console.log('get online and offline users')
    })
  
    socket.on('onlineUsers', (payload: any) => {
      console.log(payload)
      setOnlineUsers(payload.onlineUsers)
    })
  
    socket.on('connected', (payload: any) => {
      console.log(payload)
    })

  },[])


  function loginUser() {
    return new Promise((resolve, reject) => {
      const user = users.find(item => item.username == creds.username.toLowerCase())
      if (user?.password == creds.password) {
        setLoggedInUser({ _id: user?._id, username: user?.username })
        resolve("foo");
      } else {
        console.log('Invalid Credentials')
        resolve('yes')
      }
      setTimeout(() => {
        socket.auth = { id: user?._id, username: user?.username };
        socket.connect();
        setLogin(false)
      }, 1000);
    });
  }

  return (
    <div className="h-screen">
      {login ? (
        <Login creds={creds} setCreds={setCreds} submit={loginUser} />
      ) : (
        <>
          <div className='flex flex-row'>
            <Sidebar user={loggedInUser} onlineUsers={onlineUsers} />
            <Chat />
          </div>
        </>
      )}
      {/* <button onClick={() => socket.emit('ping', { msg: 'Hi Nest', to: 'room'})}>Ping</button> */}
    </div>
  )
}



export default App
