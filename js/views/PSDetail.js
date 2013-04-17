define(['jquery', 'backbone', 'engine', 'handlebars', 'models/PSDetail', 'text!templates/PSDetail.html'], function($, Backbone, E, Handlebars, Model, template){

    var View = Backbone.View.extend({

        //... is a list tag.
        tagName:  "tr",
        className: "row",
        // Cache the template function for a single item.
        template: template,
    
        // The DOM events specific to an item.
        events: {
          "click .check": "toggleFlag",
          "click .checkIsReady": "toggleIsReady",
          'click .chkentered':'toggleEntered',
          'click .chkendscrap':'toggleEndscrap',
          //"click label.todo-content"  : "showOrder",
          "dblclick label.todo-content" : "edit",
          "click span.todo-destroy"   : "clear",
          "keypress .edit": "updateOnEnter",
          "click .displayExtra": "displayExtra"
        },
    
        // The TodoView listens for changes to its model, re-rendering. Since there's
        // a one-to-one correspondence between a **Todo** and a **TodoView** in this
        // app, we set a direct reference on the model for convenience.
        initialize: function() {
            this.template = Handlebars.compile(this.template);
            _.bindAll(this, 'render', 'close', 'remove','toggleFlag','displayExtra');
            this.model.bind('change', this.render);
            this.model.bind('destroy', this.remove,this);
        },
    
        // Re-render the contents of the todo item.
        render: function() {
            var temp = this.model.toJSON();
          
            temp = this.template(temp);
    
            this.$el.html( temp );
            if(this.model.get('flag'))
                this.$el.addClass('ui-state-error');
            else
                this.$el.removeClass("ui-state-error");
            if(this.model.get('entered'))
                this.$el.addClass('ui-state-active');
            else
                this.$el.removeClass("ui-state-active");
            return this;
        },
        // Toggle the `"flag"` state of the model.
        toggleFlag: function() {
            var temp = {};
            if(this.$('.check').prop('checked')){
                temp.flagreason = this.model.get('flagreason') +  "Flagged by " + E.user.get('Name')//prompt("Please enter the reason for flagging this PID?") + '<br />';
                temp.flag = true;
            }
            else
                temp.flag =false
            this.model.set(temp);
        },
        // Toggle the `"flag"` state of the model.
        toggleEntered: function() {
            var temp = {}
            temp.entered = !this.model.get('entered')
            if(temp.entered)
                temp.dateentered = new Date().format('mm/dd/yyyy h:MM:ss TT');
            else
                temp.dateentered = null;
            this.model.set(temp);
        },
        toggleEndscrap: function() {
            var temp = {}
            temp.enterendscrap = !this.model.get('enterendscrap')
            this.model.set(temp);
        },
        toggleIsReady: function() {
            alert('caught')
            //this.model.set({isReady: !this.model.get('enterendscrap'});
        },
        // Alert the Order of this todo.
        showOrder: function(e) {
          alert('you clicked me' + this.model.get("order"));
        },
        
        // Switch this view into `"editing"` mode, displaying the input field.
        edit: function() {
          $(this.el).addClass("editing");
          this.input.focus();
        },
    
        // Close the `"editing"` mode, saving changes to the todo.
        close: function(input) {
            this.model.set({pid: this.$(input).val()});
        },
    
        // If you hit `enter`, we're through editing the item.
        updateOnEnter: function(e) {
          
          if (e.keyCode == 13) {
              e.preventDefault();
              this.close(e.currentTarget);              
          }
        },
        displayExtra: function(e){
            var $el = $(e.target)
            if($el.hasClass('ui-icon-plusthick')){
                $el.removeClass('ui-icon-plusthick').addClass("ui-icon-minusthick")
                this.$('span.extra').show(500);
            }
            else{
                $el.removeClass("ui-icon-minusthick").addClass('ui-icon-plusthick')
                this.$('span.extra').hide(300);
            }
        },
        // Remove the item, destroy the model.
        clear: function() {
          this.model.destroy();
        } 

    });
	
    // Returns the View class
    return View;
});