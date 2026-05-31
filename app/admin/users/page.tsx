import { updateUserRole } from "@/app/actions/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-ink">Users</h1>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-mocha/10 text-left text-xs uppercase tracking-wider text-mocha">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mocha/10">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="p-4 font-medium text-ink">{user.name ?? "—"}</td>
                <td className="p-4 text-mocha-dark">
                  {user.email}
                  {user.emailVerified ? null : (
                    <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                      unverified
                    </span>
                  )}
                </td>
                <td className="p-4 text-mocha-dark">{user._count.orders}</td>
                <td className="p-4 text-mocha-dark">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <form action={updateUserRole} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={user.id} />
                    <select
                      name="role"
                      defaultValue={user.role}
                      className="rounded-lg border border-mocha/25 bg-white px-3 py-1.5 text-sm outline-none focus:border-mocha"
                    >
                      <option value="CUSTOMER">Customer</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                    <button
                      type="submit"
                      className="text-xs font-medium text-mocha hover:text-gold"
                    >
                      Update
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
