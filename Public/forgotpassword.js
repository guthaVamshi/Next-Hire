
// Function to send OTP
function sendOtp() {
  const email = document.getElementById("email").value;

  if (!email) {
    alert("Please enter a valid email address.");
    return;
  }

  // Make API call to generate OTP
  fetch(`api/ForgotPasswordOTP`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ UserEmail: email }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        showOtpModal();
        // Switch to OTP and password reset form
        document.getElementById("step1").classList.add("hidden");
        document.getElementById("step2").classList.remove("hidden");
      } else {
        showErrorModal(data.Response || "Failed to send OTP. Please try again.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while sending the OTP. Please try again later.");
    });
}

// Function to reset password
function resetPassword() {
  const otp = document.getElementById("otp").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  document.getElementById("OtpError").innerText = '';
  document.getElementById("PasswordError").innerText = '';
  document.getElementById("ConfirmPasswordError").innerText = '';

  let isValid = true;

  // Validate OTP
  if (!otp) {
    document.getElementById("OtpError").innerText = 'Please Enter OTP';
    isValid = false;
  }

  // Validate New Password
  if (!newPassword) {
    document.getElementById("PasswordError").innerText = 'Please Enter New Password';
    isValid = false;
  } else if (newPassword.length < 8 || newPassword.length > 20) {
    document.getElementById("PasswordError").innerText =
      'Password must be between 8 and 20 characters';
    isValid = false;
  }

  // Validate Confirm Password
  if (!confirmPassword) {
    document.getElementById("ConfirmPasswordError").innerText = 'Please Enter Confirm Password';
    isValid = false;
  } else if (newPassword !== confirmPassword) {
    document.getElementById("ConfirmPasswordError").innerText = 'Passwords do not match';
    isValid = false;
  }
  if (!isValid) return;
  // Make API call to update password
  fetch(`api/UpdatePassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ OTP: otp, NewPassword: newPassword }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        showPasswordUpdatedModal();
        // Redirect to sign-in page
      } else {
        showErrorModal(data.Response || "Failed to send OTP. Please try again.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while updating the password. Please try again later.");
    });
}

// Function to go back to email step
function backToEmail() {
  document.getElementById("step2").classList.add("hidden");
  document.getElementById("step1").classList.remove("hidden");
}

// Show the OTP Sent Modal
function showOtpModal() {
    document.getElementById("otpSentModal").style.display = "flex";
  }
  
  // Close the OTP Sent Modal
  function closeOtpModal() {
    document.getElementById("otpSentModal").style.display = "none";
  }
  
  // Show the Password Updated Modal
  function showPasswordUpdatedModal() {
    document.getElementById("passwordUpdatedModal").style.display = "flex";
    setTimeout(() => {
      window.location.href = "signin.html"; // Redirect to the sign-in page after 3 seconds
    }, 5000);
  }
  // Show the Error Modal with a dynamic message
function showErrorModal(message) {
    const errorMessageElement = document.getElementById("errorMessage");
    errorMessageElement.textContent = message; // Set the error message dynamically
    document.getElementById("errorModal").style.display = "flex";
  }
  
  // Close the Error Modal
  function closeErrorModal() {
    document.getElementById("errorModal").style.display = "none";
  }
  