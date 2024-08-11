document.addEventListener("DOMContentLoaded",()=>{
    const form=document.getElementById('catForm');
    const catDetails=document.getElementById('catDetails');

    const displayCats = async () => {
        try{
            const response = await fetch('http://localhost:3000/get-cats');
            const cats=await response.json();
            catDetails.innerHTML = cats.map (cat => `
                <div class="cat">
                <p><strong>Name:</strong> ${cat.name}</p>
                <p><strong>Breed:</strong> ${cat.breed}</p>
                <p><strong>Age:</strong> ${cat.age} years</p>
                <p><strong>Color:</strong> ${cat.color}</p>
                <P>-----------------------------------------------<P>
            </div>
        `).join('');
        }catch(error){
            catDetails.innerHTML = `<p>Error: ${error.message} <p>`;

        }
    };
    displayCats();

    //from submit 
    form.addEventListener('submit', async (event) =>{
        event.preventDefault();

        //fetching the data from the form
        const name = document.getElementById('catName').value;
        const breed = document.getElementById('catBreed').value;
        const age = document.getElementById('catAge').value;
        const color = document.getElementById('catColor').value;
        const price = document.getElementById('price').values;

        try{
            const response = await fetch('http://localhost:3000/submit-cat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, breed, age, color , price })
            });
            
            
            const data = await response.json();
            if (data.success) {
                // Display cat details
                catDetails.innerHTML = `
                    <div class="cat">
                        <p><strong>Name:</strong> ${data.Cat.name}</p>
                        <p><strong>Breed:</strong> ${data.Cat.breed}</p>
                        <p><strong>Age:</strong> ${data.Cat.age} years</p>
                        <p><strong>Color:</strong> ${data.Cat.color}</p>
                    </div>
                `;
                
                // Optionally clear the form
                form.reset();
                
                // Refresh the list of dogs
                displayCats();
            } else {
                catDetails.innerHTML = `<p>Error: ${data.error}</p>`;
            }
        } catch (error) {
            catDetails.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    });
});