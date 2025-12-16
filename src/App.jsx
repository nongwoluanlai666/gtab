import React, { useState, useEffect } from 'react';
import BookmarksPanel from './components/BookmarksPanel';
import AddBookmarkModal from './components/AddBookmarkModal';
import FolderView from './components/FolderView';
import { DragDropContext } from 'react-beautiful-dnd';

const App = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarks');
    const savedFolders = localStorage.getItem('folders');
    
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
    
    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    }
  }, []);

  // Save data to localStorage whenever bookmarks or folders change
  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('folders', JSON.stringify(folders));
  }, [folders]);

  const handleAddBookmark = (bookmark) => {
    if (currentFolder) {
      // Add bookmark to folder
      setFolders(prevFolders => 
        prevFolders.map(folder => 
          folder.id === currentFolder.id 
            ? { ...folder, bookmarks: [...(folder.bookmarks || []), { ...bookmark, id: Date.now() }] }
            : folder
        )
      );
    } else {
      // Add bookmark to main panel
      setBookmarks(prevBookmarks => [...prevBookmarks, { ...bookmark, id: Date.now() }]);
    }
    setShowAddModal(false);
  };

  const handleDeleteBookmark = (id, fromFolder = false) => {
    if (fromFolder && currentFolder) {
      setFolders(prevFolders =>
        prevFolders.map(folder =>
          folder.id === currentFolder.id
            ? { ...folder, bookmarks: folder.bookmarks.filter(b => b.id !== id) }
            : folder
        )
      );
    } else {
      setBookmarks(prevBookmarks => prevBookmarks.filter(b => b.id !== id));
    }
  };

  const handleUpdateBookmark = (updatedBookmark, fromFolder = false) => {
    if (fromFolder && currentFolder) {
      setFolders(prevFolders =>
        prevFolders.map(folder =>
          folder.id === currentFolder.id
            ? {
                ...folder,
                bookmarks: folder.bookmarks.map(b =>
                  b.id === updatedBookmark.id ? updatedBookmark : b
                )
              }
            : folder
        )
      );
    } else {
      setBookmarks(prevBookmarks =>
        prevBookmarks.map(b => (b.id === updatedBookmark.id ? updatedBookmark : b))
      );
    }
  };

  const handleCreateFolder = (folderName) => {
    const newFolder = {
      id: Date.now(),
      name: folderName,
      bookmarks: []
    };
    setFolders(prevFolders => [...prevFolders, newFolder]);
  };

  const handleDeleteFolder = (folderId) => {
    setFolders(prevFolders => prevFolders.filter(folder => folder.id !== folderId));
    if (currentFolder?.id === folderId) {
      setCurrentFolder(null);
    }
  };

  const handleDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'folder') {
      const newFolderOrder = Array.from(folders);
      const movedFolder = newFolderOrder[source.index];
      
      newFolderOrder.splice(source.index, 1);
      newFolderOrder.splice(destination.index, 0, movedFolder);
      
      setFolders(newFolderOrder);
      return;
    }

    if (source.droppableId === 'bookmarks' && destination.droppableId === 'bookmarks') {
      // Reorder bookmarks in main panel
      const newBookmarks = Array.from(bookmarks);
      const movedBookmark = newBookmarks[source.index];
      
      newBookmarks.splice(source.index, 1);
      newBookmarks.splice(destination.index, 0, movedBookmark);
      
      setBookmarks(newBookmarks);
    } else if (source.droppableId.startsWith('folder-') && destination.droppableId.startsWith('folder-')) {
      // Move bookmark between folders
      const sourceFolderId = parseInt(source.droppableId.split('-')[1]);
      const destFolderId = parseInt(destination.droppableId.split('-')[1]);
      
      if (sourceFolderId === destFolderId) {
        // Reorder within same folder
        const folderIndex = folders.findIndex(f => f.id === sourceFolderId);
        if (folderIndex !== -1) {
          const newFolders = [...folders];
          const newFolderBookmarks = Array.from(newFolders[folderIndex].bookmarks);
          const movedBookmark = newFolderBookmarks[source.index];
          
          newFolderBookmarks.splice(source.index, 1);
          newFolderBookmarks.splice(destination.index, 0, movedBookmark);
          
          newFolders[folderIndex] = { ...newFolders[folderIndex], bookmarks: newFolderBookmarks };
          setFolders(newFolders);
        }
      } else {
        // Move from one folder to another
        const sourceFolderIndex = folders.findIndex(f => f.id === sourceFolderId);
        const destFolderIndex = folders.findIndex(f => f.id === destFolderId);
        
        if (sourceFolderIndex !== -1 && destFolderIndex !== -1) {
          const newFolders = [...folders];
          const sourceBookmark = newFolders[sourceFolderIndex].bookmarks.find(b => b.id === parseInt(draggableId));
          
          // Remove from source folder
          newFolders[sourceFolderIndex] = {
            ...newFolders[sourceFolderIndex],
            bookmarks: newFolders[sourceFolderIndex].bookmarks.filter(b => b.id !== parseInt(draggableId))
          };
          
          // Add to destination folder
          newFolders[destFolderIndex] = {
            ...newFolders[destFolderIndex],
            bookmarks: [
              ...newFolders[destFolderIndex].bookmarks,
              { ...sourceBookmark, id: Date.now() } // Assign new ID to avoid conflicts
            ]
          };
          
          setFolders(newFolders);
        }
      }
    } else if (source.droppableId === 'bookmarks' && destination.droppableId.startsWith('folder-')) {
      // Move from main panel to folder
      const destFolderId = parseInt(destination.droppableId.split('-')[1]);
      const bookmarkToMove = bookmarks.find(b => b.id === parseInt(draggableId));
      
      if (bookmarkToMove) {
        // Remove from main panel
        setBookmarks(prev => prev.filter(b => b.id !== parseInt(draggableId)));
        
        // Add to destination folder
        setFolders(prevFolders =>
          prevFolders.map(folder =>
            folder.id === destFolderId
              ? { ...folder, bookmarks: [...folder.bookmarks, { ...bookmarkToMove, id: Date.now() }] }
              : folder
          )
        );
      }
    } else if (source.droppableId.startsWith('folder-') && destination.droppableId === 'bookmarks') {
      // Move from folder to main panel
      const sourceFolderId = parseInt(source.droppableId.split('-')[1]);
      const bookmarkToMove = folders
        .find(f => f.id === sourceFolderId)
        ?.bookmarks.find(b => b.id === parseInt(draggableId));
      
      if (bookmarkToMove) {
        // Remove from folder
        setFolders(prevFolders =>
          prevFolders.map(folder =>
            folder.id === sourceFolderId
              ? { ...folder, bookmarks: folder.bookmarks.filter(b => b.id !== parseInt(draggableId)) }
              : folder
          )
        );
        
        // Add to main panel
        setBookmarks(prev => [...prev, { ...bookmarkToMove, id: Date.now() }]);
      }
    }
  };

  // Filter bookmarks based on search query
  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    folder.bookmarks.some(bookmark =>
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
        {/* Header */}
        <header className="p-6 backdrop-blur-md bg-black/20 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Modern Tab
            </h1>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Add Bookmark
              </button>
            </div>
          </div>
        </header>

        <main className="p-6 pt-4">
          <div className="max-w-7xl mx-auto">
            {/* Folder Navigation */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setCurrentFolder(null)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    !currentFolder
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  All Bookmarks
                </button>
                
                {filteredFolders.map((folder) => (
                  <div key={folder.id} className="flex items-center group">
                    <button
                      onClick={() => setCurrentFolder(folder)}
                      className={`px-4 py-2 rounded-l-lg whitespace-nowrap transition-all flex items-center ${
                        currentFolder?.id === folder.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                      </svg>
                      {folder.name}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFolder(folder.id);
                      }}
                      className="ml-1 px-2 py-2 rounded-r-lg bg-red-500/20 hover:bg-red-500/40 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
                
                <button
                  onClick={() => {
                    const folderName = prompt('Enter folder name:');
                    if (folderName) handleCreateFolder(folderName);
                  }}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all whitespace-nowrap flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  New Folder
                </button>
              </div>
            </div>

            {/* Content Area */}
            {currentFolder ? (
              <FolderView
                folder={currentFolder}
                onDeleteBookmark={handleDeleteBookmark}
                onUpdateBookmark={handleUpdateBookmark}
                onDragEnd={handleDragEnd}
                onShowAddModal={() => setShowAddModal(true)}
              />
            ) : (
              <BookmarksPanel
                bookmarks={filteredBookmarks}
                folders={filteredFolders}
                onDeleteBookmark={handleDeleteBookmark}
                onUpdateBookmark={handleUpdateBookmark}
                onDragEnd={handleDragEnd}
                onShowAddModal={() => setShowAddModal(true)}
              />
            )}
          </div>
        </main>

        {/* Add Bookmark Modal */}
        {showAddModal && (
          <AddBookmarkModal
            onClose={() => setShowAddModal(false)}
            onAddBookmark={handleAddBookmark}
            currentFolder={currentFolder}
          />
        )}
      </div>
    </DragDropContext>
  );
};

export default App;