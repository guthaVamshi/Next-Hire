document
  .getElementById("signUpForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission to do custom validation

    // Clear previous error messages
    document.getElementById("usernameError").innerText = "";
    document.getElementById("emailError").innerText = "";
    document.getElementById("phoneError").innerText = "";
    document.getElementById("passwordError").innerText = "";
    document.getElementById("dobError").innerText = "";

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const dob = document.getElementById("dob").value;

    let isValid = true;

    // Validation for username
    if (!/^[A-Za-z]+$/.test(username)) {
      document.getElementById("usernameError").innerText =
        "Username must contain only alphabets.";
      isValid = false;
    }

    // Validation for email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      document.getElementById("emailError").innerText =
        "Please enter a valid email address.";
      isValid = false;
    }

    // Validation for phone number
    const phonePattern = /^\d{10,15}$/;
    if (!phonePattern.test(phone)) {
      document.getElementById("phoneError").innerText =
        "Please enter a valid phone number (10-15 digits).";
      isValid = false;
    }

    // Validation for password length
    if (password.length < 8 || password.length > 20) {
      document.getElementById("passwordError").innerText =
        "Password must be between 8 and 20 characters long.";
      isValid = false;
    }

    // Validation for age
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    if (age < 18) {
      document.getElementById("dobError").innerText =
        "You must be at least 18 years old to sign up.";
      isValid = false;
    }

    if (isValid) {
      // // Proceed with form submission if no errors
       fetch('/api/Signup', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, email, phone, password, dob })
      })

      .then(response => {
          if (response.redirected) {
              // If redirected, check the destination URL
              if (response.url.endsWith("/signin.html")) {
                  // Redirect to login page on success

                  showModal();
              } else if (response.url.endsWith("/Signup.html")) {
                  // Show error message for unsuccessful signup
                  document.getElementById('usernameError').innerText = 'Signup failed. Please try again.';
              }
          } else {
              // Handle unexpected responses
              throw new Error('Unexpected response from server');
          }
      })
      .catch(error => {
          console.error('Error:', error);
          alert('An error occurred. Please try again later.');
      });


      
    }
  });
function showModal() {
  const modal = document.getElementById("signupSuccessModal");
  modal.style.display = "flex"; // Set to "flex" to center it as per CSS above

  // Redirect after 5 seconds
  setTimeout(function () {
    window.location.href = "/signin.html";
  }, 5000); // 5000 milliseconds = 5 seconds
}
