/*
 * 简体中文语言包
 * 基于社区贡献完善：FreezeSoul、zwh8800
 */

const locale: IGanttLocale = {
	date: {
		month_full: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
		month_short: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
		day_full: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
		day_short: ["日", "一", "二", "三", "四", "五", "六"]
	},
	labels: {
		new_task: "新任务",
		icon_save: "保存",
		icon_cancel: "取消",
		icon_details: "详情",
		icon_edit: "编辑",
		icon_delete: "删除",
		confirm_deleting: "任务将被永久删除，确定要继续吗？",
		section_description: "描述",
		section_time: "时间范围",
		section_type: "类型",
		section_deadline: "截止日期",
		section_baselines: "基线",
		section_new_resources: "资源",

		/* grid columns */
		column_wbs: "工作分解结构",
		column_text: "任务名称",
		column_start_date: "开始时间",
		column_duration: "工期",
		column_add: "",

		/* link confirmation */
		link: "关联",
		confirm_link_deleting: "将被删除",
		link_start: "（开始）",
		link_end: "（结束）",

		type_task: "任务",
		type_project: "摘要任务",
		type_milestone: "里程碑",

		minutes: "分钟",
		hours: "小时",
		days: "天",
		weeks: "周",
		months: "月",
		years: "年",

		/* message popup */
		message_ok: "确定",
		message_cancel: "取消",

		/* constraints */
		section_constraint: "限制",
		constraint_type: "限制类型",
		constraint_date: "限制日期",
		asap: "越早越好",
		alap: "越晚越好",
		snet: "不得早于开始",
		snlt: "不得晚于开始",
		fnet: "不得早于完成",
		fnlt: "不得晚于完成",
		mso: "必须开始于",
		mfo: "必须完成于",

		/* resource control */
		resources_add_button: "添加分配",
		resources_filter_placeholder: "搜索...",
		resources_filter_label: "隐藏空项",
		resources_section_placeholder: "尚未分配任何内容。点击「添加分配」以分配资源。",

		/* empty state screen */
		empty_state_text_link: "点击此处",
		empty_state_text_description: "创建您的第一个任务",

		/* baselines control */
		baselines_section_placeholder: "开始添加新的基线",
		baselines_add_button: "添加基线",
		baselines_remove_button: "删除",
		baselines_remove_all_button: "全部删除",

		/* deadline control */
		deadline_enable_button: "设置",
		deadline_disable_button: "删除"
	}
};

export default locale;
