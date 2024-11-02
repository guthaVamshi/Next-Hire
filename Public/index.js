const express = require("express");
require("dotenv").config();
const axios = require("axios");
const jsforce = require("jsforce");
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(express.json({ limit: '50mb' }));   // Adjust this as per your requirement
app.use(express.urlencoded({ limit: '50mb', extended: true }));
const port = process.env.PORT || 3001;
const { SF_LOGINURL, SF_USERNAME, SF_PASSWORD, SF_TOKEN } = process.env;
let accessToken = "";
let RecordId ="";
let instanceUrl = "";
let LoginId = "";
var LoginJosndata = "";
var JobDetails = "";
var CandidateId="";
const conn = new jsforce.Connection({
  loginUrl: SF_LOGINURL,
});

conn.login(SF_USERNAME, SF_PASSWORD + SF_TOKEN, (err, UserInfo) => {
  if (err) {
    console.error("Salesforce login error:", err);
    return;
  }
  console.log("Salesforce User ID:", UserInfo.id);
  accessToken = conn.accessToken;
  instanceUrl = conn.instanceUrl;
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.post("/api/Signup", (req, res) => {
  const Username = req.body.username; 
  const password = req.body.password;
  const phone = req.body.phone;
  const email = req.body.email;

  axios({
    method: "post", 
    url: `${instanceUrl}/services/apexrest/SignupUser/`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    data: {
      Username: Username,
      Password: password,
      Phone: phone,
      Email: email,
    },
  })
    .then((response) => {
      console.log("Response:", response.data);
      if (response.data == "Account Created") {
        res.redirect("/login.html");
      } else {
        res.redirect("/Signup.html");
      }
    })
    .catch((error) => {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    });
});
app.post("/api/CreateCandidate", (req, res) => {
  const firstName = req.body.Firstname;
  const lastName = req.body.Lastname;
  const phone = req.body.Phone;
  const email = req.body.Email;
  const currentEmployer = req.body.CurrentEmployer;
  const currentlyEmployed = req.body.CurrentlyEmployed ? true : false;
  const usCitizen = req.body.USCitizen ? true : false;
  const sponsorshipNeeded = req.body.SponsorshipNeeded ? true : false;

  axios({
    method: "post",
    url: `${instanceUrl}/services/apexrest/CreateCandidate/`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    data: {
      phone: phone,
      email: email,
      firstName: firstName,
      lastName: lastName,
      currentEmployer: currentEmployer,
      currentlyEmployed: currentlyEmployed,
      usCitizen: usCitizen,
      sponsorshipNeeded: sponsorshipNeeded,
      UserId: LoginId,
    },
  })
    .then((response) => {
      console.log("Response:", response.data);
      const data = JSON.parse(response.data);
      LoginJosndata = JSON.parse(response.data);
      CandidateId = data.CandidateId;
      console.log(data);
      LoginId = data.Id;
      console.log(LoginId);
      res.json(data);
    })
    .catch((error) => {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    });
});
app.use(express.urlencoded({ extended: true }));
app.post("/api/Login", (req, res) => {
  
  const Username = req.body.Username;
  console.log(Username);
  const Password = req.body.Password;
  axios({
    method: "get",
    url: `${instanceUrl}/services/apexrest/Auth/?Username=${Username}&Password=${Password}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      const data = JSON.parse(response.data);
      LoginJosndata = JSON.parse(response.data);
      console.log(data);
      LoginId = data.Id;
      console.log(LoginId);
      CandidateId = data.CandidateId;
      res.json(data);
    })
    .catch((error) => {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    });
});
app.get("/api/getjson", (req, res) => {
  console.log("Got hit");
  res.json(LoginJosndata);
});
app.get("/api/getjobdetails", (req, res) => {
  console.log("Got hit jobdetails");
  res.json(JobDetails);
});
app.get("/api/getJobs", (req, res) => {
  console.log("Got Hit get jobs");
  axios({
    method: "get",
    url: `${instanceUrl}/services/apexrest/getJobs/`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      console.log("get jobs");
      console.log("Response:", response.data);
      res.json(response.data);
    })
    .catch((error) => {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    });
});
app.post("/api/getJobDetails",(req,res)=>{
  const {data} = req.body;
  console.log(data);
  axios({
    method:"Post",
    url:`${instanceUrl}/services/apexrest/getJobDetails/`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    data:{
      Jobid: data
    }
  })
  .then((response) => {
    JobDetails = response.data;
    console.log(JobDetails);
    res.json(JobDetails);
  })
  .catch((error) => {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  });
});
app.post("/api/AppliedJobs",(req,res)=>{
  console.log('test');
  axios({
    method:"Post",
    url:`${instanceUrl}/services/apexrest/AppliedJobs`,
    headers:{
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    data:{
      candidateId:CandidateId
    }
})
    .then((response) =>{
      AppliedJobDetails = response.data;
     console.log(AppliedJobDetails);
     res.json(AppliedJobDetails);
    });
  });
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.post('/upload', upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'coverLetter', maxCount: 1 }
]), (req, res) => {
  const files = req.files;
  const jobId = req.body.JobId;
  const answers = JSON.parse(req.body.answers); // Parse answers from the frontend

  if (!files || !files.resume || !files.coverLetter) {
    return res.status(400).json({ success: false, message: 'Missing files.' });
  }

  // SOQL query to check if the candidate already applied
  const soql = `SELECT Id, Candidate__c FROM Job_Application__c WHERE Candidate__c = '${CandidateId}' AND Position__c = '${jobId}'`;

  conn.query(soql, (err, result) => {
    if (err) {
      return console.error('Error running SOQL query:', err);
    } else if (result.records.length >= 1) {
      return res.status(400).json({ success: false, message: 'Already applied.' });
    } else {
      // Create the Job Application and include the answers
      let jobApplicationData = {
        Candidate__c: CandidateId,
        Position__c: jobId
      };

      // Dynamically map answers to the corresponding fields in Salesforce
      Object.keys(answers).forEach(questionKey => {
        const answerField = questionKey.replace('Question', 'Question').replace('__c', '_Answer__c');
        jobApplicationData[answerField] = answers[questionKey]; // Map to Question_1_Answer__c, Question_2_Answer__c, etc.
      });

      // Create the job application in Salesforce
      conn.sobject('Job_Application__c').create(jobApplicationData, (err, record) => {
        if (err) {
          console.error('Error creating Job Application:', err);
          return res.status(500).json({
            success: false,
            message: 'Error creating Job Application',
            details: err
          });
        }

        if (!record.success) {
          console.error('Salesforce returned unsuccessful status:', record);
          return res.status(500).json({ success: false, message: 'Failed to create Job Application.', details: record });
        }

        const RecordId = record.id;

        // Function to upload files to Salesforce and delete temp files
        const uploadFile = (file) => {
          return new Promise((resolve, reject) => {
            const filePath = path.join(__dirname, file.path);
            const fileName = file.originalname;

            uploadFileToSalesforce(filePath, fileName, RecordId)
              .then((result) => {
                // Delete temporary file
                fs.unlink(filePath, (err) => {
                  if (err) console.error('Failed to delete temp file:', err);
                });
                resolve(result);
              })
              .catch((err) => {
                reject(err);
              });
          });
        };

        // Upload the files (resume and cover letter)
        const uploadPromises = [
          uploadFile(files.resume[0]),
          uploadFile(files.coverLetter[0])
        ];

        // Wait for both files to be uploaded
        Promise.all(uploadPromises)
          .then((results) => {
            res.json({ success: true, message: 'Files and answers uploaded successfully.', results });
          })
          .catch((err) => {
            res.status(500).json({ success: false, message: err.message });
          });
      });
    }
  });
});



function uploadFileToSalesforce(filePath, fileName, RecordId) {
  return new Promise((resolve, reject) => {
    const conn = new jsforce.Connection({ loginUrl: SF_LOGINURL });

    conn.login(SF_USERNAME, SF_PASSWORD + SF_TOKEN, (err, UserInfo) => {
      if (err) {
        return reject(new Error('Salesforce login error: ' + err.message));
      }

      const fileData = fs.readFileSync(filePath, 'base64');

      conn.sobject("ContentVersion").create({
        Title: fileName,
        PathOnClient: fileName,
        VersionData: fileData, 
        FirstPublishLocationId: RecordId 
      }, (err, res) => {
        if (err || !res.success) {
          return reject(new Error('Error uploading file: ' + err.message));
        }
        resolve('File uploaded successfully: ' + res.id);
      });
    });
  });
}
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

