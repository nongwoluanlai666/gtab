import { useState, useEffect } from 'react';

// 默认配置
const DEFAULT_CONFIG = {
  "baseConfig": {
    "icon": {
      "iconLayout": "custom",
      "iconRadius": 16,
      "iconSize": 62,
      "iconX": 34,
      "iconY": 34,
      "name": 1,
      "nameColor": "#f9d1ce",
      "nameSize": 14,
      "opactiy": 1,
      "showAddIcon": false,
      "startAnimation": true,
      "unit": "px",
      "width": 1248,
      "xysync": true
    },
    "lang": "zh-CN",
    "layout": {
      "view": "widget",
      "yiyan": true
    },
    "open": {
      "iconBlank": false,
      "searchBlank": false
    },
    "search": {
      "bgColor": 0.3,
      "blank": false,
      "height": 60,
      "history": false,
      "radius": 20,
      "show": true,
      "translate": "https://fanyi.baidu.com/#zh/en/"
    },
    "searchEngine": [
      {
        "href": " https://www.baidu.com/s?wd=%s&tn=15007414_23_dg&ie=utf-8",
        "key": "baidu",
        "title": "百度"
      },
      {
        "href": " https://www.google.com/search?q=",
        "key": "google",
        "title": "Google"
      },
      {
        "href": " https://www.bing.com/search?form=QBLH&q=",
        "key": "bing",
        "title": "必应"
      },
      {
        "href": " https://github.com/search?q=",
        "key": "github",
        "title": "gitHub"
      }
    ],
    "sidebar": {
      "autoHide": false,
      "lastGroup": false,
      "mouseGroup": true,
      "opacity": 0.1,
      "placement": "left",
      "width": 53
    },
    "theme": {
      "color": "#1890ff",
      "mode": "light",
      "system": false
    },
    "time": {
      "color": "#fff",
      "font": "HarmonyOS_Sans",
      "fontWeight": "600",
      "hour24": true,
      "lunar": "inline",
      "month": "inline",
      "sec": true,
      "show": true,
      "size": 81,
      "week": "inline"
    },
    "topSearch": [
      {
        "id": "KqndgxeLl9",
        "name": "微博"
      }
    ],
    "useSearch": "github",
    "useSearchPre": [
      "baidu",
      "google",
      "bing",
      "github"
    ],
    "wallpaper": {
      "blur": 0,
      "mask": 0.26,
      "name": "627908c13781bf424fb85749",
      "source": "",
      "src": " https://files.codelife.cc//itab/wallpaper/627908c13781bf424fb85749.jpeg?x-oss-process=image/resize,limit_0,m_fill,w_3840,h_2160/quality,q_96/format,webp&t=1733842885932",
      "thumb": " https://files.codelife.cc//itab/wallpaper/627908c13781bf424fb85749.jpeg?x-oss-process=image/resize,limit_0,m_fill,w_300,h_180/quality,q_92/format,webp&t=1733842885932",
      "time": 0,
      "type": 4
    }
  },
  "navConfig": [
    {
      "children": [],
      "icon": "home",
      "id": "1",
      "name": "主页"
    }
  ],
  "notes": [],
  "todo": []
};

// 配置管理器
const ConfigManager = {
  // 获取配置
  getConfig: () => {
    const config = localStorage.getItem('tabConfig');
    return config ? JSON.parse(config) : DEFAULT_CONFIG;
  },

  // 保存配置
  saveConfig: (config) => {
    localStorage.setItem('tabConfig', JSON.stringify(config));
  },

  // 导出配置
  exportConfig: () => {
    const config = ConfigManager.getConfig();
    const dataStr = JSON.stringify(config, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `tab-config-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  },

  // 导入配置
  importConfig: (configData) => {
    try {
      const parsedConfig = JSON.parse(configData);
      ConfigManager.saveConfig(parsedConfig);
      return true;
    } catch (error) {
      console.error('Invalid configuration format:', error);
      return false;
    }
  },

  // 重置配置
  resetConfig: () => {
    ConfigManager.saveConfig(DEFAULT_CONFIG);
  }
};

export default ConfigManager;