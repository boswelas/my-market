"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { redirect, useRouter } from "next/navigation";


export default function AddProductCloseButton() {
    const router = useRouter();
    const onCloseClick = () => { router.push('/home'); };
    return (
        <button onClick={onCloseClick}
            className="absolute right-5">
            <XMarkIcon className="size-10" />
        </button>
    );
}
