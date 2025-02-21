"use client"
import { useState, useEffect, FormEvent } from "react"
import { Send, Spinner } from "../components/Icons"
import { getItem, setItem } from "../utils/localStorage"
import { AISummarizerOptions } from "../../../global"

interface Message {
    text: string,
    sender: string,
    date: string
}
export default function Summarize(){
    const [isLoading, setIsLoading] = useState(false)
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

    const summarizeText = async (text: string)=> {
        if(typeof window === "undefined" || !window.ai?.summarizer) return;

        try {
            const options: AISummarizerOptions = {
                sharedContext: 'This is a scientific article',
                type: 'key-points',
                format: 'markdown',
                length: 'medium',
            };

            const summarizerCapabilities = await window.ai.summarizer.capabilities()
            const canDetect = summarizerCapabilities?.available

            if (canDetect === 'no') {
              // The Summarizer API isn't usable.
              return;
            }
            let summarizer
            if (canDetect === 'readily') {
              // The Summarizer API can be used immediately .
              summarizer = await window.ai.summarizer.create(options);
            } else {
              // The Summarizer API can be used after the model is downloaded.
              summarizer = await window.ai.summarizer.create(options);
              summarizer.addEventListener("downloadprogress", (e: Event) => {
                if ("loaded" in e && "total" in e) {
                  const progressEvent = e as ProgressEvent;
                  console.log(progressEvent.loaded, progressEvent.total);
                }
              });
              await summarizer.ready;
            }

            const summary = await summarizer.summarize(text);

            return summary
        } catch(err) {
            console.log("Summarizer Error:", err)
        }
    }
    
    const getSummary = async (e: FormEvent<HTMLFormElement>)=> {
        e.preventDefault()
        if(input.trim().length <= 10) {
            return
        }
        setIsLoading(true)
        try {
            const newMessages = [...summary, { text: input, sender: "user", date: `${date.getHours()}:${date.getMinutes()}` }]
            setSummary(newMessages)
            setInput("")
            const aiSummary = await summarizeText(input)
    
            setSummary(
                (prev) => [
                    ...prev, {
                        text: aiSummary || "Sorry, this feature is not available on this browser",
                        sender: "AI",
                        date: `${date.getHours()}:${date.getMinutes()}`
                    }
                ]
            )
        } catch (error) {
            console.error("Error in translation process:", error);
            setIsLoading(false);
        } finally{
            setIsLoading(false);
        }
    }
    const clearChat = ()=> {
        setSummary([]);
    }
    
    
    return (
        <div className="w-full h-screen flex flex-col gap-5 items-center p-4">
            <div className="h-[80%] w-[800px] max-[800px]:w-full overflow-auto space-y-2 pt-5">
                {
                    summary.map((msg, index)=> 
                        <div 
                          key={index}
                          className={`
                            w-fit max-w-[90%] px-4 py-2 pb-6 rounded-md text-white relative
                            ${msg.sender === "user" ? "bg-blue-500 ml-auto": "bg-blue-600 font-semibold"}
                          `}
                        >
                            <p className="">{msg.text}</p>

                            <span className="absolute bottom-1 right-2 text-sm font-normal">{msg.date}</span>
                        </div>
                    )
                }
                <span>{isLoading && <Spinner />}</span>
            </div>
            


            <form onSubmit={getSummary} className="relative bg-blue-300 h-[20%] w-[800px] max-[800px]:w-full flex flex-col items-left rounded-[.6rem] border-b-[5px] border-r-[3px] border-[#0d3960] border-l-2">
                <input value={input} onChange={(e)=> setInput(e.target.value)} type="text" placeholder="Summarize..." className="bg-transparent placeholder:font-semibold placeholder:text-[#0d3960] w-full p-2 outline-none" />
                <button className={`text-2xl p-2 w-fit bg-blue-400 hover:bg-blue-500 rounded-[50%] absolute bottom-2 right-2 ${input.trim().length <= 10 && "hidden"}`}><Send /></button>
            </form>

            <button onClick={clearChat} className="absolute right-2 top-2 bg-red-500 text-white text-sm font-semibold py-2 px-4 rounded-md">Clear Chat</button>
        </div>
    )
}