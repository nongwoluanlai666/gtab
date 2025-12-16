import React, { useState } from 'react';

const AddBookmarkModal = ({ onClose, onAddBookmark, currentFolder }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && url.trim()) {
      onAddBookmark({ 
        title: title.trim(), 
        url: url.trim(),
        type: "icon",
        src: "",
        backgroundColor: ""
      });
      setTitle('');
      setUrl('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800/90 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md border border-white/20 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {currentFolder ? `Add to "${currentFolder.name}"` : 'Add New Bookmark'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="Enter bookmark title"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="url" className="block text-sm font-medium mb-2">
              URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="https://example.com"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
            >
              Add Bookmark
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookmarkModal;