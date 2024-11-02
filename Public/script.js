window.onload = function() {
    fetch('/api/getjson')
        .then(response => response.json())
        .then(data => {
          if(data === ""){
              window.location.href = "signin.html";
          }else{
              console.log(data);
            console.log(data.CandidateId);
            if(data.CandidateId != null){
                document.getElementById('GetStarted').style.display = 'none';
                document.getElementById('viewJobs').style.display = 'inline';
            }
          }
            
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
      fetch('/api/CreateCandidate',{
          method: 'Post',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(data =>{
         window.location.href='Home.html';
      });
     // window.location.href='Home.html';
  });