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
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  }

  async function handleUpdate(id: string) {
    setMessage(null);
    const item = items.find(i => i.id === id);
    if (!item) return;
    const result = await updateExistingItem(id, formLink.shortCode, formLink.destination);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8 animate-fade-in">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
          <button
            onClick={() => logout()}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg"
          >
            Logout
          </button>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`rounded-xl p-4 ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}>
            <p className={`text-sm ${message.type === 'success' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              {message.text}
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800/50 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('links')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'links' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
          >
            🔗 Links
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'files' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
          >
            📁 Files
          </button>
        </div>

        {/* Create/Edit Form */}
        <div className="glass-card rounded-2xl p-6">
          {activeTab === 'links' ? (
            <>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                {editingId ? 'Edit Link' : 'Create New Link'}
              </h2>
              <form onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdate(editingId); } : handleCreateLink} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short Code</label>
                  <input
                    type="text"
                    value={formLink.shortCode}
                    onChange={(e) => setFormLink({ ...formLink, shortCode: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-grad-end transition-all"
                    required
                    pattern="[a-zA-Z0-9\-_]+"
                    placeholder="e.g., myblog"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destination URL</label>
                  <input
                    type="url"
                    value={formLink.destination}
                    onChange={(e) => setFormLink({ ...formLink, destination: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-grad-end transition-all"
                    required
                    placeholder="https://example.com"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="bg-gradient-to-r from-grad-end to-grad-mid text-white px-6 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all">
                    {editingId ? 'Update' : 'Create'}
                  </button>
                  {editingId && (
                    <button type="button" onClick={cancelEdit} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Upload File</h2>
              <form onSubmit={handleUploadFile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short Code</label>
                  <input
                    type="text"
                    value={formFile.shortCode}
                    onChange={(e) => setFormFile({ ...formFile, shortCode: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-grad-end transition-all"
                    required
                    pattern="[a-zA-Z0-9\-_]+"
                    placeholder="e.g., myfile"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">File</label>
                  <input
                    id="fileInput"
                    type="file"
                    onChange={(e) => setFormFile({ ...formFile, file: e.target.files?.[0] || null })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-grad-end file:text-white hover:file:bg-grad-mid transition-all"
                    required
                  />
                </div>
                <button type="submit" className="bg-gradient-to-r from-grad-end to-grad-mid text-white px-6 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all">
                  Upload
                </button>
              </form>
            </>
          )}
        </div>

        {/* Items Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Short URL</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {activeTab === 'links' ? 'Destination' : 'File Name / Size'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No items yet. Create one above.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <a
                          href={`${baseUrl}/${activeTab === 'links' ? 'links' : 'files'}/${item.shortCode}`}
                          target="_blank"
                          className="text-blue-600 dark:text-blue-400 hover:underline font-mono text-sm"
                        >
                          {baseUrl}/{activeTab}/{item.shortCode}
                        </a>
                      </td>
                      <td className="px-6 py-4 truncate max-w-md">
                        {activeTab === 'links' ? (
                          <a href={item.destination!} target="_blank" className="text-gray-700 dark:text-gray-300 hover:underline text-sm">
                            {item.destination}
                          </a>
                        ) : (
                          <span className="text-gray-700 dark:text-gray-300 text-sm">
                            {item.fileName} ({(item.fileSize! / 1024).toFixed(1)} KB)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-3">
                        {activeTab === 'links' && (
                          <button onClick={() => startEdit(item)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium">
                            Edit
                          </button>
                        )}
                        <button onClick={() => handleDelete(item.id)} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium">
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
    </div>
  );
}
