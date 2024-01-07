"use server";

import { revalidatePath } from "next/cache";

export async function revalidate(pathname: string) {
  revalidatePath(pathname);
}
