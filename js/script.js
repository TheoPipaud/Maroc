$currentSection = 1;
$navEnabled = false;

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
		$navEnabled = false;
		$currentSection = parseInt(id);
		console.log("id : "+id);
		if($("body").attr("class") == undefined){
			initBg(id);
		}else{
			moveBg(id);
		}
		$("body").addClass("loaded");
	});

	var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x
 
	if (document.attachEvent){
	    document.attachEvent("on"+mousewheelevt, scroll);
	}else if(document.addEventListener){
	    document.addEventListener(mousewheelevt, scroll, false);
	}

	function scroll(e){
		if($navEnabled == true){
			
			$evt=window.event || e;
			$delta=$evt.detail? $evt.detail*(-120) : $evt.wheelDelta;

		    if($delta >= 0){
		    	$newId = $currentSection-1 ;
		    	if($newId>0){
		    		app_router.navigate("section/"+$newId, {trigger: true});
		    	}
		    }else{
		    	$newId = $currentSection+1 ;
		    	if($newId<=3){
		        	app_router.navigate("section/"+$newId, {trigger: true});
		        }
		    }
		}
	}

	$("body").bind('mousewheel', function(event){
		
	});

	$('a[href^="#"]').click(function(e) {
		e.preventDefault();
		if($navEnabled == true){
			$link = $(this).attr('href');
			app_router.navigate($link, {trigger: true});
		}
    	return false;
    });

	$(".open-menu").mouseenter(function(){
		$(".menu").stop().animate({"left":0}, 500, "easeInOutCubic", function(){

		});
	});
	$(".menu").mouseleave(function(){
		$(".menu").stop().animate({"left":"-460px"}, 500, "easeInOutCubic");
	});

    // ------------------- FUNCTIONS -------------------

	function initBg(id){
		$("#section"+id).css({"display":"table", "opacity":1});
		$.each($(".oneBg .bg"),function(){
			if($(this).hasClass("bg-"+id)){
				$(this).addClass("active");
			}else{
				$(this).addClass("inactive");
			}
		});
		$navEnabled = true;
	}

	function moveBg(id){
		console.log("launch anim");
		$counter = 0;
		$(".section").animate({opacity:0},300, function(){
			
			$(".section").css("display","none");
			$(".oneBg .bg-"+id).removeClass("active inactive").addClass("pre-active");
			
			$.each($(".oneBg .bg.active"),function(){
				if($(this).parent().hasClass("topLeft")){
					$(this).stop().animate({top : "0", left: "100%"}, 1000, "easeInOutCubic", function(){
						reinitBg(id, $(this));
					});
				}else if($(this).parent().hasClass("topRight")){
					$(this).stop().animate({top : "100%", left: "0"}, 1000, "easeInOutCubic", function(){
						reinitBg(id, $(this));
					});
				}else if($(this).parent().hasClass("bottomLeft")){
					$(this).stop().animate({top : "-100%", left: "0"}, 1000, "easeInOutCubic", function(){
						reinitBg(id, $(this));
					});
				}else{
					$(this).stop().animate({top : "0", left: "-100%"}, 1000, "easeInOutCubic", function(){
						reinitBg(id, $(this));
					});
				}
			});

		});
	}

	function reinitBg(id, it){
		$counter++;
		it.removeClass("active pre-active").addClass("inactive");
		if($counter == 4){
			$(".oneBg .pre-active").removeClass("pre-active").addClass("active");
			$(".oneBg .inactive").css({top : "0", left: "0"});
			$("#section"+id).css("display","table").animate({opacity:1},300);
			$navEnabled = true;
		}
	}

	Backbone.history.start();

});