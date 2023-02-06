import { useEffect, useState } from 'react'
import * as io from 'socket.io-client'
const socket = io.connect('http://localhost:3001')
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const randomRoom = Math.floor(Math.random() * 10)

  socket.on('pong', (data) => {
    console.log('pong recieved from server')
  })
  

  return (
    <div className="App">
      <button onClick={() => socket.emit('ping', { msg: 'Hi Nest', to: 'room'})}>Ping</button>
    </div>
  )
}

export default App