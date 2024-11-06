document.addEventListener('DOMContentLoaded', function () {
    let stock = 0;
    let itemName = '';
    let itemLocation = '';
    const price = document.getElementById('price');
    const links = document.querySelectorAll('nav a');
    const quantity = document.getElementById('quantity');
    const orderForm = document.getElementById('orderForm');
    const itemsList = document.getElementById('items-list');
    const purchaseBtn = document.getElementById('purchaseBtn');
    const submitButton = document.getElementById('submitButton');

    if (purchaseBtn) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('product');
        itemLocation = 'Phones/' + productId;

        purchaseBtn.addEventListener('click', function () {
            purchaseBtn.disabled = true;
            submitButton.disabled = true;
            orderForm.classList.remove('hidden');
            stock = parseInt(document.getElementById('item-stock').textContent.match(/\d+/g));
            price.textContent = document.getElementById('item-price').textContent.match(/\d+(\.\d+)?/g);
            itemName = document.getElementById('item-name').textContent + ', ' +
                document.getElementById('item-description').textContent;

            links.forEach(link => {
                link.style.pointerEvents = 'none';
            });
        });
    }
    else if (itemsList) {
        itemsList.addEventListener('click', function (event) {
            if (event.target.matches('.dynamic-button')) {
                orderForm.classList.remove('hidden');
                itemLocation = event.target.getAttribute('data-item-key');
                const parentElement = event.target.closest('.card-body');
                stock = parseInt(parentElement.querySelectorAll('p')[2].textContent.match(/\d+/g));
                price.textContent = parentElement.querySelectorAll('p')[1].textContent.match(/\d+(\.\d+)?/g);
                itemName = parentElement.querySelector('h5').textContent + ', ' +
                    parentElement.querySelectorAll('p')[0].textContent;

                links.forEach(link => {
                    link.style.pointerEvents = 'none';
                });

                const editButtons = document.querySelectorAll('.edit-btn');
                const deleteButtons = document.querySelectorAll('.delete-btn');
                const dynamicButtons = document.querySelectorAll('.dynamic-button');

                [...dynamicButtons, ...editButtons, ...deleteButtons].forEach(btn => {
                    btn.disabled = true;
                });
            }

            event.target.blur();
        });
    }

    const increaseBtn = document.getElementById('increaseQuantity');

    increaseBtn.addEventListener('click', function () {
        if (quantity.value < stock && quantity.value > 0) {
            quantity.value++;
            let currentPrice = parseFloat(quantity.value * (price.textContent / (quantity.value - 1)));

            if (currentPrice % 1 !== 0) {
                price.textContent = currentPrice.toFixed(2);
            }
            else {
                price.textContent = currentPrice;
            }
        }

        increaseBtn.blur();
    });

    const decreaseBtn = document.getElementById('decreaseQuantity');

    decreaseBtn.addEventListener('click', function () {
        if (quantity.value > 1) {
            let currentPrice = price.textContent - (price.textContent / quantity.value);
            quantity.value--;

            if (currentPrice % 1 !== 0) {
                price.textContent = currentPrice.toFixed(2);
            }
            else {
                price.textContent = currentPrice;
            }
        }

        decreaseBtn.blur();
    });

    const database = firebase.database();
    const orders = database.ref('orders');
    const customers = database.ref('customers');
    const orderItems = database.ref('order_items');

    const name = document.getElementById('name');
    const phoneNum = document.getElementById('phone');
    const address = document.getElementById('address');
    const cashButton = document.getElementById('cash');
    const cardButton = document.getElementById('card');

    const confirmBtn = document.getElementById('confirmButton');

    function validateField(field) {
        const phoneRegex = /^[0-9]+$/;
        let isValid = true;
    
        field.style.border = "";
    
        if (field === name && field.value.trim() === "") {
            field.style.border = "2px solid red";
            isValid = false;
        } 
        else if (field === address && field.value.trim() === "") {
            field.style.border = "2px solid red";
            isValid = false;
        } 
        else if (field === phoneNum && !phoneRegex.test(field.value.trim())) {
            field.style.border = "2px solid red";
            isValid = false;
        }
    
        return isValid;
    }
    
    name.addEventListener('blur', function() { validateField(name); });
    address.addEventListener('blur', function() { validateField(address); });
    phoneNum.addEventListener('blur', function() { validateField(phoneNum); });

    function sendOrderDetails() {
        let maxOrderId = 0;
        let paymentBtn = "";
        const customerId = phoneNum.value;
        const orderAddress = address.value;
        const dateNow = new Date().toISOString().split('T')[0];

        if (cashButton.checked === true) {
            paymentBtn = cashButton.value;
        }
        else if (cardButton.checked === true) {
            paymentBtn = cardButton.value;
        }

        const payMethod = paymentBtn;

        orders.once('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const orderId = parseInt(childSnapshot.key, 10);
                if (orderId > maxOrderId) {
                    maxOrderId = orderId;
                }
            });

            const newOrderId = maxOrderId + 1;

            const orderData = {
                customer_id: customerId,
                order_address: orderAddress,
                pay_method: payMethod,
                order_date: dateNow
            };

            orders.child(newOrderId).set(orderData);
        });
    }

    function sendCustomerDetails() {
        const customerName = name.value;
        const customerPhone = phoneNum.value;

        customers.child(customerPhone).once('value', (snapshot) => {
            if (snapshot.exists()) {
                const existingCustomer = snapshot.val();

                if (customerName !== existingCustomer.customer_name) {
                    const confirmUpdate = window.confirm(`This phone number already exists with the name "${existingCustomer.customer_name}". Do you want to update the name to "${customerName}"?`);

                    if (confirmUpdate) {
                        customers.child(customerPhone).update({ customer_name: customerName })
                        .then(() => {
                            alert(`The name has been changed successfully. Thank you for your order, ${customerName}!`);
                        })
                        .catch((error) => {
                            console.error('Failed to update customer name:', error);
                        });
                    }
                    else {
                        alert(`Confirmation accepted. Thank you for your order, ${existingCustomer.customer_name}!`);
                    }
                }
            }
            else {
                const customerData = { customer_name: customerName };
                customers.child(customerPhone).set(customerData)
                .then(() => {
                    alert(`Thank you for your order, "${customerName}"!`);
                })
                .catch((error) => {
                    console.log('Failed to initialize customer: ', error);
                })
            }
        });
    }

    function sendOrderItemDetails() {
        let maxOrderItemId = 0;

        orderItems.once('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const orderItemId = parseInt(childSnapshot.key, 10);
                if (orderItemId > maxOrderItemId) {
                    maxOrderItemId = orderItemId;
                }
            });

            const newOrderItemId = maxOrderItemId + 1;
            const orderItemData = {
                item_name: itemName,
                quantity: quantity.value,
                total_price: price.textContent
            };

            orderItems.child(newOrderItemId).set(orderItemData)
            .then(() => {
                quantity.value = 1;
            })
            .catch((error) => {
                console.error('Failed to create a new order item:', error);
            });
        });
    }

    confirmBtn.addEventListener('click', function () {
        const isValidName = validateField(name);
        const isValidAddress = validateField(address);
        const isValidPhoneNum = validateField(phoneNum);

        if (isValidName && isValidAddress && isValidPhoneNum && stock > 0) {
            sendOrderDetails();
            sendCustomerDetails();
            sendOrderItemDetails();

            if (purchaseBtn && submitButton) {
                purchaseBtn.disabled = false;
                submitButton.disabled = false;
            }

            const allButtons = document.querySelectorAll('.dynamic-button');

            allButtons.forEach(btn => {
                btn.disabled = false;
            });

            links.forEach(link => {
                link.style.pointerEvents = 'auto';
            });

            let newStock = 0;
            const itemRef = database.ref(itemLocation);
            
            itemRef.once('value', (snapshot) => {
                newStock = parseInt(snapshot.val().stock - quantity.value);
                itemRef.update({ stock: newStock });
            });

            stock = 0;
            name.value = "";
            address.value = "";
            phoneNum.value = "";
            cashButton.checked = true;
            cardButton.checked = false;

            orderForm.classList.add('hidden');
        }
        else if (stock < 1) {
            alert('We are sorry! The item is out of stock.');
            location.reload();
        }
        else {
            alert("Fields are required and cannot contain illegal characters or be empty!");
        }
    });

    const cancelBtn = document.getElementById('cancelButton');

    cancelBtn.addEventListener('click', function () {
        stock = 0;
        name.value = "";
        address.value = "";
        phoneNum.value = "";
        name.style.border = "";
        address.style.border = "";
        phoneNum.style.border = "";

        quantity.value = 1;
        cashButton.checked = true;
        cardButton.checked = false;

        orderForm.classList.add('hidden');

        if (purchaseBtn && submitButton) {
            purchaseBtn.disabled = false;
            submitButton.disabled = false;
        }

        const editButtons = document.querySelectorAll('.edit-btn');
        const deleteButtons = document.querySelectorAll('.delete-btn');
        const dynamicButtons = document.querySelectorAll('.dynamic-button');

        [...dynamicButtons, ...editButtons, ...deleteButtons].forEach(btn => {
            btn.disabled = false;
        });

        links.forEach(link => {
            link.style.pointerEvents = 'auto';
        });
    });
});