// /public/js/purchase.js

document.addEventListener('DOMContentLoaded', () => {
    const catList = document.getElementById('catList');
    const purchaseDetails = document.getElementById('purchaseDetails');
    const purchaseForm = document.getElementById('purchaseForm');
    const purchaseMessage = document.getElementById('purchaseMessage');

    // Function to fetch and display cats
    const displayCats = async () => {
        try {
            const response = await fetch('http://localhost:3000/get-cats');
            if (!response.ok) throw new Error('Network response was not ok');
            const cats = await response.json();
            if (cats.length === 0) {
                catList.innerHTML = '<p>No cats available for purchase.</p>';
            } else{
                catList.innerHTML = cats.map(cat => `
                    <div class="cat-item">
                        <p><strong>Name:</strong> ${cat.name}</p>
                        <p><strong>Breed:</strong> ${cat.breed}</p>
                        <p><strong>Age:</strong> ${cat.age} years</p>
                        <p><strong>Color:</strong> ${cat.color}</p>
                        <p><strong>Price:</strong> $${cat.price}</p>
                        <button onclick="selectDog('${cat._id}', '${cat.name}', ${cat.price})">Purchase</button>
                    </div>
                `).join('');
            }
        } catch (error) {
            catList.innerHTML = `<p>Error fetching cat details: ${error.message}</p>`;
        }
    };

    // Function to handle cat selection
    window.selectDog = (catId, catName, catPrice) => {
        document.getElementById('selectedCatId').value = catId;
        document.getElementById('purchasePrice').value = `$${catPrice}`;
        purchaseDetails.style.display = 'block';
    };

    // Handle form submission
    purchaseForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const catId = document.getElementById('selectedCatId').value;
        const buyerName = document.getElementById('buyerName').value;
        const buyerEmail = document.getElementById('buyerEmail').value;
        const purchasePrice = document.getElementById('purchasePrice').value;

        if (!catId || !buyerName || !buyerEmail) {
            purchaseMessage.textContent = 'Please fill out all fields.';
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/purchase-cat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ catId, buyerName, buyerEmail, purchasePrice })
            });

            const data = await response.json();
            if (data.success) {
                purchaseMessage.textContent = 'Purchase successful!';
                purchaseDetails.style.display = 'none';
                // Optionally refresh the dog list
                //displayCats();
                location.href='../paymentGateway/payment.html'
            } else {
                purchaseMessage.textContent = `Error: ${data.error}`;
            }
        } catch (error) {
            purchaseMessage.textContent = `Error submitting form: ${error.message}`;
        }
    });

    // Fetch and display Cats on page load
    displayCats();
});
