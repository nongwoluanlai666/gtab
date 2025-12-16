import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { PencilIcon, TrashIcon, FolderIcon } from '@heroicons/react/24/outline';

const BookmarksPanel = ({ items, onDeleteBookmark, onUpdateBookmark, onDragEnd, onShowAddModal }) => {
  const getFaviconUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return '/favicon.ico'; // fallback
    }
  };

  // Separate items into bookmarks and folders
  const bookmarks = items.filter(item => item.type !== 'folder');
  const folders = items.filter(item => item.type === 'folder');

  return (
    <>
      {/* Main Bookmarks Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
            Bookmarks
          </h2>
          <button
            onClick={onShowAddModal}
            className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-sm hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            Add New
          </button>
        </div>

        <Droppable droppableId="bookmarks" direction="horizontal">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 p-2 min-h-[200px] rounded-xl transition-all ${
                snapshot.isDraggingOver ? 'bg-white/10' : 'bg-transparent'
              }`}
            >
              {bookmarks.map((bookmark, index) => (
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
                              });
                            }}
                            className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              onDeleteBookmark(bookmark.id);
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
      </section>

      {/* Folders Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FolderIcon className="h-5 w-5 mr-2" />
          Folders
        </h2>
        
        <Droppable droppableId="folders" direction="horizontal" type="folder">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 p-2 min-h-[200px] rounded-xl transition-all ${
                snapshot.isDraggingOver ? 'bg-white/10' : 'bg-transparent'
              }`}
            >
              {folders.map((folder, index) => (
                <Draggable key={folder.id} draggableId={`folder-${folder.id}`} index={index} type="folder">
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
                        <span className="font-medium text-center truncate w-full">{folder.name}</span>
                        <span className="text-xs text-gray-400 mt-1">
                          {folder.bookmarks.length} bookmark{folder.bookmarks.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </section>
    </>
  );
};

export default BookmarksPanel;