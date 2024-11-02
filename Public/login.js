const submitButton = document.getElementById('SubmitButton');
submitButton.addEventListener('click',function(){
    const Username = document.getElementById('signInEmail').value;
    const Password = document.getElementById('signInPassword').value;
    console.log(Username,Password);
    const logindata = {
        Username:Username,
        Password:Password
    }
    fetch('/api/Login', {
        method: 'Post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(logindata)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Success:', result);
        if(result.ResString == 'Auth Success'){
            window.location.href = 'Home.html';
        }else{
            document.getElementById('error').innerHTML = 'username/password incorrect';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
    
});
