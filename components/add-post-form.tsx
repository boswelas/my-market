import Button from "./button";
import { uploadPost } from "@/app/(tabs)/life/add-post/actions";
import { useFormState } from "react-dom";
import Input from "./input";

export default function AddPostForm() {
    const [state, action] = useFormState(uploadPost, null);
    return (
        <div>
            <form action={action} className="p-5 flex flex-col gap-5">
                <div>
                    <Input name="title"
                        required
                        placeholder="Title"
                        type="text">
                    </Input>
                </div>
                <div>
                    <textarea
                        className="bg-transparent rounded-md w-full h-48 focus:outline-none ring-2
                        focus:ring-4 ring-neutral-200 focus:ring-orange-500 border-none
                        placeholder:text-neutral-400"
                        name="description"
                        required
                        placeholder="Type post here..."
                    >
                    </textarea>
                </div>
                <Button text="Post" />

            </form>
        </div>
    )
}
