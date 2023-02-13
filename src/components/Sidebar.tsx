import { useEffect, useState } from "react"
import socket from '../socket'


const Sidebar = ({ user, chats }: any) => {

  const [onlineUsers, setOnlineUsers] = useState<any>([])
  socket.on('userJoin', (data) => {
    console.log('userJoin', data);
    onlineUsers.push(data.id)
  })

  

  useEffect(() => {
    return () => {
      socket.off('userJoin');
    }
  }, [user.id])

  return (
    <aside className="h-screen w-72 bg-slate-100 py-5">
      <h1 className="text-center">Teams ({user.username})</h1>
      <div className="flex justify-center mt-5">
        <button className="mr-4 bg-rose-700 text-white p-2 rounded-md">Personal</button>
        <button className="bg-rose-700 text-white p-2 rounded-md">Group</button>
      </div>

      <div className="items mt-5">

        {chats.length == 0 ? (
          <h4>Loading</h4>
        ) : chats.map((item: any) => {
          const chat = item.chat.connectedUsers.find((item: any) => item.id != user.id)
          let isOnline = false
          socket.on('userJoin', (data) => {
            if(data.id == chat.id) {
              console.log(chat.firstName, 'is online')
              isOnline = true
            }
          })
          socket.emit('onPersonalJoin', { personalId: item.chat.id })
          return (
            <div key={item.id} className="border-2 border-indigo-500/50 mx-5 p-3">
              <p>{chat.firstName} {chat.lastName} {isOnline ? 'Online' : 'Offline'}</p>
            </div>
          )
        })}
      </div>
    </aside>
  )
}

export default Sidebar