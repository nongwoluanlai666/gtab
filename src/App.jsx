import React, { useState, useEffect } from 'react';
import BookmarksPanel from './components/BookmarksPanel';
import AddBookmarkModal from './components/AddBookmarkModal';
import FolderView from './components/FolderView';
import SettingsModal from './components/SettingsModal';
import { DragDropContext } from 'react-beautiful-dnd';
import ConfigManager from './utils/ConfigManager';

const App = () => {
  const [config, setConfig] = useState(ConfigManager.getConfig());
  const [currentTab, setCurrentTab] = useState(config.navConfig[0]?.id || '1');
  const [currentFolder, setCurrentFolder] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedConfig = ConfigManager.getConfig();
    setConfig(savedConfig);
    if (savedConfig.navConfig.length > 0) {
      setCurrentTab(savedConfig.navConfig[0].id);
    }
  }, []);

  const handleAddBookmark = (bookmark) => {
    const newBookmark = { 
      ...bookmark, 
      id: Date.now().toString(),
      type: "icon",
      src: "",
      backgroundColor: ""
    };

    setConfig(prevConfig => {
      const newConfig = { ...prevConfig };
      const currentTabIndex = newConfig.navConfig.findIndex(tab => tab.id === currentTab);
      
      if (currentTabIndex !== -1) {
        if (currentFolder) {
          // Add to folder inside current tab
          const currentTabChildren = newConfig.navConfig[currentTabIndex].children;
          const folderIndex = currentTabChildren.findIndex(item => item.id === currentFolder.id);
          
          if (folderIndex !== -1 && currentTabChildren[folderIndex].type === 'folder') {
            newConfig.navConfig[currentTabIndex].children[folderIndex].children = [
              ...(currentTabChildren[folderIndex].children || []),
              newBookmark
            ];
          }
        } else {
          // Add to main tab
          newConfig.navConfig[currentTabIndex].children = [
            ...(newConfig.navConfig[currentTabIndex].children || []),
            newBookmark
          ];
        }
        
        // Save config
        ConfigManager.saveConfig(newConfig);
      }
      
      return newConfig;
    });
    
    setShowAddModal(false);
  };

  const handleDeleteBookmark = (id, fromFolder = false) => {
    setConfig(prevConfig => {
      const newConfig = { ...prevConfig };
      const currentTabIndex = newConfig.navConfig.findIndex(tab => tab.id === currentTab);
      
      if (currentTabIndex !== -1) {
        if (fromFolder && currentFolder) {
          // Delete from folder inside current tab
          const currentTabChildren = newConfig.navConfig[currentTabIndex].children;
          const folderIndex = currentTabChildren.findIndex(item => item.id === currentFolder.id);
          
          if (folderIndex !== -1 && currentTabChildren[folderIndex].type === 'folder') {
            newConfig.navConfig[currentTabIndex].children[folderIndex].children = 
              (currentTabChildren[folderIndex].children || []).filter(item => item.id !== id);
          }
        } else {
          // Delete from main tab
          newConfig.navConfig[currentTabIndex].children = 
            newConfig.navConfig[currentTabIndex].children.filter(item => item.id !== id);
        }
        
        // Save config
        ConfigManager.saveConfig(newConfig);
      }
      
      return newConfig;
    });
  };

  const handleUpdateBookmark = (updatedBookmark) => {
    setConfig(prevConfig => {
      const newConfig = { ...prevConfig };
      const currentTabIndex = newConfig.navConfig.findIndex(tab => tab.id === currentTab);
      
      if (currentTabIndex !== -1) {
        const updateInArray = (arr, id, updatedItem) => {
          return arr.map(item => {
            if (item.id === id) {
              return updatedItem;
            } else if (item.type === 'folder' && item.children) {
              return {
                ...item,
                children: updateInArray(item.children, id, updatedItem)
              };
            }
            return item;
          });
        };
        
        newConfig.navConfig[currentTabIndex].children = 
          updateInArray(newConfig.navConfig[currentTabIndex].children, updatedBookmark.id, updatedBookmark);
        
        // Save config
        ConfigManager.saveConfig(newConfig);
      }
      
      return newConfig;
    });
  };

  const handleCreateFolder = (folderName) => {
    const newFolder = {
      id: Date.now().toString(),
      name: folderName,
      size: "1x1",
      type: "folder",
      children: []
    };

    setConfig(prevConfig => {
      const newConfig = { ...prevConfig };
      const currentTabIndex = newConfig.navConfig.findIndex(tab => tab.id === currentTab);
      
      if (currentTabIndex !== -1) {
        newConfig.navConfig[currentTabIndex].children = [
          ...(newConfig.navConfig[currentTabIndex].children || []),
          newFolder
        ];
        
        // Save config
        ConfigManager.saveConfig(newConfig);
      }
      
      return newConfig;
    });
  };

  const handleDeleteFolder = (folderId) => {
    setConfig(prevConfig => {
      const newConfig = { ...prevConfig };
      const currentTabIndex = newConfig.navConfig.findIndex(tab => tab.id === currentTab);
      
      if (currentTabIndex !== -1) {
        newConfig.navConfig[currentTabIndex].children = 
          newConfig.navConfig[currentTabIndex].children.filter(item => item.id !== folderId);
      }
      
      if (currentFolder?.id === folderId) {
        setCurrentFolder(null);
      }
      
      // Save config
      ConfigManager.saveConfig(newConfig);
      return newConfig;
    });
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

    setConfig(prevConfig => {
      const newConfig = { ...prevConfig };
      const currentTabIndex = newConfig.navConfig.findIndex(tab => tab.id === currentTab);
      
      if (currentTabIndex === -1) return prevConfig;

      const currentTabChildren = newConfig.navConfig[currentTabIndex].children;
      
      // Helper function to find item and its path
      const findItemWithPath = (items, id, path = []) => {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.id === id) {
            return { item, path: [...path, i] };
          }
          if (item.type === 'folder' && item.children) {
            const found = findItemWithPath(item.children, id, [...path, i, 'children']);
            if (found) return found;
          }
        }
        return null;
      };

      // Find source item
      const sourceItemPath = findItemWithPath(currentTabChildren, draggableId);
      if (!sourceItemPath) return prevConfig;

      // Extract item from source
      const extractItem = (items, path) => {
        if (path.length === 1) {
          const index = path[0];
          const [removedItem] = items.splice(index, 1);
          return removedItem;
        } else if (path.length === 3 && path[1] === 'children') {
          // Path is [folderIndex, 'children', childIndex] - extracting from folder
          const folderIndex = path[0];
          const childIndex = path[2];
          return currentTabChildren[folderIndex].children.splice(childIndex, 1)[0];
        }
        return null;
      };

      // Insert item to destination
      const insertItem = (items, path, item) => {
        if (path.length === 1) {
          // Insert into main tab
          const index = path[0];
          items.splice(index, 0, item);
        } else if (path.length === 3 && path[1] === 'children') {
          // Insert into folder
          const folderIndex = path[0];
          const childIndex = path[2];
          if (!currentTabChildren[folderIndex].children) {
            currentTabChildren[folderIndex].children = [];
          }
          currentTabChildren[folderIndex].children.splice(childIndex, 0, item);
        }
      };

      // Get source item and remove it from source
      const sourceItem = extractItem(currentTabChildren, sourceItemPath.path);

      // Determine destination path
      let destPath = [];
      if (destination.droppableId === 'bookmarks') {
        // Destination is main tab
        destPath = [destination.index];
      } else if (destination.droppableId.startsWith('folder-')) {
        // Destination is a folder
        const folderId = destination.droppableId.replace('folder-', '');
        const folderIndex = currentTabChildren.findIndex(item => item.id === folderId);
        if (folderIndex !== -1) {
          destPath = [folderIndex, 'children', destination.index];
        }
      }

      // Insert item at destination
      if (destPath.length > 0) {
        insertItem(currentTabChildren, destPath, sourceItem);
      }

      // Save config
      ConfigManager.saveConfig(newConfig);
      return newConfig;
    });
  };

  // Get current tab data
  const currentTabData = config.navConfig.find(tab => tab.id === currentTab) || { children: [] };

  // Filter bookmarks based on search query
  const getFilteredItems = (items) => {
    return items.filter(item => {
      if (item.type === 'folder') {
        // For folders, check if folder name matches or any child matches
        return (
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.children && item.children.some(child => 
            child.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            child.url?.toLowerCase().includes(searchQuery.toLowerCase())
          ))
        );
      } else {
        // For regular items, check title and url
        return (
          item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.url?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
    });
  };

  const filteredItems = getFilteredItems(currentTabData.children || []);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div 
        className="min-h-screen text-white"
        style={{
          backgroundImage: config.baseConfig.wallpaper?.src ? `url(${config.baseConfig.wallpaper.src})` : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: config.baseConfig.theme?.mode === 'dark' ? '#0f0f1f' : '#f0f0ff',
          opacity: 1 - (config.baseConfig.wallpaper?.mask || 0.26)
        }}
      >
        {/* Header with search and settings */}
        <header className="p-6 backdrop-blur-md bg-black/20 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Modern Tab
              </h1>
              
              {/* Tab Navigation */}
              <div className="flex space-x-2">
                {config.navConfig.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setCurrentTab(tab.id);
                      setCurrentFolder(null);
                    }}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                      currentTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
                
                <button
                  onClick={() => {
                    const tabName = prompt('Enter tab name:');
                    if (tabName) {
                      const newTab = {
                        id: Date.now().toString(),
                        name: tabName,
                        icon: "home",
                        children: []
                      };
                      
                      setConfig(prevConfig => {
                        const newConfig = { ...prevConfig };
                        newConfig.navConfig = [...newConfig.navConfig, newTab];
                        ConfigManager.saveConfig(newConfig);
                        return newConfig;
                      });
                    }
                  }}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all whitespace-nowrap flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  New Tab
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              
              {/* Settings Button */}
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </button>
              
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
                
                {filteredItems.filter(item => item.type === 'folder').map((folder) => (
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
                items={filteredItems}
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
        
        {/* Settings Modal */}
        {showSettings && (
          <SettingsModal 
            config={config} 
            onSave={(newConfig) => {
              setConfig(newConfig);
              ConfigManager.saveConfig(newConfig);
              setShowSettings(false);
            }}
            onClose={() => setShowSettings(false)}
            onExport={ConfigManager.exportConfig}
            onImport={(configData) => {
              if (ConfigManager.importConfig(configData)) {
                const newConfig = ConfigManager.getConfig();
                setConfig(newConfig);
                setShowSettings(false);
              }
            }}
            onReset={() => {
              ConfigManager.resetConfig();
              const newConfig = ConfigManager.getConfig();
              setConfig(newConfig);
              setShowSettings(false);
            }}
          />
        )}
      </div>
    </DragDropContext>
  );
};

export default App;