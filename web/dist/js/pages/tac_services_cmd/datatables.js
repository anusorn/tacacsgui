var initialData =
{
	ajaxLink: "tacacs/cmd/datatables/",
	tableSelector: '#mainDataTable',
	item: 'cmd',
	deleteItems: tgui_cmd.del,
	exportCsv: function(idList){ tgui_cmd.csvParser.csvDownload(idList); return true;},
  columns:
	{
		id: {title: "ID", data : "id", orderable: true, visible: false,},
		name: {title: "Name", data : "name", visible: true, orderable: true},
	 	created_at: {title: "Created at", data : "created_at", visible: false, orderable: true},
	 	updated_at: {title: "Updated at", data : "updated_at", visible: false, orderable: true},
		buttons: {title: "Action", data : "buttons", visible: true, orderable: false},
	},
  column:
	{
		select: true,
		preview: true
	},
  sort:
	{
		column: 3,
		order: 'asc'
	},
};

var dataTable = {
	init: function() {
		this.settings.columnsFilter();
		this.settings.preview();
		this.settings.columnDefs = [
			{
				targets: [ 3 ],
				createdCell: function (td, cellData, rowData, row, col) {
					if (rowData.type == 'junos') {
						//cellData = 123123;
						//console.log(cellData);
						$(td).addClass('junos');
					}
				},
			}
		];
		this.table = $(initialData.tableSelector).DataTable(this.settings);
	},
	table: {},
	settings: new tgui_datatables(initialData),
};

//$.fn.dataTable.ext.errMode = 'throw';
