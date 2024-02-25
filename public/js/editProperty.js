// this handles the form submission for updating an address, lease, and review on an /edit page

document.addEventListener('DOMContentLoaded', (event) => {
    const saveBtn = document.querySelector('.save-property-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', editFormHandler);
    }
});

const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
};

const editFormHandler = async (event) => {
    event.preventDefault();

    // Ids stored as hidden input fields
    const propertyId = document.querySelector('#property-id').value.trim();
    const leaseId = document.querySelector('#lease-id').value.trim();
    const reviewId = document.querySelector('#review-id').value.trim();

    const formData = {
        addressName: document.querySelector('#address-name').value.trim(),
        addressLine1: document.querySelector('#address-line1').value.trim(),
        addressLine2: document.querySelector('#address-line2').value.trim(),
        addressCity: document.querySelector('#address-city').value.trim(),
        addressState: document.querySelector('#address-state').value.trim(),
        addressZip: document.querySelector('#address-zip').value.trim(),
        addressRent: document.querySelector('#address-rent-amount').value.trim(),
        addressBedrooms: document.querySelector('#address-bedrooms').value.trim(),
        addressSquareFootage: document.querySelector('#address-square-footage').value.trim(),
        addressRating: document.querySelector('#address-rating').value.trim(),
        addressReview: document.querySelector('#address-review').value.trim(),
    };

    const addressMoveIn = formatDateForInput(document.querySelector('#address-move-in').value);
    const addressMoveOut = formatDateForInput(document.querySelector('#address-move-out').value);

    console.log('propertyId:', propertyId);
    console.log('leaseId:', leaseId);
    console.log('reviewId:', reviewId);

    // Update Property
    let response = await fetch(`/api/properties/update/${propertyId}`, {
        method: 'PUT',
        body: JSON.stringify({
            name: formData.addressName,
            address1: formData.addressLine1,
            address2: formData.addressLine2,
            city: formData.addressCity,
            state: formData.addressState,
            zip: formData.addressZip,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        console.error('Failed to update property');
        return;
    }

    // Update Lease if leaseId is provided

    const formattedMoveIn = addressMoveIn === '' ? null : addressMoveIn;
    const formattedMoveOut = addressMoveOut === '' ? null : addressMoveOut;
    if (leaseId) {
        response = await fetch(`/api/leases/update/${leaseId}`, {
            method: 'PUT',
            body: JSON.stringify({
                start_date: formattedMoveIn,
                end_date: formattedMoveOut,
                rent_amount: formData.addressRent,
                rent_bedrooms: formData.addressBedrooms,
                square_footage: formData.addressSquareFootage,
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            console.error('Failed to update lease');
            return;
        }
    }

    // Update Review if reviewId is provided
    if (reviewId) {
        response = await fetch(`/api/reviews/update/${reviewId}`, {
            method: 'PUT',
            body: JSON.stringify({
                rating: formData.addressRating,
                content: formData.addressReview,
                property_id: propertyId,
                reviewee_type: 'property',
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            console.error('Failed to update review');
            return;
        }
    }

    document.location.replace('/dashboard');
};
