var pWin;
function checkChild() 
{
  if (pWin.closed) 
  {
    window.location.reload(true);
  } 
  else 
  {
	  setTimeout("checkChild()",1);
  };
}