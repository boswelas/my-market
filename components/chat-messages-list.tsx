"use client"

import { InitialChatMessages } from "@/app/chats/[id]/page";
import { GetChatMessageTime } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { RealtimeChannel, createClient } from "@supabase/supabase-js";
import { saveMessage } from "@/app/chats/actions";
import CloseButton from "./close-button";

const SUPABASE_PUBLIC_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yanJtb3hqa294Y2N4YnF2c2V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUzNjgxMDcsImV4cCI6MjAzMDk0NDEwN30.oSXm_kBBRyGEaCNZp1qzq1t3glV1AKTtUqREcTA_xJg";
const SUPABASE_URL = "https://mrjrmoxjkoxccxbqvsez.supabase.co";

interface ChatMessageListProps {
    initialMessages: InitialChatMessages;
    userId: number;
    chatRoomId: string;
    username: string;
    avatar: string;
}

export default function ChatMessagesList({ initialMessages, userId, chatRoomId, username, avatar }: ChatMessageListProps) {
    const [messages, setMessages] = useState(initialMessages);
    const [message, setMessage] = useState("");
    const channel = useRef<RealtimeChannel>();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef(true);

    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    useEffect(() => {
        if (isInitialMount.current) {
            scrollToBottom('auto');
            isInitialMount.current = false;
        } else {
            scrollToBottom('smooth');
        }
    }, [messages]);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { value },
        } = event;
        setMessage(value);
    };

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessages(prevMsgs => [...prevMsgs, {
            id: Date.now(),
            payload: message,
            created_at: new Date(),
            userId,
            user: {
                username,
                avatar,
            }
        }]);
        channel.current?.send({
            type: "broadcast",
            event: "message",
            payload: {
                id: Date.now(), payload: message, created_at: new Date(), userId,
                user: { username, avatar }
            },
        });
        await saveMessage(message, chatRoomId);
        setMessage("");
    };

    useEffect(() => {
        const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
        channel.current = client.channel(`room-${chatRoomId}`);
        channel.current.on("broadcast", { event: "message" },
            (payload) => { setMessages((prevMsgs) => [...prevMsgs, payload.payload]) }).subscribe();
        return () => {
            channel.current?.unsubscribe();
        }
    }, [chatRoomId]);

    return (
        <div className="p-5 flex flex-col h-screen max-w-7xl">

            <div className="flex-1 overflow-y-auto mb-4 no-scrollbar">
                <CloseButton />
                {messages.map((message, index) => (
                    <div key={message.id}>
                        {index > 0 && new Date(messages[index - 1].created_at).toDateString() !== new Date(message.created_at).toDateString() && (
                            <div className="flex justify-center w-full my-8 relative">
                                <div className="absolute top-0 left-0 right-0 text-center">
                                    <span className="text-sm text-neutral-400">{new Date(message.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                            </div>
                        )}
                        <div className={`flex gap-2 items-start ${message.userId === userId ? "justify-end" : ""}`} style={{ marginBottom: '1rem' }}>
                            <Image
                                src={message.user.avatar!}
                                alt={message.user.username}
                                width={50}
                                height={50}
                                className="size-8 rounded-full"
                            />
                            <div>
                                <div className="flex gap-1 items-center">
                                    <span className="text-xs">{message.user.username}</span>
                                    <span className="text-xs">{GetChatMessageTime(message.created_at)}</span>
                                </div>
                                <div className={`flex flex-col gap-1 ${message.userId === userId ? "items-end" : ""}`}>
                                    <span className={`${message.userId === userId ? "bg-neutral-500" : "bg-orange-500"} p-2.5 rounded-md max-w-96 max-h-[5rem] overflow-hidden`}>
                                        {message.payload}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}


                <div ref={messagesEndRef} />
            </div>
            <form className="flex items-center" onSubmit={onSubmit}>
                <input
                    required
                    onChange={onChange}
                    value={message}
                    className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
                    type="text"
                    name="message"
                    placeholder="Write message..."
                />
                <button className="ml-2">
                    <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
                </button>
            </form>
        </div >
    );
}
