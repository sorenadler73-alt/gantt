/**
 * 批量将项目用户可见文本替换为简体中文
 * 用法: node scripts/apply-zh-cn.js
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

// 按长度降序排列，避免短词误替换长词
const replacements = [
	// 示例页面标题
	["Gantt : Samples", "甘特图：示例"],
	["Using gantt constructor and destructor", "使用甘特图构造与析构"],
	["Keyboard navigation, multiple gantts", "键盘导航（多个甘特图）"],
	["Export data from Gantt", "从甘特图导出数据"],
	["jQuery initialization", "jQuery 初始化"],
	["Gantts in dhtmlxLayout cells (dhtmlxSuite v8.x)", "dhtmlxLayout 单元格中的甘特图（dhtmlxSuite v8.x）"],
	["Multiple Gantts on the page", "页面上的多个甘特图"],
	["Right to left gantt", "从右到左的甘特图"],
	["Time scale at the bottom of gantt", "甘特图底部时间刻度"],
	["Gantt chart with resource panel", "带资源面板的甘特图"],
	["Grid columns rightside of gantt", "甘特图右侧表格列"],
	["Show empty state screen", "显示空状态界面"],
	["Draggable projects", "可拖拽的项目"],
	["Custom data api - using local storage", "自定义数据 API - 使用本地存储"],
	["Import Excel file", "导入 Excel 文件"],
	["Import MS Project file", "导入 MS Project 文件"],
	["Import Primavera P6 file", "导入 Primavera P6 文件"],
	["Predefined Project Structure", "预定义项目结构"],
	["Dynamically move task text to the right side", "动态将任务文本移至右侧"],
	["Calculate Progress of Summary Tasks", "计算摘要任务进度"],
	["Export data : MS Project, PrimaveraP6, Excel &amp; iCal", "导出数据：MS Project、PrimaveraP6、Excel 和 iCal"],
	["Export data: store online", "导出数据：在线存储"],
	["Drag parent task with its children", "拖拽父任务及其子任务"],
	["Export with custom styles", "使用自定义样式导出"],
	["Assignment Validation", "分配验证"],
	["Fixed project dates", "固定项目日期"],
	["D'n'D Events", "拖放事件"],
	["Limit drag and drop dates", "限制拖放日期"],
	["Inline editing - Custom keyboard mapping", "行内编辑 - 自定义键盘映射"],
	["Branch ordering - highlighting mode", "分支排序 - 高亮模式"],
	["Drag and drop rows in Grid", "在表格中拖放行"],
	["Inline editing", "行内编辑"],
	["Using sorting methods", "使用排序方法"],
	["Custom Buttons in a Grid", "表格中的自定义按钮"],
	["Render Gantt chart without grid", "无表格渲染甘特图"],
	["Custom sorting function", "自定义排序函数"],
	["Basic filtering", "基础筛选"],
	["Task Name Search Filter", "任务名称搜索筛选"],
	["Branch ordering", "分支排序"],
	["Built-in sorting", "内置排序"],
	["Dark skin", "深色皮肤"],
	["High contrast theme - Black", "高对比度主题 - 黑色"],
	["High contrast theme - White", "高对比度主题 - 白色"],
	["'Broadway' skin", "「Broadway」皮肤"],
	["Change skin dynamically", "动态切换皮肤"],
	["'Meadow' skin", "「Meadow」皮肤"],
	["'Skyblue' skin", "「Skyblue」皮肤"],
	["Task edit form", "任务编辑表单"],
	["Default skin", "默认皮肤"],
	["Readonly lightbox", "只读任务编辑框"],
	["3rd party multiselect control", "第三方多选控件"],
	["Select control", "下拉选择控件"],
	["Datepicker in lightbox", "任务编辑框中的日期选择器"],
	["Slider control in lightbox", "任务编辑框中的滑块控件"],
	["Specify year selector range", "指定年份选择范围"],
	["Time control", "时间控件"],
	["Parent selector", "父任务选择器"],
	["Custom control in the lightbox", "任务编辑框中的自定义控件"],
	["Custom button in the lightbox", "任务编辑框中的自定义按钮"],
	["Template control", "模板控件"],
	["Validate lightbox values", "验证任务编辑框值"],
	["Radio control", "单选控件"],
	["Progress lightbox", "进度任务编辑框"],
	["Checkbox control", "复选框控件"],
	["Lightbox customization", "任务编辑框自定义"],
	["Custom content inside the timeline cells", "时间轴单元格中的自定义内容"],
	["Specify inline colors for Tasks and Links", "为任务和关联指定内联颜色"],
	["Gantt message types", "甘特图消息类型"],
	["Create summary tasks dynamically (auto_types)", "动态创建摘要任务（auto_types）"],
	["Custom task type", "自定义任务类型"],
	["Expand container (autosize)", "扩展容器（自动调整大小）"],
	["Custom html content (Stackbar)", "自定义 HTML 内容（堆叠条）"],
	["Text in the Progress bar", "进度条中的文本"],
	["Styling task bars with events", "使用事件设置任务条样式"],
	["Task styles", "任务样式"],
	["Template for tree nodes", "树节点模板"],
	["Highlighting weekends", "高亮周末"],
	["Link styles", "关联样式"],
	["Define side content", "定义侧边内容"],
	["Custom tree formatting", "自定义树形格式"],
	["Mouse wheel zoom", "鼠标滚轮缩放"],
	["Year quarters scale", "年季度刻度"],
	["Zoom To Fit", "缩放至适合"],
	["Auto resize scale", "自动调整刻度大小"],
	["Show working hours", "显示工作时间"],
	["Selecting columns", "选择列"],
	["Custom scales", "自定义刻度"],
	["Minutes timeline", "分钟时间轴"],
	["Day hours", "日小时视图"],
	["Dynamic scales", "动态刻度"],
	["Month view", "月视图"],
	["Step config for the Quarter scale", "季度刻度的步进配置"],
	["Multiple scales", "多刻度"],
	["Full Screen with additional elements", "全屏（含附加元素）"],
	["Resizable rows in grid", "表格中可调整行高"],
	["Custom Tooltips", "自定义工具提示"],
	["Create new tasks by Drag and Drop", "通过拖放创建新任务"],
	["Full Screen", "全屏"],
	["Working with 30000 tasks", "处理 30000 个任务"],
	["QuickInfo extension", "QuickInfo 扩展"],
	["Tooltip", "工具提示"],
	["Backward planning", "逆向计划"],
	["Tasks outside the timescale", "时间刻度外的任务"],
	["Projects and milestones", "项目与里程碑"],
	["Bootstrap layout", "Bootstrap 布局"],
	["Reinitialize in another container", "在另一个容器中重新初始化"],
	["Loading tasks with start/end dates", "加载带开始/结束日期的任务"],
	["Localization", "本地化"],
	["Project duration", "项目工期"],
	["Define displayed date range", "定义显示的日期范围"],
	["Fixed size gantt", "固定尺寸甘特图"],
	["Clickable links", "可点击的关联"],
	["Backend storage using REST API", "使用 REST API 的后端存储"],
	["jQuery integration", "jQuery 集成"],
	["Load data from XML file", "从 XML 文件加载数据"],
	["Basic initialization", "基础初始化"],
	["Load data from JSON file", "从 JSON 文件加载数据"],

	// 导航分类与链接
	["Basic initialization", "基础初始化"],
	["Load data from JSON file", "从 JSON 文件加载数据"],
	["Load data from XML file", "从 XML 文件加载数据"],
	["Backend storage using REST API", "使用 REST API 的后端存储"],
	["jQuery integration", "jQuery 集成"],
	["Define displayed date range", "定义显示的日期范围"],
	["Fixed size gantt", "固定尺寸甘特图"],
	["Clickable links", "可点击的关联"],
	["Localization", "本地化"],
	["Project duration", "项目工期"],
	["Reinitialize in another container", "在另一个容器中重新初始化"],
	["Loading tasks with start/end dates", "加载带开始/结束日期的任务"],
	["Projects and milestones", "项目与里程碑"],
	["Bootstrap layout", "Bootstrap 布局"],
	["Backward planning", "逆向计划"],
	["Tasks outside the timescale", "时间刻度外的任务"],
	["QuickInfo extension", "QuickInfo 扩展"],
	["Working with 30000 tasks", "处理 30000 个任务"],
	["Custom Tooltips", "自定义工具提示"],
	["Create new tasks by Drag and Drop", "通过拖放创建新任务"],
	["Full Screen with additional elements", "全屏（含附加元素）"],
	["Resizable rows in grid", "表格中可调整行高"],
	["Multiple scales", "多刻度"],
	["Month view", "月视图"],
	["Step config for the Quarter scale", "季度刻度的步进配置"],
	["Day hours", "日小时视图"],
	["Dynamic scales", "动态刻度"],
	["Custom scales", "自定义刻度"],
	["Minutes timeline", "分钟时间轴"],
	["Auto resize scale", "自动调整刻度大小"],
	["Show working hours", "显示工作时间"],
	["Selecting columns", "选择列"],
	["Year quarters scale", "年季度刻度"],
	["Zoom To Fit", "缩放至适合"],
	["Mouse wheel zoom", "鼠标滚轮缩放"],
	["Define side content", "定义侧边内容"],
	["Custom tree formatting", "自定义树形格式"],
	["Link styles", "关联样式"],
	["Task styles", "任务样式"],
	["Template for tree nodes", "树节点模板"],
	["Highlighting weekends", "高亮周末"],
	["Text in the Progress bar", "进度条中的文本"],
	["Styling task bars with events", "使用事件设置任务条样式"],
	["Custom html content (Stackbar)", "自定义 HTML 内容（堆叠条）"],
	["Custom task type", "自定义任务类型"],
	["Expand container (autosize)", "扩展容器（自动调整大小）"],
	["Specify inline colors for Tasks and Links", "为任务和关联指定内联颜色"],
	["Create summary tasks dynamically (auto_types)", "动态创建摘要任务（auto_types）"],
	["Gantt message types", "甘特图消息类型"],
	["Custom content inside the timeline cells", "时间轴单元格中的自定义内容"],
	["Lightbox customization", "任务编辑框自定义"],
	["Checkbox control", "复选框控件"],
	["Progress lightbox", "进度任务编辑框"],
	["Radio control", "单选控件"],
	["Validate lightbox values", "验证任务编辑框值"],
	["Custom control in the lightbox", "任务编辑框中的自定义控件"],
	["Template control", "模板控件"],
	["Custom button in the lightbox", "任务编辑框中的自定义按钮"],
	["Time control", "时间控件"],
	["Parent selector", "父任务选择器"],
	["Specify year selector range", "指定年份选择范围"],
	["Slider control in lightbox", "任务编辑框中的滑块控件"],
	["Datepicker in lightbox", "任务编辑框中的日期选择器"],
	["Select control", "下拉选择控件"],
	["3rd party multiselect control", "第三方多选控件"],
	["Readonly lightbox", "只读任务编辑框"],
	["Default skin", "默认皮肤"],
	["Task edit form", "任务编辑表单"],
	["'Skyblue' skin", "「Skyblue」皮肤"],
	["'Meadow' skin", "「Meadow」皮肤"],
	["'Broadway' skin", "「Broadway」皮肤"],
	["Change skin dynamically", "动态切换皮肤"],
	["High contrast theme - Black", "高对比度主题 - 黑色"],
	["High contrast theme - White", "高对比度主题 - 白色"],
	["Dark skin", "深色皮肤"],
	["Built-in sorting", "内置排序"],
	["Branch ordering", "分支排序"],
	["Basic filtering", "基础筛选"],
	["Task Name Search Filter", "任务名称搜索筛选"],
	["Custom sorting function", "自定义排序函数"],
	["Using sorting methods", "使用排序方法"],
	["Render Gantt chart without grid", "无表格渲染甘特图"],
	["Custom Buttons in a Grid", "表格中的自定义按钮"],
	["Drag and drop rows in Grid", "在表格中拖放行"],
	["Inline editing", "行内编辑"],
	["Inline editing - Custom keyboard mapping", "行内编辑 - 自定义键盘映射"],
	["Branch ordering - highlighting mode", "分支排序 - 高亮模式"],
	["D'n'D Events", "拖放事件"],
	["Limit drag and drop dates", "限制拖放日期"],
	["Assignment Validation", "分配验证"],
	["Fixed project dates", "固定项目日期"],
	["Drag parent task with its children", "拖拽父任务及其子任务"],
	["Export data from Gantt", "从甘特图导出数据"],
	["Export with custom styles", "使用自定义样式导出"],
	["Export data : MS Project, PrimaveraP6, Excel &amp; iCal", "导出数据：MS Project、PrimaveraP6、Excel 和 iCal"],
	["Export data: store online", "导出数据：在线存储"],
	["Predefined Project Structure", "预定义项目结构"],
	["Dynamically move task text to the right side", "动态将任务文本移至右侧"],
	["Calculate Progress of Summary Tasks", "计算摘要任务进度"],
	["Import MS Project file", "导入 MS Project 文件"],
	["Import Primavera P6 file", "导入 Primavera P6 文件"],
	["Draggable projects", "可拖拽的项目"],
	["Import Excel file", "导入 Excel 文件"],
	["Custom data api - using local storage", "自定义数据 API - 使用本地存储"],
	["Show empty state screen", "显示空状态界面"],
	["Grid columns rightside of gantt", "甘特图右侧表格列"],
	["Gantt chart with resource panel", "带资源面板的甘特图"],
	["Time scale at the bottom of gantt", "甘特图底部时间刻度"],
	["Right to left gantt", "从右到左的甘特图"],
	["Multiple Gantts on the page", "页面上的多个甘特图"],
	["Gantts in dhtmlxLayout cells (dhtmlxSuite v8.x)", "dhtmlxLayout 单元格中的甘特图（dhtmlxSuite v8.x）"],
	["jQuery initialization", "jQuery 初始化"],
	["Keyboard navigation, multiple gantts", "键盘导航（多个甘特图）"],
	["Using gantt constructor and destructor", "使用甘特图构造与析构"],

	// 导航分类
	["Initialization", "初始化"],
	["Extensions", "扩展"],
	["Scales", "时间刻度"],
	["Customization", "自定义"],
	["Lightbox", "任务编辑框"],
	["Skins", "皮肤"],
	["Grid", "表格"],
	["Layout", "布局"],
	["Multiple", "多实例"],

	// 示例站点 UI
	["Gantt Samples", "甘特图示例"],
	["Gantt samples", "甘特图示例"],
	["Documentation", "文档"],
	["Gantt API", "甘特图 API"],
	["Developer forum", "开发者论坛"],
	["Resources", "资源"],
	["Find samples", "搜索示例"],
	["No results", "无结果"],
	["More in Snippet Tool", "在代码片段工具中查看更多"],
	["Source code", "源代码"],
	["API reference", "API 参考"],
	["Open the sample in a separate tab", "在新标签页打开示例"],
	["Open sample", "打开示例"],
	["Google suggestions", "Google 搜索建议"],
	["Properties", "属性"],
	["Methods", "方法"],
	["Events", "事件"],
	["Templates", "模板"],
	["Files", "文件"],
	["Other", "其他"],
	["Share", "分享"],
	["Demo", "演示"],
	["Google API file", "Google API 文件"],

	// 本地化示例页面
	["Chinese (Simplified)", "简体中文"],
	["Chinese (Traditional)", "繁体中文"],
	["Select language:", "选择语言："],
	["Language", "语言"],

	// 示例数据 - 任务名
	["Intermediate milestone", "中间里程碑"],
	["Final milestone", "最终里程碑"],
	["Website redesign", "网站改版"],
	["Visual design", "视觉设计"],
	["Wireframes", "线框图"],
	["Research", "调研"],
	["Launch", "上线"],
	["Project #1", "项目 #1"],
	["Project #2", "项目 #2"],
	["Project #3", "项目 #3"],
	["Task #1", "任务 #1"],
	["Task #2", "任务 #2"],
	["Task #3", "任务 #3"],
	["Task #4", "任务 #4"],
	["Task #2.1", "任务 #2.1"],
	["Task #2.2", "任务 #2.2"],
	["Task #2.3", "任务 #2.3"],
	["Task #2.4", "任务 #2.4"],
	["Task #4.1", "任务 #4.1"],
	["Task #4.2", "任务 #4.2"],
	["New Task", "新任务"],
	["New task", "新任务"],
	["Task name", "任务名称"],
	["Start date", "开始日期"],
	["End date", "结束日期"],
	["Duration", "工期"],
	["Progress", "进度"],
	["Priority", "优先级"],
	["Owner", "负责人"],
	["Text", "文本"],
	["Type", "类型"],
	["Add", "添加"],
	["Save", "保存"],
	["Cancel", "取消"],
	["Delete", "删除"],
	["Edit", "编辑"],
	["Details", "详情"],
	["Description", "描述"],
	["Task", "任务"],
	["Project", "项目"],
	["Milestone", "里程碑"],
	["Start", "开始"],
	["Days", "天"],
	["Weeks", "周"],
	["Months", "月"],
	["Years", "年"],
	["Hours", "小时"],
	["Minutes", "分钟"],
	["High", "高"],
	["Normal", "普通"],
	["Low", "低"],
	["Loading...", "加载中..."],
	["Loading", "加载中"],

	// HTML lang
	['lang="en"', 'lang="zh-CN"'],
	["lang=\"en\"", "lang=\"zh-CN\""],
];

// 去重并保持较长匹配优先
const uniqueReplacements = [];
const seen = new Set();
for (const pair of replacements.sort((a, b) => b[0].length - a[0].length)) {
	if (!seen.has(pair[0])) {
		seen.add(pair[0]);
		uniqueReplacements.push(pair);
	}
}

const targetDirs = [
	path.join(rootDir, "samples"),
	path.join(rootDir, "scripts", "backend"),
];

const targetFiles = [
	path.join(rootDir, "package.json"),
];

const extensions = new Set([".html", ".js", ".json", ".md", ".ts"]);

function walk(dir, callback) {
	if (!fs.existsSync(dir)) return;
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			if (entry.name === "node_modules" || entry.name === "codebase") continue;
			walk(fullPath, callback);
		} else {
			callback(fullPath);
		}
	}
}

function applyReplacements(content) {
	let result = content;
	for (const [from, to] of uniqueReplacements) {
		result = result.split(from).join(to);
	}
	return result;
}

function processFile(filePath) {
	const ext = path.extname(filePath);
	if (!extensions.has(ext)) return false;
	if (filePath.includes("codehighlight") || filePath.includes("codemirror")) return false;

	const original = fs.readFileSync(filePath, "utf8");
	const updated = applyReplacements(original);
	if (updated !== original) {
		fs.writeFileSync(filePath, updated, "utf8");
		return true;
	}
	return false;
}

let changed = 0;
for (const dir of targetDirs) {
	walk(dir, (filePath) => {
		if (processFile(filePath)) {
			changed++;
			console.log("updated:", path.relative(rootDir, filePath));
		}
	});
}
for (const file of targetFiles) {
	if (fs.existsSync(file) && processFile(file)) {
		changed++;
		console.log("updated:", path.relative(rootDir, file));
	}
}

console.log(`\nDone. ${changed} file(s) updated.`);
