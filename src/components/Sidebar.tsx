import dayjs from "dayjs"
import { useEffect, useState } from "react"
import socket from '../socket'


const Sidebar = ({ user, chats, handleChat, availableUsers }: any) => {

  let addedStatus = chats.map((item: any) => { return { ...item, isOnline: false } })

  const [chatList, setChatList] = useState<any>(addedStatus)

  socket.on('onlineUsers', (data) => {
    console.log(data)
  })

  useEffect(() => {
    let list: any = []
    chatList.map((item: any) => list.push(item.chat.connectedUsers.find((val: any) => val.id != user.id)))
    console.log('LISTTT', list)
    socket.emit('onlineUsers', { list })
    

    return () => {
      socket.off('userJoin');
    }
  }, [])

  function checkIfChatIsAvailable(id: string) {
    chatList.map((item: any) => {
      if(item.chat.connectedUsers.find((val: any) => val.id == id)) handleChat(item.chat.id)
      else console.log('Not initiated')
    })
  }

  return (
    <aside className="h-screen w-96 bg-slate-100 py-5">
      <h1 className="text-center">Teams ({user.username})</h1>
      <h4>Available users</h4>
      <div className="flex flex-col">
      {availableUsers.map((item: any) => (
        <span className="m-5" key={item.id} onClick={() => checkIfChatIsAvailable(item.id)}>{item.username}</span>
        ))}
        </div>
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