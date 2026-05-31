import type { Metadata } from "next";

import { auth } from "@/auth";
import {
  deleteAddressAction,
  setDefaultAddressAction,
} from "@/app/actions/account";
import { AddressForm } from "@/components/account/address-form";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Addresses" };

export default async function AddressesPage() {
  const session = await auth();
  const addresses = await prisma.address.findMany({
    where: { userId: session!.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-ink">Addresses</h1>

      {addresses.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="relative rounded-2xl border border-mocha/10 p-5 text-sm text-mocha-dark"
            >
              {address.isDefault ? (
                <span className="absolute right-4 top-4 rounded-full bg-mocha/10 px-2.5 py-1 text-xs font-medium text-mocha">
                  Default
                </span>
              ) : null}
              <p className="font-medium text-ink">{address.fullName}</p>
              <p>{address.line1}</p>
              {address.line2 ? <p>{address.line2}</p> : null}
              <p>
                {address.city}
                {address.state ? `, ${address.state}` : ""} {address.postalCode}
              </p>
              <p>{address.country}</p>
              {address.phone ? <p>{address.phone}</p> : null}

              <div className="mt-4 flex gap-4 text-xs">
                {!address.isDefault ? (
                  <form action={setDefaultAddressAction}>
                    <input type="hidden" name="id" value={address.id} />
                    <button type="submit" className="font-medium text-mocha hover:text-gold">
                      Set as default
                    </button>
                  </form>
                ) : null}
                <form action={deleteAddressAction}>
                  <input type="hidden" name="id" value={address.id} />
                  <button type="submit" className="font-medium text-mocha hover:text-red-600">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-mocha-dark">No saved addresses yet.</p>
      )}

      <div className="mt-8 max-w-2xl">
        <AddressForm />
      </div>
    </div>
  );
}
