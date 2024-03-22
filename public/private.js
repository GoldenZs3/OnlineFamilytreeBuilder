document.getElementById('accessTreeForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the form from being submitted normally
    
    const inputPrivateName = document.getElementById('privateTreeName').value;
    const inputPass = document.getElementById('privateTreePass').value;
    const treeName = document.getElementById('privateTreeName').value
    
    fetch("/accessTree", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({treeName: document.getElementById('privateTreeName').value, passphrase: document.getElementById('privateTreePass').value}),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        window.location.href = `/treePage?tree=${treeName}_data.json&folder=private`;
    })
    .catch((error) => console.error('Error:', error));
    });