import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import logo from '/public/logo.png';
import add from '/public/add-30.png';
import messageIcon from '/public/message.svg';
import home from '/public/home.svg';
import rocket from '/public/rocket.svg';
import bookmark from '/public/bookmark.svg';
import send from '/public/send.svg';
import bot from '/public/chatgptLogo.svg';
import human from '/public/human.png';

const App = () => {
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const [response, setResponse] = useState('');

  const url =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBGENOd_iLgRmOpvabGO1s0H5GXiHumgU8';


  const chatContainerRef = useRef(null);


  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  function handleInputChange(e) {
    setMessageText(e.target.value);
  }

  async function generateResponse(message) {
    if (!message.trim()) return;

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: message }],
          },
        ],
      }),
    };

    try {
      let response = await fetch(url, requestOptions);
      let data = await response.json();

      let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1').trim();
      setResponse(apiResponse);

      setMessages((prevMessages) => [...prevMessages, { type: 'bot', text: apiResponse }]);
    } catch (error) {
      console.error('Error generating response:', error);
    }
  }

  const handleSend = () => {
    if (!messageText.trim()) return;

    setMessages((prevMessages) => [...prevMessages, { type: 'user', text: messageText }]);
    generateResponse(messageText);
    setMessageText('');
  };

  const queryhandler = (e)=>{
    const text = e.target.value 
    setMessageText(text);
    setMessages((prevMessages) => [...prevMessages, { type: 'user', text}]);
    generateResponse(text);
    setMessageText('');

  }

  const handlerEnter = (e)=>{
    if (e.key == 'Enter'){
      handleSend();
    }
  }

  return (
    <Container>
      <div className="sidebar">
        <div className="up">
          <div className="logo">
            <img src={logo} alt="logo" />
            <h3>ChatGPT</h3>
          </div>
          <div className="but">
            <button onClick={()=>{window.location.reload()}}>
              <img src={add} alt="add" />
              New Chat
            </button>
          </div>
          <div className="both">
            <div className="msg">
              <button onClick={queryhandler} value={'What is Programming?'}>
                <img src={messageIcon} alt="message" />
                What is Programming?
              </button>
            </div>
            <div className="msg">
              <button onClick={queryhandler} value={'How to use an API?'}>
                <img src={messageIcon} alt="message" />
                How to use an API?
              </button>
            </div>
          </div>
        </div>
        <div className="down">
          <div className="contain">
            <div>
              <img src={home} alt="home" />
              Home
            </div>
            <div>
              <img src={bookmark} alt="bookmark" />
              Saved
            </div>
            <div>
              <img src={rocket} alt="rocket" />
              Upgrade to Pro
            </div>
          </div>
        </div>
      </div>

      <div className="main">
        <div className="all">

          <div className="chat" ref={chatContainerRef}>
            <div className='bot'>
              <img src={bot}/>
              <p>What can I help with?</p>
            </div>
            {messages.map((msg, i) => (
              <div key={i} className={msg.type === 'bot' ? 'bot' : 'human'}>
                <img src={msg.type === 'bot' ? bot : human} alt={msg.type} />
                <p>{msg.text}</p>
              </div>
            ))}
          </div>

          <div className="input">
            <input
              type="text"
              placeholder="Ask anything"
              value={messageText}
              onChange={handleInputChange}
              onKeyDown={handlerEnter}
            />
            <img onClick={handleSend} src={send} alt="send" />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default App;

const Container = styled.div`
  display: flex;

  .main {
    flex: 9;
  }

  .sidebar {
    border-right: 2px solid white;
    min-height: 100vh;
    flex: 3;
  }
  .up {
    padding: 2rem 2rem;
    height: 60%;
    border-bottom: 2px solid white;
  }
  .logo {
    display: flex;
    align-items: center;
  }
  .logo h3 {
    font-size: 30px;
    font-weight: 500;
  }
  .logo img {
    height: 4rem;
  }
  button {
    display: flex;
    align-items: center;
    padding: 1rem 2rem;
    justify-content: center;
    width: 20rem;
    background-color: #6060f3;
    border: none;
    border-radius: 0.25rem;
    color: white;
    font-size: 1.2rem;
  }
  .but {
    margin-top: 2rem;
  }
  .but img {
    height: 1.5rem;
    margin-right: 0.7rem;
  }
  .both {
    margin-top: 3rem;
  }
  .msg {
    margin-bottom: 1rem;
  }
  .msg button {
    background: transparent;
    border: 1px solid white;
    font-size: 1rem;
  }
  .msg button img {
    margin-right: 1.5rem;
  }
  .down {
    height: 40%;
  }
  .contain {
    margin-top: 5rem;
    margin-left: 2.3rem;
  }
  .contain div {
    margin-bottom: 2rem;
    display: flex;
    font-size: 1rem;
  }
  .contain div img {
    margin-right: 1.3rem;
    height: 1.5rem;
  }
  .main {
    display: flex;
    justify-content: center;
  }
  .all {
    margin-top: 8rem;
  }
  .chat {
    width: 900px;
    height: 700px;
    overflow-y: scroll;
    padding: 1rem;
  }
  .chat::-webkit-scrollbar {
    width: 0px;
  }
  input {
    width: 740px;
    padding: 0.78rem 1.5rem;
    background-color: #1a1a40;
    outline: none;
    font-size: 1.2rem;
    color: white;
    border-radius: 0.25rem;
    border: none;
  }
  .input {
    border-radius: 0.25rem;
    margin-top: 1rem;
    background-color: #1a1a40;
    display: flex;
    align-items: center;
    width: 900px;
    justify-content: space-between;
  }
  .input img {
    margin-right: 1rem;
    cursor: pointer;
  }
  .bot {
    display: flex;
    background-color: #1a1a40;
    padding: 2rem;
    border-radius: 0.75rem;
    margin-bottom: 1rem;
  }
  .bot img {
    margin-right: 20px;
    border-radius: 0.25rem;
    height: 3.5rem;
  }
  .human {
    margin: 1rem 0;
    display: flex;
    padding: 2rem;
    background-color: #2c2c6c;
    border-radius: 0.75rem;
  }
  .human img {
    height: 3.5rem;
    margin-right: 20px;
    border-radius: 0.25rem;
  }
`;