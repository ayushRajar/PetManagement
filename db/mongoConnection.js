const mongoose=require("mongoose");


const dogSchema=new mongoose.Schema({
    name: String,
    breed: String,
    age: Number,
    color: String,
    price:Number,
    isSold:Boolean

});

const catSchema=new mongoose.Schema({
    name: String,
    breed: String,
    age: Number,
    color:String,
    price:Number,
    isSold:Boolean
});

const customerSchema=new mongoose.Schema({
    pname: String,
    buyerName: String,
    buyerEmail: String,
    purchasePrice: String,
})

const Dog=mongoose.model('Dog',dogSchema);
const Cat=mongoose.model('Cat',catSchema);
const Customer=mongoose.model('Customer',customerSchema);

module.exports={
    Dog,
    Cat,
    Customer
}
