# NVIDIA 驱动查询增强

一个 Tampermonkey 用户脚本，用于增强 NVIDIA 官方驱动搜索页面的功能。

**支持全产品线**：GeForce、TITAN、RTX、Quadro、Tesla 等

## 功能特性

- **突破 20 条结果限制** - 可设置显示更多驱动记录（最大 50 条）
- **驱动类型切换** - 支持 Game Ready 和 Studio 驱动
- **强制 Standard 驱动** - 可强制使用 Standard 驱动而非 DCH 驱动
- **版本精确搜索** - 搜索特定版本的驱动
- **版本系列搜索** - 模糊匹配某个系列的驱动
- **配置自动保存** - 设置会保存在浏览器本地存储中
- **实时生效** - 点击应用后立即生效，无需刷新页面

## 安装方法

### 前置要求

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展
   - [Chrome 网上应用店](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox 附加组件](https://addons.mozilla.org/firefox/addon/tampermonkey/)
   - [Edge 扩展](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

### 安装脚本

1. 点击 Tampermonkey 图标，选择「添加新脚本」
2. 删除编辑器中的所有内容
3. 将 `nvidia_driver_userscript.js` 文件内容粘贴进去
4. 按 `Ctrl + S` 保存
5. 访问 NVIDIA 驱动页面即可使用

## 使用方法

### 基本使用

1. 访问 [NVIDIA 驱动搜索页面](https://www.nvidia.cn/geforce/drivers/)
2. 页面右上角会出现绿色配置面板
3. 根据需要设置参数
4. 点击「应用配置」按钮
5. 在页面中搜索驱动

### 界面说明

配置面板位于页面右上角，包含以下选项：

```
┌─────────────────────────────────┐
│  NVIDIA 驱动查询增强 v2.8    [−] │
├─────────────────────────────────┤
│ 显示驱动数量: [10         ]      │
│                                 │
│ 驱动类型: [全部 ▼]              │
│                                 │
│ [ ] 强制 Standard 驱动          │
│                                 │
│ 版本号 (精确匹配):              │
│ [              ] 如: 566.36     │
│                                 │
│ 版本系列 (模糊匹配):            │
│ [              ] 如: 570        │
│                                 │
│ [    应用配置    ]  [  重置  ]   │
│                                 │
│ 使用方法：                      │
│ 1. 配置参数并点击"应用配置"     │
│ 2. 在 NVIDIA 页面搜索驱动       │
│ 3. 查看更多驱动记录             │
└─────────────────────────────────┘
```

## 参数说明

| 参数 | 说明 | 默认值 | 示例 |
|------|------|--------|------|
| **显示驱动数量** | 搜索结果返回的最大驱动数量 | 10 | 10、20、50 |
| **驱动类型** | 选择驱动类型 | 全部 | 全部 / Game Ready / Studio |
| **强制 Standard 驱动** | 强制使用 Standard 驱动而非 DCH | 关闭 | 勾选启用 |
| **版本号 (精确匹配)** | 搜索特定版本的驱动 | 空 | 566.36 |
| **版本系列 (模糊匹配)** | 搜索某个系列的所有驱动 | 空 | 570 |

### 参数详解

#### 显示驱动数量

NVIDIA 默认只返回 20 条结果，此参数可突破该限制。**范围：10-50，超过 50 可能导致加载失败。**

#### 驱动类型

- **全部** - 显示所有类型的驱动
- **Game Ready** - 针对游戏优化的驱动，适合游戏玩家
- **Studio** - 针对创作软件优化的驱动，适合视频编辑、3D 渲染等

#### 强制 Standard 驱动

DCH 驱动是 Windows 10/11 的新驱动格式，某些情况下可能需要 Standard 驱动。勾选此选项可强制搜索 Standard 驱动。

#### 版本号 (精确匹配)

用于搜索特定版本的驱动，例如：
- 输入 `566.36` → 只显示 566.36 版本
- 输入 `572.16` → 只显示 572.16 版本

#### 版本系列 (模糊匹配)

用于搜索某个系列的所有驱动，例如：
- 输入 `570` → 显示 570.xx 所有版本（570.86、570.96 等）
- 输入 `560` → 显示 560.xx 所有版本

## 常见问题

### Q: 为什么还是只显示 20 条结果？

A: 可能的原因：
1. 未点击「应用配置」按钮
2. NVIDIA 服务器端有硬性限制
3. 浏览器控制台有错误信息

解决方法：
1. 确保点击了「应用配置」
2. 按 F12 打开控制台，查看是否有 `[NVDriverHelper]` 开头的日志
3. 尝试刷新页面后重新配置

### Q: Studio 驱动搜索不到结果？

A: Studio 驱动发布频率较低，某些显卡可能没有 Studio 驱动。请确认你的显卡型号支持 Studio 驱动。

### Q: 如何查看脚本是否生效？

A: 按 F12 打开浏览器开发者工具，切换到 Console 标签，应该能看到：
```
[NVDriverHelper] 用户脚本已加载 v2.8
[NVDriverHelper] 拦截器已注入 v2.8
[NVDriverHelper] 所有拦截器已启用!
```

### Q: 配置会保存吗？

A: 是的，配置会自动保存在浏览器的 localStorage 中，下次访问时会自动加载。

### Q: 如何重置配置？

A: 在浏览器控制台执行：
```javascript
localStorage.removeItem('nv-driver-helper-config');
```
然后刷新页面。

## 技术原理

脚本通过以下方式实现功能：

1. **请求拦截** - 拦截 XMLHttpRequest 和 fetch 请求
2. **参数修改** - 修改请求 URL 中的参数
3. **页面注入** - 在页面上下文中注入拦截代码

### 拦截的 API 端点

- `DriverManualLookup`
- `DriverLookup`
- `processFind.aspx`
- `AjaxDriverService`
- `lookupValueSearch`
- `find.aspx`
- `driverResults`

### 修改的参数

| 参数 | 作用 |
|------|------|
| `numberOfResults` | 返回结果数量 |
| `isWHQL` | 驱动类型标识 |
| `upCRD` | Studio 驱动标识 |
| `dch` | DCH/Standard 驱动标识 |
| `version` | 精确版本号 |
| `release` | 版本系列 |

## 兼容性

- **浏览器**: Chrome、Firefox、Edge（需安装 Tampermonkey）
- **页面**: 
  - https://www.nvidia.com/*
  - https://www.nvidia.cn/*
  - https://gfwsl.geforce.com/*
  - https://www.nvidia.com/download/*
  - https://www.nvidia.cn/download/*
- **支持产品线**: GeForce、TITAN、RTX、Quadro、Tesla 等

## 更新日志

### v2.8
- 添加对全产品线支持（GeForce、TITAN、RTX、Quadro、Tesla 等）
- 添加更多 API 端点拦截
- 添加 download 页面 URL 匹配

### v2.7
- 添加"全部"驱动类型选项，默认显示所有类型驱动
- 重置功能清除配置并恢复到初始状态

### v2.6
- 添加"重置"按钮，可清除配置恢复到初始状态

### v2.5
- 默认显示驱动数量改为 10
- 最小值设为 10，最大值 50

### v2.4
- 将显示驱动数量上限调整为 50（NVIDIA 服务器端限制）
- 默认值改为 50

### v2.3
- 标题改为 "NVIDIA 驱动查询增强"
- "驱动数量" 改名为 "显示驱动数量"

### v2.2
- 将 "Release" 改名为 "版本系列 (模糊匹配)"，更易理解
- 将 "版本号" 改名为 "版本号 (精确匹配)"
- 更改内部标识符为 NVDriverHelper

### v2.1
- 修复 Studio 驱动搜索问题
- 点击应用配置后立即生效，无需刷新页面
- 添加更多调试日志

### v2.0
- 重构代码架构
- 添加配置面板
- 支持版本号和 Release 参数

### v1.0
- 初始版本
- 基本的请求拦截功能

## 许可证

MIT License

## 相关链接

- [NVIDIA 驱动下载页面](https://www.nvidia.cn/geforce/drivers/)
- [Tampermonkey 官网](https://www.tampermonkey.net/)
