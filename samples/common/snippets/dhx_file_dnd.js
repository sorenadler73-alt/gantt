function fileDragAndDrop(){
	var overlay = null,
		uid = Date.now();

	function callListeners(file){
		for(var i in this.listeners){
			if(this.listeners[i])
				this.listeners[i](file);
		}
	}

	var show高light = false,
		timeout = 0;

	return {
		root: null,
		listeners: {},
		file类型Message: "Only MPP and XML files are supported!",
		dndFile类型Message: "Please try XML or MPP project file.",
		dndHint: "Drop MPP or XML file into Gantt",
		onDrop: function(listener){
			var id = uid++;
			this.listeners[id] = listener;
			return id;
		},
		removeListener: function(id){
			delete this.listeners[id];
		},

		mode:"msp",

		isExcelMime类型: function(fileTransferItem){
			if(!fileTransferItem) return false;

			var excel类型s = {
				"application/vnd.ms-excel":true,
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":true
			};

			return excel类型s[fileTransferItem.type];
		},
		isExcelFile: function(file){
			var ext = file.name.split(".").pop();
			var excel扩展 = {
				"xls": true,
				"xlsx": true
			};

			return !!(excel扩展[ext]);
		},

		isPrimaveraP6Mime类型: function(fileTransferItem){
			if(!fileTransferItem) return false;

			var types = {
				"application/xer":true
			};

			return types[fileTransferItem.type];
		},

		isPrimaveraP6File: function(file){
			var ext = file.name.split(".").pop();
			var extensions = {
				"xer": true,
				"xml": true
			};

			return !!(extensions[ext]);
		},

		isMs项目Mime类型: function(fileTransferItem){
			if(!fileTransferItem) return false;

			var ms类型s = {
				"text/xml":true,
				"application/xml":true,
				"application/vnd.ms-project": true,
				"application/msproj": true,
				"application/msproject": true,
				"application/x-msproject": true,
				"application/x-ms-project": true,
				"application/x-dos_ms_project": true,
				"application/mpp": true,
				"zz-application/zz-winassoc-mpp": true
			};

			return ms类型s[fileTransferItem.type];
		},

		isMs项目File: function(file){
			var ext = file.name.split(".").pop();
			var msProj扩展 = {
				"mpp": true,
				"xml": true
			};

			return !!(msProj扩展[ext]);
		},

		init: function(div){

			this.root = div;

			div.addEventListener("dragover", gantt.bind(function(event){
				event.preventDefault && event.preventDefault();
				show高light = true;
				this.showHover(event);
			}, this), false);

			div.addEventListener("dragenter", gantt.bind(function(event){
				event.preventDefault && event.preventDefault();
				show高light = true;
				this.showHover(event);
			}, this), false);

			div.addEventListener("dragleave", gantt.bind(function(event){
				show高light = false;
				clearTimeout( timeout );
				timeout = setTimeout( gantt.bind(function(){
					if( !show高light ){ this.hideOverlay(); }
				}, this), 200 );
			}, this), false);

			div.addEventListener("dragend", gantt.bind(function(event){
				this.hideOverlay();
				show高light = false;
			}, this), false);

			div.addEventListener("drop", gantt.bind(function(event){
				event.preventDefault && event.preventDefault();
				show高light = false;
				this.hideOverlay();

				var files = event.dataTransfer.files;

				var file = files[0];

				var checkFile类型 = this.isMs项目File;

				if(this.mode == "excel"){
					checkFile类型 = this.isExcelFile;
				}else if(this.mode == "primaveraP6"){
					checkFile类型 = this.isPrimaveraP6File;
				}

				if(checkFile类型.call(this, file)){
					callListeners.call(this, file);
				}else{
					gantt.message("The extension of <b>" +file.name+ "</b> " + this.file类型Message);
				}

				return false;
			}, this), false);
		},

		hideOverlay: function(){
			if(!overlay) return;
			overlay.parentNode.removeChild(overlay);
			overlay = null;
		},

		showHover: function showFileHover(event){
			if(event.dataTransfer && event.dataTransfer.items && event.dataTransfer.items[0]){

				var checkMime类型 = this.isMs项目Mime类型;

				if(this.mode == "excel"){
					checkMime类型 = this.isExcelMime类型;
				}else if(this.mode == "primaveraP6"){
					checkMime类型 = this.isMs项目Mime类型;
				}

				if(!checkMime类型.call(this, event.dataTransfer.items[0])){
					this.showOverlay('<div class="gantt-file-hover-content-upload-image"></div>' +
						'<div class="gantt-file-hover-content-upload-message">'+this.dndFile类型Message+'</div>', true);
				}else{
					this.showOverlay('<div class="gantt-file-hover-content-upload-image"></div>' +
						'<div class="gantt-file-hover-content-upload-message">'+this.dndHint+'</div>');
				}
			}
		},

		showUpload: function showFileIn进度(){
			this.showOverlay('<div class="gantt-file-upload-spinner"><div class="gantt-file-upload-spinner-inner"></div></div>' +
				'<div class="gantt-file-hover-content-upload-message">加载中&hellip;</div>');
		},

		showOverlay: function showOverlay(innerHTML, invalid){
			if(!this.root) return;
			if(overlay) return;

			overlay = document.createElement("div");
			overlay.className = "gantt-file-hover" + (invalid ? " not-supported" : "");

			overlay.innerHTML = '<div class="gantt-file-hover-inner">' +
				'<div class="gantt-file-hover-content-pending">' +
				innerHTML +
				'</div>' +
				'</div>';
			this.root.appendChild(overlay);
		}
	};
}