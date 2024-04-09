
    
$(document).ready( function() {        

	
	/*initialize .templatemo-submenu*/
	$('.templatemo-submenu').addClass('myhide');
	$('.templatemo-submenu').hide();
	$('.templatemo-submenu-submenu').addClass('myhide');
	$('.templatemo-submenu-submenu').hide();
	
	$('.sub_open').click(function(){
		
		if($(this).next().hasClass('myhide')) {
			$(this).next().removeClass('myhide');
			$(this).next().show(500);
		} else {
			$(this).next().addClass('myhide');
			$(this).next().hide(500);
		}
	});
	
	$('.sub_open_sub').click(function(){
		
		if($(this).next().hasClass('myhide')) {
			$(this).next().removeClass('myhide');
			$(this).next().show(500);
		} else {
			$(this).next().addClass('myhide');
			$(this).next().hide(500);
		}
		
		
	}); // sidebar menu click
	
	
	
	
	
	
		$('.aa').click(function(){
		
		if($("#bb").hasClass('myhide2')) {
			$("#bb").removeClass('myhide2');
			$(".templatemo-content").css("margin-left",210);
			/* $(".templatemo-content").show(500); */
//			$('.templatemo-submenu').show();
		} else {
			$("#bb").addClass('myhide2');
/* 			$(".templatemo-content").hide(500); */
			$(".templatemo-content").css("margin-left",0);
			
//			$('.templatemo-submenu').hide();
		}
		
		
	});
	
	
	
	
	$('.ch3').click(function(){
		
		if($('.ch1').attr('src') == 'src/pics/yjt.png') {
			$('.ch1').attr('src','src/pics/xjt.png');
		} else {
			$('.ch1').attr('src','src/pics/yjt.png');

		}
		
		
	});
	
	$('.ch4').click(function(){
		
		if($('.ch2').attr('src') == 'src/pics/yjt.png') {
			$('.ch2').attr('src','src/pics/xjt.png');
		} else {
			$('.ch2').attr('src','src/pics/yjt.png');
		}
		
		
	});
	
	
}); // document.ready