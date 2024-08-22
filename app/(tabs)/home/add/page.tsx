"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { uploadProduct } from "./actions";
import { useFormState } from "react-dom";
import AddProductCloseButton from "@/components/add-product-close";

export default function AddProduct() {
    const [preview, setPreview] = useState("");

    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { files },
        } = event;
        if (!files) {
            return;
        }
        const file = files[0];
        const url = URL.createObjectURL(file);
        setPreview(url);
    };
    const [state, action] = useFormState(uploadProduct, null);

    return (
        <div className="max-h-screen">
            <AddProductCloseButton />
            <form action={action} className="flex flex-col gap-5 max-w-xl mx-auto mt-16" >
                <label
                    htmlFor="photo"
                    className="h-[23.5rem] border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
                    style={{
                        backgroundImage: `url(${preview})`,
                    }}
                >
                    {preview === "" ? (
                        <>
                            <PhotoIcon className="w-20" />
                            <div className="text-neutral-400 text-sm">
                                Please upload photo.
                                {state?.fieldErrors.photo}
                            </div>
                        </>
                    ) : null}
                </label>
                <input
                    onChange={onImageChange}
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    className="hidden"
                />
                <Input
                    name="title"
                    required
                    placeholder="title"
                    type="text"
                    errors={state?.fieldErrors.title}
                />
                <Input
                    name="price"
                    type="number"
                    required
                    placeholder="price"
                    errors={state?.fieldErrors.price}
                />
                <Input
                    name="description"
                    type="text"
                    required
                    placeholder="description"
                    errors={state?.fieldErrors.description}
                />
                <div className="mb-2">
                    <Button text="Upload" />
                </div>
            </form>
        </div >
    );
}
