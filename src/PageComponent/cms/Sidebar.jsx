// src/PageComponent/cms/Sidebar.jsx

import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-6">CMS</h2>

      <ul className="space-y-3">
        <li><Link href="/admin">Dashboard</Link></li>
        <li><Link href="/admin/users">Users</Link></li>
        <li><Link href="/admin/banner">Banner</Link></li>
        <li><Link href="/admin/hero">Hero</Link></li>
      </ul>
    </div>
  );
}