function initCalendar编辑Form() {
	gantt.$lightboxControl.calendars.addForm = function () {

		this.deleteCalendarDate = function (id) {
			var item = gantt._calendar编辑or.data.getItem(id);
			var removeDate = item.date;
			var parsedDate = gantt.date.str_to_date("%Y-%m-%d")(removeDate);

			var calendar = gantt.getCalendar(gantt._activeCalendar);
			calendar.unsetWorkTime({ date: parsedDate, hours: "08:00-17:00" });
			gantt.refresh任务(gantt._lightbox_id);

			gantt._calendar编辑or.data.remove(id);
		};

		this.deleteAllCalendarDates = function (id) {
			var dates = gantt._calendar编辑or.data._order;
			for (var i = 0; i < dates.length; i++) {
				if (dates[i].date) {
					var parsedDate = gantt.date.str_to_date("%Y-%m-%d")(dates[i].date);
					var calendar = gantt.getCalendar(gantt._activeCalendar);
					calendar.unsetWorkTime({ date: parsedDate });
					gantt._calendar编辑or.data.remove(dates[i].id);
				}
			}
		};

		this.addCalendarDate = function () {
			var min_date = gantt.getState().min_date
			var parsedDate = gantt.date.date_to_str("%Y-%m-%d")(min_date)
			gantt._calendar编辑or.data.add([{
				date: parsedDate,
				hours: "08:00-17:00"
			}]);
			gantt.getCalendar(gantt._activeCalendar).setWorkTime({ date: new Date(min_date), hours: ["08:00-17:00"] })
		};
		this.copyCalendarDate = function (id) {
			gantt._calendar编辑or.data.copy(id, -1);
		};

		this.resetCalendarDay = function (id) {
			var item = gantt._calendar编辑or.data.getItem(id);
			var removeDay = item.day;

			var calendar = gantt.getCalendar(gantt._activeCalendar);
			calendar.setWorkTime({ day: removeDay, hours: ["00:00-24:00"] });
			gantt.refresh任务(gantt._lightbox_id);

			item.hours = "00:00-24:00";
			gantt._calendar编辑or.paint();
		};

		this.changeCalendar = function (value) {
			if (value == "global") {
				gantt._lightbox_task.calendar_id = null;
			}
			else {
				gantt._lightbox_task.calendar_id = value;
			}

			gantt._lightbox_task.end_date = gantt.calculateEndDate(gantt._lightbox_task);
			gantt.$lightboxControl.fillTabContent("calendars");
		};



		this.renameCalendar = function () {
			var parent = document.querySelector("#calendarSelector");
			var dropdown = parent.querySelector("select");

			var renamer = document.createElement("div");
			renamer.innerHTML = "<input type=button value='✔' title='保存 new calendar name' data-onclick='updateCalendarName' class='dhx_button'> " +
				"<input type=button value='✖' title='取消' data-onclick='addForm'  class='dhx_button'>" +
				"New Name: " +
				"<input class='new_calendar_name' value=" + gantt._activeCalendar + ">";
			parent.replaceChild(renamer, dropdown);
		};

		this.updateCalendarName = function (name) {
			name = name || document.querySelector(".new_calendar_name").value;

			var currentCalendar = gantt.getCalendar(gantt._activeCalendar);
			var newCalendar = gantt.createCalendar(currentCalendar);
			newCalendar.id = name;
			gantt.addCalendar(newCalendar);

			gantt.each任务(function (task) {
				if (task.calendar_id == gantt._activeCalendar) {
					task.calendar_id = name;
				}
			});


			this.deleteCalendar();
			this.changeCalendar(name);
		};


		this.cloneCalendar = function () {
			this.addCalendar(gantt._activeCalendar);
		};

		this.addCalendar = function (name) {
			name = name || "";
			var currentCalendar = gantt.getCalendar(name);

			var newCalendar = gantt.createCalendar(currentCalendar);
			if (name) {
				newCalendar.id = name + "_copy";
			}
			else {
				newCalendar.id = "calendar_" + (gantt._calendars.length + 1);
			}

			gantt.addCalendar(newCalendar);
			this.changeCalendar(newCalendar.id);
		};

		this.deleteCalendar = function () {
			if (gantt._activeCalendar == "fulltime" || gantt._activeCalendar == "global") {
				gantt.message({ text: "System calendars cannot be deleted!", type: "error" });
				return;
			}
			gantt.deleteCalendar(gantt._activeCalendar);
			this.changeCalendar("fulltime");
		};

		this.getCalendars = function () {
			gantt._calendars = [];
			var calendars = gantt.getCalendars();
			for (var i = 0; i < calendars.length; i++) {
				var calendar = { calendar: calendars[i].id, settings: [] };
				var worktime = calendars[i]._worktime;
				for (var el in worktime.dates) {
					if (el < 7) {
						if (worktime.dates[el] === true || worktime.dates[el] === "true") {
							calendar.settings.push({ day: el, hours: worktime.hours });
						}
						else if (worktime.dates[el]) {
							calendar.settings.push({ day: el, hours: worktime.dates[el] });
						}
						else {
							calendar.settings.push({ day: el, hours: false });
						}

					}
					else {
						calendar.settings.push({
							date: gantt.date.date_to_str("%Y-%m-%d")(new Date(+el)),
							hours: worktime.dates[el]
						});
					}
				}

				gantt._calendars.push(calendar);
			}
		};



		var calendarColumns = [
			{
				width: 60, id: "add", header: [{ text: "<input type=button value='✚' title='添加 a new date'  data-onclick='addCalendarDate' class='dhx_button dhx_button--size_small'>" }], sortable: false, htmlEnable: true, editable: false, template: function (text, row, col) {
					if (!row.day) return "<input type=button value='⇊' title='Clone this date with the hour settings' data-onclick='copyCalendarDate' data-onclick_argument='" + row.id + "' class='dhx_button dhx_button--size_small'>";
				}
			},
			{
				width: 120, id: "date", header: [{ text: "Date" }], type: "date", format: "%Y-%m-%d", htmlEnable: true, template: function (text, row, col) {
					if (row.day) return "Day: " + row.day;
					else return row.date;
				}
			},
			{
				minWidth: 200, id: "hours", header: [{ text: "hours" }], editor类型: "input", type: "time", template: function (text, row, col) {
					if (text.join) {
						return text.join();
					}
					else {
						return text;
					}
				}
			},
			{
				width: 60, id: "control", header: [{ text: "<input type=button value='✖' title='Remove all calendar dates' data-onclick='deleteAllCalendarDates' class='dhx_button dhx_button--size_small'>" }], sortable: false, htmlEnable: true, editable: false, template: function (text, row, col) {
					if (row.day) return "<input type=button value='-' title='Reset hours' data-onclick='resetCalendarDay' data-onclick_argument='" + row.id + "' class='dhx_button dhx_button--size_small'>";
					else return "<input type=button value='✖' title='Remove this calendar date' data-onclick='deleteCalendarDate' data-onclick_argument='" + row.id + "' class='dhx_button dhx_button--size_small'>";
				}
			}
		];


		if (gantt._calendar布局) {
			gantt._calendar布局.destructor();
		}
		gantt._calendar布局 = new dhx.布局(null, {
			rows: [
				{
					id: "header1",
					html: "<b>Assign calendar:</b>",
					minHeight: "20px"
				},
				{
					id: "calendarSelector",
					html: "<div id='calendarSelector'></div>",
					minHeight: "35px"
				},
				{
					id: "header2",
					html: "<b>编辑 calendar:</b>",
					minHeight: "20px"
				},
				{
					id: "calendarDates编辑or",
					html: "<div id='calendarDates编辑or'></div>"
				}
			]
		});

		gantt._tabbar.getCell("calendars").attach(gantt._calendar布局);


		if (gantt._calendar编辑or) {
			gantt._calendar编辑or.destructor();
		}

		this.getCalendars();

		gantt._activeCalendar = gantt._lightbox_task.calendar_id || "global";

		if (!gantt.getCalendar(gantt._activeCalendar)) {
			gantt._activeCalendar = "global";
			gantt._lightbox_task.calendar_id = gantt._activeCalendar;
		}

		var currentCalendar = null;
		for (var i = 0; i < gantt._calendars.length; i++) {
			if (gantt._activeCalendar == gantt._calendars[i].calendar) {
				currentCalendar = gantt._calendars[i];
			}
		}

		gantt._calendar编辑or = new dhx.表格(null, {
			columns: calendarColumns,
			autoHeight: true,
			autoWidth: true,
			editable: true,
			data: currentCalendar.settings
		});
		gantt._calendar布局.getCell("calendarDates编辑or").attach(gantt._calendar编辑or);

		gantt._calendar编辑or.events.on("CellClick", function (row, column, e) {
			if (column.editable !== false && !row.day) {
				gantt._calendar编辑or.editCell(row.id, column.id);
			}
		});

		gantt._calendar编辑or.events.on("Before编辑End", function (value, row, column) {
			var calendar = gantt.getCalendar(gantt._activeCalendar);

			var previous = gantt.copy(gantt._calendar编辑or.data.getItem(row.id));
			if (column.id == "hours") {
				var new_value = false;
				if ((value.indexOf(",") > -1)) {
					new_value = value.split(",");
				}
				else if (value.indexOf("-") > -1) {
					new_value = [value];
				}

				if (row.day) {
					calendar.setWorkTime({ day: row.day, hours: new_value });
				}
				else if (row.date) {
					var selectedDate = formatDate(row.date);
					calendar.setWorkTime({ date: selectedDate, hours: new_value });
				}

			}
			else if (column.id == "date") {
				var addedDates = gantt._calendar编辑or.data._order;
				var duplicates = 0;
				for (var i = 0; i < addedDates.length; i++) {
					if (previous.date == addedDates[i].date) {
						duplicates++;
					}
				}
				if (duplicates < 2) {
					var parsedDatePrevious = formatDate(previous.date);
					calendar.unsetWorkTime({ date: parsedDatePrevious });
				}
				var parsedDateNew = formatDate(value);

				var hours = row.hours;
				if (row.hours) {
					if (row.hours.indexOf(",") > -1) {
						hours = row.hours.split(",");
					}
					else if (row.hours.indexOf("-") > -1) {
						hours = [row.hours];
					}
				}

				calendar.setWorkTime({ date: parsedDateNew, hours: hours }); //GS-1515

			}
			gantt._lightbox_task.end_date = gantt.calculateEndDate(gantt._lightbox_task);

			gantt.refresh任务(gantt._lightbox_id);
		});


		dhx.awaitRedraw().then(function () {
			var calendarSelector = document.querySelector("#calendarSelector");

			var calendar_names = [];
			for (var i = 0; i < gantt._calendars.length; i++) {
				var selected = '';
				if (gantt._activeCalendar == gantt._calendars[i].calendar) {
					selected = "selected";
				}
				calendar_names.push("<option " + selected + ">" + gantt._calendars[i].calendar + "</option>");
			}


			calendarSelector.innerHTML = "<input type=button value='✚' title='添加 a new Calendar' data-onclick='addCalendar' class='dhx_button dhx_button--size_medium'> " +
				"<input type=button value='⇊' title='Clone this calendar' data-onclick='cloneCalendar' class='dhx_button dhx_button--size_medium'> " +
				"<input type=button value='✎' title='Rename this calendar' data-onclick='renameCalendar' class='dhx_button dhx_button--size_medium'> " +
				"<select class='dhx_cell-editor__select calendarChanger'>" + calendar_names.join() + "</select> " +
				"<input type=button value='✖' title='删除 this calendar' data-onclick='deleteCalendar' class='dhx_button dhx_button--size_medium'> "

			var calendarChanger = document.querySelector(".calendarChanger");
			if (calendarChanger) {
				gantt.event(calendarChanger, "change", function (e) {
					gantt.$lightboxControl.calendars.changeCalendar(calendarChanger.value);
				});
			}

		});

	};
}