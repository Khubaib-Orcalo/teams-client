import dayjs from "dayjs"
import { useEffect, useState } from "react"
import socket from '../socket'


const Sidebar = ({ user, chats, handleChat }: any) => {

  let addedStatus = chats.map((item: any) => { return { ...item, isOnline: false } })

  const [chatList, setChatList] = useState<any>(addedStatus)

  useEffect(() => {
    return () => {
      socket.off('userJoin');
    }
  }, [user.id])

  return (
    <aside className="h-screen w-96 bg-slate-100 py-5">
      <h1 className="text-center">Teams ({user.username})</h1>
      <div className="flex justify-center mt-5">
        <button className="mr-4 bg-rose-700 text-white p-2 rounded-md">Personal</button>
        <button className="bg-rose-700 text-white p-2 rounded-md">Group</button>
      </div>

      <div className="items mt-5">
        {chatList.length == 0 ? (
          <h4>Loading</h4>
        ) : chatList.map((item: any) => {
          const chat = item.chat.connectedUsers.find((item: any) => item.id != user.id)
          return (
            <div key={item.id} className="border-2 border-indigo-500/50 mx-5 p-3 flex flex-row align-middle" onClick={() => handleChat(item.chat.id)}>
              <img className="avatar" src={chat.avatar}></img>
              <div className="flex flex-col justify-center">
                <p>{chat.firstName} {chat.lastName} <span className="text-xs ml-4">{dayjs(item.updatedAt).format('hh:mm A')}</span></p>
                <p>{item.chat.lastMessageSent.content}</p>
              </div>
              {/* <p>{chat.firstName} {chat.lastName} {item.isOnline ? 'Online' : 'Offline'}</p> */}
            </div>
          )
        })}
      </div>
    </aside>
  )
}

export default Sidebar