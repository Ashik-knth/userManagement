  
      console.log('Admin js called');
            
        
            const editform = document.getElementById('editform');

            editform.addEventListener('submit', function (event) {
                event.preventDefault(); 
                const isValid = validateForms();
                if (isValid) {
                    form.submit(); 
                }
            });
            

        function validateForms() {
            console.log('edited form called');
            
    
    const username1 = document.getElementById('usernames').value.trim();
    const email1 = document.getElementById('emails').value.trim();
    
    if (!username1 || !email1 ) {
        alert("fields are required.");
        return false;
    }
   
    
    console.log('Validation successful');
     
    return true;
} 


const form = document.getElementById('createform');
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


function deleteUser(id) {
    console.log('deleteUser called', id);
    Swal.fire({
        title: 'Are you sure?',
        text: 'You won’t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/admin/delete-user/${id}`, {
                method: 'DELETE'
            }).then(response => {
                if (response.ok) {
                    Swal.fire(
                        'Deleted!',
                        'The user has been deleted.',
                        'success'
                    ).then(() => {
                        window.location.reload();
                    });
                } else {
                    Swal.fire(
                        'Failed!',
                        'Failed to delete the user.',
                        'error'
                    );
                }
            }).catch(error => {
                Swal.fire(
                    'Error!',
                    'An error occurred. Please try again later.',
                    'error'
                );
                console.error('Error:', error);
            });
        }
    });
}



function editUser(){
    console.log('editUser called');
    
    const username=document.getElementById('editUsername').value.trim()
    const email=document.getElementById('editEmail').value.trim()
    const userid=document.getElementById('editUserId').value
     
    if (username === "" || email === "") {
        Swal.fire({
            icon: 'error',
            title: 'All fields are required',
            text: 'Please fill in all the required fields.',
            showConfirmButton: true, // Keeps the popup until the user clicks
            timer: null // Prevents automatic dismissal
        });
        return false;
    }
    
    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid email address',
            text: 'Please enter a valid email address.',
            showConfirmButton: true,
            timer: null
        });
        return false;
    }
    
    // Continue with fetch logic...
    

    fetch('/admin/edit-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, userid })
    })
    .then(response => {
        console.log(response);
        
        if (response.ok) {
            return response.json();
        } else {
            return response.json().then(errorData => {
                throw new Error(errorData.message || 'Failed to edit user');
            });
        }
    })
    .then(data => {
        swal.fire({
            icon: 'success',
            title: 'User updated successfully',
            text: 'The user has been updated successfully.',
        }).then(() => {
            window.location.reload();
        });
    })
    .catch(error => {
        swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'An unexpected error occurred.',
        });
    });
      
}



 