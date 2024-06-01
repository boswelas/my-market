"use server";
import bycrypt from "bcrypt";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from "@/lib/constants";
import db from "@/lib/database";
import { z } from "zod";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const defaultIcon = "https://firebasestorage.googleapis.com/v0/b/my-market-6f3dd.appspot.com/o/avatars%2Fdefaulticon.jpg?alt=media&token=2dbfdaf4-6ed4-4c3a-8900-45d4faf6cdb3"
const checkPasswords = ({ password, confirm_password }: { password: string, confirm_password: string }) => password === confirm_password;

const formSchema = z
    .object({
        username: z
            .string({
                invalid_type_error: "Username must be a string",
                required_error: "Where is your username?"
            })
            .toLowerCase()
            .trim()
            .transform(username => `${username}`),
        email: z.string()
            .email()
            .toLowerCase(),
        password: z.string()
            .min(PASSWORD_MIN_LENGTH),
        // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
        confirm_password: z.string()
        // .min(PASSWORD_MIN_LENGTH, PASSWORD_REGEX_ERROR)
    }).superRefine(async ({ username }, ctx) => {
        const user = await db.user.findUnique({
            where: {
                username
            },
            select: {
                id: true,
            }
        });
        if (user) {
            ctx.addIssue({
                code: 'custom',
                message: "This username is already taken.",
                path: ["username"],
                fatal: true,
            });
            return z.NEVER;
        }
    })
    .superRefine(async ({ email }, ctx) => {
        const user = await db.user.findUnique({
            where: {
                email
            },
            select: {
                id: true,
            }
        });
        if (user) {
            ctx.addIssue({
                code: 'custom',
                message: "This email is already taken.",
                path: ["email"],
                fatal: true,
            });
            return z.NEVER;
        }
    }).refine(checkPasswords, {
        message: "Passwords must match", path: ["confirm_password"]
    });


export async function createAccount(prevState: any, formData: FormData) {
    const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirm_password: formData.get("confirm_password"),
    };
    const result = await formSchema.spa(data);
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
                avatar: defaultIcon,
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
