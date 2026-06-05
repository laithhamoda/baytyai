"use server";

import { signIn, signOut } from "@/auth";

export async function signInLinkedIn() {
  await signIn("linkedin", { redirectTo: "/" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
