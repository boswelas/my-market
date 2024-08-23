"use client";

import AddPostForm from "@/components/add-post-form";
import CloseButton from "@/components/close-button";

export default function addPost() {

    return (
        <>
            <div className="flex flex-col items-center max-h-screen">
                <CloseButton />
                <div className="mt-24">
                    <AddPostForm />
                </div>
            </div>
        </>
    );
}
