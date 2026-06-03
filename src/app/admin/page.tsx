'use client';

import { useEffect, useState } from 'react';
import { getLinks, createNewLink, updateExistingLink, deleteExistingLink, logout } from './actions';

type Link = {
  id: string;
  shortCode: string;
  destination: string;
  createdAt: Date;   // ✅ changed from string to Date
  updatedAt: Date;   // ✅ changed from string to Date
};

export default function AdminPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ shortCode: '', destination: '' });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadLinks();
  }, []);

  async function loadLinks() {
    const data = await getLinks();
    setLinks(data);
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const result = await createNewLink(form.shortCode, form.destination);
    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: 'Link created!' });
      setForm({ shortCode: '', destination: '' });
      loadLinks();
    }
  }

  async function handleUpdate(id: string) {
    setMessage(null);
    const result = await updateExistingLink(id, form.shortCode, form.destination);
    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: 'Link updated!' });
      setEditingId(null);
      setForm({ shortCode: '', destination: '' });
      loadLinks();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure?')) return;
    setMessage(null);
    const result = await deleteExistingLink(id);
    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: 'Link deleted!' });
      loadLinks();
    }
  }

  function startEdit(link: Link) {
    setEditingId(link.id);
    setForm({ shortCode: link.shortCode, destination: link.destination });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ shortCode: '', destination: '' });
  }

  const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}/` : '/';

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button onClick={() => logout()} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Logout
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {/* Create / Edit Form */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-3">{editingId ? 'Edit Link' : 'Create New Link'}</h2>
          <form onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdate(editingId); } : handleCreate}>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Short Code</label>
              <input
                type="text"
                value={form.shortCode}
                onChange={(e) => setForm({ ...form, shortCode: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="e.g., google"
                required
                pattern="[a-zA-Z0-9\-_]+"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Destination URL</label>
              <input
                type="url"
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="https://example.com"
                required
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                {editingId ? 'Update' : 'Create'}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Links Table */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Short URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destination</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {links.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No links yet. Create one!</td>
                </tr>
              ) : (
                links.map((link) => (
                  <tr key={link.id}>
                    <td className="px-6 py-4">
                      <a href={baseUrl + link.shortCode} target="_blank" className="text-blue-600 hover:underline">
                        {baseUrl + link.shortCode}
                      </a>
                    </td>
                    <td className="px-6 py-4 truncate max-w-xs">
                      <a href={link.destination} target="_blank" className="text-gray-600 hover:underline">
                        {link.destination}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button onClick={() => startEdit(link)} className="text-indigo-600 hover:text-indigo-900 mr-3">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(link.id)} className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
