// /public/js/admin.js

document.addEventListener('DOMContentLoaded', () => {
    const dogList = document.getElementById('dogList');
    const updateForm = document.getElementById('updateForm');
    const updateDogForm = document.getElementById('updateDogForm');
    const updateDogId = document.getElementById('updateDogId');
    const updateDogName = document.getElementById('updateDogName');
    const updateDogBreed = document.getElementById('updateDogBreed');
    const updateDogAge = document.getElementById('updateDogAge');
    const updateDogColor = document.getElementById('updateDogColor');
    const updateDogPrice = document.getElementById('updateDogPrice');

    // Function to fetch and display dogs
    const displayDogs = async () => {
        try {
            const response = await fetch('http://localhost:3000/get-dogs');
            if (!response.ok) throw new Error('Network response was not ok');
            const dogs = await response.json();
            dogList.innerHTML = dogs.map(dog => `
                <div class="dog-item">
                    <p><strong>Name:</strong> ${dog.name}</p>
                    <p><strong>Breed:</strong> ${dog.breed}</p>
                    <p><strong>Age:</strong> ${dog.age} years</p>
                    <p><strong>Color:</strong> ${dog.color}</p>
                    <p><strong>Price:</strong> $${dog.price}</p>
                    <button onclick="editDog('${dog._id}', '${dog.name}', '${dog.breed}', ${dog.age}, '${dog.color}', ${dog.price})">Edit</button>
                    <button onclick="deleteDog('${dog._id}')">Delete</button>
                </div>
            `).join('');
        } catch (error) {
            dogList.innerHTML = `<p>Error fetching dog details: ${error.message}</p>`;
        }
    };

    // Function to handle dog editing
    window.editDog = (id, name, breed, age, color, price) => {
        updateDogId.value = id;
        updateDogName.value = name;
        updateDogBreed.value = breed;
        updateDogAge.value = age;
        updateDogColor.value = color;
        updateDogPrice.value = price;
        updateForm.style.display = 'block';
    };

    // Handle update form submission
    updateDogForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const id = updateDogId.value;
        const name = updateDogName.value.trim();
        const breed = updateDogBreed.value.trim();
        const age = parseInt(updateDogAge.value);
        const color = updateDogColor.value.trim();
        const price = parseFloat(updateDogPrice.value);

        if (!id || !name || !breed || isNaN(age) || !color || isNaN(price)) {
            alert('Please fill out all fields correctly.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/update-dog/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, breed, age, color, price })
            });

            const data = await response.json();
            if (data.success) {
                alert('Dog updated successfully!');
                updateForm.style.display = 'none';
                displayDogs(); // Refresh the list of dogs
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            alert(`Error updating dog: ${error.message}`);
        }
    });

    // Function to handle dog deletion
    window.deleteDog = async (id) => {
        if (confirm('Are you sure you want to delete this dog?')) {
            try {
                const response = await fetch(`http://localhost:3000/delete-dog/${id}`, {
                    method: 'DELETE'
                });

                const data = await response.json();
                if (data.success) {
                    alert('Dog deleted successfully!');
                    displayDogs(); // Refresh the list of dogs
                } else {
                    alert(`Error: ${data.error}`);
                }
            } catch (error) {
                alert(`Error deleting dog: ${error.message}`);
            }
        }
    };

    // Fetch and display dogs on page load
    displayDogs();
});
