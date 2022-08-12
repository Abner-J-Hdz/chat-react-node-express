import './App.css';
import io from 'socket.io-client'
import { useState, useEffect } from 'react'

//const socket = io('http://localhost:4000')//para desarrollo
const socket = io()///estamos sirviendo en el puerto donde está corriendo
function App() {

  const [message, setMessage] = useState("")

  const [messages, setMessages] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(message)

    socket.emit('message', message)
    const newMessage = {
      body: message,
      from: "Me"
    }
    setMessages([newMessage, ...messages ])
    setMessage('')
  }

  useEffect(() => {
    const receiveMessage = (message) => {
      console.log(message)


      setMessages([message, ...messages ])
      setMessages([ {
        body: message.body,
        from: message.from
      }, ...messages])
    }

   socket.on('message', receiveMessage)
   
   return ()=>{
      socket.off('message', receiveMessage)
   }
  }, [messages])
  

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-5">
        <h1 className='text-2x1 font-bold my-2'>Chat React</h1>
        <input 
          value={message} 
          type="text" 
          onChange={e => setMessage(e.target.value)} 
          className="border-2 text-black border-zinc-500 p-2 w-full"
        />
          {/* <button className='bg-blue-500'>Send</button> */}
        
        <ul className='h-80 overflow-y-auto'>
          {messages.map((message, index) => (
            <li 
              className={`my-2 p-2 table text-sm rounded-md ${message.from === "Me" ? "bg-sky-700 ml-auto" : "bg-black" }`}
              key={index}>
              <p> {message.from}:{message.body} </p>
              <p>  </p>
            </li>
          ))}
        </ul>

      </form>


    </div>
  );
}

export default App;
