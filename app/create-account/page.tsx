import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function CreateAccount() {
    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl ">Welcome!</h1>
                <h2 className="text-xl">Fill in the form below to join!</h2>
            </div>
            <form className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <input type="text" placeholder="Username" required
                        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-1
                        focus:ring-2 ring-neutral-200 focus:ring-orange-500 border-none
                        placeholder:text-neutral-400" />
                    <span className="text-red-500 font-medium">Input error</span>
                </div>
                <button className="primary-btn h-10 text-lg">Create Account</button>
            </form>
            <div className="w-full h-px bg-neutral-500" />
            <div>
                <Link className="primary-btn flex h-10 items-center justify-center gap-3" href={"/sms"}>
                    <span><ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" /></span>
                    <span>Sign up with SMS</span>
                </Link>
            </div>
        </div>
    );
}
