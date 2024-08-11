document.addEventListener('DOMContentLoaded', () => {
    const paymentForm = document.getElementById('paymentForm');
    const paymentMessage = document.getElementById('paymentMessage');

    paymentForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const amount = document.getElementById('purchasePrice').value;
        const cardNumber = document.getElementById('cardNumber').value.trim();
        const cardExpiry = document.getElementById('cardExpiry').value.trim();
        const cardCvc = document.getElementById('cardCvc').value.trim();

        // if (!amount || !cardNumber || !cardExpiry || !cardCvc) {
        //     paymentMessage.textContent = 'Please fill out all fields.';
        //     return;
        // }

        paymentMessage.textContent = 'Processing payment...';

        try {
            const response = await fetch('http://localhost:3000/process-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount, cardNumber, cardExpiry, cardCvc })
            });

            const data = await response.json();
            location.href="../customer/customer.html"
            if (data.success) {
                paymentMessage.textContent = 'Payment successful!';
                
            } else {
                paymentMessage.textContent = `Error: ${data.message}`;
            }
        } catch (error) {
            paymentMessage.textContent = `Error processing payment: ${error.message}`;
        }
    });
});
