const express = require('express');
require('dotenv').config();
const axios = require("axios");
const jsforce = require('jsforce');
const multer = require('multer');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(express.json({ limit: '50mb' }));   
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
var UserEmail = "";
const conn = new jsforce.Connection({
  loginUrl: SF_LOGINURL
})
conn.login(SF_USERNAME, SF_PASSWORD + SF_TOKEN)
  .then(userInfo => {
    console.log("Login successful");
    console.log("Salesforce User ID:", userInfo.id);
    accessToken = conn.accessToken;
    instanceUrl = conn.instanceUrl;
  })
  .catch(err => {
    console.error("Salesforce login error:", err);
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
        res.redirect("/signin.html");
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
app.post("/api/ForgotPasswordOTP", (req, res) => {
  
  UserEmail = req.body.UserEmail;
  axios({
    method: "get",
    url: `${instanceUrl}/services/apexrest/ForgetPassword/?UserEmail=${UserEmail}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      const data = JSON.parse(response.data);
      LoginJosndata = JSON.parse(response.data);
      console.log(data);
      res.json(data);
    })
    .catch((error) => {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    });
});
app.post("/api/UpdatePassword", (req, res) => {
  
  const OTP = req.body.OTP;
  const NewPassword = req.body.NewPassword;
  console.log(OTP,NewPassword,UserEmail);
  axios({
    method: "Post",
    url: `${instanceUrl}/services/apexrest/ForgetPassword/?UserEmail=${UserEmail}&Otp=${OTP}&NewPassword=${NewPassword}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      const data = JSON.parse(response.data);
      LoginJosndata = JSON.parse(response.data);
      console.log(data);
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
app.get("/api/gettopjobs",(req,res)=>{
  axios({
    method: "get",
    url: `${instanceUrl}/services/apexrest/GetTopJobs/`,
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
})
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


const createJobApplication = async (jobApplicationData) => {
  try {
    const record = await conn.sobject('Job_Application__c').create(jobApplicationData);
    if (!record.success) {
      throw new Error(`Failed to create Job Application: ${JSON.stringify(record)}`);
    }
    return record.id;
  } catch (error) {
    console.error('Error creating Job Application:', error);
    throw error;
  }
};

const uploadAndLogFile = async (file, RecordId) => {
  const filePath = path.join(__dirname, file.path);
  const fileName = file.originalname;
  try {
    const result = await uploadFileToSalesforce(filePath, fileName, RecordId);
    console.log(`File upload result for ${fileName}:`, result);
    return result;
  } catch (error) {
    console.error(`Error uploading file ${fileName}:`, error);
    throw error;
  }
};

app.post('/upload', upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'coverLetter', maxCount: 1 }
]), async (req, res) => {
  const files = req.files;
  const tempFilePaths = [];

  try {
    if (!conn.accessToken) {
      return res.status(500).json({ success: false, message: 'Not connected to Salesforce.' });
    }

    console.log('Received files:', files);
    const jobId = req.body.JobId;
    const answers = JSON.parse(req.body.answers);
    console.log('Parsed answers:', answers);

    if (!files || !files.resume || !files.coverLetter) {
      return res.status(400).json({ success: false, message: 'Missing files.' });
    }

    // Store temp file paths for later deletion
    if (files.resume[0]) tempFilePaths.push(files.resume[0].path);
    if (files.coverLetter[0]) tempFilePaths.push(files.coverLetter[0].path);

    // SOQL query to check if the candidate already applied
    const soql = `SELECT Id, Candidate__c FROM Job_Application__c WHERE Candidate__c = '${CandidateId}' AND Position__c = '${jobId}'`;
    const result = await conn.query(soql);
    console.log('SOQL result:', result);

    if (result.records.length >= 1) {
      return res.status(400).json({ success: false, message: 'Already applied.' });
    }

    // Create the Job Application and include the answers
    let jobApplicationData = {
      Candidate__c: CandidateId,
      Position__c: jobId
    };

    Object.keys(answers).forEach(questionKey => {
      const answerField = questionKey.replace('Question', 'Question').replace('__c', '_Answer__c');
      jobApplicationData[answerField] = answers[questionKey];
    });

    // Create Job Application
    const RecordId = await createJobApplication(jobApplicationData);

    // Upload files
    const uploadPromises = [
      uploadAndLogFile(files.resume[0], RecordId),
      uploadAndLogFile(files.coverLetter[0], RecordId)
    ];

    const uploadResults = await Promise.allSettled(uploadPromises);

    const successfulUploads = uploadResults.filter(result => result.status === 'fulfilled');
    const failedUploads = uploadResults.filter(result => result.status === 'rejected');

    if (failedUploads.length > 0) {
      console.warn('Some file uploads failed:', failedUploads);
    }

    res.json({
      success: true,
      message: 'Job application created successfully.',
      jobApplicationId: RecordId,
      uploadResults: {
        successful: successfulUploads.length,
        failed: failedUploads.length
      }
    });

  } catch (error) {
    console.error('Error in upload process:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during the upload process.',
      error: error.message
    });
  } finally {
    // Delete temporary files
    for (const filePath of tempFilePaths) {
      fs.unlink(filePath, (err) => {
        if (err) console.error(`Failed to delete temp file ${filePath}:`, err);
        else console.log(`Successfully deleted temp file ${filePath}`);
      });
    }
  }
});



app.get('/candidate', (req, res) => {
  

  if (!CandidateId) {
    return res.status(400).json({ error: 'CandidateId is required' });
  }

  conn.apex.get(`/services/apexrest/profile?CandidateId=${CandidateId}`)
    .then(result => {
      console.log('Profile:', result);
      res.json(result);
    })
    .catch(err => {
      console.error('Error fetching data from Salesforce:', err);
      res.status(500).json({ error: 'Error fetching data from Salesforce', details: err.message });
    });
});
app.patch('/candidate', (req, res) => {
  // Get CandidateId from URL parameters
  const updateData = req.body; // Get updated data from frontend
  console.log('Update data received:', updateData); // Log the update data

  // Check if updateData is a valid object
  if (typeof updateData !== 'object' || Array.isArray(updateData) || updateData === null) {
    return res.status(400).send('Error: Request body must be a JSON object');
  }

  // Prepare the PATCH request body for Salesforce
  const patchBody = updateData;

  console.log('PATCH body to Salesforce:', patchBody); // Log the body sent to Salesforce

  // Make a PATCH request to Salesforce Apex REST resource
  conn.apex.patch(`/services/apexrest/profile?CandidateId=${CandidateId}`, patchBody, (err, result) => {
      if (err) {
          console.error('Salesforce update error:', err); // Log the error for debugging
          return res.status(500).send('Error updating data in Salesforce: ' + err.message);
      }
        console.log('Successfully updated:', result); // Log successful result
        res.json(result);
      
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
        console.log("success full" + res);
        if (err || !res.success) {
          return reject(new Error('Error uploading file: ' + err.message));
        }
        resolve('File uploaded successfully: ' + res.id);
        res.send({
          "Success":"true"
        });
      });
    });
  });
}
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});