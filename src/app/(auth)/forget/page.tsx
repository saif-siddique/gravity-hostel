"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Page = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [found, setFound] = useState(false);
    const [passwords, setPasswords] = useState({
        newpass: "",
        confirmpass: "",
    });
    const [submitLoading, setSubmitLoading] = useState(false);

    const handleForget = async (e: any) => {
        e.preventDefault();
        try {
            setIsLoading(true);

            const result = await axios.get(`/api/auth/forget?email=${email}`);

            if (result.data?.success) {
                toast.success("User Found");
                setFound(true);
            }
        } catch (error) {
            toast.error("User with this email doesn't exist");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPass = async (e: any) => {
        e.preventDefault();

        try {
            if (passwords.newpass !== passwords.confirmpass) {
                toast.error("Passwords do not match");
                return;
            }

            setSubmitLoading(true);

            const result = await axios.post("/api/auth/resetpassword", {
                email,
                password: passwords.newpass,
            });

            if (result.data.success) {
                toast.success("Password changed successfully");
            }
            router.push('/login')
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <>
            {!found && (
                <div className="min-w-full min-h-screen flex justify-center items-center">
                    <Card className="max-w-md mx-auto shadow-lg rounded-2xl border">
                        <CardHeader className="space-y-1 text-center">
                            <CardTitle className="text-2xl font-semibold">
                                Forgot Password
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleForget} className="flex flex-col gap-5">
                                <Input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    placeholder="example@email.com"
                                />

                                <Button disabled={isLoading}>
                                    {isLoading ? <Loader2 className="animate-spin" /> : "Find Account"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {found && (
                <div className="min-h-screen flex items-center justify-center px-4">
                    <Card className="w-full max-w-md shadow-lg rounded-2xl">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-semibold">
                                Reset Password
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleResetPass} className="flex flex-col gap-5">
                                <Input
                                    type="password"
                                    placeholder="New password"
                                    value={passwords.newpass}
                                    onChange={(e) =>
                                        setPasswords({
                                            ...passwords,
                                            newpass: e.target.value,
                                        })
                                    }
                                />

                                <Input
                                    type="password"
                                    placeholder="Confirm password"
                                    value={passwords.confirmpass}
                                    onChange={(e) =>
                                        setPasswords({
                                            ...passwords,
                                            confirmpass: e.target.value,
                                        })
                                    }
                                />

                                <Button disabled={submitLoading}>
                                    {submitLoading ? <Loader2 className="animate-spin" /> : "Reset Password"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
};

export default Page;