document.addEventListener('DOMContentLoaded', function () {
    const items = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    });

    items.forEach(item => {
        observer.observe(item);
    });
});

document.getElementById('goToSignUp')?.addEventListener('click', () => {
    window.location.href = 'signup.html';
});

document.getElementById('goToSignIn')?.addEventListener('click', () => {
    window.location.href = 'signin.html';
});

document.getElementById('signUpForm')?.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        dob: document.getElementById('dob').value,
        address: document.getElementById('address').value,
        zipcode: document.getElementById('zipcode').value,
        country: document.getElementById('location').value
    };

    if (formData.username && formData.password && formData.firstName && formData.lastName && formData.email) {
        alert(`Account Created:
        Username: ${formData.username}
        Name: ${formData.firstName} ${formData.lastName}
        Email: ${formData.email}
        Age: ${formData.age}
        Gender: ${formData.gender}
        DOB: ${formData.dob}
        Address: ${formData.address}, ${formData.zipcode}, ${formData.country}`);
    } else {
        alert('Please fill in all required fields.');
    }
});

document.getElementById('signInForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    let valid = true;

    if (!validateEmail(email)) {
        emailError.style.display = 'block';
        valid = false;
    } else {
        emailError.style.display = 'none';
    }

    if (password.length < 6) {
        passwordError.style.display = 'block';
        valid = false;
    } else {
        passwordError.style.display = 'none';
    }

    if (valid) {
        alert(`Logging in with:
        Email: ${email}
        Password: ${password}`);
    }
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

document.getElementById('backToHome')?.addEventListener('click', function() {
    window.location.href = 'index.html';
});
document.querySelector('video').addEventListener('play', function() {
    console.log('Video is playing');
});

document.getElementById("goToJobs").addEventListener("click", function() {
    window.location.href = "jobs.html";
  });
  
  document.getElementById("goToSignUp").addEventListener("click", function() {
    window.location.href = "signup.html";
  });
  
  document.getElementById("goToSignIn").addEventListener("click", function() {
    window.location.href = "signin.html";
  });