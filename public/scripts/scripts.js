function myFunction()
	{
		var un = document.forms["myForm"]["uname"].value; // taking the value of username entered
		var pw = document.forms["myForm"]["passw"].value; // taking the value of password entered
		
	
		if(un =="joshtan" && pw == "12345" )
		{		
			window.location.href="index.html";
			alert("Going to home page");
		}
		else if(un =="antonsantos" && pw == "54321")
		{
			window.location.href="recruiter-index.html";
			alert("Going to home page");
		}
		else
		{
			alert("Invalid Username and/or Password");
		}
	}	

	
function searchFunction() 
	{
		$("header").text("Results");
		$(".details").hide();
	}
