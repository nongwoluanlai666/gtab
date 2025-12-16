import React, { useState } from 'react';

const SettingsModal = ({ config, onSave, onClose, onExport, onImport, onReset }) => {
  const [localConfig, setLocalConfig] = useState(config);
  const [activeTab, setActiveTab] = useState('general');
  const [importText, setImportText] = useState('');

  const handleSave = () => {
    onSave(localConfig);
  };

  const handleImport = () => {
    onImport(importText);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800/90 backdrop-blur-lg rounded-2xl p-6 w-full max-w-4xl border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Settings</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/20 mb-6">
          {['general', 'theme', 'search', 'wallpaper', 'import-export'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 capitalize transition-colors ${
                activeTab === tab
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select
                value={localConfig.baseConfig.lang}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  baseConfig: {
                    ...localConfig.baseConfig,
                    lang: e.target.value
                  }
                })}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              >
                <option value="zh-CN">中文</option>
                <option value="en-US">English</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Icon Size</label>
                <input
                  type="number"
                  value={localConfig.baseConfig.icon.iconSize}
                  onChange={(e) => setLocalConfig({
                    ...localConfig,
                    baseConfig: {
                      ...localConfig.baseConfig,
                      icon: {
                        ...localConfig.baseConfig.icon,
                        iconSize: parseInt(e.target.value)
                      }
                    }
                  })}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Icon Radius</label>
                <input
                  type="number"
                  value={localConfig.baseConfig.icon.iconRadius}
                  onChange={(e) => setLocalConfig({
                    ...localConfig,
                    baseConfig: {
                      ...localConfig.baseConfig,
                      icon: {
                        ...localConfig.baseConfig.icon,
                        iconRadius: parseInt(e.target.value)
                      }
                    }
                  })}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showAddIcon"
                checked={localConfig.baseConfig.icon.showAddIcon}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  baseConfig: {
                    ...localConfig.baseConfig,
                    icon: {
                      ...localConfig.baseConfig.icon,
                      showAddIcon: e.target.checked
                    }
                  }
                })}
                className="mr-2"
              />
              <label htmlFor="showAddIcon">Show Add Icon</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="startAnimation"
                checked={localConfig.baseConfig.icon.startAnimation}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  baseConfig: {
                    ...localConfig.baseConfig,
                    icon: {
                      ...localConfig.baseConfig.icon,
                      startAnimation: e.target.checked
                    }
                  }
                })}
                className="mr-2"
              />
              <label htmlFor="startAnimation">Enable Start Animation</label>
            </div>
          </div>
        )}

        {/* Theme Settings */}
        {activeTab === 'theme' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Theme Color</label>
              <input
                type="color"
                value={localConfig.baseConfig.theme.color}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  baseConfig: {
                    ...localConfig.baseConfig,
                    theme: {
                      ...localConfig.baseConfig.theme,
                      color: e.target.value
                    }
                  }
                })}
                className="w-12 h-10 rounded-lg bg-white/10 border border-white/20"
              />
              <span className="ml-2">{localConfig.baseConfig.theme.color}</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Theme Mode</label>
              <select
                value={localConfig.baseConfig.theme.mode}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  baseConfig: {
                    ...localConfig.baseConfig,
                    theme: {
                      ...localConfig.baseConfig.theme,
                      mode: e.target.value
                    }
                  }
                })}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showTime"
                checked={localConfig.baseConfig.time.show}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  baseConfig: {
                    ...localConfig.baseConfig,
                    time: {
                      ...localConfig.baseConfig.time,
                      show: e.target.checked
                    }
                  }
                })}
                className="mr-2"
              />
              <label htmlFor="showTime">Show Time</label>
            </div>

            {localConfig.baseConfig.time.show && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Time Color</label>
                  <input
                    type="color"
                    value={localConfig.baseConfig.time.color}
                    onChange={(e) => setLocalConfig({
                      ...localConfig,
                      baseConfig: {
                        ...localConfig.baseConfig,
                        time: {
                          ...localConfig.baseConfig.time,
                          color: e.target.value
                        }
                      }
                    })}
                    className="w-12 h-10 rounded-lg bg-white/10 border border-white/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Time Size</label>
                  <input
                    type="number"
                    value={localConfig.baseConfig.time.size}
                    onChange={(e) => setLocalConfig({
                      ...localConfig,
                      baseConfig: {
                        ...localConfig.baseConfig,
                        time: {
                          ...localConfig.baseConfig.time,
                          size: parseInt(e.target.value)
                        }
                      }
                    })}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Search Settings */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showSearch"
                checked={localConfig.baseConfig.search.show}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  baseConfig: {
                    ...localConfig.baseConfig,
                    search: {
                      ...localConfig.baseConfig.search,
                      show: e.target.checked
                    }
                  }
                })}
                className="mr-2"
              />
              <label htmlFor="showSearch">Show Search Bar</label>
            </div>

            {localConfig.baseConfig.search.show && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Search Height</label>
                    <input
                      type="number"
                      value={localConfig.baseConfig.search.height}
                      onChange={(e) => setLocalConfig({
                        ...localConfig,
                        baseConfig: {
                          ...localConfig.baseConfig,
                          search: {
                            ...localConfig.baseConfig.search,
                            height: parseInt(e.target.value)
                          }
                        }
                      })}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Search Radius</label>
                    <input
                      type="number"
                      value={localConfig.baseConfig.search.radius}
                      onChange={(e) => setLocalConfig({
                        ...localConfig,
                        baseConfig: {
                          ...localConfig.baseConfig,
                          search: {
                            ...localConfig.baseConfig.search,
                            radius: parseInt(e.target.value)
                          }
                        }
                      })}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Search Engine</label>
                  <select
                    value={localConfig.baseConfig.useSearch}
                    onChange={(e) => setLocalConfig({
                      ...localConfig,
                      baseConfig: {
                        ...localConfig.baseConfig,
                        useSearch: e.target.value
                      }
                    })}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  >
                    {localConfig.baseConfig.searchEngine.map(engine => (
                      <option key={engine.key} value={engine.key}>{engine.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Search Engines Order</label>
                  <div className="space-y-2">
                    {localConfig.baseConfig.useSearchPre.map((key, index) => {
                      const engine = localConfig.baseConfig.searchEngine.find(e => e.key === key);
                      return (
                        <div key={index} className="flex items-center justify-between bg-white/5 p-2 rounded">
                          <span>{engine?.title || key}</span>
                          <div className="flex space-x-1">
                            {index > 0 && (
                              <button
                                onClick={() => {
                                  const newOrder = [...localConfig.baseConfig.useSearchPre];
                                  [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
                                  setLocalConfig({
                                    ...localConfig,
                                    baseConfig: {
                                      ...localConfig.baseConfig,
                                      useSearchPre: newOrder
                                    }
                                  });
                                }}
                                className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/40 rounded text-xs"
                              >
                                ↑
                              </button>
                            )}
                            {index < localConfig.baseConfig.useSearchPre.length - 1 && (
                              <button
                                onClick={() => {
                                  const newOrder = [...localConfig.baseConfig.useSearchPre];
                                  [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
                                  setLocalConfig({
                                    ...localConfig,
                                    baseConfig: {
                                      ...localConfig.baseConfig,
                                      useSearchPre: newOrder
                                    }
                                  });
                                }}
                                className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/40 rounded text-xs"
                              >
                                ↓
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Wallpaper Settings */}
        {activeTab === 'wallpaper' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Wallpaper URL</label>
              <input
                type="text"
                value={localConfig.baseConfig.wallpaper.src}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  baseConfig: {
                    ...localConfig.baseConfig,
                    wallpaper: {
                      ...localConfig.baseConfig.wallpaper,
                      src: e.target.value
                    }
                  }
                })}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="Enter wallpaper URL"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Wallpaper Blur</label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={localConfig.baseConfig.wallpaper.blur}
                  onChange={(e) => setLocalConfig({
                    ...localConfig,
                    baseConfig: {
                      ...localConfig.baseConfig,
                      wallpaper: {
                        ...localConfig.baseConfig.wallpaper,
                        blur: parseInt(e.target.value)
                      }
                    }
                  })}
                  className="w-full"
                />
                <span className="text-sm">{localConfig.baseConfig.wallpaper.blur}px</span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Wallpaper Mask Opacity</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={localConfig.baseConfig.wallpaper.mask}
                  onChange={(e) => setLocalConfig({
                    ...localConfig,
                    baseConfig: {
                      ...localConfig.baseConfig,
                      wallpaper: {
                        ...localConfig.baseConfig.wallpaper,
                        mask: parseFloat(e.target.value)
                      }
                    }
                  })}
                  className="w-full"
                />
                <span className="text-sm">{(localConfig.baseConfig.wallpaper.mask * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Import/Export Settings */}
        {activeTab === 'import-export' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium mb-2">Export Configuration</h4>
              <button
                onClick={onExport}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all"
              >
                Export Config
              </button>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-2">Import Configuration</h4>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste your configuration JSON here..."
                className="w-full h-32 px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
              <button
                onClick={handleImport}
                className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
              >
                Import Config
              </button>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-2">Reset Configuration</h4>
              <button
                onClick={onReset}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all"
              >
                Reset to Default
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;