/*
  tgui_devGrp
    init:
    add:
    getGrpInfo:
    edit:
    delete:
    clearForm:

 */
var tgui_devGrp = {
  formSelector_add: 'form#addDeviceGroupForm',
  formSelector_edit: 'form#editDeviceGroupForm',
  select_user_group_add: '#addDeviceGroupForm .select_user_group',
  select_user_group_edit: '#editDeviceGroupForm .select_user_group',
  select_acl_add: '#addDeviceGroupForm .select_acl',
  select_acl_edit: '#editDeviceGroupForm .select_acl',
  init:function() {
    var self = this;

    this.csvParser = new tgui_csvParser(this.csv),

    /*cleare forms when modal is hided*/
    $('#addDeviceGroup').on('hidden.bs.modal', function(){
    	self.clearForm();
    })
    $('#editDeviceGroup').on('hidden.bs.modal', function(){
    	self.clearForm();
    })/*cleare forms*///end

    $('select[data-objtype="password"]').change(function(){
      tgui_supplier.selector({select: this});
    })

    /*Select2 Group*/
    this.userGrpSelect2 = new tgui_select2({
      ajaxUrl : API_LINK+"tacacs/user/group/list/",
      template: this.selectionTemplate_grp,
      add: this.select_user_group_add,
      edit: this.select_user_group_edit,
    });
    $(this.select_user_group_add).select2(this.userGrpSelect2.select2Data());
    $(this.select_user_group_edit).select2(this.userGrpSelect2.select2Data());
    /*Select2 Group*///END
    /*Select2 ACL*/
    this.aclSelect2 = new tgui_select2({
      ajaxUrl : API_LINK + "tacacs/acl/list/",
      template: this.selectionTemplate_acl,
      add: this.select_acl_add,
      edit: this.select_acl_edit,
    });

    $(this.select_acl_add).select2(this.aclSelect2.select2Data());
    $(this.select_acl_edit).select2(this.aclSelect2.select2Data());
    /*Select2 ACL*///END

    $('#addDeviceGroup').on('show.bs.modal', function(){
    	self.userGrpSelect2.preSelection(0, 'add');
    	self.aclSelect2.preSelection(0, 'add');
    })

    /*fix tab IDs for tabMessages template*/
    var tabLinks = $(this.formSelector_edit + ' .message-tabs ul li a')
    var tabs = $(this.formSelector_edit + ' div.message-tabs div.tab-content div.tab-pane')
    for (var i = 0, len = tabLinks.length; i < len; i++) {
      $(tabLinks[i]).attr('href',$(tabLinks[i]).attr('href')+'_edit');
    }
    for (var i = 0, len = tabs.length; i < len; i++) {
      $(tabs[i]).attr('id',$(tabs[i]).attr('id')+'_edit');
    }
    /*fix tab IDs for tabMessages template*///end
  },
  add: function(){
    console.log('Adding new device group');
    var self = this;
    var formData = tgui_supplier.getFormData(self.formSelector_add);
    var ajaxProps = {
      url: API_LINK+"tacacs/device/group/add/",
      data: formData
    };//ajaxProps END

    ajaxRequest.send(ajaxProps).then(function(resp) {
      if (tgui_supplier.checkResponse(resp.error, self.formSelector_add)){
        return;
      }
      tgui_error.local.show({type:'success', message: "Device Group"+ $(self.formSelector_add + ' input[name="name"]').val() +" was added"})
      $("#addDeviceGroup").modal("hide");
			tgui_status.changeStatus(resp.changeConfiguration)
			self.clearForm();
			setTimeout( function () {dataTable.table.ajax.reload()}, 2000 );
    }).fail(function(err){
      tgui_error.getStatus(err, ajaxProps)
    })
    return this;
  },
  getGrpInfo: function(id, name) {
    var self = this;
    var ajaxProps = {
      url: API_LINK+"tacacs/device/group/edit/",
      type: "GET",
      data: {
        "name": name,
        "id": id,
      }
    };//ajaxProps END
    var el = {}, el_n = {};
    ajaxRequest.send(ajaxProps).then(function(resp) {
      tgui_supplier.fulfillForm(resp.group, self.formSelector_edit);

      self.userGrpSelect2.preSelection(resp.group.user_group, 'edit');
      self.aclSelect2.preSelection(resp.group.acl, 'edit');

      tgui_supplier.selector( {select: self.formSelector_edit + ' select[name="enable_flag"]', flag: resp.group.enable_flag } )

      if (resp.group.default_flag == 1) $(self.formSelector_edit + ' input[name="default_flag"]').iCheck('disable');

      $('#editDeviceGroup').modal('show')
    }).fail(function(err){
      tgui_error.getStatus(err, ajaxProps)
    })
  },
  edit: function() {
    console.log('Editing device group');
    var self = this;
    var formData = tgui_supplier.getFormData(this.formSelector_edit, true);

    var ajaxProps = {
      url: API_LINK+"tacacs/device/group/edit/",
      type: 'POST',
      data: formData
    };//ajaxProps END

    if ( ! tgui_supplier.checkChanges(ajaxProps.data, ['id']) ) return false;

    if ( formData.enable ) {
      formData.enable_flag = $(this.formSelector_edit+' select[name="enable_flag"]').val()
      formData.enable_encrypt = ( $(this.formSelector_edit+' input[name="enable_encrypt"]').prop('checked') ) ? 1 : 0
    }

    ajaxRequest.send(ajaxProps).then(function(resp) {
      if (tgui_supplier.checkResponse(resp.error, self.formSelector_edit)){
        return;
      }
      tgui_error.local.show({type:'success', message: "Device Group"+ $(self.formSelector_edit + ' input[name="name"]').val() +" was edited"})
      $("#editDeviceGroup").modal("hide");
      tgui_status.changeStatus(resp.changeConfiguration)
      self.clearForm();
      setTimeout( function () {dataTable.table.ajax.reload()}, 2000 );
    }).fail(function(err){
      tgui_error.getStatus(err, ajaxProps)
    })
    return this;
  },
  delete: function(id, name, flag) {
    console.log('Deleting DeviceGroupID:'+id+' with name '+ name)
    id = id || 0;
    flag = (flag !== undefined) ? false : true;
    name = name || 'undefined';
    if (flag && !confirm("Do you want delete '" + name + "'?")) return;
    var ajaxProps = {
      url: API_LINK+"tacacs/device/group/delete/",
      data: {
        "name": name,
        "id": id,
      }
    };//ajaxProps END
    ajaxRequest.send(ajaxProps).then(function(resp) {
      if(resp.result != 1) {
        (resp.error.message) ?
          tgui_error.local.show( {type:'error', message: resp.error.message} )
        :
          tgui_error.local.show( {type:'error', message: "Oops! Unknown error appeared :("} );
        return;
      }
      tgui_error.local.show({type:'success', message: "Device Group"+ name +" was deleted"})
      tgui_status.changeStatus(resp.changeConfiguration)
      setTimeout( function () {dataTable.table.ajax.reload()}, 2000 );
    }).fail(function(err){
      tgui_error.getStatus(err, ajaxProps)
    })
    return this;
  },
  selectionTemplate_grp: function(data){
    data.default_flag = (data.id != 0) ? data.default_flag : false;
    var default_flag_class = (data.default_flag) ? 'option_default_flag': ''
    var output='<div class="selectGroupOption '+ default_flag_class +'">';
      output += '<text>'+data.text+'</text>';
      output += '<specialFlags>';
      output += (data.key) ? '<small class="label pull-right bg-green" style="margin:3px">k</small>' : '';
      output += (data.enable) ? ' <small class="label pull-right bg-yellow" style="margin:3px">e</small>' : '';
      output += (data.default_flag) ? ' <small class="label pull-right bg-gray" style="margin:3px">d</small>' : '';
      output += '</specialFlags>'
    output += '</div>'
    return output;
  },
  selectionTemplate_acl: function(data){
    var output='<div class="selectAclOption">';
      output += '<text>'+data.text+'</text>';
      output += '</div>'
    return output;
  },
  csv: {
    columnsRequired: ['name'],
    fileInputId: '#csv-file',
    ajaxItem: 'device/group',
    outputId: '#csvParserOutput',
    ajaxHandler: function(resp,index){
      var item = 'deviceGroup';
      if (resp.error && resp.error.status){
        var error_message = '';
        for (v in resp.error.validation){
          if (!(resp.error.validation[v] == null)){
            for (num in resp.error.validation[v]){
              error_message+='<p class="text-danger">'+resp.error.validation[v][num]+'</p>';
            }
            this.csvParserOutput({tag: error_message, response: index});
          }
        }
      }
      if (resp[item] && resp[item].name) {
        this.csvParserOutput({tag: '<p class="text-success">Device <b>'+ resp[item].name + '</b> was added!</p>', response: index});
        tgui_status.changeStatus(resp.changeConfiguration)
      }
      this.csvParserOutput({tag: '<hr>'});
    },
    finalAnswer: function() {
      this.csvParserOutput({message: 'End of CSV file. Reload database.'})
      setTimeout( function () {dataTable.table.ajax.reload()}, 2000 );
    }
  },
  //csvDownload: this.csvParser.csvDownload,
  clearForm: function() {
    tgui_supplier.clearForm();
    $('input[name="default_flag"]').iCheck('enable');
    $('.nav.nav-tabs a[href="#tab_1"]').tab('show');//select first banner tab
  	$('.nav.nav-tabs a[href="#tab_1_edit"]').tab('show');//select first banner tab
  	$('.nav.nav-tabs a[href="#general_info"]').tab('show');//select first tab
  	$('.nav.nav-tabs a[href="#general_info_edit"]').tab('show');//select first tab
  },
}
