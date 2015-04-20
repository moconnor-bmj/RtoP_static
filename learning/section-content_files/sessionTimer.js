//event to check session time variable declaration
var checkSessionTimeEvent;
var redirectedCount = 0;
$(document).ready(function() {	
    //event to check session time left (times 1000 to convert seconds to milliseconds) 
    var sessionTimerOff = eval(document.forms.moduleFrm2);
    if (typeof(sessionTimerOff) == 'undefined')
    { 
    	redirectedCount = 0;
    	checkSessionTimeEvent = setInterval("checkSessionTime()",5*60*1000);     
    }   
});

//set number of mins to count down from for countdown ticker
var countdownTime = 5;
//set number of second to count down from for countdown ticker
var countdownTimeInSeconds = 60;
// timer session start
var pageRequestTime = new Date();

function checkSessionTime()
{		
	//session timeout length
	var maxTimeout = $('input:hidden[name=sessionTimeoutInMin]').val();	
	var timeoutLength = maxTimeout * 60 * 1000;			
	//set time for first warning, 5 mins before session expires
	var warningTime = timeoutLength - (5*60*1000);
	//declare event create countdown ticker variable
	var countdownTickerEvent; 
	// declare even create count down ticker in seconds variable
	var countdownTickerInSecondsEvent; 
	//difference between time now and time session started variable declartion
	var timeDifference = 0;	
	//get time now
	var timeNow = new Date(); 
	timeDifference = timeNow - pageRequestTime;	
	    if (timeDifference > warningTime && timeDifference < timeoutLength)
	{
    	if (countdownTime <=1)
    	{	
    		//clear (stop) countdownTickerEvent event
    		clearInterval(countdownTickerEvent);
    	} 
    	else 
    	{	    	
			countdownTicker();
			 //set as interval event to countdown mins to session timeout				
			countdownTickerEvent = setInterval("countdownTicker()", 60*1000);
		}		
    	
    	
    	
    	//$('#sessionWarning').dialog('open');
    	popSessionTimer('sessionWarning');
	} 
	else if (timeDifference > timeoutLength)
    {    		
   	    //stop countdownTicker event
   	    clearInterval(countdownTickerEvent);
	    //stop countdownTickerInSeconds event
	    clearInterval(countdownTickerInSecondsEvent);	    
	    //stop checksession event
	    clearInterval(checkSessionTimeEvent);	    	    
	    //close warning dialog box
	    //if ($('#sessionWarning').dialog('isOpen')) $('#sessionWarning').dialog('close');
	   
	    if ($('#sessionWarning-popup').is(":visible")) {
	    	_closeTimerPopUp();
	    }
	    // open expired dialog box
	    popSessionTimer('sessionExpired');
	    //$('#sessionExpired').dialog('open');
	    //force relocation only once
	    if (redirectedCount == 0)
	    {
	    	var moduleId =  $('input:hidden[name=moduleId]').val();
	    	var currLocale =  $('input:hidden[name=locale]').val();	    
	    	var currentUrl = window.location.href.substring(0,window.location.href.lastIndexOf( '/' ) + 1 );
	    	var redirectUrl = currentUrl.substring(0, currentUrl.indexOf("modules")) + 'module-start.html?isExpired=true&moduleId=' + moduleId+'&locale='+currLocale;
	    	window.location.href = redirectUrl;
	    }
	    redirectedCount++;
	}
}

function countdownTicker()
{
	if (countdownTime <= 1)
	{
		//manually initiate countdownTickerInSeconds timer
		//countdownTickerInSeconds();		
		countdownTickerInSecondsEvent = setInterval("countdownTickerInSeconds()", 1000);	
		clearInterval(checkSessionTimeEvent);
		//change checkSessionTimeEvent interval to 1 second		     
    	//checkSessionTimeEvent = setInterval("checkSessionTime()",1000);  
	}	
	else
	{
		//put countdown time left in dialog box
		$("span#dialogText-warning").html(countdownTime +" minutes");	
	}	
	//decrement countdownTime
	countdownTime--;	
} 

function countdownTickerInSeconds()
{
	if (countdownTimeInSeconds == 1)
	{
		//put countdown time left in dialog box			
		$("span#dialogText-warning").html(countdownTimeInSeconds +" second");
	}	
	else if (countdownTimeInSeconds == 0)
	{
			//stop checkSessionTime Event
			clearInterval(checkSessionTimeEvent);
			//put countdown time left in dialog box			
			$("span#dialogText-warning").html(countdownTimeInSeconds+" second");
			// manually instiate checkSessionTime.
			checkSessionTime();
			//change checkSessionTimeEvent interval to 1 second					       
    		checkSessionTimeEvent = setInterval("checkSessionTime()",1000);  
	}
	else if (countdownTimeInSeconds < 0)
	{
		//stop checkSessionTime Event
		clearInterval(checkSessionTimeEvent);	
	}
	else
	{
		//put countdown time left in dialog box
		$("span#dialogText-warning").html(countdownTimeInSeconds +" seconds");
	}
	//decrement countdownTime
	countdownTimeInSeconds--;
}

function redirect()
{	
	var moduleId = $('input:hidden[name=moduleId]').val();
	var currLocale = $('input:hidden[name=locale]').val();
	var currentUrl = window.location.href.substring(0,window.location.href.lastIndexOf( '/' ) + 1 );
	var redirectUrl = currentUrl.substring(0, currentUrl.indexOf("modules")) + 'module-start.html?isExpired=true&moduleId=' + moduleId+'&locale='+currLocale;
	// excluce modules folder	
	window.location.href = redirectUrl;
}

$(function() {
   	// jQuery UI Dialog    
	$('#sessionWarning').dialog({autoOpen: false,
		height: 100,
		width: 400,
		modal: true,
		resizable: false,
		position: ['center', 'center'],
		title: 'WARNING'	
	});   
	$('#sessionExpired').dialog({autoOpen: false,
		height: 100,
		width: 400,
		modal: true,
		resizable: false,
		position: ['center', 'center'],
		title: 'WARNING',
		close: function(event, ui) { 
				redirect();
			}
	});
 });


function popSessionTimer(divIdentifier){
	
	var warningMsg = jQuery.i18n.prop('label.warning.uppercase');
	var closeTxt = jQuery.i18n.prop('button.close');
	var popId = divIdentifier + "-popup";
	$('body').append('<div id="overlay"></div>');
	$('body').append('<div id="'+popId+'" class="modal" style="width:300px;"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h3>'+warningMsg+'</h3></div><div class="modal-body"></div></div>');
	var arrPageSizes = getPageSize();
	$('#overlay').css({
			height: arrPageSizes[1],
			opacity: '0.3'
			}).fadeIn();
	$('.messagepop').slideFadeToggle();
	$(".modal-body").append( $('#' + divIdentifier).html());	
	_closeTimerPopUp();	
}

function _closeTimerPopUp(){
	$('.close').on('click',function(e){		
		closePopup();
		redirect();
	});
	
	$(document).keypress(function(e) { 
	    if (e.keyCode == 27) { 
	    	closePopup();
	    }  // esc   
	});
}
