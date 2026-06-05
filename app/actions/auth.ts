"use server";

import { signIn, signOut, auth } from "@/auth";
import { redirect } from "next/navigation";

export async function signInLinkedIn() {
  const session = await auth();

  // If already authenticated, redirect to home
  if (session?.user) {
    redirect("/");
  }

  // Initiate OAuth flow
  await signIn("linkedin", { redirectTo: "/" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
