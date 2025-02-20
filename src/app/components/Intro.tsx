import Link from "next/link"

export default function Intro(){
    return(
        <div className="w-[450px] p-3 bg-blue-400 flex flex-col gap-3 items-center border-b-[5px] border-r-[3px] border-t-2 border-l-2 border-[#0d3960] rounded-[.6rem]">
            <div>
                <h1 className="text-3xl font-bold">Welcome to summereaseAI</h1>
                <p>lorem</p>
            </div>

            <Link href="/translate" className="bg-blue-500 py-1 px-3 rounded-[.6rem] hover:bg-[#ebab16] border-b-[5px] border-r-[3px] border-[#0d3960] border-t-2 border-l-2 cursor-pointer"> Translation </Link>
            <Link href="/summarize" className="bg-blue-500 py-1 px-3 rounded-[.6rem] hover:bg-[#ebab16] border-b-[5px] border-r-[3px] border-[#0d3960] border-t-2 border-l-2 cursor-pointer"> Summary </Link>
            {/* <Link href="/translate-and-summarize" className="bg-blue-500 py-1 px-3 rounded-[.6rem] hover:bg-[#ebab16] border-b-[5px] border-r-[3px] border-[#0d3960] border-t-2 border-l-2 cursor-pointer">Translate and Summarize</Link> */}
        </div>
    )
}

{/* <button className="bg-blue-400 font-semibold px-6 py-2 rounded-[.6rem] hover:bg-[#ebab16] border-b-[5px] border-r-[3px] border-[#0d3960] border-t-2 border-l-2 cursor-pointer">Next</button> */}