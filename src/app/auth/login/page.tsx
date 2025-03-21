"use client";
import React, { useContext, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { communityname } from "@/utils";
import { LoginUser } from "@/services/AuthService";
import { useRouter } from "next/navigation";
import { GlobalContext } from "@/context";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";

export default function LoginFormDemo() {
  const { isAuthUser, setAuthUser,setRole,setUser } = useContext(GlobalContext);
  const router = useRouter();
  const [formData, setFormdata] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    console.log(formData);
    console.log("Form submitted");
    const res = await LoginUser(formData);
    console.log(res);
    if (res.success) {
      console.log("Login Success");
      setFormdata({ email: "", password: "" });
      setAuthUser(true);
      setRole(res.user.role);
      setUser(res.user)
      Cookies.set("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      router.push("/dashboard");
    } else {
      setFormdata({ email: "", password: "" });
    }
  };

  useEffect(() => {
    if (isAuthUser) {
      router.push("/dashboard");
    }
  }, [isAuthUser]);
  return (
    <div className=" h-screen flex justify-center items-center">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input border border-black bg-white  dark:bg-black ">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 py-5">
          Welcome to {communityname} community
        </h2>
        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
          
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Login to Access the Community Dashboard
        </p>

        <div className="my-8">
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="projectmayhem@fc.com"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormdata({ ...formData, email: e.target.value });
              }}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={formData.password}
              onChange={(e) => {
                setFormdata({ ...formData, password: e.target.value });
              }}
            />
          </LabelInputContainer>
          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            onClick={handleSubmit}
          >
            Login &rarr;
            <BottomGradient />
          </button>
        </div>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
