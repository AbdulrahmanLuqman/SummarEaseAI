"use client"
import { useState, useEffect, FormEvent } from "react"
import { Send } from "../components/Icons"
import { getItem, setItem } from "../utils/localStorage"

interface Message {
    text: string,
    sender: string,
    date: string
}
export default function Summarize(){
    const date = new Date
    const [summary, setSummary] = useState<Message[]>(
        ()=> {
            const summary = getItem("summmary")
            return summary ? summary : [
                {
                    text: "Hello, pls make sure your words is not less than 150 characters",
                    sender: "AI",
                    date: `${date.getHours()}:${date.getMinutes()}`
                }
            ]
        }
    )

    useEffect(()=> {
        setItem("message", summary)
    }, [summary])
    const [input, setInput] = useState("")

    const getSummary = (e: FormEvent<HTMLFormElement>)=> {
        e.preventDefault()
        if ('ai' in self && 'summarizer' in self.ai) {
            if(!input.trim) return
            if(input.trim().length <= 10) {
                alert("greater than this than pls")
                return
            }
    
            const newMessages = [...summary, { text: input, sender: "user", date: `${date.getHours()}:${date.getMinutes()}` }]
            setSummary(newMessages)
            setInput("")
    
            setTimeout(()=> {
                setSummary(
                    (prev) => [
                        ...prev, {
                            text: "Summarizing",
                            sender: "AI",
                            date: `${date.getHours()}:${date.getMinutes()}`
                        }
                    ]
                )
            }, 1000)
        } else {
            setSummary(
                (prev) => [
                    ...prev, {
                        text: "This Browser doesn't support this",
                        sender: "AI",
                        date: `${date.getHours()}:${date.getMinutes()}`
                    }
                ]
            )
        }
    }
    const clearChat = ()=> {
        setSummary([]);
    }
    
    
    return (
        <div className="w-full h-screen flex flex-col gap-3 items-center p-4">
            <div className="h-[80%] w-[800px]">
                {
                    summary.map((msg, index)=> 
                        <div 
                          key={index}
                          className={`
                            w-fit max-w-[50%] px-4 py-2 pb-6 rounded-md text-white relative
                            ${msg.sender === "user" ? "bg-blue-500 ml-auto": "bg-blue-600 font-semibold"}
                          `}
                        >
                            <p className="">{msg.text}</p>

                            <span className="absolute bottom-1 right-2 text-sm font-normal">{msg.date}</span>
                        </div>
                    )
                }
            </div>
            


            <form onSubmit={getSummary} className="relative bg-blue-300 h-[20%] w-[800px] flex flex-col items-left rounded-[.6rem] border-b-[5px] border-r-[3px] border-[#0d3960] border-l-2">
                <input value={input} onChange={(e)=> setInput(e.target.value)} type="text" placeholder="Summarize..." className="bg-transparent placeholder:font-semibold placeholder:text-[#0d3960] w-full p-2 outline-none" />
                <button className={`text-2xl p-2 w-fit bg-blue-400 hover:bg-blue-500 rounded-[50%] absolute bottom-2 right-2 ${input.trim().length <= 10 && "hidden"}`}><Send /></button>
            </form>

            <button onClick={clearChat} className="absolute left-2 top-2 bg-red-500 text-white text-sm font-semibold py-2 px-4 rounded-md">Clear Chat</button>
        </div>
    )
}