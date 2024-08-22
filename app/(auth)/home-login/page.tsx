import Link from "next/link";
import "@/lib/database";
import Image from "next/image";


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen mt-[10%]">
      <div className="max-w-screen-md">
        <div className="my-auto flex flex-col items-center gap-3 *:font-medium">
          <span className="text-9xl"></span>
          <h1 className="text-4xl">My Market</h1>
          <Image src="/shopping_bags.png" width={200} height={150} alt="" />

          <h2 className="text-2xl">Welcome to Your Market</h2>
        </div>
        <div className="flex flex-col items-center gap-4 w-full mt-20">
          <Link href="/create-account"
            className="primary-btn py-2.5">Create Account</Link>
          <div className="flex gap-2">
            <span>Already a member?</span>
            <Link href="/login" className="hover:underline">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
