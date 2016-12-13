$(document).ready(setColors);

function setColors(){
	var colors_array = ["#07A23D", "#04F257", "#0E6CEA", "#17F6F3", "#D51F08", "#FA8101", "#FA01D0", "#D001FA", "#000000", "#AAA3A6", "#FFFFFF"];
	for (var i = 0; i  < colors_array.length; i++) {
		$('#changeColor').append('<button class="set_color" id='+ colors_array[i] +' + style="background-color:' + colors_array[i] +'">  </button>');
	}


	$('#changeColor button').click(function(){
		var selectedColor = $(this).attr('id');
		context.fillStyle = selectedColor;
		context.strokeStyle = selectedColor;

	});

}
