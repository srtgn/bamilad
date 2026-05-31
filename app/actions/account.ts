"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { addressSchema } from "@/lib/validations";

export type AddressState = { error?: string; success?: string } | undefined;

export async function addAddressAction(
  _prev: AddressState,
  formData: FormData,
): Promise<AddressState> {
  const session = await auth();
  if (!session?.user) return { error: "You must be signed in." };

  const parsed = addressSchema.safeParse({
    fullName: formData.get("fullName"),
    line1: formData.get("line1"),
    line2: formData.get("line2") || undefined,
    city: formData.get("city"),
    state: formData.get("state") || undefined,
    postalCode: formData.get("postalCode"),
    country: formData.get("country"),
    phone: formData.get("phone") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const count = await prisma.address.count({ where: { userId: session.user.id } });
  await prisma.address.create({
    data: { ...parsed.data, userId: session.user.id, isDefault: count === 0 },
  });

  revalidatePath("/account/addresses");
  return { success: "Address saved." };
}

export async function deleteAddressAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) return;
  const id = String(formData.get("id"));
  // userId guard ensures users can only delete their own addresses.
  await prisma.address.deleteMany({ where: { id, userId: session.user.id } });
  revalidatePath("/account/addresses");
}

export async function setDefaultAddressAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) return;
  const id = String(formData.get("id"));
  await prisma.$transaction([
    prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    }),
    prisma.address.updateMany({
      where: { id, userId: session.user.id },
      data: { isDefault: true },
    }),
  ]);
  revalidatePath("/account/addresses");
}
