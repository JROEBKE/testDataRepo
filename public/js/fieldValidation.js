

//validate vin
function validateVin(vin){
      // Validation rule
      var re = /^[A-Za-z0-9]+$/;
      // Check input
      if(re.test(vin)){
        // Style green
        document.getElementById('vin').style.background ='#ccffcc';
        // Hide error prompt
        document.getElementById('vinError').style.display = "none";
        return true;
      }else{
        // Style red
        document.getElementById('vin').style.background ='#e35152';
        // Show error prompt
        document.getElementById('vinError').style.display = "block";
        return false;
      }
}

// Validate email
function validateEmail(email){
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(re.test(email)){
        document.getElementById('email').style.background ='#ccffcc';
        document.getElementById('emailError').style.display = "none";
        return true;
      }else{
        document.getElementById('email').style.background ='#e35152';
        return false;
      }
}



// Validate complete form
function validateForm(){
      // Set error catcher
      var error = 0;

      // validate  vin
      if(!validateVin(document.getElementById('vin').value)){
        document.getElementById('vinError').style.display = "block";
        error++;
      }


      // Do not submit form if there are errors
      if(error > 0){
        return false;
  }
}
