// Dashboard handler for logged in renter users to create, update, and delete posts

// Function to handle the new post form
const newFormHandler = async (event) => {
    event.preventDefault();

    const name = document.querySelector('#post-title').value.trim();
    const address1 = document.querySelector('#post-content').value.trim();

    if (name && address1) {
        const response = await fetch(`/api/properties`, {
            method: 'POST',
            body: JSON.stringify({ name, address1 }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert('Failed to publish property');
        }
    }
};

// This function is used to take the user to the edit page for a property
const editButtonHandler = async (event) => {
    if (event.target.classList.contains('btn-edit')) {
        const id = event.target.getAttribute('data-id');

        const response = await fetch(`/api/properties/${id}`, {
            method: 'GET',
        });

        if (response.ok) {
            document.location.replace('/properties/edit');
        } else {
            console.log('Failed to get properties');
        }
    }
};

// Function to handle the delete property button
const delButtonHandler = async (event) => {
    if (event.target.hasAttribute('data-id')) {
        const id = event.target.getAttribute('data-id');

        const response = await fetch(`/api/properties/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert('Failed to delete property');
        }
    }
};

document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);

// Attach event listener to delete button on the post page
document.querySelectorAll('.btn-delete').forEach((button) => {
    button.addEventListener('click', delButtonHandler);
});

// Attach event listner to edit button on the post page
document.querySelectorAll('.btn-edit').forEach((button) => {
    button.addEventListener('click', editButtonHandler);
});
