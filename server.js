const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const{Dog,Cat,Customer}=require("./db/mongoConnection");

mongoose.connect('mongodb://localhost:27017/petshop', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (like HTML, CSS, JS)
app.use(express.static(path.join(__dirname, './public')));

// Handle form submission and save dog details
app.post('/submit-dog', async (req, res) => {
    try {
        const { name, breed, age, color,price } = req.body;
        const newDog = new Dog({ name, breed, age, color,price });
        await newDog.save();
        res.json({ success: true, dog: newDog });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Retrieve all dog details
app.get('/get-dogs', async (req, res) => {
    try {
        const dogs = await Dog.find();
        res.json(dogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/submit-cat', async (req, res) => {
    try {
        const {name, breed, age, color, price } = req.body;
        const newCat = new Cat({name, breed, age, color , price});
        await newCat.save();
        res.json({ success: true, Cat: newCat });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/get-cats',async(req,res)=>{
    try{
        const cats= await Cat.find();
        res.json(cats);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

app.post('/purchase-dog',async (req,res)=>{
    try {
        const { dogId, buyerName, buyerEmail, purchasePrice } = req.body;

        // Logic to handle purchase (e.g., update dog status, save transaction details)
        const dog = await Dog.findById(dogId);
        const pname=dog.name;
        if (!dog) {
            return res.status(404).json({ success: false, error: 'Dog not found' });
        }else{
            const newCust=new Customer({ pname, buyerName, buyerEmail, purchasePrice });
            await newCust.save(); 
            await Dog.findByIdAndDelete(dogId);
            res.json({ success: true });
        }
    }catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/purchase-cat',async (req,res)=>{
    try {
        const { catId, buyerName, buyerEmail, purchasePrice } = req.body;

        // Logic to handle purchase (e.g., update dog status, save transaction details)
        const cat = await Cat.findById(catId);
        const pname=cat.name;
        if (!cat) {
            return res.status(404).json({ success: false, error: 'Cat not found' });
        }else{
            const newCust=new Customer({ pname, buyerName, buyerEmail, purchasePrice });
            await newCust.save(); 
            await Cat.findByIdAndDelete(catId);
            res.json({ success: true });
        }
    }catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/get-customer', async (req,res) => {
    try{
        const customer=await Customer.find();
        res.json(customer);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

app.put('/update-dog/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, breed, age, color, price } = req.body;

        const updatedDog = await Dog.findByIdAndUpdate(id, {
            name,
            breed,
            age,
            color,
            price
        }, { new: true });

        if (!updatedDog) {
            return res.status(404).json({ success: false, error: 'Dog not found' });
        }

        res.json({ success: true, dog: updatedDog });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Route to delete a dog
app.delete('/delete-dog/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedDog = await Dog.findByIdAndDelete(id);

        if (!deletedDog) {
            return res.status(404).json({ success: false, error: 'Dog not found' });
        }

        res.json({ success: true, message: 'Dog deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.put('/update-cat/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, breed, age, color, price } = req.body;

        const updatedCat = await Cat.findByIdAndUpdate(id, {
            name,
            breed,
            age,
            color,
            price
        }, { new: true });

        if (!updatedCat) {
            return res.status(404).json({ success: false, error: 'Cat not found' });
        }

        res.json({ success: true, cat: updatedCat });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.delete('/delete-cat/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCat = await Cat.findByIdAndDelete(id);

        if (!deletedCat) {
            return res.status(404).json({ success: false, error: 'Cat not found' });
        }

        res.json({ success: true, message: 'Cat deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/process-payment', (req, res) => {
    const { amount, cardNumber, cardExpiry, cardCvc } = req.body;

    // Simulate a payment delay
    setTimeout(() => {
        // Simulate a successful payment 90% of the time
        const isSuccess = Math.random() > 0.1;

        if (isSuccess) {
            res.json({ success: true, message: 'Payment processed successfully!' });
        } else {
            res.json({ success: false, message: 'Payment failed. Please try again.' });
        }
    }, 2000); // Simulated 2-second delay
});



// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
