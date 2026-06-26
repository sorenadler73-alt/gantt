function initLink编辑Form() {
	gantt.$lightboxControl.links.addForm = function () {

		this.deleteLink = function (id) {
			gantt._removed_links.push(id);
			gantt._link编辑or.data.remove(id);
			this.update任务编辑框LinkData();
		};

		this.removeAllLinks = function () {
			var links = gantt._link编辑or.data._order;
			for (var i = 0; i < links.length; i++) {
				gantt._removed_links.push(links[i].id);
				gantt._link编辑or.data.remove(links[i].id);
			}
			this.update任务编辑框LinkData();
		};

		this.addNewLink = function () {
			gantt._link编辑or.data.add([{
				id: +new Date() + "",
				target: "",
				source: gantt._lightbox_id,
				type: 0,
				task: "",
				link_type: "Finish to 开始",
				direction: "Predecessor",
				lag: 0
			}]);
			this.update任务编辑框LinkData();
		}

		this.update任务编辑框LinkData = function () {
			gantt._lightbox_links = gantt._link编辑or.data._order;
		}



		var linkColumns = [
			{ width: 50, id: "add_link", header: [{ text: "<input class='dhx_button dhx_button--size_small' type=button value='+' title='添加 a new link' data-onclick='addNewLink'>" }], sortable: false, htmlEnable: true, editable: false },
			{
				minWidth: 150, id: "task", header: [{ text: "task" }], editor类型: "select", options: [], htmlEnable: true, template: function (text, row, col) {
					return col.optionLabels[text];
				}
			},
			{ width: 120, id: "direction", header: [{ text: "direction" }], editor类型: "select", htmlEnable: true, options: ["Predecessor", "Successor",] },
			{ width: 120, id: "link_type", header: [{ text: "类型" }], editor类型: "select", htmlEnable: true, options: ["Finish to 开始", "开始 to 开始", "Finish to Finish", "开始 to Finish"] },
			{ width: 80, id: "lag", header: [{ text: "Lag" }], editor类型: "input", type: "number" },
			{
				width: 50, id: "remove_link", header: [{ text: "<input type=button class='dhx_button dhx_button--size_small' value='✖' title='删除 all links' data-onclick='removeAllLinks'>" }], sortable: false, htmlEnable: true, editable: false, template: function (text, row, col) {
					return "<input class='dhx_button dhx_button--size_small' type=button value='✖' title='删除 this link' data-onclick='deleteLink' data-onclick_argument='" + row.id + "'>";
				}
			},
		]

		if (gantt._link编辑or) {
			gantt._link编辑or.destructor();
		}

		if (gantt._lightbox_links == "load") {
			gantt._lightbox_links = [];
			var task = gantt._lightbox_task;
			var predecessors = task.$target;
			var successors = task.$source;

			predecessors.forEach(function (linkId) {
				var link = gantt.getLink(linkId);
				if (!gantt.is任务Exists(link.source)) return;

				link.task = link.source;
				link.link_type = linkColumns[3].options[link.type];
				link.direction = "Predecessor";
				link.lag = link.lag || 0;

				gantt._lightbox_links.push(link);
			})


			successors.forEach(function (linkId) {
				var link = gantt.getLink(linkId);
				if (!gantt.is任务Exists(link.target)) return;

				link.task = link.target;
				link.link_type = linkColumns[3].options[link.type];
				link.direction = "Successor";
				link.lag = link.lag || 0;

				gantt._lightbox_links.push(link);
			});
		}


		linkColumns[1].options = [];
		linkColumns[1].optionLabels = {};
		var tasks = gantt.get任务ByTime()
		tasks.forEach(function (task) {
			if (task.id != gantt.getState().lightbox) {
				linkColumns[1].options.push(task.id);
				linkColumns[1].optionLabels[task.id] = task.text;
			}
		})

		gantt._link编辑or = new dhx.表格(null, {
			columns: linkColumns,
			autoHeight: true,
			autoWidth: true,
			editable: true,
			data: gantt._lightbox_links
		});

		gantt._link编辑or.events.on("CellClick", function (row, column, e) {
			if (column.editable !== false) {
				gantt._link编辑or.editCell(row.id, column.id);
			}
		});

		gantt._link编辑or.events.on("After编辑开始", function (row, col, editor类型) {
			if (col.id == "lag") {
				dhx.awaitRedraw().then(function () {
					var element = document.querySelector(".dhx_cell-editor");
					element.type = "number";
				});
			}
			if (col.id == "task") {
				dhx.awaitRedraw().then(function () {
					var selectEl = document.querySelector(".dhx_cell-editor__select");
					var selectedValue = selectEl.value;
					var children = selectEl.childNodes;
					for (var i = 0; i < children.length; i++) {
						var child = children[i];
						child.outerHTML = "<option value=" + child.innerHTML + ">" + linkColumns[1].optionLabels[child.innerHTML] + "</option>";
					}
					selectEl.value = selectedValue;
				});
			}

		});

		gantt._link编辑or.events.on("Before编辑End", function (value, row, column) {
			var id = row.id
			for (var i = 0; i < gantt._lightbox_links.length; i++) {
				var link = gantt._lightbox_links[i];
				if (link.id != id) {
					continue;
				}

				if (column.id == "task") {
					var selected任务Id = value;
					if (link.direction == "Predecessor") {
						link.source = selected任务Id;
						link.target = gantt._lightbox_id;
					}
					else {
						link.source = gantt._lightbox_id;
						link.target = selected任务Id;
					}

				}
				if (column.id == "direction") {
					var tmpProperty = link.source;
					link.source = link.target;
					link.target = tmpProperty;
				}
				if (column.id == "link_type") {
					link.type = column.options.indexOf(value) + "";
				}
			}
		});
		gantt._tabbar.getCell("links").attach(gantt._link编辑or);
	};

}