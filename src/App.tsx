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
  const [selectedChat, setSelectedChat] = useState('')

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

  const sendMessage = async (payload: any) => {
    const response = await axios.post(`${baseUrl}/messages`, payload)
    if(response.status === 201) console.log('Message Sent')
  }

  const [chatData, setChatData] = useState<any>([])

  const openChat = async (id: string) => {
    const response = await axios.get(`${baseUrl}/messages/chat/${id}`)
    // console.log(response)
    setSelectedChat(id)
    setChatData(response.data)
  }

  return (
    <div className="h-screen">
      {login ? (
        <Login creds={creds} setCreds={setCreds} submit={loginUser} />
      ) : (
        <>
          <div className='flex flex-row'>
            <Sidebar user={loggedInUser} chats={chats} handleChat={openChat} />
            {selectedChat ? (
              <Chat
                chatData={chatData}
                id={selectedChat}
                user={loggedInUser}
                handleMessageSend={sendMessage}
              />
            ) : null }
          </div>
        </>
      )}
    </div>
  )
}



export default App
