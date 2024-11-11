
window.onload = async function() {
    await fetchCandidateDetails();
};

// Function to fetch and display candidate details
async function fetchCandidateDetails() {
    // Show loading screen
    document.getElementById('loadingSpinner').style.display = 'flex';
    document.getElementById('MainContent').style.display = "none";
    try {
        const response = await fetch(`/candidate`);
        
        if (!response.ok) {
            alert('Error fetching candidate details');
            return;
        }

        const data = await response.json();

        // Populate form with data
        document.getElementById('firstName').value = data[0].First_Name__c || '';
        document.getElementById('lastName').value = data[0].Last_Name__c || '';
        document.getElementById('email').value = data[0].Email__c || '';
        document.getElementById('phone').value = data[0].Phone__c || '';
        document.getElementById('mobile').value = data[0].Mobile__c || '';
        document.getElementById('street').value = data[0].Street__c || '';
        document.getElementById('city').value = data[0].City__c || '';
        document.getElementById('state').value = data[0].State__c || '';
        document.getElementById('country').value = data[0].Country__c || '';
        document.getElementById('postalCode').value = data[0].Postal_Code__c || '';
        document.getElementById('education').value = data[0].Education__c || '';
        document.getElementById('yearsOfExperience').value = data[0].Years_of_Experience__c || '';
        document.getElementById('CurrentEmployer').value = data[0].Current_Employeer__c || '';
        document.getElementById('currentlyEmployed').checked = data[0].Currently_Emoloyed__c || false;
        document.getElementById('usCitizen').checked = data[0].US_Citizen__c || false;
        document.getElementById('visaRequired').checked = data[0].Visa_Required__c || false;

    } catch (error) {
        alert('Error fetching candidate details: ' + error.message);
    } finally {
        // Hide the loading screen after a delay
        setTimeout(() => {
            document.getElementById('loadingSpinner').style.display = 'none';
            document.getElementById('MainContent').style.display = "block";
        }, 2000);
    }
}

// Function to update candidate details
function updateCandidateDetails() {
    // Get form values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const street = document.getElementById('street').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const country = document.getElementById('country').value.trim();
    const postalCode = document.getElementById('postalCode').value.trim();
    const education = document.getElementById('education').value;
    const yearsOfExperience = document.getElementById('yearsOfExperience').value.trim();
    const currentEmployer = document.getElementById('CurrentEmployer').value.trim();
    const currentlyEmployed = document.getElementById('currentlyEmployed').checked;
    const usCitizen = document.getElementById('usCitizen').checked;
    const visaRequired = document.getElementById('visaRequired').checked;

    // Validation checks
    if (!firstName) {
        alert("First Name is required");
        return;
    }
    if (!lastName) {
        alert("Last Name is required");
        return;
    }
    if (!validateEmail(email)) {
        alert("Invalid Email");
        return;
    }
    if (!validatePhone(phone)) {
        alert("Invalid Phone number");
        return;
    }
    if (!validatePhone(mobile)) {
        alert("Invalid Mobile number");
        return;
    }
    if (!street) {
        alert("Street is required");
        return;
    }
    if (!city) {
        alert("City is required");
        return;
    }
    if (!state) {
        alert("State is required");
        return;
    }
    if (!country) {
        alert("Country is required");
        return;
    }
    if (!postalCode || !/^\d{5}(-\d{4})?$/.test(postalCode)) {
        alert("Invalid Postal Code");
        return;
    }
    if (!education) {
        alert("Education level is required");
        return;
    }
    if (!yearsOfExperience || isNaN(yearsOfExperience) || yearsOfExperience < 0) {
        alert("Years of Experience must be a valid number");
        return;
    }

    // Prepare data to send to server
    const data = {
        First_Name__c: firstName,
        Last_Name__c: lastName,
        Email__c: email,
        Phone__c: phone,
        Mobile__c: mobile,
        Street__c: street,
        City__c: city,
        State__c: state,
        Country__c: country,
        Postal_Code__c: postalCode,
        Education__c: education,
        Years_of_Experience__c: parseInt(yearsOfExperience),
        Currently_Emoloyed__c: currentlyEmployed,
        US_Citizen__c: usCitizen,
        Visa_Required__c: visaRequired,
        Current_Employeer__c:currentEmployer
    };

    // Send PATCH request to the server
    fetch(`/candidate`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.ok) {
            // Show success modal if update is successful
            $('#successModal').modal('show');
        } else {
            return response.json().then(err => {
                throw new Error(err.message || 'Error updating candidate details');
            });
        }
    })
    .catch(error => {
        alert('Error: ' + error.message);
    });
}

// Validation function for email
function validateEmail(email) {
    const re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return re.test(email);
}

// Validation function for phone number (10 digits)
function validatePhone(phone) {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
}

