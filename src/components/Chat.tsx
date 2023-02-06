

const Chat = () => {

  return (
    <div className="w-full">
      <div className="header">
        <span className="h-4 w-4 text-green-600">Online</span> username
        <span className="h-4 w-4 text-gray-400">Offline</span> username
      </div>

      <ul className="messages">
        <li
        >
          <div className="sender">
            username
          </div>
          message
        </li>
      </ul>

      <form className="form flex flex-col" onSubmit={(e) => e.preventDefault()}>
        <input className="p-3 border-2" placeholder="Your message..." />
        <div className="flex flex-row justify-end">
          <button className="mt-5 mr-3 bg-gray-700 text-white p-2 px-5 rounded-md">Emoji</button>
          <button className="mt-5 mr-3 bg-gray-700 text-white p-2 px-5 rounded-md">Upload File</button>
          <button className="mt-5 bg-rose-700 text-white p-2 px-5 rounded-md">Send</button>
        </div>
      </form>
    </div >
  )
}

export default Chat