document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('dogForm');
    const dogDetails = document.getElementById('dogDetails');

    // Function to fetch and display dog details
    const displayDogs = async () => {
        try {
            const response = await fetch('http://localhost:3000/get-dogs');
            const dogs = await response.json();
            dogDetails.innerHTML = dogs.map(dog => `
                <div class="dog">
                    <p><strong>Name:</strong> ${dog.name}</p>
                    <p><strong>Breed:</strong> ${dog.breed}</p>
                    <p><strong>Age:</strong> ${dog.age} years</p>
                    <p><strong>Color:</strong> ${dog.color}</p>
                    <P>-----------------------------------------------<P>
                </div>
            `).join('');
        } catch (error) {
            dogDetails.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    };

    // Fetch and display dogs on page load
    displayDogs();

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Get form values
        const name = document.getElementById('dogName').value;
        const breed = document.getElementById('dogBreed').value;
        const age = document.getElementById('dogAge').value;
        const color = document.getElementById('dogColor').value;
        const price = document.getElementById('price').value;

        // Send form data to server
        try {
            const response = await fetch('http://localhost:3000/submit-dog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, breed, age, color , price })
            });

            const data = await response.json();
            if (data.success) {
                // Display dog details
                dogDetails.innerHTML = `
                    <div class="dog">
                        <p><strong>Name:</strong> ${data.dog.name}</p>
                        <p><strong>Breed:</strong> ${data.dog.breed}</p>
                        <p><strong>Age:</strong> ${data.dog.age} years</p>
                        <p><strong>Color:</strong> ${data.dog.color}</p>
                    </div>
                `;
                
                // Optionally clear the form
                form.reset();
                
                // Refresh the list of dogs
                displayDogs();
            } else {
                dogDetails.innerHTML = `<p>Error: ${data.error}</p>`;
            }
        } catch (error) {
            dogDetails.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    });
});
