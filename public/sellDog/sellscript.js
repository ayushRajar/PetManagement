// /public/js/purchase.js

document.addEventListener('DOMContentLoaded', () => {
    const dogList = document.getElementById('dogList');
    const purchaseDetails = document.getElementById('purchaseDetails');
    const purchaseForm = document.getElementById('purchaseForm');
    const purchaseMessage = document.getElementById('purchaseMessage');

    // Function to fetch and display dogs
    const displayDogs = async () => {
        try {
            const response = await fetch('http://localhost:3000/get-dogs');
            if (!response.ok) throw new Error('Network response was not ok');
            const dogs = await response.json();
            if (dogs.length === 0) {
                dogList.innerHTML = '<p>No dogs available for purchase.</p>';
            } else{
                dogList.innerHTML = dogs.map(dog => `
                    <div class="dog-item">
                        <p><strong>Name:</strong> ${dog.name}</p>
                        <p><strong>Breed:</strong> ${dog.breed}</p>
                        <p><strong>Age:</strong> ${dog.age} years</p>
                        <p><strong>Color:</strong> ${dog.color}</p>
                        <p><strong>Price:</strong> $${dog.price}</p>
                        <button onclick="selectDog('${dog._id}', '${dog.name}', ${dog.price})">Purchase</button>
                    </div>
                `).join('');
            }
        } catch (error) {
            dogList.innerHTML = `<p>Error fetching dog details: ${error.message}</p>`;
        }
    };

    // Function to handle dog selection
    window.selectDog = (dogId, dogName, dogPrice) => {
        document.getElementById('selectedDogId').value = dogId;
        document.getElementById('purchasePrice').value = `$${dogPrice}`;
        purchaseDetails.style.display = 'block';
    };

    // Handle form submission
    purchaseForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const dogId = document.getElementById('selectedDogId').value;
        const buyerName = document.getElementById('buyerName').value;
        const buyerEmail = document.getElementById('buyerEmail').value;
        const purchasePrice = document.getElementById('purchasePrice').value;

        if (!dogId || !buyerName || !buyerEmail) {
            purchaseMessage.textContent = 'Please fill out all fields.';
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/purchase-dog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ dogId, buyerName, buyerEmail, purchasePrice })
            });

            const data = await response.json();
            if (data.success) {
                purchaseMessage.textContent = 'Purchase successful!';
                purchaseDetails.style.display = 'none';
                // Optionally refresh the dog list
                //displayDogs();
                location.href='../paymentGateway/payment.html'
            } else {
                purchaseMessage.textContent = `Error: ${data.error}`;
            }
        } catch (error) {
            purchaseMessage.textContent = `Error submitting form: ${error.message}`;
        }
    });

    // Fetch and display dogs on page load
    displayDogs();
});
