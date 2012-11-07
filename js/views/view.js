define(['jquery', 'backbone', 'engine', 'handlebars', 'models/model', 'text!templates/main.html', 'models/collection'], function($, Backbone, E, Handlebars, Model, template, Collection){

    var View = Backbone.View.extend({
        // Represents the actual DOM element that corresponds to your View (There is a one to one relationship between View Objects and DOM elements)
        tagName:  "div",
        className: 'SmeadApp border relative',
        attributes: {},
        template: template,
        location: '' + window.location.href,
        // View constructor
        initialize: function() {
            // Setting the view's model property to the passed in model
            this.model = new Model();
            _.bindAll(this,'render');
            // Setting the view's template property
            this.template = Handlebars.compile(this.template);			
        },
        events: {
            'click #todoview': 'loadlink',
            'click #restart':'restart'
	    },
        render: function() {
            var temp = this.model.toJSON();
            _.extend(temp,E.user.toJSON());
            this.$el.append(this.template(temp));
            this.$el.find('#tabsmenu').buttonset();
            this.$('#links').menu({role: "null"});
            this.$('#ialpha').combobox();
            return this;
        },
        afterRender: function() {
            //this.$('#sidebarBtns').position({my:'bottom',at:'right bottom',of:'#footer',collision:'none'})
            this.$('#sidebarBtns > input').button({icons:'ui-icon-cart',text:false})
            this.$('#sidebarBtns > input').each(function(value){
                var btn = $(this);
                var icon = btn.attr('data-icon');
                //alert(icon)
                btn.button('option','icons',{primary:icon})
            })
            this.$('#sidebarBtns > label').css({'display':'block'});
            var height = this.$el.height();
            //alert(height)
            //this.$el.height(height-300);
        },
        loadlink: function(e){
        	var id = $(e.currentTarget).attr('id');
        	$('#mainview').html('YOu loaded ' + id);        	
        	//define(['jquery','backbone'])        	
        },
        restart: function(){
            window.location = this.location + '';
        }

    });
	
    // Returns the View class
    return View;
});