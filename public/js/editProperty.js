// this handles the form submission for updating an address, lease, and review on an /edit page

document.addEventListener('DOMContentLoaded', (event) => {
    const saveBtn = document.querySelector('.save-property-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', editFormHandler);
    }
});

const editFormHandler = async (event) => {
    event.preventDefault();

    const propertyId = document.querySelector('#property-id').value.trim();
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

    console.log('propertyId:', propertyId);
    // Update Property
    try {
        const response = await fetch(`/api/properties/update/${propertyId}`, {
            method: 'PUT',
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

        if (response.ok) {
            // Redirect to the updated post page
            document.location.replace(`/dashboard`);
        } else {
            console.log('Failed to update address');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to update post');
    }
};
