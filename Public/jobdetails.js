const Job ='';
document.addEventListener("DOMContentLoaded", function() {
    window.onload = function() {
        fetch('/api/getJobDetails')
            .then(response => response.json())
            .then(jobData => {
                 job = jobData[0];
                
                document.querySelector(".company-logo").innerHTML = `
               <img src="${job.Company_Image__c}" alt="Company Logo">
                `
            
                // Set job title
                document.querySelector(".job-header h1").textContent = job.Name;
            
                // Set location
                document.querySelector(".location").textContent = job.Location__c;
            
                // Set job status
                document.querySelector(".status").textContent = `Status: ${job.Status__c}`;
                
                document.querySelector(".Job-Description").textContent = job.Job_Description__c;
               
                document.querySelector(".job-specificSkills").textContent = job.Skills_Required__c;
                let SKR = job.Skills_Required__c;
                // Populate job information
                document.querySelector(".job-info").innerHTML = `
                    <h5 ><strong id="TotalApplicant">${job.Total_No_of_Job_Application__c || '0'} Potential applicants</strong></h5>
                    <p><strong>Salary Range:</strong> $${job.Min_pay__c} - $${job.Max_Pay__c}</p>
                    <p><strong>Location:</strong> ${job.Company_Address__c}</p>
                    <p><strong>Travel Required:</strong> ${job.Travel_Required__c ? 'Yes' : 'No'}</p>
                    <p><strong>Severity:</strong> ${job.Severity__c}</p>
                `;
            
                // Populate required skills
                const requiredSkills = [];
                if (job.Apex__c) requiredSkills.push('Apex');
                if (job.C_Sharp__c) requiredSkills.push('C#');
                if (job.Java__c) requiredSkills.push('Java');
                if (job.JavaScript__c) requiredSkills.push('JavaScript');
                document.querySelector(".required-skills").innerHTML = requiredSkills.length > 0 ? requiredSkills.map(skill => `<li>${skill}</li>`).join('') : `<li>None</li>`;
                const skills = SKR.split(',');

                // Display the skills in the required format (comma-separated list in <li> elements)
                document.querySelector(".job-specificSkills").innerHTML = skills.length > 0 
                    ? skills.map(skill => `<li>${skill}</li>`).join('') 
                    : `<li>None</li>`;
                // Populate optional skills
                const optionalSkills = [];
                if (job.Excel__c) optionalSkills.push('Excel');
                if (job.Power_Point__c) optionalSkills.push('PowerPoint');
                if (job.Team_Building__c) optionalSkills.push('Team Building');
                document.querySelector(".optional-skills").innerHTML = optionalSkills.length > 0 ? optionalSkills.map(skill => `<li>${skill}</li>`).join('') : `<li>None</li>`;
               


                function renderQuestions(job) {
                  // Accessing the first job (assuming single job object in array)
                  const formContainer = document.getElementById("questionForm");
      
                  // Loop through each key in the response and detect question fields
                  let questionIndex = 1;
                  for (const key in job) {
                      if (job.hasOwnProperty(key) && key.startsWith('Question_')) {
                          // Create a label element for the question
                          const label = document.createElement("label");
                          label.setAttribute("for", key);
                          label.textContent = `${questionIndex}: ${job[key]}`;
      
                          // Create an input element for the answer
                          const input = document.createElement("input");
                          input.setAttribute("type", "text");
                          input.setAttribute("id", key);
                          input.setAttribute("name", key);
                          input.setAttribute("placeholder", "Enter your answer");
      
                          // Add label and input to the form container
                          formContainer.appendChild(label);
                          formContainer.appendChild(input);
                          formContainer.appendChild(document.createElement("br")); // Line break for spacing
      
                          questionIndex++;  // Increment the question count
                      }
                  }
              }
      
              // Call the function with the API response
              renderQuestions(job);
            });
      };
    });
    document.getElementById('uploadForm').addEventListener('submit', function(e) {
      e.preventDefault();

      const fileInput = document.getElementById('fileInput');
      const coverInput = document.getElementById('coverLetter');
      const file = fileInput.files[0]; 
      const coverl = coverInput.files[0];
      const jobId = job.Id;
  
      // Check if files are selected
      if (!file || !coverl) {
        document.getElementsByClassName('error').innerHTML += '<p> Please select Both files';
        alert("Please select both files.");
        return;
      }
  
      // Create FormData to send with file uploads
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('coverLetter', coverl);
      formData.append('JobId', jobId);
  
      // Dynamically fetch all available answers from the input fields
      const answers = {};  // Object to store answers dynamically
      let questionIndex = 1;
      
      while (document.getElementById(`Question_${questionIndex}__c`)) {
        const inputField = document.getElementById(`Question_${questionIndex}__c`);
        const answer = inputField.value;
  
        if (answer) {
          answers[`Question_${questionIndex}__c`] = answer;
        }
  
        questionIndex++;  // Move to the next question
      }
  
      // Convert answers object to JSON string and append it to formData
      formData.append('answers', JSON.stringify(answers));
  
      // Send the data using fetch API
      fetch('/upload', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
        //  alert('File and answers uploaded successfully: ' + data.message);
        document.getElementById('RecordIdOfApplication').innerHTML += data.jobApplicationId;
        $('#successApplicationModal').modal('show');
        } else {
          alert('Error uploading file or answers: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error uploading file or answers:', error);
      });
  });
  // Get input elements
  const inputElements = ['fileInput', 'coverLetter'].map((inputId) => document.getElementById(inputId));

  // Add click event listeners to wrappers
  inputElements.forEach((inputElement) => {
    const wrapper = inputElement.parentElement;
  
    // Click to trigger file input (directly on input)
    inputElement.addEventListener('click', () => {
      // No need to check target here, input is already clicked
    });
  
    // Drag-and-drop functionality
    wrapper.addEventListener('dragover', (e) => {
      e.preventDefault();
      wrapper.classList.add('dragging');
    });
  
    wrapper.addEventListener('dragleave', () => {
      wrapper.classList.remove('dragging');
    });
  
    wrapper.addEventListener('drop', (e) => {
      e.preventDefault();
      wrapper.classList.remove('dragging');
      inputElement.files = e.dataTransfer.files;
  
      const fileName = e.dataTransfer.files[0]?.name || `Upload ${inputId === 'fileInput' ? 'Resume' : 'Cover Letter'}`;
      wrapper.querySelector('.file-label-text').textContent = fileName;
    });
  });
  
  // Update file label when file is selected via click
  inputElements.forEach((inputElement) => {
    inputElement.addEventListener('change', function(event) {
      const wrapper = event.target.parentElement; // Access wrapper within the event listener
      const fileName = this.files[0]?.name || `Upload ${inputId === 'fileInput' ? 'Resume' : 'Cover Letter'}`;
      wrapper.querySelector('.file-label-text').textContent = fileName;
    });
  });