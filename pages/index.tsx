import ClientProvider from "@/components/ClientProvider";
import React, {useRef} from "react";
import { toast } from "react-hot-toast";


// Types
interface Conversation {
  role: string
  content:string
}

export default function Home(){

  const [value, setValue] = React.useState<string>("")
  const [conversation, setConversation] = React.useState<Conversation[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleInput = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
    },
    []
  )

  
    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if(e.key === "Enter"){
        const notification = toast.loading('ChatGPT is thinking...')
        const chatHistory = [...conversation, {role: "user", content: value}]
        const response = await fetch("/api/openAIChat",{
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({messages: chatHistory})
        })

        const data = await response.json();
        // Toast Notification to say succesful
        toast.success('ChatGPT has responded!',{
          id: notification
        })
        setValue("");
        setConversation([
          ...chatHistory, 
          {role: "assistant", content: data.result.choices[0].message.content}
        ])

      }
    }

    const handleRefresh = () => {
      inputRef.current?.focus()
      setValue("")
      setConversation([])
    }

  return(

    
    <div className="w-full">
      <ClientProvider/>
      <div className="flex flex-col m-40 text-center">
        <h1 className="text-6xl">ChatGPT API Test by Coffe Break</h1>
        <div className="my-12">
          <p className="mb-6 font-bold">Type your prompt</p>
          <input 
          placeholder="Type your prompt here"
          className="w-full w-100 input input-bordered input-secondary"
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          />
          <button onClick={handleRefresh} className="mt-6  btn btn-error">Start new conversation</button>
        </div>

        
        <div className="textarea text-left">
          {conversation.map((item, index) => (
            <React.Fragment key={index}>
              <br />
              {item.role === "assistant" ? (
                <div className="chat chat-end">
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img src="/images/openaipic.jpeg" />
                    </div>
                  </div>
                  <div className="chat-header">
                    ChatGPT
                  </div>
                  <div className="chat-bubble chat-bubble-secondary">{item.content}</div>
                </div>
              ): (
                <div className="chat chat-start">
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img src="/images/userpic.png" />
                    </div>
                  </div>
                  <div className="chat-header">
                    Coffe Break
                  </div>
                  <div className="chat-bubble chat-bubble-secondary">{item.content}</div>
                </div>
              )}  
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
