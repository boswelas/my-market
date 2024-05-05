"use server";
import bycrypt from "bcrypt";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from "@/lib/constants";
import db from "@/lib/database";
import { z } from "zod";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { IronSession } from "iron-session";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const checkUsername = (username: string) =>
    !username.includes("potato");

const checkPasswords = ({ password, confirm_password }: { password: string, confirm_password: string }) => password === confirm_password;

const checkUniqueUsername = async (username: string) => {
    const user = await db.user.findUnique({
        where: {
            username,
        },
        select: {
            id: true,
        },
    });
    return !Boolean(user);
};

const checkUniqueEmail = async (email: string) => {
    const user = await db.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
        },
    });
    return !Boolean(user);
};

const formSchema = z
    .object({
        username: z
            .string({
                invalid_type_error: "Username must be a string",
                required_error: "Where is your username?"
            })
            .toLowerCase()
            .trim()
            .transform(username => `${username}`)
            .refine(checkUsername, "No potatoes allowed!")
            .refine(checkUniqueUsername, "Username already taken"),
        email: z.string()
            .email()
            .toLowerCase()
            .refine(checkUniqueEmail, "Email already taken"),
        password: z.string()
            .min(PASSWORD_MIN_LENGTH),
        // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
        confirm_password: z.string()
        // .min(PASSWORD_MIN_LENGTH, PASSWORD_REGEX_ERROR)
    }).refine(checkPasswords, {
        message: "Passwords should match", path: ["confirm_password"]
    });


export async function createAccount(prevState: any, formData: FormData) {
    console.log(cookies());
    const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirm_password: formData.get("confirm_password"),
    };
    const result = await formSchema.safeParseAsync(data);
    if (!result.success) {
        console.log(result.error.flatten());
        return result.error.flatten();
    } else {
        const hashedPassword = await bycrypt.hash(result.data.password, 12);
        console.log(hashedPassword);
        //save the user to the database using prisma
        const user = await db.user.create({
            data: {
                username: result.data.username,
                email: result.data.email,
                password: hashedPassword,
            },
            select: {
                id: true,
            },
        });
        const session = await getSession();
        session.id = user.id;
        await session.save();
        redirect("/profile");
    }
}
