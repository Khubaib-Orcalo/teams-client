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
  const [creds, setCreds] = useState<any>({ username: 'alice', password: '123' })
  const [loggedInUser, setLoggedInUser] = useState<any>({})
  const [chats, setChats] = useState<any>([])
  const [selectedChat, setSelectedChat] = useState('')
  const [availableUsers, setAvailableUsers] = useState([])

  async function getChats() {
    console.log(loggedInUser)
    const response = await axios.get(`${baseUrl}/conversations`, { headers: { authorization: `Bearer ${loggedInUser.id}` }})
    return response.data
  }

  async function loginUser() {
    const res = await axios.post(`${baseUrl}/auth/login`, creds)
    const { data: user } = res

    
    const response = await axios.get(`${baseUrl}/conversations`, { headers: { authorization: `Bearer ${user.id}` }})
    const resUsers = await axios.get(`${baseUrl}/users`, { headers: { authorization: `Bearer ${user.id}` }})
    
    setLoggedInUser(user)
    setAvailableUsers(resUsers.data)
    setChats(response.data)

    socket.auth = { id: user?.id, username: user?.username };
    socket.connect();

    let list: any = []
    response.data.map((item: any) => list.push(item.chat.connectedUsers.find((val: any) => val.id != user.id)?.id))
    console.log('LISTTT', list)
    socket.emit('onlineUsers', { list })

    setLogin(false)
  }

  const sendMessage = async (payload: any) => {
    const response = await axios.post(`${baseUrl}/messages`, payload)
    if (response.status === 201) console.log('Message Sent')
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
