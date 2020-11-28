( function() {
    tinymce.PluginManager.add( 'bbspoiler_button', function( editor, url ) {

        // Add a button that opens a window
        editor.addButton( 'bbspoiler_button_button_key', {
			title : bbbutton.spoiler,
            text: false,
			image : url + '/spoiler.png',
            
            onclick: function() {
                // Open window
                editor.windowManager.open( {
                    title: 'BBSpoiler',
                    body: [
					{type: 'textbox', name: 'title', label: bbbutton.title},
					{type: 'textbox', name: 'text', label: bbbutton.text, 'multiline': 'true', 'minWidth': 380, 'minHeight': 140},
                    {type: 'listbox', name: 'style', label: bbbutton.style, 
                        'values': [
                            {text: bbbutton.default2, value: 'default'},
                            {text: bbbutton.green, value: 'green'},
                            {text: bbbutton.blue, value: 'blue'},
                            {text: bbbutton.yellow, value: 'yellow'},
                            {text: bbbutton.orange, value: 'orange'},
                            {text: bbbutton.brown, value: 'brown'},
                            {text: bbbutton.purple, value: 'purple'},
                            {text: bbbutton.cyan, value: 'cyan'},
                            {text: bbbutton.lime, value: 'lime'},
                            {text: bbbutton.steelblue, value: 'steelblue'}
                        ]
                    },
					{name: 'collapse_link', type: 'checkbox', checked: 'true', label: bbbutton.showlink}
					],
                    onsubmit: function( e ) {
                        // Insert content when the window form is submitted
                        editor.insertContent('[spoiler title=\'' + e.data.title + '\'' + ' style=\'' + e.data.style + '\'' + ' collapse_link=\'' + e.data.collapse_link + '\']' + e.data.text + '[/spoiler]');
                    }

                } );
            }

        } );

    } );

} )();