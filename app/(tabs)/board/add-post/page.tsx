"use client";

import AddPostForm from "@/components/posts/add-post-form";
import CloseButton from "@/components/close-button";

export default function addPost() {

    return (
        <>
            <div className="flex flex-col items-center max-h-screen">
                <div className="absolute right-[2%] sm:right-[5%] lg:right-[10%] sm:top-[2.5%] lg:top-[5%]">
                    <CloseButton />
                </div>
                <div className="mt-24">
                    <AddPostForm />
                </div>
            </div>
        </>
    );
}
