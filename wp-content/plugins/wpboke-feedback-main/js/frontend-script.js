jQuery(document).ready(function( $ ) {

	// custom colors: add hover changes
	$( '.flaggedc-button-color-custom' ).hover(

		// mouseenter
		function() {
			var hover_color = $ ( this ).attr( 'data-flaggedc-color-hover' );
			$( this ).css( 'background-color', hover_color );
			$( this ).css( 'border-color', hover_color);
		},

		// mouseleave
		function() {
			var saved_color = $ ( this ).attr( 'data-flaggedc-color-saved' );
			$( this ).css( 'background-color', saved_color );
			$( this ).css( 'border-color', saved_color);
		}
	);

	/** Init modals **/
	if ( $( '.flaggedc-form-modal' )[0] ) {

		$( '.flaggedc-reveal-button' ).each( function() 
		{
			var output_id = $( this ).attr( 'data-flaggedc-output-id' );
			var flaggedc_form = '.flaggedc-form-modal[data-flaggedc-output-id="' + output_id + '"]';

			if ( flaggedc_ajax_object.modal_type == 'magnific-popup' ) 
			{
				$( this ).magnificPopup({
					items: {
						src: flaggedc_form,
						type: 'inline'
					},
					removalDelay: 300,
					mainClass: 'flaggedc-mfp-slide-bottom',
					midClick: true,
					fixedContentPos: false,
					fixedBgPos: true,
					overflowY: 'auto',
					closeBtnInside: true,
					preloader: false,
					callbacks: {
						// this - is Magnific Popup object
						// Will fire when this exact popup is opened
						open: function() { 
							 $( flaggedc_form ).removeClass( 'flaggedc-hide' );
						},
						// Will fire when popup is closed
						close: function() {
							 $( flaggedc_form ).addClass( 'flaggedc-hide' );
						}
					  }
				});
			}
			else 
			{
				$( this ).featherlight( $( flaggedc_form ), {
					persist: true,
					variant: 'flaggedc-featherlight',
					beforeOpen: function() {
						$( flaggedc_form ).removeClass( 'flaggedc-hide' );
						$( 'html' ).addClass( 'flaggedc-scrollbar-visible' );
					},
					afterClose: function() {
						$( flaggedc_form ).addClass( 'flaggedc-hide' );
						$( 'html' ).removeClass( 'flaggedc-scrollbar-visible' );
					}
				} );
			}			
		});
	}

	/** Listeners */

	$( ".flaggedc-button" ).mouseup( function(){
    	$( this ).blur();
	});

	$( '.flaggedc-submit-button' ).on( 'click', function( e ) 
	{
		var $selected_form = $( this ).closest( 'form' );
		var output_id      = $( this ).attr( 'data-flaggedc-output-id' );
		var cname          = $( this ).attr( 'data-flaggedc-cname' );
		var ctype          = $( this ).attr( 'data-flaggedc-ctype' );

		if ( validate_the_form( $selected_form ) ) {
			send_ajax_form( $selected_form, output_id, cname, ctype );
		}
	});

	/** Validate and process form submission */

	function validate_the_form( $selected_form ) 
	{
		var validation_error_count = 0;

		var $alert_box 					= $selected_form.find( '.flaggedc-alert-box' );
		var alert_require_text 			= $alert_box.text();
		var $all_labels 				= $selected_form.find( 'label' );

		var $reason_dropdown 			= $selected_form.find( 'select[name=flaggedc_reason][required]' );
		var $reason_dropdown_selected 	= $selected_form.find( 'select[name=flaggedc_reason][required] option:selected' );
		var $reason_dropdown_label 	    = $selected_form.find( 'label[for=flaggedc_reason]' );

		var $reason_radio 				= $selected_form.find( 'input[name=flaggedc_reason][required]' );
		var $reason_radio_label 		= $selected_form.find( '.flaggedc-radio-group-label' );

		var $name 						= $selected_form.find( 'input[name=flaggedc_name][required]' );
		var $name_label 				= $selected_form.find( 'label[for=flaggedc_name]' );

		var $email 						= $selected_form.find( 'input[name=flaggedc_email][required]' );
		var $email_label 				= $selected_form.find( 'label[for=flaggedc_email]' );

		var $description 				= $selected_form.find( 'textarea[name=flaggedc_description][required]' );
		var $description_label 			= $selected_form.find( 'label[for=flaggedc_description]' );

		// Reset the validation errors
		$alert_box.removeClass( 'flaggedc-validation-errors-description' ).hide();
		$all_labels.removeClass( 'flaggedc-validation-error' );
		$reason_radio_label.removeClass( 'flaggedc-validation-error' );

		// Check if "Reason" field (dropdown) is required and if a value has not been chosen
		if ( $reason_dropdown.length && $reason_dropdown_selected.index() < 0 ) {
			$reason_dropdown_label.addClass( 'flaggedc-validation-error' );
			validation_error_count++;
		}

		// Check if "Reason" field (radio buttons) is required and if a value has not been chosen
		if ( $reason_radio.length && ! $reason_radio.is(':checked') ) {
			$reason_radio_label.addClass( 'flaggedc-validation-error' );
			validation_error_count++;
		}

		// Check if "Your Name" field is required and if a value has not been entered
		if ( $name.length && ! $name.val().length ) {
			$name_label.addClass( 'flaggedc-validation-error' );
			validation_error_count++;
		}

		// Check if "Your Email" field is required and if a value has not been entered
		if ( $email.length && ! $email.val().length ) {
			$email_label.addClass( 'flaggedc-validation-error' );
			validation_error_count++;
		}

		// Check if "Your Description" field is required and if a value not has been entered
		if ( $description.length && ! $description.val().length ) {
			$description_label.addClass( 'flaggedc-validation-error' );
			validation_error_count++;
		}

		if ( validation_error_count > 0 ) {
			$alert_box
				.addClass( 'flaggedc-validation-errors-description' )
				.text( alert_require_text )
				.show();
		}

		return ! validation_error_count;
	}

	function send_ajax_form( $selected_form, output_id, content_name, content_type ) 
	{
        var $container          = $( '.flaggedc-form-container[data-flaggedc-output-id=' + output_id + ']'  );
		var $alert_box 			= $selected_form.find( '.flaggedc-alert-box' );

		var $reason 			= $selected_form.find( 'select[name=flaggedc_reason], input[name=flaggedc_reason]:checked' );
		var $name 				= $selected_form.find( 'input[name=flaggedc_name]' );
		var $email 				= $selected_form.find( 'input[name=flaggedc_email]' );
		var $description 		= $selected_form.find( 'textarea[name=flaggedc_description]' );

		var $content_id 		= $selected_form.find( 'input[name=flaggedc_content_id]' );
		var $sticky_paper 		= $selected_form.find( 'input[name=flaggedc_sticky_paper]' );
		var $sticky_paper_2 	= $selected_form.find( 'input[name=flaggedc_sticky_paper_2]' );
		var $pocketwatch 		= $selected_form.find( 'input[name=flaggedc_pocketwatch]' );

		var $submit 			= $selected_form.find( '.flaggedc-submit-button' );
		var submit_text_saved 	= $submit.text();
		var submit_sending_text = $submit.attr( 'data-flaggedc-sending-label' );
		var $spinner 			= $selected_form.find( '.flaggedc-submit-spinner' );

        var $reveal              = $( '.flaggedc-reveal-button[data-flaggedc-output-id=' + output_id + ']' );
        var reveal_success_label = $reveal.attr( 'data-flaggedc-success-label' );
		var reveal_success_icon  = $reveal.attr( 'data-flaggedc-success-icon' );
		$sticky_paper_2.val( $sticky_paper.val() );

		var form_data = {
	        action: 					'flaggedc_ajax_handler',
	        nonce: 						flaggedc_ajax_object.nonce,
	        user_id: 					flaggedc_ajax_object.user_id,
			flaggedc_name: 				$name.val(),
			flaggedc_email: 			$email.val(),
			flaggedc_reason: 			$reason.val(),
			flaggedc_description: 		$description.val(),
			content_id: 				$content_id.val(),
	        flaggedc_sticky_paper: 		$sticky_paper.val(),
			flaggedc_sticky_paper_2: 	$sticky_paper_2.val(),
	        flaggedc_pocketwatch: 		$pocketwatch.val(),
	        content_name: 				content_name,
	        content_type: 			    content_type
	    };

		$submit.text( submit_sending_text );
		$submit.prop( 'disabled', true );

		//$spinner.attr( 'style', function( i, s ) { return ( s || '' ) + 'display: inline-block !important;' } );
		$spinner.css( "visibility", "visible" );

		jQuery.ajax({

     		 type: "post",
     		 url:  flaggedc_ajax_object.ajax_url,
     	     data: form_data,
		     
		     success:function( data, textStatus, jqXHR ) {
				
		     	var return_data = data.data;

				 if ( flaggedc_ajax_object.debug_mode == "1" ) {
					 console.log( 'data:' );
					 console.log( data );
					 console.log( 'textStatus: ' );
					 console.log( textStatus );
					 console.log( 'jqXHR: ' );
					 console.log( jqXHR );
					 console.log( 'return_data: ' );
					 console.log( return_data );
				 }

				// Successful ajax call
				if ( data.success ) {

					if ( return_data.message != '' ) {
						$alert_box
							.removeClass( 'flaggedc-validation-errors-description' )
							.addClass( 'flaggedc-alert-box-success' )
							.text( return_data.message )
							.show();
					}
					else {
						$alert_box.hide();
					}

					// $name.prop( 'disabled', true );
					// $email.prop( 'disabled', true );
					// $reason.prop( 'disabled', true );
					// $( selected_form + 'input[name=flaggedc_reason]' ).prop( 'disabled', true );
					// $description.prop( 'disabled', true );

					$name.replaceWith( function () {
                        return '<div>' + this.value + '</div>';
                    });

                    $email.replaceWith( function () {
                        return '<div>' + this.value + '</div>';
                    });

                    var reason_value = $reason.val();

                    $selected_form.find( 'select[name=flaggedc_reason], .flaggedc-reason-radio-group-container' ).replaceWith( function () {
                        return '<div>' + reason_value + '</div>';
                    });

                    $description.replaceWith( function () {
                        return '<div>' + this.value + '</div>';
                    });

					$submit.hide();

					$reveal.text( reveal_success_label );
					if ( reveal_success_icon != '' ) {
						$reveal.prepend( '<span class="dashicons ' + reveal_success_icon + '"></span>' );
					}

					$container.removeClass( 'flaggedc-form-status-unflagged' ).addClass( 'flaggedc-form-status-flagged' );
				}

				else {

					$alert_box
						.removeClass( 'flaggedc-alert-box-success' )
						.addClass( 'flaggedc-validation-errors-description' )
						.text( return_data.message )
						.show();

					$submit.prop( 'disabled', false );
				}
		     },

		     error: function( jqXHR, textStatus, errorThrown ) {
				$submit.prop( 'disabled', false );
		     },

		     complete: function( jqXHR, textStatus ) {
				 $submit.text( submit_text_saved );
		         $spinner.css( "visibility", "hidden" );
		     }
		});
	}
});