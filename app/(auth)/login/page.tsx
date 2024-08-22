"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { login } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";


export default function LogIn() {
    const [state, action] = useFormState(login, null);
    return (
        <div className="">
            <div className="flex flex-col items-center mt-[5%]">
                <div className="w-[30%] flex flex-col gap-10 ">
                    <div className="flex flex-col gap-2 *:font-medium">
                        <h1 className="text-2xl ">Welcome!</h1>
                        <h2 className="text-xl">Log in with email and password</h2>
                    </div>
                    <form action={action} className="flex flex-col gap-3">
                        <Input
                            name="email"
                            type="email"
                            placeholder="Email"
                            required
                            errors={state?.fieldErrors.email} />
                        <Input
                            name="password"
                            type="password"
                            placeholder="Password"
                            required
                            minLength={PASSWORD_MIN_LENGTH}
                            errors={state?.fieldErrors.password} />
                        <Button text={"Log In"} />
                    </form>
                    <SocialLogin />
                </div>
            </div>
        </div>
    );
}
