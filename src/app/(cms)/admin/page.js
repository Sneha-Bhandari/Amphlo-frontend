import Link from "next/link";

export default function AdminPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to CMS</p>
      <Link href="/admin/users">Go to Users</Link>
    </div>
  );
}