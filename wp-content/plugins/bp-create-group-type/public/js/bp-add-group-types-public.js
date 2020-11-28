(function( $ ) {
	'use strict';
	var group_all_clicked = true;

	var object = 'groups';// wbcom_agt_bp_filter_request
	jQuery.cookie(
		'bp-' + object + '-extras', '', {
			path: '/'
		}
	);

	$( document ).on(
		'change', 'select.bpgt-groups-search-group-type', function(){
			//alert('trigger');
			if( !group_all_clicked ) {
				return;
			}
			var selectdropdown = $( this ).val();
			if( '' == selectdropdown ) {
				var current_group = jQuery.cookie( 'current_bpgt_tab' );
				selectdropdown = current_group;
			}

			bp_filter_request(
				object,
				jQuery.cookie( 'bp-' + object + '-filter' ),
				jQuery.cookie( 'bp-' + object + '-scope' ),
				'div.' + object,
				$( '#' + object + '_search' ).val(),// ( '#bpgt-groups-search-text' ).val(),
				1,
				'group_type=' + $( this ).val(),
				'',
				''
			);
		}
	);

	function wbcom_agt_bp_filter_request( object, filter, scope, target, search_terms, page, extras, caller, template ) {
		if ( 'activity' === object ) {
			return false;
		}
		if ( null === scope ) {
			scope = 'all';
		}
		/* Set the correct selected nav and filter */
		jQuery( '.item-list-tabs li' ).each(
			function() {
				jQuery( this ).removeClass( 'selected' );
			}
		);
		jQuery( '#' + object + '-' + scope + ', #object-nav li.current' ).addClass( 'selected' );
		jQuery( '.item-list-tabs li.selected' ).addClass( 'loading' );
		jQuery( '.item-list-tabs select option[value="' + filter + '"]' ).prop( 'selected', true );
		if ( 'friends' === object || 'group_members' === object ) {
			object = 'members';
		}
		if ( bp_ajax_request ) {
			bp_ajax_request.abort();
		}
		bp_ajax_request = jQuery.post(
			ajaxurl, {
				action: object + '_filter',
					// 'cookie': bp_get_cookies(),
				'object': object,
				'filter': filter,
				'search_terms': search_terms,
				'scope': scope,
				'page': page,
				'extras': extras,
				'template': template
			},
			function(response)
			{
				/* animate to top if called from bottom pagination */
				if ( caller === 'pag-bottom' && jQuery( '#subnav' ).length ) {
					var top = jQuery( '#subnav' ).parent();
					jQuery( 'html,body' ).animate(
						{scrollTop: top.offset().top}, 'slow', function() {
							jQuery( target ).fadeOut(
								100, function() {
									jQuery( this ).html( response );

									/* KLEO added */
									jQuery( this ).fadeIn(
										100, function(){
											jQuery( "body" ).trigger( 'gridloaded' );
										}
									);
								}
							);
						}
					);

				} else {
					jQuery( target ).fadeOut(
						100, function() {
							jQuery( this ).html( response );
							jQuery( this ).fadeIn(
								100, function(){
									/* KLEO added */
									jQuery( "body" ).trigger( 'gridloaded' );
								}
							);
						}
					);
				}

				jQuery( '.item-list-tabs li.selected' ).removeClass( 'loading' );

			}
		);
	}

})( jQuery );

jQuery(document).ready(function($){
	'use strict';
	jQuery( '.item-list-tabs > ul > li > a' ).on('click', function(){
		if( jQuery( this ).parent().hasClass( "bpgt-type-tab" )) {
			var par_id        = jQuery( this ).parent().attr('id');
			var current_group = par_id.replace('groups-', '');
			jQuery.cookie( 'current_bpgt_tab', current_group,{ path: '/' } );
			var group_all_clicked = false;
			jQuery('.bpgt-groups-search-group-type').val('').trigger('change');
			jQuery('#groups_search').val('').trigger('submit');
		} else {
			jQuery.cookie( 'current_bpgt_tab', '', { path: '/' });
		}	
	});
	
});
