$(document).ready(start);

var draw;
var canvas = document.getElementById('canvas');
var context = canvas.getContext("2d");

var bg = new Image();
bg.onload= setbg.bind(null, bg, context);
bg.crossOrigin = "Anonymous";

//default pen size
var radius = 6;

//min pensize
var minRadius = 2;

//max pensize
var maxRadius = 40;

resizeCanvas();
save();

//set image background to same size as canvas
function setbg(bg, context) {
   var hRatio = canvas.width  / bg.width    ;
   var vRatio =  canvas.height / bg.height  ;
   var ratio  = Math.min ( hRatio, vRatio );
   context.clearRect(0,0,canvas.width, canvas.height);
   context.drawImage(bg, 0,0, bg.width, bg.height, 0, 0, 
                   bg.width*ratio, bg.height*ratio);  
   canvasState.save();
}
bg.src = "img/pitch2.jpg";


//keep canvas inside browser window
function resizeCanvas(){
	if (canvas.width < window.innerWidth){
		canvas.width = window.innerWidth-15;
	}
	if (canvas.height < window.innerHeight){
		canvas.height = window.innerHeight;
	}
}

//two different line options (solid and dashed)
function lineType(){
    $('#linesolid').click(function(){
        context.setLineDash([0]);

    });

    $('#linedash').click(function(){
    context.setLineDash([2,30]);
   

    });
    }

//pen size can be increased or decreased. 
//Default set to 6. Min set to 2 and max set to 40
function penSize(){
	$('#btnIncrease').click(function(){
		radius = radius + 2;
		if (radius >= maxRadius) {
			radius = maxRadius;
		}
		$('#penVal').text(radius);

	});

	$('#btnDecrease').click(function(){
		radius = radius - 2;
		if (radius <= minRadius) {
			radius = minRadius;
		}
		$('#penVal').text(radius);

	});
}

//save the current canvas state 
var canvasState = (function() {
	var index = 0;
	var array = [];
	var size = 20;

	var module = {};
	module.save = function() {
		var data = context.getImageData(0, 0, canvas.width, canvas.height);
		array[++index] = data;
		if (array.length > size) {
			array.shift();
			index--;
		}
	}

	module.undo = function() {
		if (index > 1) {
			var data = array[--index];
			context.putImageData(data, 0, 0);
		}
	}

	module.redo = function() {
		if (index < array.length - 1) {
			var data = array[++index];
			context.putImageData(data, 0, 0);
		}
	}

	return module;
})();

function setupCanvasState() {
	var undoButton = document.querySelector("button.undo");
	var redoButton = document.querySelector("button.redo");


	undoButton.onclick = canvasState.undo;
	redoButton.onclick = canvasState.redo;

}

setupCanvasState();

function start(){

	penSize();
	lineType();

	
	

	$('#canvas').mousedown(press);
	$('#canvas').mousemove(paint);
	$('#canvas').mouseup(stop);
	canvasState.save();

	function press(){

		draw = true;
		context.moveTo(event.pageX, event.pageY);
	}

	function paint(){

		if(draw){
			context.lineWidth = radius * 2;
			context.lineTo(event.pageX, event.pageY)
			context.stroke();
			context.lineJoin = 'round';
    		context.lineCap = 'round';
			context.beginPath();
			//context.arc(event.pageX, event.pageY, radius, 0, 2*Math.PI);
			context.fill();

			context.beginPath();
			context.moveTo(event.pageX, event.pageY);
		}

		//canvasState.save();
	}

	function stop(){

		draw = false;
		canvasState.save();
	}
}


function save(){
	$('#btnSave').click(function(){
		var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
		window.location.href = image;
	});
}



function readPic() {
    if ( this.files && this.files[0] ) {
        var filereader= new FileReader();
        filereader.onload = function(event) {
           var img = new Image();
           img.onload = function() {
             context.drawImage(img, 0,0, canvas.height, canvas.width);
           };
           img.src = event.target.result;
        };       
        filereader.readAsDataURL( this.files[0] );
		canvasState.save();

	}



}
document.getElementById("uploadPic").addEventListener("change", readPic, false);
