"use client"
import { FormEvent, useState, useEffect } from "react"
import { Send } from "../components/Icons"
import { getItem, setItem } from "../utils/localStorage"

interface Message {
    text: string;
    sender: string;
    date: string;
    detectedLanguage: string;
}

export default function Translate(){
    const date = new Date
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("fr");

    const languages = [
      { name: "English", code: "en" },
      { name: "Portuguese", code: "pt" },
      { name: "Spanish", code: "es" },
      { name: "Russian", code: "ru" },
      { name: "Turkish", code: "tr" },
      { name: "French", code: "fr" },
    ];
    const [messages, setMessages] = useState<Message[]>(
        ()=> {
            const messages = getItem("messages")
            return messages ? messages : [
                {
                    text: "Hello, Let's do some translations",
                    sender: "AI",
                    date: `${date.getHours()}:${date.getMinutes()}`,
                    detectedLanguage: "en"
                }
            ]
        }
    )
    useEffect(()=> {
        setItem("messages", messages)
    }, [messages])

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLanguage(event.target.value);
    };

    const translateText = async (text: string, sourceLang: string, targetLang: string) => {
        if (typeof window === "undefined" || !window.ai?.translator) {
            return;
        }
        try {
            const translator = await window.ai.translator.create({
                sourceLanguage: sourceLang,
                targetLanguage: targetLang,
            });
            return await translator.translate(text);
        } catch (error) {
            console.error("Translation error:", error);
            return text;
        }
    };

    const detectLanguage = async (text: string) => {
        if (typeof window === "undefined" || !window.ai?.languageDetector) {
          console.error("AI Language Detector is not available.");
          return;
        }
      
        try {
          const languageDetectorCapabilities = await window.ai.languageDetector.capabilities();
          const canDetect = languageDetectorCapabilities?.available;
      
          if (canDetect === "no") {
            console.warn("Language detection is not supported.");
            return;
          }
      
          let detector;
      
          if (canDetect === "readily") {
            detector = await window.ai.languageDetector.create();
          } else {
            detector = await window.ai.languageDetector.create({
                monitor(m: EventTarget) {
                    m.addEventListener("downloadprogress", (e) => {
                      const progressEvent = e as ProgressEvent;
                      console.log(`Downloaded ${progressEvent.loaded} of ${progressEvent.total} bytes.`);
                    });
                }
            });
            await detector.ready;
          }
      
          if (!detector?.detect) {
            console.error("Detect method is unavailable.");
            return;
          }
      
          const results = await detector.detect(text);
      
          if (!results || results.length === 0) {
            console.warn("No language detected.");
            return;
          }

          const { detectedLanguage, confidence } = results[0];
          console.log(`Detected Language: ${detectedLanguage} (Confidence: ${confidence})`);
      
          return { language: detectedLanguage, confidence };
        } catch (error) {
          console.error("Error detecting language:", error);
        }
      };

    const getTranslation = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input) return;

        setIsLoading(true);
        try {
            const detectedResult = await detectLanguage(input);
            const languageDetected = detectedResult?.language || "unavailable";

            const userMessage = {
                text: input,
                sender: "user",
                date: `${date.getHours()}:${date.getMinutes()}`,
                detectedLanguage: languageDetected ,
            };

            setMessages((prev: Message[]) => [...prev, userMessage]);
            setInput("");

            // let aiResponseText = "Baba wetin u want";
            const translatedAiResponse = languageDetected !== selectedLanguage
                && await translateText(input, languageDetected, selectedLanguage)

            const aiMessage = {
                text: translatedAiResponse || "Sorry, Translation is not available on this browser",
                sender: "AI",
                date: `${date.getHours()}:${date.getMinutes()}`,
                detectedLanguage: selectedLanguage,
            };

            setMessages((prev: Message[]) => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error in translation process:", error);
            setIsLoading(false);
        } finally{
            setIsLoading(false);
        }
        
    };

    const clearChat = ()=> {
        setMessages([]);
    }

    console.log(messages)
      
    return (
        <div className="w-full h-screen flex flex-col gap-5 items-center p-4">
            <div className="h-[80%] w-[800px] max-[800px]:w-full overflow-auto space-y-2">
                {
                    messages.map((msg, index)=> 
                    <div 
                      key={index}
                      className={`
                        w-fit px-4 py-2 pb-6 rounded-md text-white relative
                        ${msg.sender === "user" ? "bg-blue-500 ml-auto" : "bg-blue-600 font-semibold"}
                      `}>
                        <p className="">
                            {
                                msg.sender === "AI" && <span>{isLoading ? "Loading: " : "Translation: "}</span>
                            }
                            {msg.text} 
                            <span className="font-normal">({msg.detectedLanguage})</span>
                            
                        </p>
                        <span className="absolute bottom-1 right-2 text-sm font-normal">{msg.date}</span>
                    </div>
                    )
                }
            </div>
            


            <form onSubmit={getTranslation} className="relative bg-blue-300 h-[20%] w-[800px] max-[800px]:w-full flex flex-col items-left rounded-[.6rem] border-b-[5px] border-r-[3px] border-[#0d3960] border-l-2">
            <select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className="block w-full p-3 text-lg font-medium border rounded-lg shadow-md bg-blue-500 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code} className="text-white">
                  {lang.name} ({lang.code})
                </option>
              ))}
            </select>

                <input value={input} onChange={(e)=> setInput(e.target.value)} type="text" placeholder="Translate..." className="bg-transparent placeholder:font-semibold placeholder:text-[#0d3960] w-full p-2 outline-none" />
                <button className={`text-2xl p-2 w-fit bg-blue-400 hover:bg-blue-500 rounded-[50%] absolute bottom-2 right-2 ${!input && "hidden"}`}><Send /></button>
            </form>
            <button onClick={clearChat} className="absolute right-2 top-2 bg-red-500 text-white text-sm font-semibold py-2 px-4 rounded-md">Clear Chat</button>
        </div>
    )
}

