
$(document).ready(function() {

	var AppRouter = Backbone.Router.extend({
		routes: {
		    "": "home",
		    "section/:id": "section",
		}
	});

	var app_router = new AppRouter;

	app_router.on('route:home', function (id) {
		app_router.navigate("section/1", {trigger: true});
	});

	app_router.on('route:section', function (id) {
		console.log("id : "+id);
		if($("body").attr("class") == undefined){
			initBg(id);
		}else{
			moveBg(id);
		}
		$("body").addClass("section");
	});

	function initBg(id){
		$.each($(".oneBg .bg"),function(){
			if($(this).hasClass("bg-"+id)){
				$(this).addClass("active");
			}else{
				$(this).addClass("inactive");
			}
		});
	}

	function moveBg(id){
		$counter = 0;
		$(".oneBg .bg-"+id).removeClass("active inactive").addClass("pre-active");
		$.each($(".oneBg .bg.active"),function(){
			if($(this).parent().hasClass("topLeft")){
				$(this).animate({top : "0", left: "100%"}, 1000, "easeInOutCubic", function(){
					$(this).removeClass("active pre-active").addClass("inactive");
					reinitBg();
				});
			}else if($(this).parent().hasClass("topRight")){
				$(this).animate({top : "100%", left: "0"}, 1000, "easeInOutCubic", function(){
					$(this).removeClass("active pre-active").addClass("inactive");
					reinitBg();
				});
			}else if($(this).parent().hasClass("bottomLeft")){
				$(this).animate({top : "-100%", left: "0"}, 1000, "easeInOutCubic", function(){
					$(this).removeClass("active pre-active").addClass("inactive");
					reinitBg();
				});
			}else{
				$(this).animate({top : "0", left: "-100%"}, 1000, "easeInOutCubic", function(){
					$(this).removeClass("active pre-active").addClass("inactive");
					reinitBg();
				});
			}
		});
	}

	function reinitBg(){
		$counter++;
		if($counter == 4){
			$(".oneBg .pre-active").removeClass("pre-active").addClass("active");
			$(".oneBg .inactive").css({top : "0", left: "0"});

		}
	}

	Backbone.history.start();

});