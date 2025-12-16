import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { PencilIcon, TrashIcon, FolderIcon } from '@heroicons/react/24/outline';

const FolderView = ({ folder, onDeleteBookmark, onUpdateBookmark, onDragEnd, onShowAddModal }) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set());

  const getFaviconUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return '/favicon.ico'; // fallback
    }
  };

  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <FolderIcon className="h-5 w-5 mr-2" />
          {folder.name}
        </h2>
        <button
          onClick={onShowAddModal}
          className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-sm hover:from-blue-600 hover:to-purple-600 transition-all"
        >
          Add to Folder
        </button>
      </div>
      
      <Droppable droppableId={`folder-${folder.id}`} type="folder-internal">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 p-4 rounded-xl transition-all ${
              snapshot.isDraggingOver ? 'bg-white/10' : 'bg-transparent'
            }`}
          >
            {(folder.children || []).map((item, index) => (
              item.type === 'folder' ? (
                <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-xl p-4 border border-yellow-400/30 transition-all transform hover:scale-105 hover:shadow-xl cursor-pointer ${
                        snapshot.isDragging ? 'shadow-2xl scale-110 z-10' : ''
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-yellow-500/30 rounded-lg flex items-center justify-center mb-2">
                          <FolderIcon className="h-6 w-6 text-yellow-400" />
                        </div>
                        <span className="font-medium text-center truncate w-full">{item.name}</span>
                        <span className="text-xs text-gray-400 mt-1">
                          {item.children?.length || 0} bookmark{item.children?.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  )}
                </Draggable>
              ) : (
                <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 transition-all transform hover:scale-105 hover:shadow-xl hover:border-blue-400/50 ${
                        snapshot.isDragging ? 'shadow-2xl scale-110 z-10' : ''
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex flex-col items-center"
                        >
                          <img
                            src={getFaviconUrl(item.url)}
                            alt={item.title}
                            className="w-10 h-10 rounded-lg mb-2 object-contain"
                            onError={(e) => {
                              e.target.src = '/favicon.ico';
                            }}
                          />
                          <span className="text-sm font-medium text-center truncate w-full">{item.title}</span>
                        </a>
                        
                        <div className="flex space-x-1 mt-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              const newTitle = prompt('Edit title:', item.title) || item.title;
                              const newUrl = prompt('Edit URL:', item.url) || item.url;
                              onUpdateBookmark({
                                ...item,
                                title: newTitle,
                                url: newUrl
                              });
                            }}
                            className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              onDeleteBookmark(item.id);
                            }}
                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              )
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default FolderView;