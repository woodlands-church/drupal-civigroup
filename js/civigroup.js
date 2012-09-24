(function ($) {
	Drupal.behaviors.civi_groups_gui = {
		attach: function(context) {
			var contacts = $('#group-contact-list');
			//Load active folder
			Drupal.behaviors.civi_groups_gui.loadGroupContents($("div.group_load:first"),0);
			$("div.group_load:first").addClass('selectedFolder');
			//Bind click handlers.
			//Toggle subgroup display
			$("div.group-children-toggle").bind('click', Drupal.behaviors.civi_groups_gui.toggleSubgroups);
			//Group content loading:
			$("div.group_load").bind('click', function (event) {
				var $item = $(this);
				Drupal.behaviors.civi_groups_gui.loadGroupContents($item, 0);
				return false;
			});
			$("div.group_load").droppable({
				accept: "#group-contact-list > li",
				over: function (event, ui) {
					$(this).toggleClass('dragOverDrop');
				},
	        		out: function (event, ui) {
			                $(this).toggleClass('dragOverDrop');
			        }
			});
		},
		loadGroupContents: function ($item, $page) {
	    		if($item.hasClass('selectedGroup') && $page == Drupal.settings.civigroups.page) {
				return;
			}
			$('.selectedGroup').removeClass('selectedGroup');
			$item.addClass('selectedGroup');
			$("#group-contact-list > li").remove();
			var loading = '<li id="loading_group"><b>Loading Contacts...</b></li>';
			$loading = $(loading);
			$loading.appendTo('#group-contact-list');

			$.ajax({ 
				url: Drupal.settings.civigroups.url+"?q=civicrm/groups/contactsJSON", 
				processData:  true,
				data: {group: $item.attr('id'), page: $page}, 
				success: Drupal.behaviors.civi_groups_gui.groupContactsLoaded,
			});
			Drupal.settings.civigroups.page = $page;
		},
		groupContactsLoaded: function (data) {
			$("#loading_group").remove();
			$('#history_chart').replaceWith('<div id="history_chart">'+data['history'])+'</div>';
			jQuery(data['contacts']).each(function(index){
			var item = this;
			var listitem = $('<li></li>').appendTo('#group-contact-list')
				.attr('id', 'contact-id' + item.id)
				.html('<div class="icon crm-icon Individual-icon" title="Individual"></div>'+item.sort_name)
				.bind('click', function (event) {
					return true;
				});
			$item = $(item);
			listitem.draggable({
				cancel: "a.ui-icon",
				revert: "invalid",
				containment: "document",
				helper: "clone",
				cursor: "move"
			});
			});
		},
		toggleSubgroups: function (event) {
			// Grab folder.
      			var $item = $(this);
      			// Toggle the display of its <ul> elements.
      			var $parent = $item.parent();
			$parent.children('ul').toggleClass('hidden');
      			return false;
    		},
	};
})(jQuery);
