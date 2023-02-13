import { useEffect, useState } from 'react'
import socket from './socket'
import './App.css'
import Chat from './components/Chat'
import Login from './components/Login'
import Sidebar from './components/Sidebar'
import { users } from './data/users'
import axios from 'axios'

const baseUrl = 'http://localhost:8001'

function App() {
  const [login, setLogin] = useState(true)
  const [creds, setCreds] = useState<any>({ username: '', password: '' })
  const [loggedInUser, setLoggedInUser] = useState<any>({})
  const [chats, setChats] = useState<any>([])

  async function getChats(id: any) {
    const response = await axios.get(`${baseUrl}/personal/${id}`)
    return response.data.data
  }

  function loginUser() {
    return new Promise(async (resolve, reject) => {
      const user = users.find(item => item.username == creds.username.toLowerCase())
      if (user?.password == creds.password) {
        setLoggedInUser({ id: user?.id, username: user?.username })
        resolve("foo");
      } else {
        console.log('Invalid Credentials')
        resolve('yes')
      }
      const chatData = await getChats(user?.id)
      socket.auth = { id: user?.id, username: user?.username };
      setChats(chatData)
      socket.connect();
      setLogin(false)
    });
  }

  return (
    <div className="h-screen">
      {login ? (
        <Login creds={creds} setCreds={setCreds} submit={loginUser} />
      ) : (
        <>
          <div className='flex flex-row'>
            <Sidebar user={loggedInUser} chats={chats} />
            <Chat />
          </div>
        </>
      )}
    </div>
  )
}



export default App
