"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { createAccount } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export default function CreateAccount() {
    const [state, dispatch] = useFormState(createAccount, null);
    return (
        <div className="flex flex-col items-center">
            <div className=" mt-[4%] w-[30em] md:w-[40em]">
                <div className="gap-10">
                    <div className="flex flex-col gap-2 *:font-medium">
                        <h1 className="text-2xl ">Welcome!</h1>
                        <h2 className="text-xl">Fill in the form below to join!</h2>
                    </div>
                    <div className="mt-6 ">
                        <form action={dispatch} className="flex flex-col gap-3 ">
                            <div>
                                <Input
                                    name="username"
                                    type="text"
                                    placeholder="Username"
                                    required
                                    errors={state?.fieldErrors.username}
                                    minLength={3}
                                    maxLength={10}
                                />
                            </div>
                            <div>

                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    required
                                    errors={state?.fieldErrors.email}
                                />
                            </div>
                            <div>

                                <Input
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    required
                                    errors={state?.fieldErrors.password}
                                    minLength={PASSWORD_MIN_LENGTH}
                                />
                            </div>
                            <div>

                                <Input
                                    name="confirm_password"
                                    type="password"
                                    placeholder="Confirm Password"
                                    required
                                    errors={state?.fieldErrors.confirm_password}
                                    minLength={PASSWORD_MIN_LENGTH}
                                />
                            </div>
                            <div className="mt-2">
                                <Button text={"Create Account"} />
                            </div>
                        </form>
                    </div>
                    <div className="mt-8 mb-8 flex flex-col items-center">
                        <span>- or -</span>
                    </div>
                    <div>
                        <SocialLogin />
                    </div>
                </div>
            </div>
        </div>
    );
}
