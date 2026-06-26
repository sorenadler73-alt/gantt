function init任务编辑Form() {
	gantt.$lightboxControl.task.addForm = function () {
		var task = gantt.get任务(gantt._lightbox_id);
		if (gantt._lightbox_task) {
			task = gantt._lightbox_task;
		}

		var taskFormRows = {
			text: {
				name: "text",
				type: "input",
				label: "任务名称",
				id: "text",
				labelPosition: "left",
				labelWidth: 100,
				required: true,
				value: task.text,
			},
			description: {
				name: "description",
				type: "textarea",
				label: "描述",
				id: "description",
				labelPosition: "left",
				labelWidth: 100,
				value: task.description,
			},
			start_date: {
				name: "start_date",
				type: "datepicker",
				label: "开始 Date",
				id: "start_date",
				required: true,
				labelPosition: "left",
				labelWidth: 100,
				dateFormat: "%d/%m/%y %H:%i",
				timePicker: true,
				value: task.start_date,
			},
			end_date: {
				name: "end_date",
				type: "datepicker",
				label: "End Date",
				id: "end_date",
				required: true,
				labelPosition: "left",
				labelWidth: 100,
				dateFormat: "%d/%m/%y %H:%i",
				timePicker: true,
				value: task.end_date,
			},
			duration: {
				name: "duration",
				type: "input",
				input类型: "number",
				label: "工期",
				id: "duration",
				labelPosition: "left",
				labelWidth: 100,
				required: true,
				value: task.duration,
			},
			tags: {
				name: "tags",
				type: "combo",
				label: "Tags",
				id: "end_date",
				labelPosition: "left",
				labelWidth: 100,
				multiselection: true,
				value: ["1", "4"],
				data: [
					{ value: "Important", id: "1" },
					{ value: "Urgent", id: "2" },
					{ value: "External", id: "3" },
					{ value: "Planned", id: "4" },
					{ value: "Teamwork", id: "5" },
				],
				value: task.tags,
			},
			progress: {
				name: "progress",
				type: "slider",
				id: "progress",
				label: "进度",
				labelPosition: "left",
				labelWidth: 100,
				min: 0,
				max: 100,
				value: task.progress * 100,
			},
		};

		var taskFormRowsFor表格 = [
			taskFormRows["text"],
			taskFormRows["description"],
			taskFormRows["start_date"],
			taskFormRows["end_date"],
			taskFormRows["duration"],
			taskFormRows["tags"],
			taskFormRows["progress"],
		];

		if (gantt._taskForm) gantt._taskForm.destructor();
		gantt._taskForm = new dhx.Form(null, {
			css: "dhx_widget--bordered",
			rows: taskFormRowsFor表格,
		});
		gantt._tabbar.getCell("task").attach(gantt._taskForm);

		gantt._taskForm.events.on("Change", function (name, new_value) {
			var task = gantt._lightbox_task;

			var updated任务 = gantt._taskForm.getValue();

			task.text = updated任务.text;
			task.description = updated任务.description;
			task.tags = updated任务.tags;
			task.progress = updated任务.progress / 100;

			switch (name) {
				case "start_date":
					task.start_date = gantt.date.parseDate(updated任务.start_date, taskFormRows.start_date.dateFormat);
					task.end_date = gantt.calculateEndDate({ start_date: task.start_date, duration: task.duration, task: task, unit: "hour" });
					gantt._taskForm.getItem("end_date").setValue(task.end_date);
					break;

				case "duration":
					task.duration = updated任务.duration;
					task.end_date = gantt.calculateEndDate({ start_date: task.start_date, duration: task.duration, task: task, unit: "hour" });
					gantt._taskForm.getItem("end_date").setValue(task.end_date);
					break;

				case "end_date":
					task.end_date = gantt.date.parseDate(updated任务.end_date, taskFormRows.end_date.dateFormat);
					if (+task.end_date <= +task.start_date) {
						task.end_date = gantt.calculateEndDate({ start_date: task.start_date, duration: 1, task: task, unit: "hour" });
						gantt._taskForm.getItem("end_date").setValue(task.end_date);
					}

					task.duration = gantt.calculate工期({ start_date: task.start_date, end_date: task.end_date, task: task, unit: "hour" });
					gantt._taskForm.getItem("duration").setValue(task.duration);
					break;

				default:
					break;
			}
		});
	};
}
