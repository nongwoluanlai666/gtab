import React, { useState } from 'react';

const AddBookmarkModal = ({ onClose, onAddBookmark, currentFolder }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [isFolder, setIsFolder] = useState(false);
  const [folderSize, setFolderSize] = useState('1x1');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFolder) {
      // Create a folder
      if (title.trim()) {
        onAddBookmark({ 
          title: title.trim(), 
          url: '', // folders don't have URLs
          type: "folder",
          size: folderSize,
          children: []
        });
        setTitle('');
      }
    } else {
      // Create a bookmark
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
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800/90 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md border border-white/20 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {currentFolder ? `Add to "${currentFolder.name}"` : 'Add New Bookmark/Folder'}
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
            <div className="flex space-x-2 mb-3">
              <button
                type="button"
                onClick={() => setIsFolder(false)}
                className={`px-3 py-1 rounded-lg text-sm ${!isFolder ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                Bookmark
              </button>
              <button
                type="button"
                onClick={() => setIsFolder(true)}
                className={`px-3 py-1 rounded-lg text-sm ${isFolder ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                Folder
              </button>
            </div>
            
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              {isFolder ? 'Folder Name' : 'Title'}
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder={isFolder ? "Enter folder name" : "Enter bookmark title"}
              required
            />
          </div>

          {!isFolder && (
            <div className="mb-4">
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
                required={!isFolder}
              />
            </div>
          )}

          {isFolder && (
            <div className="mb-4">
              <label htmlFor="folderSize" className="block text-sm font-medium mb-2">
                Folder Size
              </label>
              <select
                id="folderSize"
                value={folderSize}
                onChange={(e) => setFolderSize(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              >
                <option value="1x1">1x1 (Default)</option>
                <option value="2x2">2x2</option>
                <option value="2x3">2x3</option>
                <option value="3x2">3x2</option>
                <option value="3x3">3x3</option>
              </select>
            </div>
          )}

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
              {isFolder ? 'Create Folder' : 'Add Bookmark'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookmarkModal;