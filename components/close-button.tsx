"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";


export default function CloseButton() {
    const router = useRouter();
    const onCloseClick = () => { router.back(); };
    return (
        <button onClick={onCloseClick}
            >
            <XMarkIcon className="size-10" />
        </button>
    );
}
