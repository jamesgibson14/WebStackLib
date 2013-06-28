define(['jquery', 'backbone', 'engine', 'handlebars', 'text!templates/BasePlot.html', 'models/BasePlot', 'views/SlickGrid', 'jqp','jqpall'], 
function($, Backbone, E, Handlebars, template,Model,SlickGrid){

    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'CorpPiecesPerHour ofh',
        model: Model,
        plot: null,
        template: template,
        events:{
            'click #chartOptions': 'renderChartOptions',
            'click #selectable': 'addRemoveMachine',
            'click .chartOptions': 'adjustChartOptions'
        },
        initialize: function() {
          this.template = Handlebars.compile(this.template);
            _.bindAll(this, 'render','loadData','renderDataGrid');

            this.model = new this.model()
            this.model.on('change:plotData', this.loadData);
            this.SlickGrid = new SlickGrid()
        },
        loadData: function(){
           var that = this;
            $.jqplot.config.enablePlugins = true;
            this.$("#sql").html(this.model.collection.sql);
            if (this.plot)
                this.plot.destroy();
            this.SlickGrid.$el.html('<h2><span>No Data Selected</span><h2>')
            this.renderMachines();  
            debugger;
            var data = this.model.get('plotData');
             
            var options = this.model.toJSON()
            
            this.plot = $.jqplot("plot",data, options);
            this.$('#resizable').off('resize')
            this.$('#resizable').on('resize', function(event, ui) {
                if (that.plot)
                    that.plot.replot();
            });
           
            this.$('#plot').off('jqplotDataClick');
            this.$('#plot').on('jqplotDataClick',this.renderDataGrid);   
            
        },
        render: function() {
            var that = this;
            var obj = this.model.toJSON();
            
            var temp = this.template(obj);
            
            this.$el.html( temp );
            this.$('.dPicker').datepicker({numberOfMonths: 3});
            this.$('#startDate').on('change', function(e){
                that.model.set('startDate', this.value);
            })
            this.$('#endDate').on('change', function(e){
                that.model.set('endDate' ,this.value);
            })
            this.$('#machineGroups').on('change',function(e){
                if (!this.value)
                    return false;
                if(that.$('#imachine').val()!=''){
                    that.$('#imachine').val('')
                    that.model.attributes.level = 'Branch';
                }
                that.$('#rbranch').prop('disabled', false);
                that.$('#rmachine').prop('disabled', false);
                that.model.set('machineCodes',that.model.get('machineTypes')[this.value].machines);
            });
            //this.$('#printLandscape').button({text: false})
            //this.$('#chartOptions').button({text: false});

            function split( val ) {      return val.split( /,\s*/ );    }    
            function extractLast( term ) {      return split( term ).pop();    }
            
            var machines = this.model.get('Machines');

            this.$( "#imachine" )
            // don't navigate away from the field on tab when selecting an item      
            .bind( "keydown", function( event ) {        
                if ( event.keyCode === $.ui.keyCode.TAB && $( this ).data( "ui-autocomplete" ).menu.active ) {          
                    event.preventDefault();        
                }      
            })
            .autocomplete({
                source: function( request, response ) {          
                    // delegate back to autocomplete, but extract the last term          
                    response( $.ui.autocomplete.filter(machines, extractLast( request.term ) ) );        
                },
                autoFocus: true,
                minLength: 0,
                delay: 0,
                focus: function() {          
                    // prevent value inserted on focus          
                    return false;        
                },        
                select: function( event, ui ) {          
                    var terms = split( this.value );          
                    // remove the current input          
                    terms.pop();          
                    // add the selected item          
                    terms.push( ui.item.code ); 
                            
                    // add placeholder to get the comma-and-space at the end          
                    terms.push( "" );
                    that.model.attributes.level = 'Machine';
                    that.$('#rmachine, #rbranch').prop('disabled', true);
                    that.model.set('machineCodes', terms.slice(0,-1));          
                    this.value = terms.join( ", " );
                    that.$('#machineGroups').val('')
                          
                    return false;        
                }
            })
            .tooltip({                            
                position: { 
                    my: 'bottom',                               
                    at: "right+25 top-5"                           
                },                            
                tooltipClass: "ui-state-highlight absolute z2k"                        
            });
            this.$("#imachine").on('click',function(e){
                //that.$( "#imachine" ).autocomplete( "search", "" );
            })
            this.$('input[type=radio]').click(function(e){   
                that.model.set($(this).attr("name"), $(this).val())
            })
            this.$('#resizable').resizable({delay:20,minHeight: 326,minWidth: 400});
            //this.$('input, textarea').placeholder();
            this.$('#optionsView').dialog({      
                autoOpen: false,      
                show: {        
                    effect: "blind",        
                    duration: 300      
                },      
                hide: {        
                    effect: "explode",        
                    duration: 600      
                }  
            });  
            return this;
        },
        addRemoveMachine: function(e){
            $(e.target).toggleClass('ui-state-active').toggleClass('ui-state-highlight').toggleClass('fontStrike')
            
        },
        renderMachines: function(){
            var html = '';
            $.each(this.model.get('machineCodes'), function(i, item){
                html += '<li class="ui-state-default" style="padding-left:3px;padding-right:3px">' + item + '</li>'
            })
            this.$('#selectable').html();
            this.$('#selectable').html(html);
        },
        renderDataGrid: function(ev, seriesIndex, pointIndex, data){
            //Instead of destroying plot just reload data, lables and then re-plot
            var that = this;
            var html;
            var dt = new Date(data[0]+ 1000*60*60*24).format("mm/dd/yyyy")
            var wDate ='';
            var model = this.model.toJSON();
            if (model.groupBy =='month')
                wDate = "DateCompleted >='" + dt + "' AND DateCompleted < DATEADD(month,1,'" + dt + "')";
            else
                wDate = "DateCompleted = '" + dt + "'";
                
            
            var labels = model.legend.labels
            
            var wLevel = '';
            if (this.model.get('level')=='Branch'){
                var selected = $('#machineGroups').find(":selected").val();
                wLevel = "Unit = '" + labels[seriesIndex] + "' AND MachineCode IN (" + model.machineTypes[selected].machines.join(", ") + ") "                   
            }
            else
                wLevel = "MachineCode = '" + labels[seriesIndex].slice(labels[seriesIndex].indexOf('_')+1) + "' ";                
  
            debugger;
            var options = {
                sql: "SELECT Item FROM dbo.PeopleSoftData WHERE " + wDate + " AND " + wLevel + " Group BY Item ORDER By Item"
            };
            this.$("#sql").html(options.sql);
            html = this.SlickGrid.render(options).el
            this.$('#processRecord').html(html)
            setTimeout(function(){
                
                that.SlickGrid.postRender();
            },1)
            
        },
        renderChartOptions: function(e){
            if($( "#optionsView" ).dialog( "isOpen" )){
                $( "#optionsView" ).dialog( "close" )
                return false;
            }
                
            var $el = $('#optionsView')
            $el.html('<span>Trendlines: </span><span class="chartOptions" data-attr="trendlines">Off</span><br /><span>Markers: </span><span class="chartOptions" data-attr="markers">Off</span>');
            $el.dialog({
                appendTo: this.$el,
                position: {
                    my: 'right top',
                    at: 'right bottom',
                    of: e.target
                }  
            })
            $el.dialog('open')
            
        },
        adjustChartOptions: function(e){
            var val = $(e.target).html();
            val == 'Off' ? val = "On" : val = 'Off';
            $(e.target).html(val);
            //TODO: update plot here
        },
        toggleMenu: function(e){
            $(e.target).parent().toggleClass('open');
        }
         
    });
	
    // Returns the View class
    return View;
});