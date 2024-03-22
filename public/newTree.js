function showInputs() {
    var inputs = document.getElementById("inputs");
    if (document.getElementById("private").checked) {
        inputs.style.display = "block";
    } else {
        inputs.style.display = "none";
    }
}
function hideInputs() {
    var inputs = document.getElementById("inputs");
    if (document.getElementById("public").checked) {
        inputs.style.display = "none";
    } else {
        inputs.style.display = "block";
    }
}


document.getElementById('newTreeForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the form from being submitted normally

    const inputPrivacy = document.querySelector('input[name="privacy"]:checked').value;
    const inputPrivateName = document.getElementById('privateTreeName').value;
    const inputPass = document.getElementById('privateTreePass').value;
    const inputName = document.getElementById('newTreeName').value;
    const inputDate = document.getElementById('newTreedateOfBirth').value;
    const inputPlace = document.getElementById('newTreeplace').value;
    const inputStatus = document.querySelector('input[name="status"]:checked') ? document.querySelector('input[name="status"]:checked').value : '';
    const inputClass = document.querySelector('input[name="gender"]:checked') ? document.querySelector('input[name="gender"]:checked').value : '';
    const profilePicture = document.getElementById('profilePicture').files[0] ? document.getElementById('profilePicture').files[0]: 'no_pic';


    let formData = new FormData();

    // Append all the form data
    formData.append('privacy', inputPrivacy);
    formData.append('treeName', inputPrivateName);
    formData.append('passphrase', inputPass);
    formData.append('relation', JSON.stringify({name: inputName, class: inputClass, extra: {dateOfBirth: inputDate, place: inputPlace, status: inputStatus}}));
    formData.append('profilePicture', profilePicture); // Append the file
    console.log(inputName);
    fetch("/addNewTree", {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        document.getElementById('successMessage').style.display = 'flex';
                document.getElementById('newTreeForm').reset();

                setTimeout(function() {
                    document.getElementById('successMessage').style.display = 'none';
                }, 3000);
                if(inputPrivacy=="public"){
                    console.log("here");
                    window.location.href = `/treePage?tree=${inputName}_data.json&folder=${inputPrivacy}`;
                }
                if(inputPrivacy=="private"){
                    console.log("here");
                    window.location.href = `/treePage?tree=${inputPrivateName}_data.json&folder=${inputPrivacy}`;
                }
       
})
    .catch((error) => console.error('Error:', error));
});