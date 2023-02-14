import { useEffect, useState } from "react"
import socket from '../socket'

const Chat = ({ data, id, user, handleMessageSend }: any) => {

  const [msg, setMsg] = useState(null)
  const [messages, setMessages] = useState(data)
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>();
  const [isTyping, setIsTyping] = useState(false);
  const [isRecipientTyping, setIsRecipientTyping] = useState(false);
  const [typingText, setTypingText] = useState('')

  useEffect(() => {
    setMessages(data)
  }, [])

  useEffect(() => {
    socket.emit('onPersonalJoin', { personalId: id })

    socket.on('onMessage', (payload) => {
      console.log('New Message')
      let chats = [...messages]
      chats.push(payload)
      setMessages(chats)
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
      socket.off('onMessage')
      socket.off('onTypingStart');
      socket.off('onTypingStop');
    }
  }, [messages])

  function setupMsg() {
    const payload = {
      chat: id,
      author: user.id,
      content: msg,
      replyTo: null,
      attachments: []
    }

    setMsg(null)
    handleMessageSend(payload)
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

  return (
    <div className="w-full">
      <div className="header">
        <span className="h-4 w-4 text-green-600">Online</span> username
        {/* <span className="h-4 w-4 text-gray-400">Offline</span> username */}
      </div>

      <ul className="messages">
        {messages.map((item: any) => {
          return (
            <li key={item.id} className={item.author.id == user.id ? 'flex justify-end' : ''}>
              <span>
                <span>{item.author.firstName} {item.author.lastName}</span>
                <br />
                <span>{item.content}</span>
              </span>
            </li>
          )
        })}
      </ul>
      
      {typingText ? (
        <span>{typingText}</span>
      ): null}
      <form className="form flex flex-col" onSubmit={(e) => e.preventDefault()}>
        <input className="p-3 border-2" onKeyDown={() => sendTypingStatus()} onChange={(e: any) => setMsg(e.target.value)} placeholder="Your message..." />
        <div className="flex flex-row justify-end">
          <button className="mt-5 mr-3 bg-gray-700 text-white p-2 px-5 rounded-md">Emoji</button>
          <button className="mt-5 mr-3 bg-gray-700 text-white p-2 px-5 rounded-md">Upload File</button>
          <button className="mt-5 mr-3 bg-gray-700 text-white p-2 px-5 rounded-md" onClick={() => sendTypingStatus()}>Test Typing start</button>
          <button className="mt-5 bg-rose-700 text-white p-2 px-5 rounded-md" onClick={() => setupMsg()}>Send</button>
        </div>
      </form>
    </div>
  )
}

export default Chat