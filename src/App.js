import React, { useEffect, useState } from "react";
import io from "socket.io-client";

function App() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");

    newSocket.on("message", (message) => {
      if (Array.isArray(message)) {
        setMessages(message);
      } else {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    newSocket.on("users", (userList) => {
      setUsers(userList);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = (message) => {
    if (socket) {
      socket.emit("chatMessage", message);
    }
  };

  return (
    <div className="App">
      <div>
        <h1>Hello</h1>
        <div>
          <h2>Chat Room</h2>
          <div>
            <h3>Users:</h3>
            <ul>
              {users.map((user) => (
                <li key={user.id}>{user.id}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Messages:</h3>
            <ul>
              {messages.map((message, index) => (
                <li key={index}>
                  {message.user ? `${message.user}: ${message.text}` : message}
                </li>
              ))}
            </ul>
          </div>
          <input
            type="text"
            placeholder="Type a message..."
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                sendMessage(e.target.value);
                e.target.value = "";
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
