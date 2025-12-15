# Modern Tab - Beautiful New Tab Page

A modern, feature-rich new tab page application with bookmark management, folder organization, and drag-and-drop functionality.

## Features

- 📚 **Bookmark Management**: Add, edit, and delete bookmarks with ease
- 📁 **Folder Organization**: Group bookmarks into folders for better organization
- 🎯 **Drag & Drop**: Intuitive drag-and-drop interface for reorganizing bookmarks
- 🔍 **Search Functionality**: Quickly find bookmarks by title or URL
- 💾 **Local Storage**: All data is stored locally in your browser
- 🎨 **Modern UI**: Beautiful gradient design with glass-morphism effects
- 📱 **Responsive Design**: Works seamlessly on all device sizes

## Tech Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS
- **Drag & Drop**: react-beautiful-dnd
- **Icons**: Heroicons
- **Build Tool**: Vite

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Navigate to the project directory:
```bash
cd modern-tab
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

## Usage

1. **Adding a Bookmark**:
   - Click the "Add Bookmark" button
   - Enter the title and URL
   - Click "Add Bookmark"

2. **Managing Bookmarks**:
   - Edit: Click the pencil icon next to a bookmark
   - Delete: Click the trash icon next to a bookmark
   - Reorder: Drag and drop bookmarks to rearrange them

3. **Working with Folders**:
   - Create: Click "New Folder" and enter a name
   - View: Click on a folder name to view its contents
   - Add to Folder: While in a folder view, click "Add to Folder"
   - Move Between: Drag bookmarks between folders or from main panel to folders

4. **Searching**:
   - Use the search bar at the top to filter bookmarks and folders

## Project Structure

```
src/
├── components/           # React components
│   ├── BookmarksPanel.jsx
│   ├── FolderView.jsx
│   └── AddBookmarkModal.jsx
├── App.jsx              # Main application component
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## Deployment

This project is configured for GitHub Pages deployment using GitHub Actions. When you push to the main branch, the workflow will automatically build and deploy the site.

To deploy manually:
```bash
npm run build
```

The built files will be in the `dist/` directory.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License.
