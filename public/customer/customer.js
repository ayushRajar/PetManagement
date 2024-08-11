document.addEventListener("DOMContentLoaded", () => {
    const customerDetails=document.getElementById('customerDetails');

    const displayCustomer=async()=>{
        try{
            const response= await fetch('http://localhost:3000/get-customer');
            const customers=await response.json();
            customerDetails.innerHTML = customers.map(customer => `
                <div class="customer">
                    <p><strong>Pet Name:</strong> ${customer.pname}</p>
                    <p><strong> BuyerName:</strong> ${customer.buyerName}</p>
                    <p><strong>BuyerEmail:</strong> ${customer.buyerEmail} years</p>
                    <p><strong>PurchasePrice:</strong> ${customer.purchasePrice}</p>
                    <P>-----------------------------------------------<P>
                </div>
            `).join('');

        }catch(err){
            customerDetails.innerHTML= `<p> Error: ${Err.Message} </p>`
        }


    }
    displayCustomer();

})