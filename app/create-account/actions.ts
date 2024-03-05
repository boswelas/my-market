"use server";
import { userAgent } from "next/server";
import { z } from "zod";

// At least one uppercase letter, one lowercase letter, one number and one special character
const passwordRegex = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[#?!@$%^&*-]).+$/
);

const checkUsername = (username: string) =>
    !username.includes("potato");

const checkPasswords = ({ password, confirm_password }: { password: string, confirm_password: string }) => password === confirm_password

const formSchema = z.object({
    username: z.string({
        invalid_type_error: "Username must be a string",
        required_error: "Where is your username?"
    }).min(5, "Way too short!").max(10, "That is too long!").toLowerCase().trim().transform(username => `un`)
        .refine(checkUsername, "No potatoes allowed!"),
    email: z.string().email().toLowerCase(),
    password: z.string().min(10).regex(passwordRegex, "A password must contain a lowercase, uppercase, number, and special character."),
    confirm_password: z.string().min(10, "Passwords must be at least 10 characters.")
}).refine(checkPasswords, {
    message: "Passwords should match", path: ["confirm_password"]
});


export async function createAccount(prevState: any, formData: FormData) {
    const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirm_password: formData.get("confirm_password")
    };
    const result = formSchema.safeParse(data);
    if (!result.success) {
        console.log(result.error.flatten());
        return result.error.flatten();
    } else {
        console.log(result.data);
    }
}
