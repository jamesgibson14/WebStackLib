define(['jquery', 'backbone', 'engine', 'handlebars', 'text!templates/ImageTesting.html'], 
function($, Backbone, E, Handlebars, template){

    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'ImageTesting',
        template: template,
        initialize: function() {
            _.bindAll(this, 'render', 'postRender','toImage');   
        },
        events: {
            'click a': 'toImage'
        },
        render: function() {

            var html;
            var ctemp = Handlebars.compile(this.template);
            var context = {};
               
            html = ctemp(context);
            this.$el.html( html );

            return this;
        },
        postRender: function(){
            var can = document.getElementById("myCanvas");
            var context = can.getContext('2d');
            var centerX = can.width / 2;
              var centerY = can.height / 2;
              var radius = 70;
        
              context.beginPath();
              context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
              context.fillStyle = 'green';
              context.fill();
              context.lineWidth = 5;
              context.strokeStyle = '#003300';
              context.stroke();
            /*
            var imgA = new Image();
            imgA.src = 'assets/images/barchart2-64px.ico';
    
            imgA.onload = function() {
              ctx.drawImage(imgA, -25, 0, imgA.width, imgA.height);
              ctx.restore();
            };
    
            var imgB = new Image();
            imgB.src = 'assets/images/piechart1.ico';
    
            imgB.onload = function() {
              ctx.globalAlpha = 0.1
              ctx.drawImage(imgB, -100, -75, imgB.width, imgB.height);
              ctx.restore();
            };
            */
            E.hideLoading()
        },
        toImage: function(e) {
          alert($(e.target).html())
          var returnType = $(e.target).html()
          var dataURL = document.getElementById('myCanvas').toDataURL("image/png");
    
          // The returnType argument specifies how to get the
          // the image.  'obj' will set the source to an image element.
          // 'window' will open a new window and display the image.
          // 'download' will prompt the user to save the image.
          switch(returnType) {
            case 'ImageTag':
              var imgObj = new Image();
              imgObj.src = dataURL;
              document.getElementById('graphics').appendChild(imgObj);
              break;
            case 'NewWindow':
              window.open(dataURL, "CanvasImage");
              break;
            case 'Download':
              dataURL = dataURL.replace("image/png", "image/octet-stream");
              window.location.href = dataURL;
              break;
          }
        }
    });
    
    // Returns the View class
    return View;
});