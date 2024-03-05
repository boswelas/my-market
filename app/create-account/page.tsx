"use client";
import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useFormState } from "react-dom";
import { createAccount } from "./actions";

export default function CreateAccount() {
    const [state, dispatch] = useFormState(createAccount, null);
    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl ">Welcome!</h1>
                <h2 className="text-xl">Fill in the form below to join!</h2>
            </div>
            <form action={dispatch} className="flex flex-col gap-3">
                <FormInput
                    name="username"
                    type="text"
                    placeholder="Username"
                    required
                    errors={state?.fieldErrors.username}
                />
                <FormInput
                    name="email"
                    type="Email"
                    placeholder="email"
                    required
                    errors={state?.fieldErrors.email}
                />
                <FormInput
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    errors={state?.fieldErrors.password}
                />
                <FormInput
                    name="confirm_password"
                    type="password"
                    placeholder="Confirm Password"
                    required
                    errors={state?.fieldErrors.confirm_password}
                />
                <FormButton text={"Create Account"} />
            </form>
            <SocialLogin />
        </div>
    );
}
