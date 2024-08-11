document.addEventListener('DOMContentLoaded', () => {
    const catList = document.getElementById('catList');
    const updateForm = document.getElementById('updateForm');
    const updateCatForm = document.getElementById('updateCatForm');
    const updateCatId = document.getElementById('updateCatId');
    const updateCatName = document.getElementById('updateCatName');
    const updateCatBreed = document.getElementById('updateCatBreed');
    const updateCatAge = document.getElementById('updateCatAge');
    const updateCatColor = document.getElementById('updateCatColor');
    const updateCatPrice = document.getElementById('updateCatPrice');

    // Function to fetch and display cats
    const displayCats = async () => {
        try {
            const response = await fetch('http://localhost:3000/get-cats');
            if (!response.ok) throw new Error('Network response was not ok');
            const cats = await response.json();
            catList.innerHTML = cats.map(cat => `
                <div class="cat-item">
                    <p><strong>Name:</strong> ${cat.name}</p>
                    <p><strong>Breed:</strong> ${cat.breed}</p>
                    <p><strong>Age:</strong> ${cat.age} years</p>
                    <p><strong>Color:</strong> ${cat.color}</p>
                    <p><strong>Price:</strong> $${cat.price}</p>
                    <button onclick="editCat('${cat._id}', '${cat.name}', '${cat.breed}', ${cat.age}, '${cat.color}', ${cat.price})">Edit</button>
                    <button onclick="deleteCat('${cat._id}')">Delete</button>
                </div>
            `).join('');
        } catch (error) {
            catList.innerHTML = `<p>Error fetching cat details: ${error.message}</p>`;
        }
    };

    // Function to handle cat editing
    window.editCat = (id, name, breed, age, color, price) => {
        updateCatId.value = id;
        updateCatName.value = name;
        updateCatBreed.value = breed;
        updateCatAge.value = age;
        updateCatColor.value = color;
        updateCatPrice.value = price;
        updateForm.style.display = 'block';
    };

    // Handle update form submission
    updateCatForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const id = updateCatId.value;
        const name = updateCatName.value.trim();
        const breed = updateCatBreed.value.trim();
        const age = parseInt(updateCatAge.value);
        const color = updateCatColor.value.trim();
        const price = parseFloat(updateCatPrice.value);

        if (!id || !name || !breed || isNaN(age) || !color || isNaN(price)) {
            alert('Please fill out all fields correctly.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/update-cat/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, breed, age, color, price })
            });

            const data = await response.json();
            if (data.success) {
                alert('Cat updated successfully!');
                updateForm.style.display = 'none';
                displayCats(); // Refresh the list of dogs
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            alert(`Error updating Cat: ${error.message}`);
        }
    });

    // Function to handle cat deletion
    window.deleteCat = async (id) => {
        if (confirm('Are you sure you want to delete this cat?')) {
            try {
                const response = await fetch(`http://localhost:3000/delete-cat/${id}`, {
                    method: 'DELETE'
                });

                const data = await response.json();
                if (data.success) {
                    alert('Cat deleted successfully!');
                    displayCats(); // Refresh the list of cats
                } else {
                    alert(`Error: ${data.error}`);
                }
            } catch (error) {
                alert(`Error deleting cat: ${error.message}`);
            }
        }
    };

    // Fetch and display dogs on page load
    displayCats();
});
