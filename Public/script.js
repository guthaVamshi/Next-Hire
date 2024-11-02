var topjobs = [];
window.onload = function() {
    fetch('/api/getjson')
        .then(response => response.json())
        .then(data => {
            if(data === ""){
                window.location.href = "signin.html";
            } else {
                console.log(data);
                console.log(data.CandidateId);
                if(data.CandidateId != null){
                    document.getElementById('GetStarted').style.display = 'none';
                    document.getElementById('viewJobs').style.display = 'inline';
                }
            }
        })
        .catch(error => console.error('Error fetching JSON:', error));

    fetch('/api/gettopjobs')
        .then(response => response.json())
        .then(data => {
            topjobs = data;
            console.log(topjobs);
            // Move createJobCards here to ensure it's called after topjobs is populated
            createJobCards(topjobs);
            createCompanyCarousel(topjobs);
        })
        .catch(error => console.error('Error fetching JSON:', error));
};

const Createcan = document.getElementById('CreateCandidate');
Createcan.addEventListener('click', async function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // Gather form data
    const formData = {
        Firstname: document.getElementById('Firstname').value,
        Lastname: document.getElementById('Lastname').value,
        Phone: document.getElementById('Phone').value,
        Email: document.getElementById('Email').value,
        Education: document.getElementById('Education').value,
        CurrentEmployer: document.getElementById('CurrentEmployer').value,
        CurrentlyEmployed: document.getElementById('CurrentlyEmployed').checked,
        USCitizen: document.getElementById('USCitizen').checked,
        SponsorshipNeeded: document.getElementById('SponsorshipNeeded').checked
    };

    fetch('/api/CreateCandidate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        window.location.href = 'Home.html';
    });
});

function createJobCards(topjobs) {
    const jobCardsContainer = document.getElementById('job-cards');

    // Clear previous job cards, if any
    jobCardsContainer.innerHTML = '';

    topjobs.forEach(job => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
            <div class="card">
                <img src="${job.Company_Image__c || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${job.Name}">
                <div class="card-body">
                    <h5 class="card-title">${job.Name}</h5>
                    <p class="card-text"><strong>Max Pay:</strong> $${job.Max_Pay__c}</p>
                    <p class="card-text"><strong>Company Name:</strong> ${job.CompnayName__c || 'N/A'}</p>
                    <p class="card-text"><strong>Company Address:</strong> ${job.Company_Address__c || 'N/A'}</p>
                </div>
            </div>
        `;
        jobCardsContainer.appendChild(card);
    });
}
function createCompanyCarousel(topjobs) {
    const carouselItemsContainer = document.getElementById('carousel-items');

    // Use a Set to track unique company images
    const uniqueCompanies = new Set();
    let count = 0;
    let carouselItem; // Variable to hold the current carousel item

    topjobs.forEach(job => {
        if (job.Company_Image__c && !uniqueCompanies.has(job.Company_Image__c) && count < 30) { // Allow up to 30 images
            uniqueCompanies.add(job.Company_Image__c); // Add image to the set
            count++;

            // Create a new carousel item every six images
            if (count % 6 === 1) {
                carouselItem = document.createElement('div');
                carouselItem.className = 'carousel-item' + (count === 1 ? ' active' : ''); // Set first item as active
                carouselItemsContainer.appendChild(carouselItem);
                
                // Create a row for the images
                const rowDiv = document.createElement('div');
                rowDiv.className = 'row';
                carouselItem.appendChild(rowDiv);
            }

            // Create an image element in a column
            const colDiv = document.createElement('div');
            colDiv.className = 'col-4 text-center'; // Three columns per row
            colDiv.innerHTML = `
                <img src="${job.Company_Image__c}" class="d-block mx-auto" alt="Company Image" style="height: 50px;">
            `;
            carouselItem.querySelector('.row').appendChild(colDiv);

            // If it's the sixth image, we close the div element for that carousel item
            if (count % 6 === 0) {
                carouselItemsContainer.appendChild(carouselItem);
            }
        }
    });
};