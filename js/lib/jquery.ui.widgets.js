(function($){
/*
$.widget( "ui.combobox", {            
    _create: function() {                
        var input,                    
        that = this,                    
        select = this.element.hide(),                    
        selected = select.children( ":selected" ),                    
        value = selected.val() ? selected.text() : "",                    
        wrapper = this.wrapper = $( "<span>" )                        
        .addClass( "ui-combobox" )                        
        .insertAfter( select );                 
        function removeIfInvalid(element) {                    
            var value = $( element ).val(),                        
            matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( value ) + "$", "i" ),                        
            valid = false;                    
            select.children( "option" ).each(function() {                        
                if ( $( this ).text().match( matcher ) ) {                            
                    this.selected = valid = true;                            
                    return false;                        
                }                    
            });                    
            if ( !valid ) {                        
                // remove invalid value, as it didn't match anything                        
                $( element )                            
                .val( "" )                            
                .attr( "title", value + " didn't match any item" )                            
                .tooltip( "open" );                        
                select.val( "" );                        
                setTimeout(function() {                            
                    input.tooltip( "close" ).attr( "title", "" );                        
                }, 2500 );                        
                input.data( "autocomplete" ).term = "";
                input.focus()                        
                return false;                    
            }                
        }                 
        input = $( "<input>" )                    
        .appendTo( wrapper )                    
        .val( value )                    
        .attr( "title", "" )                    
        .addClass( "ui-combobox-input" )                    
        .autocomplete({                        
            delay: 0,                        
            minLength: 0,
            autoFocus:true,                        
            source: function( request, response ) {                            
                var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );                            
                response( select.children( "option" ).map(function() {                                
                    var text = $( this ).text();                                
                    if ( this.value && ( !request.term || matcher.test(text) ) )                                    
                    return {                                        
                        label: text.replace(                                            
                            new RegExp(                                                
                                "(?![^&;]+;)(?!<[^<>]*)(" +                                                
                                $.ui.autocomplete.escapeRegex(request.term) +                                                
                                ")(?![^<>]*>)(?![^&;]+;)", "gi"                                            
                                ), "<strong>$1</strong>" ),                                        
                                value: text,                                        
                                option: this                                    
                    };                            
                }) );                        
            },                        
            select: function( event, ui ) {                            
                ui.item.option.selected = true;                            
                that._trigger( "selected", event, {                                
                    item: ui.item.option                            
                });                        
            },                        
            change: function( event, ui ) {                            
                if ( !ui.item )                                
                return removeIfInvalid( this );                        
            }                    
        })                    
        .addClass( "ui-widget ui-widget-content ui-corner-left" );                 
        input.data( "ui-autocomplete-item" )._renderItem = function( ul, item ) {                    
            return $( "<li>" )                        
            .data( "item.autocomplete", item )                        
            .append( "<a>" + item.label + "</a>" )                        
            .appendTo( ul );                
        };                 
            $( "<a>" )                    
            .attr( "tabIndex", -1 )                    
            .attr( "title", "Show All Items" )                    
            .tooltip({track:true,hide: 4000,position:{collision:'none'},tooltipClass:"absolute z2k"})                    
            .appendTo( wrapper )                    
            .button({                        
                icons: {                            
                    primary: "ui-icon-triangle-1-s"                        
                },                        
                text: false                    
            })                    
            .removeClass( "ui-corner-all" )                    
            .addClass( "ui-corner-right ui-combobox-toggle" )                   
            .click(function() {                        
                // close if already visible                        
                if ( input.autocomplete( "widget" ).is( ":visible" ) ) {                            
                    input.autocomplete( "close" );                            
                    removeIfInvalid( input );                            
                    return;                        
                }                         
                // work around a bug (likely same cause as #5265)                        
                $( this ).blur();                         
                // pass empty string as value to search for, displaying all results                        
                input.autocomplete( "search", "" );                        
                input.focus();                    
            });                     
            input                        
            .tooltip({                            
                position: { 
                    my: 'bottom',                               
                    at: "right+20 top+10",
                    of: this.button                            
                },                            
                tooltipClass: "ui-state-highlight absolute z2k"                        
            });            
        },             
        destroy: function() {                
            this.wrapper.remove();                
            this.element.show();                
            $.Widget.prototype.destroy.call( this );            
    }        
});
*/
$.widget( "ui.combobox", {      
    _create: function() {        
        this.wrapper = $( "<span>" )          
        .addClass( "ui-combobox" )          
        .insertAfter( this.element );         
        this._createAutocomplete();        
        this._createShowAllButton();      
    },       
    _createAutocomplete: function() {        
        var selected = this.element.children( ":selected" ),          
        value = selected.val() ? selected.text() : "";
        var that = this;         
        this.input = $( "<input>" )          
        .appendTo( this.wrapper )          
        .val( value )          
        .attr( "title", "" )          
        .addClass( "ui-state-default ui-combobox-input ui-widget ui-widget-content ui-corner-left" )          
        .autocomplete({            
            delay: 0,
            autoFocus:true,            
            minLength: 0,            
            source: $.proxy( this, "_source" )          
        })          
        .tooltip({            
            tooltipClass: "ui-state-highlight absolute z2k",
            hide: 4000,
            position:{
                my: 'bottom',                               
                at: "right+20 top+10",
                of: this.button
            }           
        });         
        this._on( this.input, {          
            autocompleteselect: function( event, ui ) {            
                ui.item.option.selected = true;            
                this._trigger( "select", event, {              
                    item: ui.item.option            
                });          
            },           
            autocompletechange: "_removeIfInvalid"        
        });      
    },       
    _createShowAllButton: function() {        
        var wasOpen = false;
        var that = this;         
        $( "<a>" )          
        .attr( "tabIndex", -1 )          
        .attr( "title", "Show All Items" )          
        .tooltip({            
            tooltipClass: "absolute z2k",
            hide: 1500,
            position:{
                my: 'bottom',                               
                at: "right+20 top+10",
                of: this.button
            }          
        })          
        .appendTo( this.wrapper )          
        .button({            
            icons: {              
                primary: "ui-icon-triangle-1-s"            
            },            
            text: false          
        })          
        .removeClass( "ui-corner-all" )          
        .addClass( "ui-corner-right ui-combobox-toggle" )          
        .mousedown(function() {            
            wasOpen = that.input.autocomplete( "widget" ).is( ":visible" );          
        })          
        .click(function() {            
            that.input.focus();             
            // Close if already visible            
            if ( wasOpen ) {              
                return;            
            }             
            // Pass empty string as value to search for, displaying all results            
            that.input.autocomplete( "search", "" );          
        });      
    },       
    _source: function( request, response ) {        
        var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );        
        response( this.element.children( "option" ).map(function() {          
            var text = $( this ).text();          
            if ( this.value && ( !request.term || matcher.test(text) ) )            
            return {              
                label: text,              
                value: text,              
                option: this            
            };        
        }) );      
    },       
    _removeIfInvalid: function( event, ui ) {         
        // Selected an item, nothing to do
        var that = this;        
        if ( ui.item ) {          
            return;        
        }         
        // Search for a match (case-insensitive)        
        var value = this.input.val(),          
        valueLowerCase = value.toLowerCase(),          
        valid = false;        
        this.element.children( "option" ).each(function() {          
            if ( $( this ).text().toLowerCase() === valueLowerCase ) {            
                this.selected = valid = true;            
                return false;          
            }        
        });         
        // Found a match, nothing to do        
        if ( valid ) {          
            return;        
        }         
        // Remove invalid value        
        this.input          
        .val( "" )          
        .attr( "title", value + " didn't match any item" )          
        .tooltip( "open" );        
        this.element.val( "" );        
        this._delay(function() {          
            that.input.tooltip( "close" ).attr( "title", "" );        
        }, 2500 );        
        this.input.focus().data( "ui-autocomplete" ).term = "";      
    },       
    _destroy: function() {        
        this.wrapper.remove();        
        this.element.show();      
    }    
});    
})( jQuery );