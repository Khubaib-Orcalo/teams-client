import { useEffect, useState } from 'react'
import * as io from 'socket.io-client'
// const socket = io.connect('http://localhost:3001')
import './App.css'
import Chat from './components/Chat'
import Login from './components/Login'
import Sidebar from './components/Sidebar'
import { users } from './data/users'

function App() {
  const [login, setLogin] = useState(true)
  const [creds, setCreds] = useState<any>({ username: '', password: '' })
  const [loggedInUser, setLoggedInUser] = useState<any>({})

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
        setLogin(false)
      }, 1000);
    });
  }
  // socket.on('pong', (data) => {
  //   console.log('pong recieved from server')
  // })


  return (
    <div className="h-screen">
      {login ? (
        <Login creds={creds} setCreds={setCreds} submit={loginUser} />
      ) : (
        <>
          <div className='flex flex-row'>
            <Sidebar user={loggedInUser} />
            <Chat />
          </div>
        </>
      )}
      {/* <button onClick={() => socket.emit('ping', { msg: 'Hi Nest', to: 'room'})}>Ping</button> */}
    </div>
  )
}



export default App
