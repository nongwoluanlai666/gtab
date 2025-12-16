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

  // Calculate grid class based on folder size
  const getGridClass = (item) => {
    if (item.type === 'folder' && item.size) {
      const [rows, cols] = item.size.split('x').map(Number);
      return `grid-cols-${cols}`;
    }
    return 'grid-cols-1'; // Default to 1 column for regular items
  };

  return (
    <>
      {/* Unified Bookmarks and Folders Section */}
      <section className="mb-8">
        {/* Removed the header section */}
        <div className="flex justify-end mb-4">
          <button
            onClick={onShowAddModal}
            className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-sm hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            Add New
          </button>
        </div>

        <Droppable droppableId="bookmarks" direction="vertical">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 p-2 min-h-[500px] rounded-xl transition-all relative ${
                snapshot.isDraggingOver ? 'bg-white/10' : 'bg-transparent'
              }`}
              style={{
                backgroundImage: `
                  linear-gradient(rgba(100, 149, 237, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(100, 149, 237, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px',
              }}
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                  {(provided, snapshot) => {
                    if (item.type === 'folder') {
                      // Calculate grid class based on folder size
                      const [rows, cols] = item.size ? item.size.split('x').map(Number) : [1, 1];
                      const totalCells = rows * cols;
                      
                      return (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-lg p-2 border border-yellow-400/30 transition-all flex flex-col items-center ${
                            snapshot.isDragging ? 'shadow-2xl scale-110 z-10' : ''
                          }`}
                          style={{ gridColumn: `span ${cols}`, gridRow: `span ${rows}` }}
                        >
                          <div className="flex-grow w-full flex items-center justify-center">
                            <div className="w-8 h-8 bg-yellow-500/30 rounded-lg flex items-center justify-center">
                              <FolderIcon className="h-4 w-4 text-yellow-400" />
                            </div>
                          </div>
                          <div className="mt-1 text-center">
                            <span className="text-xs font-medium text-center truncate w-full">{item.name}</span>
                            <span className="text-xs text-gray-400 block mt-1">
                              {item.children?.length || 0} item{item.children?.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/20 transition-all flex flex-col items-center ${
                            snapshot.isDragging ? 'shadow-2xl scale-110 z-10' : ''
                          }`}
                        >
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex flex-col items-center"
                          >
                            <img
                              src={getFaviconUrl(item.url)}
                              alt={item.title}
                              className="w-6 h-6 rounded mb-1 object-contain"
                              onError={(e) => {
                                e.target.src = '/favicon.ico';
                              }}
                            />
                            <span className="text-xs font-medium text-center truncate w-full">{item.title}</span>
                          </a>
                          
                          <div className="flex space-x-1 mt-1">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                onUpdateBookmark({
                                  ...item,
                                  title: prompt('Edit title:', item.title) || item.title,
                                  url: prompt('Edit URL:', item.url) || item.url
                                });
                              }}
                              className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded"
                            >
                              <PencilIcon className="h-3 w-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                onDeleteBookmark(item.id);
                              }}
                              className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded"
                            >
                              <TrashIcon className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      );
                    }
                  }}
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