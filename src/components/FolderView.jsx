import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const FolderView = ({ folder, onDeleteBookmark, onUpdateBookmark, onDragEnd, onShowAddModal }) => {
  const getFaviconUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return '/favicon.ico'; // fallback
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          </svg>
          {folder.name}
        </h2>
        <button
          onClick={onShowAddModal}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
        >
          Add to Folder
        </button>
      </div>

      <p className="text-gray-300 mb-6">
        {folder.bookmarks.length} bookmark{folder.bookmarks.length !== 1 ? 's' : ''} in this folder
      </p>

      <Droppable droppableId={`folder-${folder.id}`} direction="horizontal">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 p-2 min-h-[200px] rounded-xl transition-all ${
              snapshot.isDraggingOver ? 'bg-white/10' : 'bg-transparent'
            }`}
          >
            {folder.bookmarks?.map((bookmark, index) => (
              <Draggable key={bookmark.id} draggableId={bookmark.id.toString()} index={index}>
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
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex flex-col items-center"
                      >
                        <img
                          src={getFaviconUrl(bookmark.url)}
                          alt={bookmark.title}
                          className="w-10 h-10 rounded-lg mb-2 object-contain"
                          onError={(e) => {
                            e.target.src = '/favicon.ico';
                          }}
                        />
                        <span className="text-sm font-medium text-center truncate w-full">{bookmark.title}</span>
                      </a>
                      
                      <div className="flex space-x-1 mt-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            onUpdateBookmark({
                              ...bookmark,
                              title: prompt('Edit title:', bookmark.title) || bookmark.title,
                              url: prompt('Edit URL:', bookmark.url) || bookmark.url
                            }, true);
                          }}
                          className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            onDeleteBookmark(bookmark.id, true);
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
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default FolderView;