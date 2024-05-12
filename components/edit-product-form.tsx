"use client"

import { updateProduct } from "@/app/products/edit/[id]/actions";
import Button from "@/components/button";
import Input from "@/components/input";
import { useState } from "react";
import { useFormState } from "react-dom";

interface EditFormProps {
    id: Number,
    title: string,
    photo: string,
    price: Number,
    description: string,
    userId: Number,
}

export default function EditProductForm({ id, title, photo, price, description, userId }: EditFormProps) {
    const [preview, setPreview] = useState(photo);
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
    const [state, action] = useFormState(updateProduct, null);
    console.log(photo);
    return (
        <div>
            <form action={action} className="p-5 flex flex-col gap-5">
                <label
                    htmlFor="photo"
                    className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
                    style={{
                        backgroundImage: `url(${preview})`,
                    }}
                >
                </label>
                <input id="id" name="id" className="hidden" defaultValue={id.toString()} />
                <input
                    onChange={onImageChange}
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    className="hidden"
                    defaultValue={`url(${photo})`}
                />
                <Input
                    name="title"
                    required
                    defaultValue={title}
                    type="text"
                    errors={state?.fieldErrors.title}
                />
                <Input
                    name="price"
                    type="number"
                    required
                    defaultValue={price.toString()}
                    errors={state?.fieldErrors.price}
                />
                <Input
                    name="description"
                    type="text"
                    required
                    defaultValue={description}
                    errors={state?.fieldErrors.description}
                />
                <Button text="Update" />
            </form>
            
        </div>
    )
}
