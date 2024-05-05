"use server";

import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from "@/lib/constants";
import { z } from "zod";
import { redirect } from "next/navigation";
import db from "@/lib/database";
import bcrypt from "bcrypt";
import getSession from "@/lib/session";


const checkEmailExists = async (email: string) => {
    const user = await db.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
        },
    });
    return Boolean(user);
};

const formSchema = z.object({
    email: z.string().email().toLowerCase().refine(checkEmailExists, "No account with this email."),
    password: z.string({
        required_error: "Password is required."
    })
    // .min(PASSWORD_MIN_LENGTH)
    // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

export async function login(prevState: any, formData: FormData) {
    const data = {
        email: formData.get("email"),
        password: formData.get("password"),
    };
    const result = await formSchema.safeParseAsync(data);
    if (!result.success) {
        return result.error.flatten();
    } else {
        const user = await db.user.findUnique({
            where: {
                email: result.data.email
            },
            select: {
                password: true,
                id: true
            }
        })
        const ok = await bcrypt.compare(result.data.password, user!.password ?? "");
        if (ok) {
            const session = await getSession();
            session.id = user!.id;
            redirect("/profile");
            // log user in
            // redirect profile
        }
        else {
            return {
                fieldErrors: {
                    password: ["Incorrect password"],
                    email: [],
                },
            };
        }
    }
}
