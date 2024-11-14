document.addEventListener("DOMContentLoaded", function() {

    window.onload = function() {
        loadingSpinner.style.display = "flex";
        MainContent.style.display="none";
        fetch('/api/AppliedJobs', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            const jobCardsContainer = document.getElementById('job-cards'); // Get the job cards container
            const nojobs = document.getElementById('nojobscontainer');
            const apiResponse = data; // Assign the fetched data to apiResponse
            console.log(data.length);
           
            if(data.length ==0){
                nojobs.innerHTML='<h2 class="NoJobs"> <p>No jobs Applied</p></h2>';
                setTimeout(() => {
                    document.getElementById('loadingSpinner').style.display = 'none';
                    document.getElementById('MainContent').style.display = "block";
                }, 2000);
            }else{

            
            

            // Clear previous content (optional)
            jobCardsContainer.innerHTML = '';

            apiResponse.forEach(job => {
                const card = `
                    <div class="card mb-3">
                        <div class="row no-gutters">
                            <div class="col-md-4 text-center" id="Companyimage">
                                <img src="${job.Position__r.Company_Image__c  || 'N/A'}" class="card-img" alt="${job.Position__r.Name}">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${job.Position__r.Name}</h5>
                                    <p class="card-text"><strong>Type:</strong> ${job.Position__r.Type__c || 'N/A'}</p>
                                    <p class="card-text"><strong>Functional Area:</strong> ${job.Position__r.Functional_Area__c || 'N/A'}</p>
                                    <p class="card-text"><strong>Status:</strong> ${job.Status__c || 'N/A'}</p>
                                    <p class="card-text"><strong>Location:</strong> ${job.Position__r.Company_Address__c|| 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                jobCardsContainer.innerHTML += card; // Append the card to the container
                setTimeout(() => {
                    document.getElementById('loadingSpinner').style.display = 'none';
                    document.getElementById('MainContent').style.display = "block";
                }, 2000);
            });
        }
        })
        .catch(error => {
            console.error('Error fetching job data:', error); // Log any errors to the console
        });
    };
});
