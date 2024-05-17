"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";


export default function CloseProductButton() {
    const router = useRouter();

    const onCloseClick = () => { router.push("/home"); };
    return (
        <button onClick={onCloseClick}
            className="absolute right-5 top-5">
            <XMarkIcon className="size-10" />
        </button>
    );
}
