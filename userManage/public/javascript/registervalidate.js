
const form = document.getElementById('myform');
document.addEventListener('DOMContentLoaded', function() {
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const isValid = validateForm();
        if(isValid){
            form.submit();
        }
    })
})      



function validateForm() {
    console.log('validateForm called');

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim()
    const confirmPassword = document.getElementById('confirm_password').value.trim();


    if (username === "" || email === "" || password === "" || confirmPassword === "") {
        alert(" fields are required");
        return false;
    } else if (password.length < 8) { 
        alert("Password must be at least 8 characters long");
        return false;
    } else if (password !== confirmPassword) {
        alert("Passwords do not match");
        return false;
    }
    console.log('Validation successful');
    return true;
    
}