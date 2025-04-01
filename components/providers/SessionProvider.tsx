"use client";

import { signOut } from "@aws-amplify/auth";
import { parseAmplifyConfig } from "@aws-amplify/core/internals/utils";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { redirect } from "next/navigation";

import outputs from "@/amplify_outputs.json";
import AppSidebar from "@/components/ui/app-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  SidebarTrigger,
  SidebarProvider as Sidebar,
} from "@/components/ui/sidebar";

const amplifyConfig = parseAmplifyConfig(outputs);

Amplify.configure(amplifyConfig);

const signOutRedirect = async () => {
  await signOut();
  redirect("/");
};

function Home({ children }: { children: React.ReactNode }) {
  return (
    <Sidebar>
      <AppSidebar />
      <main className="h-screen w-screen flex flex-col">
        <nav className="flex items-center justify-between h-16 bg-[var(--sidebar)] px-6 border-b border-b-[var(--border)]">
          <SidebarTrigger size={"lg"} />
          <div className="flex gap-3 items-center justify-around">
            <Avatar className="w-10 h-10">
              <AvatarImage />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
            <Button
              size={"sm"}
              className="text-xs cursor-pointer"
              onClick={signOutRedirect}
            >
              Sign out
            </Button>
          </div>
        </nav>
        {children}
      </main>
    </Sidebar>
  );
}

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  return authStatus === "authenticated" ? (
    <Home>{children}</Home>
  ) : (
    <Authenticator />
  );
}
