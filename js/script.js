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
		console.log("router");
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

	$("body").bind('mousewheel', function(event){
		
	});

	$(".navicon-button").click(function(){
		$(this).toggleClass("open");
		if($(this).hasClass("active")){
			$(this).removeClass("active").addClass("inactive");
			$(".menu").stop().animate({opacity:0}, 500, "easeInOutCubic", function(){
				$(".menu").css("display","none");
			});
		}else{
			$(this).removeClass("inactive").addClass("active");
			$(".menu").css("display","table");
			$(".menu").stop().animate({opacity:1}, 500, "easeInOutCubic");
		}
	});

	$("nav a").click(function(e){
		e.preventDefault();
		console.log($navEnabled);
		$link = $(this).attr('href');
		if($navEnabled == true){
			$(".navicon-button").removeClass("active").addClass("inactive");
			$(".menu").stop().animate({opacity:0}, 500, "easeInOutCubic", function(){
				$(".menu").css("display","none");
				console.log($link);
				app_router.navigate($link, {trigger: true});
			});
		}
	});

	resize();

	window.onresize = function(){
		resize();
	}
    
    // ------------------- FUNCTIONS -------------------

    function resize(){
    	$body = $("body");
    	
    	if($body.height()%2 != 0){
    		$("#background").css("height",($body.height()+1)+"px");
    	}else{
    		$("#background").css("height","100%");
    	}

    	if($body.width()%2 != 0){
    		$("#background").css("width",($body.width()+1)+"px");
    	}else{
    		$("#background").css("width","100%");
    	}
    }

    function scroll(e){
		if($navEnabled == true){
			console.log("nav false");
			$evt=window.event || e;
			$delta=$evt.detail? $evt.detail*(-120) : $evt.wheelDelta;

		    if($delta >= 0){
		    	if($currentSection>=2){
		    		app_router.navigate("section/"+($currentSection-1), {trigger: true});
		    	}
		    }else{
		    	if($currentSection<=5){
		        	app_router.navigate("section/"+($currentSection+1), {trigger: true});
		        }
		    }
		}
	}

	function initBg(id){
		$("#section"+id).css({"display":"table", "opacity":1});
		$.each($(".oneBg .bg"),function(){
			if($(this).hasClass("bg-"+id)){
				$(this).addClass("active");
				$(this).css({opacity:1});
			}else{
				$(this).addClass("inactive");
			}
		});
		window.setTimeout(function(){
			animateSection(id);
		},500);
	}

	function moveBg(id){
		console.log("launch anim");
		$counter = 0;
		$(".state, .section-head").removeClass("active");
		$(".oneBg .bg-"+id).removeClass("active inactive").addClass("pre-active");
		$("#complete-bg").css({padding:"100px", top:"-100px", left:"-100px"}).removeClass().addClass("sct"+id).animate({padding:"0px", top:0, left:0}, 1400, "easeInOutCubic");
		$.each($(".oneBg .bg.active"),function(){
			$parent = $(this).parent();
			$(this).css({opacity:1});
			if($parent.hasClass("topLeft")){
				$(this).stop().animate({opacity : 0, right: "-100%"}, 1400, "easeInOutCubic", function(){
					reinitBg(id, $(this));
				});
			}else if($parent.hasClass("topRight")){
				$(this).stop().animate({opacity : 0, bottom : "-100%"}, 1400, "easeInOutCubic", function(){
					reinitBg(id, $(this));
				});
			}else if($parent.hasClass("bottomLeft")){
				$(this).stop().animate({opacity : 0, top : "-100%"}, 1400, "easeInOutCubic", function(){
					reinitBg(id, $(this));
				});
			}else{
				$(this).stop().animate({opacity : 0, left: "-100%"}, 1400, "easeInOutCubic", function(){
					reinitBg(id, $(this));
				});
			}
		});

		
	}

	function reinitBg(id, it){
		$counter++;
		it.removeClass("active pre-active").addClass("inactive");
		if($counter == 4){
			$(".oneBg .pre-active").css({opacity:1}).removeClass("pre-active").addClass("active");
			$(".oneBg.topLeft .inactive").css({right : "0", bottom: "0"});
			$(".oneBg.topRight .inactive").css({left : "0", bottom: "0"});
			$(".oneBg.bottomLeft .inactive").css({right : "0", top: "0"});
			$(".oneBg.bottomRight .inactive").css({left : "0", top: "0"});
			animateSection(id);
		}
	}

	function animateSection(id){
		if(id==1){
			$("#section1 .state").addClass("active");
			window.setTimeout(function(){
				$navEnabled = true;
			},400);
		}else{
			$("#section"+id+" .step.state").addClass("active");
			window.setTimeout(function(){
				$("#section"+id+" .section-title.state").addClass("active");
				window.setTimeout(function(){
					$("#section"+id+" .text.state").addClass("active");
					window.setTimeout(function(){
						$("#section"+id+" .section-head").addClass("active");
						$navEnabled = true;
					}, 200);
				}, 200);
			}, 200);
		}
	}

	Backbone.history.start();

});