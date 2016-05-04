$(document).ready(function() {
	_saveSession();
	_loadTourSession();
});
$(function(){
	$('#btnnheo').click(function(){
		$.ajax({
			//url: 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyA6Ru1bMnTyQ1hesbxnucSjmP4Im30RE',
			url: 'https://maps.googleapis.com/maps/api/geocode/json',
			data: $('.form-map').serialize(),
			type: 'GET',
			success: function(response){
				console.log(response);
				procMapControl(response);
			},
			error: function(error){
				console.log(error);
			}
		});
	});
	$('#tourlist').change(function(){
			//alert(document.getElementById("tourlist").options[document.getElementById("tourlist").selectedIndex].value);
		$.ajax({
			//url: 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyA6Ru1bMnTyQ1hesbxnucSjmP4Im30RE',
			url: '/gettourinfo',
			//data: $('.form-map').serialize(),
			data:JSON.stringify({ctour_seq:document.getElementById("tourlist").options[document.getElementById("tourlist").selectedIndex].value}),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			type: 'POST',
			success: function(response){
				ctour = response["ctour"];
				console.log(ctour["ctour_master"]);
				_loadTourDetail(ctour["ctour_master"][0], ctour["ctour_wpt"])
				//procMapControl(response);
			},
			error: function(error){
				console.log(error);
			}
		});
	});

	$('#btnsavemaster').click(function(){
		$.ajax({
			//url: 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyA6Ru1bMnTyQ1hesbxnucSjmP4Im30RE',
			url: '/savemaster',
			//data: $('.form-map').serialize(),
			data:JSON.stringify({tourdata:_getTourInfo()}),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			type: 'POST',
			success: function(response){
				console.log(response);
				ctour_master = response["ctour_master"];
				alert("저장되었습니다.[ctour_seq:"+ctour_master[6]+"]");
				document.getElementById("ctour_seq").value = ctour_master[6];
				_saveSession();
				//procMapControl(response);
			},
			error: function(error){
				console.log(error);
			}
		});
	});

/*
	$('#wptbtn').click(function() {
		alert("test");
		var toAdd = "<li><a href=\"#\">"+$("input[name=wptnm]").val()+"</a>"+"<ol></ol>";
		alert(toAdd);
		$('#menu').append(toAdd);
		alert($('#menu'));
	});
*/

	$('#wptbtn').click(function() {
		var toAdd = "<div class=\"group\"><h3>"+$("input[name=wptnm]").val()+"</h3><div></div></div>";
		$("#accordion").append(toAdd);
		$("#accordion").sortable().accordion("refresh");
		$(".group").mousedown(function() {
			if(event.which == 3) {
				if(confirm('삭제하시겠습니까?'))
					this.remove();
			}
		});
		$("h3").click(function() {
			_preview(this.textContent);
		});
		//console.log($("#accordion"));
	});

	$('.wpt').click(function() {
		//alert("wpt");
		//var toAdd = "<li><a href=\"#\">"+$("input[name=wptnm]").val()+"</a>"+"<ol></ol>";
		//alert(toAdd);
		//$('#menu').append(toAdd);
		//alert($('#menu'));
	});

	$("ol.example").sortable();

	var oldContainer;

	$("ol.nested_with_switch").sortable({
  	group: 'nested',
  	afterMove: function (placeholder, container) {
    	if(oldContainer != container){
      	if(oldContainer)
        	oldContainer.el.removeClass("active");
      	container.el.addClass("active");
	
      	oldContainer = container;
    	}
  	},
  	onDrop: function ($item, container, _super) {
    	container.el.removeClass("active");
    	_super($item, container);
  	}
	});
	
	$(".switch-container").on("click", ".switch", function  (e) {
  	var method = $(this).hasClass("active") ? "enable" : "disable";
  	$(e.delegateTarget).next().sortable(method);
	});

	$("#accordiaon").accordion();

});
