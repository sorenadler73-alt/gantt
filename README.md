# DHTMLX Gantt - JavaScript 甘特图（社区版 · 简体中文）

[![npm: v.10.0.0](https://img.shields.io/badge/npm-v.10.0.0-blue.svg)](https://www.npmjs.com/package/dhtmlx-gantt) · [![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md) · [![made by DHTMLX](https://img.shields.io/badge/made%20by-DHTMLX-blue)](https://dhtmlx.com/)

![](dhtmlx_logo.svg)

> **本分支说明**：基于 [DHTMLX/gantt](https://github.com/DHTMLX/gantt) 的简体中文本地化版本，默认语言为简体中文，示例与界面文本已翻译。

[快速开始](#快速开始) | [从源码构建](#从源码构建) | [功能特性](#功能特性) | [社区版与 PRO 版](#社区版与-pro-版) | [框架集成](#框架集成) | [许可证](#许可证) | [相关链接](#相关链接)

`dhtmlx-gantt` 是一款开源 JavaScript 甘特图库，用于可视化和管理项目进度：可配置的任务表格、可缩放的时间轴、项目与里程碑、四种依赖关联类型、拖放排程、数据导出，以及 32 种内置语言。

该组件与框架无关，可在纯 JavaScript 中使用，并支持与 React、Angular、Vue 和 Svelte 集成。

![DHTMLX Gantt - Community (MIT) Edition](dhtmlx-gantt-mit.png)

这是 DHTMLX Gantt 的**社区版**，以 `dhtmlx-gantt` npm 包形式在 **MIT 许可证**下发布，提供**可读源代码**，可自由 Fork、修改和重新构建。如需自动排程、关键路径、资源管理等高级项目管理能力，请参阅 [PRO 版](#社区版与-pro-版)。

---

## 快速开始

安装包、引入脚本和样式，然后在容器元素中初始化图表。

### 安装

```bash
npm install dhtmlx-gantt
```

### 引入

使用模块打包工具（Vite、webpack、Rollup 等）：

```js
import { gantt } from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";

// 本分支默认使用简体中文，也可显式设置：
// gantt.i18n.setLocale("cn");
```

也可通过 `<script>` 标签直接引入 `codebase/` 中的构建文件：

```html
<script src="codebase/dhtmlxgantt.js"></script>
<link rel="stylesheet" href="codebase/dhtmlxgantt.css">
```

### 添加容器

```html
<div id="gantt_here" style="width: 100%; height: 600px;"></div>
```

### 初始化

```js
gantt.config.date_format = "%Y-%m-%d";

gantt.init("gantt_here");

gantt.parse({
    data: [
        { id: 1, text: "网站改版", type: "project",    progress: 0.4, open: true },
        { id: 2, text: "调研",         start_date: "2026-06-01", duration: 4, parent: 1, progress: 1 },
        { id: 3, text: "线框图",       start_date: "2026-06-05", duration: 6, parent: 1, progress: 0.6 },
        { id: 4, text: "视觉设计",    start_date: "2026-06-11", duration: 8, parent: 1, progress: 0.2 },
        { id: 5, text: "上线",           start_date: "2026-06-19", type: "milestone", parent: 1 }
    ],
    links: [
        { id: 1, source: 2, target: 3, type: "0" },
        { id: 2, source: 3, target: 4, type: "0" },
        { id: 3, source: 4, target: 5, type: "0" }
    ]
});
```

[查看在线演示](https://snippet.dhtmlx.com/a69d7378a) · 或运行 [`npm run start`](#从源码构建) 后打开 `/samples/` 浏览示例。

---

## 从源码构建

社区版提供 TypeScript/JavaScript 源码和 LESS 样式，可阅读、修改并重新构建。

```bash
git clone https://github.com/sorenadler73-alt/gantt.git
cd gantt
npm install

npm run build     # 构建 codebase/dhtmlxgantt.js（含 ES 模块、CSS、d.ts）
npm run start     # 开发模式：监听构建 + 示例服务 http://localhost:5173
npm run test      # 构建后加载每个示例，控制台报错则失败
npm run lint      # 对 src/ 运行 eslint
```

`codebase/` 为构建输出（生成文件，不提交到仓库）。执行 `npm run build` 后，可像 npm 包一样通过 `<script>` 标签直接使用。

### 仓库结构

```
src/        库源码（TypeScript + JavaScript，LESS 样式）
samples/    可运行示例（npm run start 后打开 /samples/）
scripts/    构建、开发服务器和测试脚本
codebase/   构建输出（生成文件）
```

### 测试

```bash
npm run test                 # 冒烟测试：构建后加载每个示例
npm run test 05_lightbox     # 仅测试某个示例目录
npm run lint                 # 对 src/ 运行 eslint
```

`npm run test` 为冒烟测试：无头加载每个已构建示例，若页面抛出异常或输出 `console.error` 则失败。默认会先执行构建；可用 `--no-build` 跳过（如 CI 中构建为独立步骤）。

---

## 基本用法

### 配置表格与时间刻度

```js
gantt.config.columns = [
    { name: "text",       label: "任务",  tree: true, width: 220 },
    { name: "start_date", label: "开始", align: "center", width: 90 },
    { name: "duration",   label: "天",  align: "center", width: 60 },
    { name: "add",        label: "",      width: 44 }
];

gantt.config.scale_unit = "week";
gantt.config.date_scale = "%M %d";

gantt.templates.scale_cell_class = function (date) {
    if (date.getDay() === 0 || date.getDay() === 6) return "weekend";
};

gantt.init("gantt_here");
```

### 启用插件

在调用 `gantt.init()` 之前激活可选扩展：

```js
gantt.plugins({
    tooltip:             true,
    quick_info:          true,
    fullscreen:          true,
    keyboard_navigation: true,
    drag_timeline:       true,
    click_drag:          true
});

gantt.init("gantt_here");
```

### 多实例

使用 `Gantt` 工厂在同一页面渲染多个独立甘特图：

```js
import { Gantt } from "dhtmlx-gantt";

var chartA = Gantt.getGanttInstance();
var chartB = Gantt.getGanttInstance();

chartA.init("gantt_a");
chartB.init("gantt_b");
```

默认导出的 `gantt` 本身也是通过此方式创建的实例，现有单图代码无需修改。

### 响应变更

```js
gantt.attachEvent("onAfterTaskUpdate", function (id, task) {
    fetch("/api/tasks/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task)
    });
});
```

双向同步 REST 后端可使用内置 `dataProcessor`，参见[后端集成](#后端集成)。

---

## 功能特性

社区版涵盖日常甘特图功能集，**包括项目（摘要任务）和里程碑**：

- **任务表格** — 任意数量可配置列、树形列、行内单元格编辑
- **项目/摘要任务与里程碑** — 任务类型及对应渲染与编辑框
- **可缩放时间轴** — 单/双刻度，可配置单位（小时至年）与步进
- **四种依赖类型** — 完成-开始、开始-开始、完成-完成、开始-完成，支持滞后与拖放创建关联
- **拖放排程** — 移动任务条重新排期，拖拽调整工期
- **进度指示** — 完成度以填充条显示，可在编辑框中修改
- **任务编辑框** — 可配置模态对话框，支持自定义控件
- **智能渲染** — 仅绘制可见行/列，适合大数据集
- **多实例** — 通过 `Gantt` 工厂在同一页面渲染多个独立甘特图
- **模板** — 覆盖任意渲染元素（任务条、表格单元格、刻度单元格、工具提示）
- **插件** — 工具提示、快速信息、键盘导航、全屏、拖放时间轴、点击拖放
- **表格列宽调整**与列配置 API
- **数据加载/保存** — JSON/XML 解析与序列化，REST `dataProcessor`
- **导出** — 通过 DHTMLX 在线导出服务导出 PDF、PNG、Excel、iCal 和 MS Project
- **皮肤** — Material、Terrace、Meadow、Broadway、Skyblue 等
- **32 种语言**、WAI-ARIA 无障碍、触控支持、CSP 兼容模式
- **事件系统** — 100+ 事件覆盖交互与生命周期
- **TypeScript** — 内置类型定义

> **注意**：`codebase/dhtmlxgantt.d.ts` 描述完整产品 API，其中部分 PRO 专属方法在社区版中不可用。

---

## 社区版与 PRO 版

本版面向进度可视化与手动编辑。自动排程、关键路径、资源规划等生产级项目管理功能属于商业 **PRO 版**。

| 功能 | 社区版 (MIT) | PRO 版 |
|:---|:---:|:---:|
| 任务表格、列、树形、行内编辑 | ✓ | ✓ |
| 可缩放单/双时间轴 | ✓ | ✓ |
| 项目/摘要任务、里程碑 | ✓ | ✓ |
| 四种依赖类型 (FS/SS/FF/SF) + 滞后 | ✓ | ✓ |
| 拖放排程与调整任务条 | ✓ | ✓ |
| 进度、编辑框、模板 | ✓ | ✓ |
| 大数据集智能渲染 | ✓ | ✓ |
| 每页多实例 | ✓ | ✓ |
| 工具提示、快速信息、键盘导航、全屏 | ✓ | ✓ |
| 拖放时间轴、点击拖放、列宽调整 | ✓ | ✓ |
| 皮肤、32 种语言、无障碍、触控 | ✓ | ✓ |
| JSON/XML 加载、REST dataProcessor | ✓ | ✓ |
| 导出 PDF/PNG/Excel/iCal/MS Project | ✓ | ✓ |
| **自动排程** | ✗ | ✓ |
| **关键路径与浮动时间** | ✗ | ✓ |
| **资源管理**（分配、直方图、按资源分组） | ✗ | ✓ |
| **基线与截止日期** | ✗ | ✓ |
| **约束** | ✗ | ✓ |
| **拆分任务与汇总** | ✗ | ✓ |
| **WBS 编码** | ✗ | ✓ |
| **分组** | ✗ | ✓ |
| **动态（按需）加载** | ✗ | ✓ |
| **撤销/重做** | ✗ | ✓ |
| **多任务选择与拖拽** | ✗ | ✓ |
| **时间轴标记/今日线** | ✗ | ✓ |
| **未排程任务与新任务占位** | ✗ | ✓ |
| **工作时间日历**（setWorkTime、自定义工作日历） | ✗ | ✓ |

### 需要高级项目管理功能？

**DHTMLX Gantt PRO 版**提供自动排程、关键路径计算、资源管理（分配、直方图、按资源分组）、工作时间日历、基线与截止日期、约束、拆分任务、WBS 和动态数据加载等能力。

- [社区版与 PRO 版对比](https://docs.dhtmlx.com/gantt/guides/editions-comparison/)
- [下载 30 天 PRO 试用版](https://dhtmlx.com/docs/products/dhtmlxGantt/download.shtml)
- 联系我们：[info@dhtmlx.com](mailto:info@dhtmlx.com)

---

## 框架集成

DHTMLX Gantt 支持主流前端框架。PRO 版提供现成组件（`ReactGantt`、`VueGantt`、`AngularGantt`）；社区版通过标准封装方式集成：

- [React 集成指南](https://docs.dhtmlx.com/gantt/integrations/react/js-gantt-react/)
- [Angular 集成指南](https://docs.dhtmlx.com/gantt/integrations/angular/js-gantt-angular/)
- [Vue.js 集成指南](https://docs.dhtmlx.com/gantt/integrations/vue/js-gantt-vue/)
- [Svelte 集成指南](https://docs.dhtmlx.com/gantt/integrations/svelte/howtostart-svelte/)
- [Salesforce 集成指南](https://docs.dhtmlx.com/gantt/integrations/salesforce/howtostart-salesforce/)

## 后端集成

内置 `dataProcessor` 可在图表与 REST API 之间双向同步数据：

- [Node.js / Express](https://docs.dhtmlx.com/gantt/integrations/node/howtostart-nodejs/)
- [ASP.NET Core](https://docs.dhtmlx.com/gantt/integrations/dotnet/howtostart-dotnet-core/)
- [PHP / Laravel](https://docs.dhtmlx.com/gantt/integrations/php/howtostart-php-laravel/)
- [Ruby on Rails](https://docs.dhtmlx.com/gantt/integrations/other/howtostart-ruby/)
- [Python / Django](https://docs.dhtmlx.com/gantt/integrations/other/howtostart-python/)

---

## 许可证

DHTMLX Gantt 社区版基于 **MIT 许可证**发布，详见 [LICENSE.md](LICENSE.md)。

Copyright © 2026 XB Software Ltd.

---

## 文档与资源

完整产品[文档](https://docs.dhtmlx.com/gantt/)适用于本版上述功能范围。

- [产品页](https://dhtmlx.com/docs/products/dhtmlxGantt/open-source/)
- [文档](https://docs.dhtmlx.com/gantt/)
- [API 参考](https://docs.dhtmlx.com/gantt/api/)
- [在线演示与示例](https://docs.dhtmlx.com/gantt/samples/)
- [社区论坛](https://forum.dhtmlx.com/c/gantt)

## 相关链接

- [导出服务](https://dhtmlx.com/docs/products/dhtmlxGantt/export.shtml)
- [集成方案](https://dhtmlx.com/docs/products/integrations/)

如果本项目对您有帮助，请为 [GitHub 仓库](https://github.com/sorenadler73-alt/gantt) 点个 ⭐。
