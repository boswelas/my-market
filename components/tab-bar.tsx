"use client";

import {
  HomeIcon as SolidHomeIcon,
  NewspaperIcon as SolidNewspaperIcon,
  ChatBubbleOvalLeftEllipsisIcon as SolidChatIcon,
  UserIcon as SolidUserIcon,
} from "@heroicons/react/24/solid";
import {
  HomeIcon as OutlineHomeIcon,
  NewspaperIcon as OutlineNewspaperIcon,
  ChatBubbleOvalLeftEllipsisIcon as OutlineChatIcon,
  UserIcon as OutlineUserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { checkLoggedIn } from "@/app/(tabs)/home/actions";
import { useState, useEffect } from "react";

export default function TabBar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const fetchLoginStatus = async () => {
      const status = await checkLoggedIn();
      setIsLoggedIn(status);
    };

    fetchLoginStatus();
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 mx-auto max-w-screen-full border-t px-5 py-3 bg-neutral-800 border-b-[.05em] border-black">
      <ul className="flex justify-between items-center">
        <div className="grid grid-cols-4 md:max-w-[30%] lg:max-w-[25%] max-w-[60%] items-center gap-8">
          <li>
            <Link href="/home" className="flex items-center">
              {pathname === "/home" ? (
                <SolidHomeIcon className="w-5 h-5 text-white" />
              ) : (
                <OutlineHomeIcon className="w-5 h-5 text-white" />
              )}
              <span className="ml-1 text-sm text-white">Home</span>
            </Link>
          </li>
          <li>
            <Link href="/board" className="flex items-center">
              {pathname === "/board" ? (
                <SolidNewspaperIcon className="w-5 h-5 text-white" />
              ) : (
                <OutlineNewspaperIcon className="w-5 h-5 text-white" />
              )}
              <span className="ml-1 text-sm text-white">Board</span>
            </Link>
          </li>
          <li>
            <Link href="/chat" className="flex items-center">
              {pathname === "/chat" ? (
                <SolidChatIcon className="w-5 h-5 text-white" />
              ) : (
                <OutlineChatIcon className="w-5 h-5 text-white" />
              )}
              <span className="ml-1 text-sm text-white">Chat</span>
            </Link>
          </li>
          {isLoggedIn && <li>
            <Link href="/home/add" className="bg-emerald-600 flex items-center justify-center rounded-md 
            w-36 p-1 text-white hover:bg-emerald-500">
              Post Product
            </Link>
          </li>}

        </div>
        <div className="flex items-center mr-2">
          <li>
            {isLoggedIn ? (
              <Link href="/profile" className="flex items-center">
                {pathname === "/profile" ? (
                  <SolidUserIcon className="w-5 h-5 text-white" />
                ) : (
                  <OutlineUserIcon className="w-5 h-5 text-white" />
                )}
                <span className="ml-2 text-sm text-white">Profile</span>
              </Link>
            ) : (
              <Link href="/home-login" className="flex items-center">
                <span className="ml-2 text-sm text-white">Log in / Sign up</span>
              </Link>
            )}
          </li>
        </div>
      </ul>
    </div>
  );
}
