import { useEffect, useState } from "react"
import socket from '../socket'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import axios from 'axios'

const baseUrl = 'http://localhost:8001'


const Chat = ({ chatData, id, user, handleMessageSend }: any) => {
  const [msg, setMsg] = useState('')
  const [messages, setMessages] = useState(chatData)
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>();
  const [isTyping, setIsTyping] = useState(false);
  const [isRecipientTyping, setIsRecipientTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [typingText, setTypingText] = useState('')

  useEffect(() => {
    setMessages(chatData)
    socket.emit('onPersonalJoin', { personalId: id })
  }, [chatData])

  useEffect(() => {
    console.log('Message Changed', messages)
  }, [messages])

  useEffect(() => {
    socket.on('onMessage', (payload) => {
      console.log('New Message')
      let chats = [...messages]
      chats.push(payload)
      setMessages(chats)
    })

    socket.on('onMessageDelete', (payload) => {
      console.log('Delete Message', payload)
      let chats = [...messages]
      chats.splice(messages.indexOf(messages.find((item: any) => item.id === payload.id)), 1)
      setMessages(chats)
    })

    socket.on('onMessageEdit', (payload) => {
      console.log('Edit Message', payload)
      let index = messages.indexOf(messages.find((item: any) => item.id === payload.id))
      messages[index].content = payload.content
      console.log(messages)
      setMessages([...messages])
    })

    socket.on('onTypingStart', (data) => {
      setTypingText(`${data.user} has started typing...`)
      console.log(`onTypingStart: ${data.user} has started typing...`);
      setIsRecipientTyping(true);
    });
    socket.on('onTypingStop', () => {
      setTypingText('')
      console.log('onTypingStop: User has stopped typing...');
      setIsRecipientTyping(false);
    });

    return () => {
      socket.off('onMessageDelete')
      socket.off('onMessage')
      socket.off('onTypingStart');
      socket.off('onTypingStop');
    }
  }, [])

  function setupMsg() {
    let payload = {
      chat: id,
      author: user.id,
      content: msg,
      replyTo: {},
      attachments: []
    }

    if (replyingTo) {
      payload.replyTo = {
        content: replyingTo.content,
        reference: replyingTo.id
      }
    }

    setReplyingTo(null)
    setMsg('')
    handleMessageSend(payload)
    // console.log(payload)
  }

  const sendTypingStatus = () => {
    console.log('init')
    if (isTyping) {
      clearTimeout(timer);
      setTimer(
        setTimeout(() => {
          console.log('User stopped typing');
          socket.emit('onTypingStop', { personalId: id });
          setIsTyping(false);
        }, 2000)
      );
    } else {
      setIsTyping(true);
      socket.emit('onTypingStart', { personalId: id });
    }
  };

  function addEmoji(data: any) {
    // if(mode) console.log('Reaction', data.native)
    setMsg(msg + data.native)
    // console.log(msg + data.native)
  }

  const [showMessageActions, setShowMessageActions] = useState('')

  function handleMsgAction(i: any) {
    if (!i) setShowMessageActions('')
    if (showMessageActions == i) setShowMessageActions('')
    else setShowMessageActions(i)
  }

  const [replyingTo, setReplyingTo] = useState<any>(null)

  const handleMessageDelete = async (id: any) => {
    const response = await axios.delete(`${baseUrl}/messages/${id}`, { headers: { authorization: `Bearer ${user.id}` }})
    if (response.status === 200) {
      let chats = [...messages]
      chats.splice(messages.indexOf(messages.find((item: any) => item.id === id)), 1)
      setMessages(chats)
      console.log('Message Deleted')
    }
  }

  const [showEdit, setShowEdit] = useState('')
  const [editMsg, setEditMsg] = useState('')

  async function handleMessageEdit(id: any) {
    console.log(id, editMsg)
    const response = await axios.patch(`${baseUrl}/messages/${id}`, { content: editMsg }, { headers: { authorization: `Bearer ${user.id}` }})
    if (response.status === 200) {
      let findMsg = messages.find((item: any) => item.id == id)
      findMsg.content = editMsg
      console.log(findMsg)
    }
    setEditMsg('')
    setShowEdit('')
  }


  return (
    <div className="w-full">
      <div className="header">
        <span className="h-4 w-4 text-green-600">Online</span> username
        {/* <span className="h-4 w-4 text-gray-400">Offline</span> username */}
      </div>

      {/* TODO: [] Add Reaction to message */}
      {/* TODO: [x] Add Reply to message */}
      {/* TODO: [] Add Delete to message */}
      {/* TODO: [] Show if user is online and save it in database */}
      <ul className="messages">
        {messages.length == 0 ? (
          <h4>No Data</h4>
        ) : messages.map((item: any) => {
          return (
            <li key={item.id} className={item.author.id == user.id ? 'flex justify-end' : ''}>
              <div className="flex flex-row">
                <div className="content mr-2">
                  {item.replyTo ? (
                    <div className="bg-gray-200 py-2">
                      <span className="mx-3">{item.replyTo.content}</span>
                    </div>
                  ) : null}
                  <div className="flex flex-row align-middle">
                    <img className="avatar" src={item.author.avatar}></img>
                    <div className="flex flex-col justify-center">
                      <span>{item.author.firstName} {item.author.lastName}</span>
                      {showEdit == item.id ? (
                        <>
                          <input className="p-3 border-2" value={editMsg} onChange={(e) => setEditMsg(e.target.value)} />
                          <span className="mt-5 bg-rose-700 text-white p-2 px-5 rounded-md cursor-pointer" onClick={() => handleMessageEdit(item.id)}>Edit</span>
                        </>
                      ) : <span>{item.content}</span>}
                    </div>
                  </div>
                </div>
                <div className="action flex flex-col justify-center">
                  <img src="https://cdn-icons-png.flaticon.com/128/2311/2311524.png" width={15} alt="" onClick={() => handleMsgAction(item.id)} />
                  {showMessageActions == item.id ? (
                    <div className="flex flex-col bg-white shadow-xl rounded-lg p-5">
                      <span className="cursor-pointer" onClick={() => setReplyingTo(item)}>Reply</span>
                      {item.author.id == user.id ? (
                        <span className="cursor-pointer" onClick={() => {
                          setShowEdit(item.id)
                          setEditMsg(item.content)
                          handleMsgAction('')
                        }}>Edit</span>
                      ) : null}
                      <span className="cursor-pointer" onClick={() => handleMessageDelete(item.id)}>Delete</span>
                      <span className="cursor-pointer" onClick={() => {
                        navigator.clipboard.writeText(item.content)
                        console.log('Copied text')
                        handleMsgAction('')
                      }}>Copy</span>
                    </div>
                  ) : null}

                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {typingText ? (
        <span>{typingText}</span>
      ) : null}
      {replyingTo ? (
        <span>Reply - {replyingTo.content}</span>
      ) : null}
      <form className="form flex flex-col" onSubmit={(e) => e.preventDefault()}>
        <input className="p-3 border-2" value={msg} onKeyDown={() => sendTypingStatus()} onChange={(e: any) => setMsg(e.target.value)} placeholder="Your message..." />
        <div className="flex flex-row justify-end">

          <div className={showEmoji ? 'absolute right-72 top-72 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 z-10' : 'hidden'}>
            <Picker data={data} onEmojiSelect={addEmoji} />
          </div>
          <button className="mt-5 mr-3 bg-gray-700 text-white p-2 px-5 rounded-md" onClick={() => setShowEmoji(val => !val)}>Emoji</button>
          <button className="mt-5 mr-3 bg-gray-700 text-white p-2 px-5 rounded-md">Upload File</button>
          <button className="mt-5 bg-rose-700 text-white p-2 px-5 rounded-md" onClick={() => setupMsg()}>Send</button>
        </div>
      </form>
    </div>
  )
}

export default Chat