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
  const [creds, setCreds] = useState<any>({ email: 'alice', password: '123' })
  const [loggedInUser, setLoggedInUser] = useState<any>({})
  const [chats, setChats] = useState<any>([])
  const [selectedChat, setSelectedChat] = useState('')
  const [availableUsers, setAvailableUsers] = useState([])

  async function getChats(type: string, token: any) {
    const response = await axios.get(`${baseUrl}/conversations?type=${type}`, { headers: { authorization: `Bearer ${token ? token : loggedInUser.id}` }})
    const { data: { data } } = response
    return data
  }

  async function loginUser() {
    const res = await axios.post(`${baseUrl}/auth/login`, creds)
    const {
      data: { user, accessToken, refreshToken },
    } = res.data;
    setLoggedInUser(user)
    
    const resUsers = await axios.get(`${baseUrl}/users`, { headers: { authorization: `Bearer ${user.id}` }})
    const chatsList = await getChats('PERSONAL', user.id) 

    setAvailableUsers(resUsers.data)
    setChats(chatsList)

    socket.auth = { id: user?.id, username: user?.username };
    socket.connect();

    setLogin(false)
  }

  const sendMessage = async (payload: any) => {
    const response = await axios.post(`${baseUrl}/messages`, payload)
    if (response.status === 201) console.log('Message Sent')
  }

  const [chatData, setChatData] = useState<any>([])

  const openChat = async (id: string) => {
    const response = await axios.get(`${baseUrl}/messages/chat/${id}`)
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
            <Sidebar user={loggedInUser} availableUsers={availableUsers} chats={chats} handleChat={openChat} />
            {selectedChat ? (
              <Chat
                chatData={chatData}
                id={selectedChat}
                user={loggedInUser}
                handleMessageSend={sendMessage}
              />
            ) : null}
          </div>
        </>
      )}
    </div>
  )
}



export default App
