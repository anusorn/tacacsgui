<div id="addDevice" class="modal fade" role="dialog">
	<div class="modal-dialog modal-lg">
	<!-- Modal content-->
	<div class="modal-content">
		<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal">&times;</button>
			<h4 class="modal-title">Add New Device</h4>
		</div>
		<div class="modal-body">
		<form id="addDeviceForm">
			<div class="nav-tabs-custom">
				<ul class="nav nav-tabs">
					<li class="active"><a href="#general_info" data-toggle="tab" aria-expanded="true">General</a></li>
					<li><a href="#tacgui" data-toggle="tab" aria-expanded="true">TacGUI</a></li>
				</ul>
				<div class="tab-content">
					<div class="tab-pane active" id="general_info">
						<?php include __DIR__ . '/tabGeneralInfo.php';?>
					</div>
					<!-- /.tab-pane -->
					<div class="tab-pane" id="tacgui">
						<?php include __DIR__ . '/tabTacGUI.php';?>
					</div>
					<!-- /.tab-pane -->
				<!-- /.tab-content -->
				</div>
			</div>
		</form>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-flat pull-left" data-dismiss="modal">Close</button>
			<button type="button" class="btn btn-flat btn-success" onclick="cm_devices.add()">Add Device</button>
		</div>
	</div>
	</div>
</div>
