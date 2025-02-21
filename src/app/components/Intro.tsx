import Link from "next/link"

export default function Intro(){
    return(
        <div className="max-w-[450px] max-[457px]:w-[95%] p-3 bg-blue-400 flex flex-col gap-3 items-center border-b-[5px] border-r-[3px] border-t-2 border-l-2 border-[#0d3960] rounded-[.6rem]">
            <div>
                <h1 className="text-3xl font-bold text-center">Welcome to summereaseAI</h1>
                {/* <p>lorem</p> */}
            </div>

            <Link href="/translate" className="bg-blue-500 py-1 px-3 rounded-[.6rem] hover:bg-[#ebab16] border-b-[5px] border-r-[3px] border-[#0d3960] border-t-2 border-l-2 cursor-pointer"> Translation </Link>
            <Link href="/summarize" className="bg-blue-500 py-1 px-3 rounded-[.6rem] hover:bg-[#ebab16] border-b-[5px] border-r-[3px] border-[#0d3960] border-t-2 border-l-2 cursor-pointer"> Summary </Link>
            {/* <Link href="/translate-and-summarize" className="bg-blue-500 py-1 px-3 rounded-[.6rem] hover:bg-[#ebab16] border-b-[5px] border-r-[3px] border-[#0d3960] border-t-2 border-l-2 cursor-pointer">Translate and Summarize</Link> */}
            <p className="text-sm text-center">Note: This AI only works on Chrome and it won&apos;t work if you are yet to enable it</p>
        </div>
    )
}