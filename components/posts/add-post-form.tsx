import Button from "./button";
import { uploadPost } from "@/app/(tabs)/board/add-post/actions";
import { useFormState } from "react-dom";
import Input from "./input";

export default function AddPostForm() {
    const [state, action] = useFormState(uploadPost, null);
    return (
        <div className="w-[30em] md:w-[45em]">
            <form action={action} className="p-5 flex flex-col gap-5 ">
                <div className="mb-2 ">
                    <Input
                        name="title"
                        required
                        placeholder="Title"
                        type="text">
                    </Input>
                </div>
                <div>
                    <textarea
                        className="bg-transparent rounded-lg w-full h-48 focus:outline-none ring-2
                        focus:ring-4 ring-neutral-200 focus:ring-emerald-500 border-none
                        placeholder:text-neutral-400"
                        name="description"
                        required
                        placeholder="Type post here..."
                    >
                    </textarea>
                </div>
                <div className="">
                    <Button text="Post" />
                </div>
            </form>
        </div>
    )
}
