let jsonData = [];
let currentPage = 1; // Track the current page
const jobsPerPage = 10; // Number of jobs to show per page
let filteredJobs = []; // Initially set to all jobs (no filter)

window.onload = function () {
  loadingSpinner.style.display = "flex";
  // Fetch job data on initial load
  
  fetch("/api/getJobs")
    .then((response) => response.json())
    .then((data) => {
      if (data == null) {
        window.location.href = "/login.html"; // Use window.location.href instead of window.location
      } else {
        jsonData = data;
        filteredJobs = jsonData; // Update filteredJobs after fetching data
        Populatedata(); // Populate data after jobs are loaded
      }
    })
    .catch((error) => console.error("Error fetching JSON:", error));

  // Set up search event listener
  document.querySelector("#jobTitleInput").addEventListener("input", handleSearch);
  document.querySelector("#locationInput").addEventListener("input", handleSearch);
};

// Function to populate jobs
function Populatedata(page = 1) {
  const positionsContainer = document.querySelector("#positionsContainer");
  const loadingSpinner = document.querySelector("#loadingSpinner");
  const footer = document.querySelector('footer');
  // Show the loading spinner and clear the container
  
  positionsContainer.innerHTML = "";

  // Calculate the start and end index for slicing the job data
  const startIndex = (page - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;

  // Simulate a delay to show the loading spinner for effect (optional)
  setTimeout(() => {
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    // Check if there are jobs to display
    if (paginatedJobs.length === 0) {
      positionsContainer.innerHTML = "<p>No jobs found</p>";
      footer.style.position = "sticky";
      footer.style.bottom = '0';
      loadingSpinner.style.display = "none"; // Hide the spinner after data is loaded
      return;
    }

    // Loop through paginated data and display jobs in grid
    paginatedJobs.forEach((job) => {
      // Create a new div element for the job card
      const jobCard = document.createElement("div");
      jobCard.className = "job-card";

      // Company logo and name
      const companyInfo = document.createElement("div");
      companyInfo.className = "company-info";
      if (job.Company_Image__c) {
        const companyLogo = document.createElement("img");
        companyLogo.src = job.Company_Image__c;
        companyLogo.alt = `${job.Name} Logo`;
        companyLogo.className = "company-logo";
        companyInfo.appendChild(companyLogo);
      }
      const jobName = document.createElement("h2");
      jobName.textContent = job.Name;
      companyInfo.appendChild(jobName);
      jobCard.appendChild(companyInfo);

      // Location
      const jobLocation = document.createElement("p");
      jobLocation.textContent = `Location: ${job.Company_Address__c}`;
      jobCard.appendChild(jobLocation);

      // Open Date
      const jobOpenDate = document.createElement("p");
      jobOpenDate.textContent = `Open Date: ${job.Open_Date__c || "N/A"}`;
      jobCard.appendChild(jobOpenDate);

      // "View More Details" button
      const viewButton = document.createElement("button");
      viewButton.className = "job-details-btn";
      viewButton.textContent = "View More Details";
      viewButton.dataset.id = job.Id;
      viewButton.addEventListener("click", function () {
        const jobId = this.dataset.id;
        const dataToSend = { data: jobId };

        fetch("/api/getJobDetails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        })
        .then(response => response.json())
        .then(result => {
          window.location.href = "/JobDetails.html";
        })
        .catch(error => {
          console.error("Error:", error);
        });
      });

      jobCard.appendChild(viewButton);

      // Append the job card to the positions container
      positionsContainer.appendChild(jobCard);
    });

    loadingSpinner.style.display = "none"; // Hide the spinner after data is loaded

    // Update pagination buttons
    updatePaginationControls();
  }, 2000); // Adjust timeout as necessary for loading effect
}

// Function to update pagination controls
function updatePaginationControls() {
  const paginationContainer = document.querySelector("#paginationControls");
  paginationContainer.innerHTML = ""; // Clear existing controls

  // Previous button
  if (currentPage > 1) {
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.classList.add("nextbutton");
    prevButton.addEventListener("click", function () {
      currentPage--;
      Populatedata(currentPage);
    });
    paginationContainer.appendChild(prevButton);
  }

  // Next button
  if (currentPage * jobsPerPage < filteredJobs.length) {
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.classList.add("nextbutton");
    nextButton.addEventListener("click", function () {
      currentPage++;
      Populatedata(currentPage);
    });
    paginationContainer.appendChild(nextButton);
  }
}

// Function to handle search input
// Function to handle search input
function handleSearch() {
  const titleInput = document.querySelector("#jobTitleInput").value.toLowerCase();
  const locationInput = document.querySelector("#locationInput").value.toLowerCase();

  // Filter the jobs based on the search inputs
  filteredJobs = jsonData.filter((job) => {
    // Safely check if the job title or company name exist, then match with titleInput
    const jobTitleMatch = (job.Name && job.Name.toLowerCase().includes(titleInput)) || 
                          (job.Company_Name__c && job.Company_Name__c.toLowerCase().includes(titleInput));
    
    // Safely check if location exists, then match with locationInput
    const locationMatch = job.Company_Address__c && job.Company_Address__c.toLowerCase().includes(locationInput);

    // Return true if job title/company matches and location matches (or if no location is provided)
    return jobTitleMatch && (!locationInput || locationMatch);
  });

  // Reset to the first page after filtering
  currentPage = 1;
  Populatedata(currentPage);
}

