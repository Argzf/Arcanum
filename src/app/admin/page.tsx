'use client';

import { useEffect, useState } from 'react';
import {
  getItems,
  createNewLink,
  uploadNewFile,
  updateExistingItem,
  deleteExistingItem,
  logout,
} from './actions';

type Item = {
  id: string;
  shortCode: string;
  destination: string | null;
  type: 'link' | 'file';
  fileName?: string | null;
  fileSize?: number | null;
  mimeType?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export default function AdminPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'links' | 'files'>('links');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formLink, setFormLink] = useState({ shortCode: '', destination: '' });
  const [formFile, setFormFile] = useState({ shortCode: '', file: null as File | null });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    const data = await getItems();
    setItems(data);
    setLoading(false);
  }

  async function handleCreateLink(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const result = await createNewLink(formLink.shortCode, formLink.destination);
    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: 'Link created!' });
      setFormLink({ shortCode: '', destination: '' });
      loadItems();
    }
  }

  async function handleUploadFile(e: React.FormEvent) {
    e.preventDefault();
    if (!formFile.file) {
      setMessage({ type: 'error', text: 'Please select a file' });
      return;
    }
    setMessage(null);
    const fd = new FormData();
    fd.append('shortCode', formFile.shortCode);
    fd.append('file', formFile.file);
    const result = await uploadNewFile(fd);
    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: 'File uploaded!' });
      setFormFile({ shortCode: '', file: null });
      loadItems();
      // reset file input
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  }

  async function handleUpdate(id: string) {
    setMessage(null);
    // For simplicity: we only allow updating shortCode for both types, and destination for links.
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newShortCode = formLink.shortCode;
    const newDestination = formLink.destination;
    const result = await updateExistingItem(id, newShortCode, newDestination);
    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: 'Updated!' });
      setEditingId(null);
      setFormLink({ shortCode: '', destination: '' });
      loadItems();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure?')) return;
    setMessage(null);
    const result = await deleteExistingItem(id);
    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: 'Deleted!' });
      loadItems();
    }
  }

  function startEdit(item: Item) {
    setEditingId(item.id);
    setFormLink({
      shortCode: item.shortCode,
      destination: item.destination || '',
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setFormLink({ shortCode: '', destination: '' });
  }

  const filteredItems = items.filter(item => 
    activeTab === 'links' ? item.type === 'link' : item.type === 'file'
  );

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  if (loading) return <div className="p-8 text-center dark:text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <button onClick={() => logout()} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Logout
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200'}`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('links')}
            className={`py-2 px-4 font-semibold ${activeTab === 'links' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 dark:text-gray-400'}`}
          >
            🔗 Links
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`py-2 px-4 font-semibold ${activeTab === 'files' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 dark:text-gray-400'}`}
          >
            📁 Files
          </button>
        </div>

        {/* Create/Edit Form */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
          {activeTab === 'links' ? (
            <>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{editingId ? 'Edit Link' : 'Create New Link'}</h2>
              <form onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdate(editingId); } : handleCreateLink}>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Short Code</label>
                  <input
                    type="text"
                    value={formLink.shortCode}
                    onChange={(e) => setFormLink({ ...formLink, shortCode: e.target.value })}
                    className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                    pattern="[a-zA-Z0-9\-_]+"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Destination URL</label>
                  <input
                    type="url"
                    value={formLink.destination}
                    onChange={(e) => setFormLink({ ...formLink, destination: e.target.value })}
                    className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    {editingId ? 'Update' : 'Create'}
                  </button>
                  {editingId && (
                    <button type="button" onClick={cancelEdit} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                  )}
                </div>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Upload File</h2>
              <form onSubmit={handleUploadFile}>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Short Code</label>
                  <input
                    type="text"
                    value={formFile.shortCode}
                    onChange={(e) => setFormFile({ ...formFile, shortCode: e.target.value })}
                    className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                    pattern="[a-zA-Z0-9\-_]+"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">File</label>
                  <input
                    id="fileInput"
                    type="file"
                    onChange={(e) => setFormFile({ ...formFile, file: e.target.files?.[0] || null })}
                    className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Upload</button>
              </form>
            </>
          )}
        </div>

        {/* Items Table */}
        <div className="bg-white dark:bg-gray-800 rounded shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Short URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  {activeTab === 'links' ? 'Destination' : 'File Name / Size'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredItems.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No items</td></tr>
              ) : (
                filteredItems.map(item => (
                  <tr key={item.id}>
                    <td className="px-6 py-4">
                      <a href={`${baseUrl}/${activeTab === 'links' ? 'links' : 'files'}/${item.shortCode}`} target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">
                        {baseUrl}/{activeTab}/{item.shortCode}
                      </a>
                    </td>
                    <td className="px-6 py-4 truncate max-w-xs">
                      {activeTab === 'links' ? (
                        <a href={item.destination!} target="_blank" className="text-gray-600 dark:text-gray-300 hover:underline">{item.destination}</a>
                      ) : (
                        <span className="text-gray-600 dark:text-gray-300">{item.fileName} ({(item.fileSize! / 1024).toFixed(1)} KB)</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {activeTab === 'links' && (
                        <button onClick={() => startEdit(item)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 mr-3">Edit</button>
                      )}
                      <button onClick={() => handleDelete(item.id)} className="text-red-600 dark:text-red-400 hover:text-red-900">Delete</button>
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
