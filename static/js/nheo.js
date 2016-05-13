$(document).ready(function() {
	_saveSession();
	refresharc();
	refresharcsub();
	//_loadTourSession();
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
				console.log(response);
				_loadTourDetail(ctour["ctour_master"][0], ctour["ctour_wpt"], ctour["ctour_place"])
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
				console.log(response);
				if(ctour_master) {
					alert("저장되었습니다.[ctour_seq:"+ctour_master[8]+"]");
					document.getElementById("ctour_seq").value = ctour_master[8];
					_saveSession();
				}else{
					alert("오류가발생했습니다. "+ response["error"]);
				}
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
		wptcnt++;
		console.log("wptcnt:"+wptcnt);
		var toAdd = "<div class=\"group\"><h3 title='"+$("input[name=wptnm]").val()+"' id='0' data-addr='"+$("input[name=wptnm]").val()+"''>0일 "+$("input[name=wptnm]").val()+"</h3><div style='height:100px;' class=accordionsub><table><tr><td>체류:<input type=text name=wp_nights class=wp_nights value='0' size=2 onchange=\"javascript:_changenights("+(wptcnt)+")\">박</td><td>"+ 
" 이동:<select class=\"routemode\" name=routemode onchange=\"stroll();\"> <option value=\"DRIVING\">자동차</option> <option value=\"WALKING\">도보</option> <option value=\"BICYCLING\">자전거</option> <option value=\"TRANSIT\">환승</option> </select>"+
"<input type=button id="+(wptcnt)+" name=innerroute class=stroll value='동선' onclick='javascript:stroll()'></td></tr><tr><td colspan=2>거리:<input type=text name=wp_distance value='' size=3/> km</td></tr><tr><td colspan=2>비고:<input type id=wp_note name=wp_note value='' size=20></td></tr><tr><td colspan=2><input type=text name=wp_cost id=wp_cost size=10/></td></tr></table></div></div>";
		$("#accordion").append(toAdd);
		refresharc();
		refresharcsub();
		$("#accordion").sortable().accordion("refresh");
		//$(".accordionsub").sortable().accordion("refresh");
		
		$(".group").mousedown(function() {
			if(event.which == 3) {
				if(confirm('삭제하시겠습니까?')) {
					wptcnt--;
					this.remove();
				}
			}
		});
		$("h3").click(function() {
			cmenu = $('h3').index(this);
			console.log("=======================");
			console.log(cmenu);
			console.log("=======================");
			_preview(this.getAttribute("title"));
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
