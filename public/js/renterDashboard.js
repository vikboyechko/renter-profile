// Dashboard handler for logged in renter users to create, update, and delete addresses and other info

// Function to handle the new address form
const newFormHandler = async (event) => {
    event.preventDefault();

    const addressName = document.querySelector('#address-name').value.trim();
    const addressLine1 = document.querySelector('#address-line1').value.trim();
    const addressLine2 = document.querySelector('#address-line2').value.trim();
    const addressCity = document.querySelector('#address-city').value.trim();
    const addressState = document.querySelector('#address-state').value.trim();
    const addressZip = document.querySelector('#address-zip').value.trim();
    const addressMoveIn = document.querySelector('#address-move-in').value.trim();
    const addressMoveOut = document.querySelector('#address-move-out').value.trim();
    const addressRent = document.querySelector('#address-rent-amount').value.trim();
    const addressBedrooms = document.querySelector('#address-bedrooms').value.trim();
    const addressSquareFootage = document.querySelector('#address-square-footage').value.trim();
    const addressRating = document.querySelector('#address-rating').value.trim();
    const addressReview = document.querySelector('#address-review').value.trim();

    if (addressLine1 && addressCity && addressState && addressZip) {
        let response = await fetch(`/api/properties`, {
            method: 'POST',
            body: JSON.stringify({
                name: addressName,
                address1: addressLine1,
                address2: addressLine2,
                city: addressCity,
                state: addressState,
                zip: addressZip,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.log('Failed to add property');
            return; // Stop the process if can't create property
        }

        const propertyData = await response.json();
        const propertyId = propertyData.id;

        // Now we create the lease with the property ID
        response = await fetch(`/api/leases`, {
            method: 'POST',
            body: JSON.stringify({
                property_id: propertyId,
                start_date: addressMoveIn,
                end_date: addressMoveOut,
                rent_amount: addressRent,
                rent_bedrooms: addressBedrooms,
                square_footage: addressSquareFootage,
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log('Failed to add lease');
            alert(`Failed to add lease: ${errorData.message}`);
            return;
        }

        // finally we create the review with the property ID
        response = await fetch(`/api/reviews`, {
            method: 'POST',
            body: JSON.stringify({
                rating: addressRating,
                content: addressReview,
                property_id: propertyId,
                reviewee_type: 'property',
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            console.log('Failed to add review');
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

// Function to handle the edit profile form
const editProfileHandler = async (event) => {
    event.preventDefault();

    const id = document.querySelector('#profile-edit-form').getAttribute('data-user-id');
    const name = document.querySelector('#newName').value.trim();
    const email = document.querySelector('#newEmail').value.trim();
    const phone = document.querySelector('#newPhone').value.trim();

    if (name && email && phone) {
        const response = await fetch(`/api/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ name, email, phone }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert('Failed to update profile');
        }
    }
};

document.querySelector('.new-address-form').addEventListener('submit', newFormHandler);

// Attach event listener to delete button on the post page
document.querySelectorAll('.btn-delete').forEach((button) => {
    button.addEventListener('click', delButtonHandler);
});

// Attach event listner to edit button on the post page
document.querySelectorAll('.btn-edit').forEach((button) => {
    button.addEventListener('click', editButtonHandler);
});

// Show the form if "Edit Profile" is clicked
document.getElementById('edit-profile-btn').addEventListener('click', function () {
    document.getElementById('edit-profile-form').classList.toggle('d-none');
});

// Hide the form if "Cancel" is clicked
document.getElementById('cancel-edit-btn').addEventListener('click', function () {
    document.getElementById('edit-profile-form').classList.add('d-none');
});

// Attach event listener to edit profile form save
document.querySelector('#profile-edit-form').addEventListener('submit', editProfileHandler);
