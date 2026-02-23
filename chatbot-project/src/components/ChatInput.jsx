import { useState } from "react";
import { Chatbot } from "supersimpledev";
import dayjs from "dayjs";
import SpinnerImage from "../assets/loading-spinner.gif";
import "./ChatInput.css";

function ChatInput({ chatMessages, setChatMessages }) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function saveInputText(event) {
    setInputText(event.target.value);
  }

  async function sendMessage() {
    if (isLoading || inputText === "") {
      return;
    }

    setIsLoading(true);
    setInputText("");

    if (inputText) {
      const newChatMessages = [
        ...chatMessages,
        {
          message: inputText,
          sender: "user",
          id: crypto.randomUUID(),
          time: dayjs().valueOf(),
        },
      ];

      setChatMessages(newChatMessages);

      setChatMessages([
        ...newChatMessages,
        {
          message: (
            <img src={SpinnerImage} alt="loading spinner" className="spinner" />
          ),
          sender: "robot",
          id: crypto.randomUUID(),
        },
      ]);

      const response = await Chatbot.getResponseAsync(inputText);
      setChatMessages([
        ...newChatMessages,
        {
          message: response,
          sender: "robot",
          id: crypto.randomUUID(),
        },
      ]);
    }

    setIsLoading(false);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      sendMessage();
    } else if (event.key === "Escape") {
      setInputText("");
    }
  }

  function clearAllMessages() {
    setChatMessages([]);
  }

  return (
    <div className="chat-input-container">
      <input
        placeholder="Send a message to Chatbot"
        size="30"
        onChange={saveInputText}
        onKeyDown={handleKeyDown}
        value={inputText}
        className="chat-input"
      />
      <button onClick={sendMessage} className="send-button">
        Send
      </button>
      <button className="clear-button" onClick={clearAllMessages}>
        Clear
      </button>
    </div>
  );
}

export default ChatInput;
