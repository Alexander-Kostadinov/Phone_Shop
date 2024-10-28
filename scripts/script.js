document.addEventListener('DOMContentLoaded', function () {
    const loginContainer = document.getElementById('loginContainer');
    const loginLink = document.getElementById('loginLink');
    const loginConfirmButton = document.getElementById('loginConfirmButton');
    const orderHistoryBtn = document.getElementById('order-history');
    const logoutBtn = document.getElementById('logoutLink');
    const ordersContainer = document.getElementById('orders-container');

    const firstEditBtn = document.getElementById('edit-1');
    const secondEditBtn = document.getElementById('edit-2');
    const thirdEditBtn = document.getElementById('edit-3');
    const fourthEditBtn = document.getElementById('edit-4');
    const fifthEditBtn = document.getElementById('edit-5');

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    const firebaseConfig = {
        apiKey: "AIzaSyAswWsyGO7ib_S9F7iM0xxUO9x6wEHJxWI",
        authDomain: "phoneshop-7c8f1.firebaseapp.com",
        databaseURL: "https://phoneshop-7c8f1-default-rtdb.firebaseio.com",
        projectId: "phoneshop-7c8f1",
        storageBucket: "phoneshop-7c8f1.appspot.com",
        messagingSenderId: "1048100188554",
        appId: "1:1048100188554:web:3b19fe3af5a02089d01873"
    };

    firebase.initializeApp(firebaseConfig);

    const pageName = window.location.pathname.split("/").pop().split(".")[0];

    if (isLoggedIn) {
        loginLink.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        orderHistoryBtn.classList.remove('hidden');

        if (pageName === "index") {
            firstEditBtn.classList.remove('hidden');
            secondEditBtn.classList.remove('hidden');
            thirdEditBtn.classList.remove('hidden');
            fourthEditBtn.classList.remove('hidden');
            fifthEditBtn.classList.remove('hidden');
        }
        else if (pageName === "contact") {
            const editButtons = document.querySelectorAll('.edit-btn');
            editButtons.forEach(btn => {
                btn.classList.remove('hidden');
            });
        }
    }

    loginLink.addEventListener('click', function () {
        loginContainer.classList.toggle('hidden');
    });

    document.addEventListener('click', function (event) {
        if (!loginContainer.contains(event.target) && !loginLink.contains(event.target)) {
            loginContainer.classList.add('hidden');
        }

        if (!ordersContainer.contains(event.target) && !orderHistoryBtn.contains(event.target)) {
            ordersContainer.classList.add('hidden');
        }
    });

    logoutBtn.addEventListener('click', function () {
        localStorage.setItem('isLoggedIn', 'false');
        location.reload();
    });

    loginConfirmButton.addEventListener('click', function () {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === "fpmi" && password === "1234") {
            alert('Login successful!');
            localStorage.setItem('isLoggedIn', 'true');
            location.reload();
        } else {
            alert('Invalid username or password. Please try again.');
            loginContainer.classList.remove('hidden');
        }

        document.getElementById('username').value = '';
        document.getElementById('password').value = '';

        loginConfirmButton.blur();
    });

    orderHistoryBtn.addEventListener('click', function () {
        ordersContainer.classList.toggle('hidden');

        if (ordersContainer.classList.contains('hidden')) {
            orderHistoryBtn.blur();
            return;
        }

        const database = firebase.database();
        const ordersRef = database.ref('orders');
        const orderItemsRef = database.ref('order_items');
        const orderRows = document.getElementById('order-rows');

        orderRows.innerHTML = "";

        ordersRef.once('value', (orderSnapshot) => {
            const orders = orderSnapshot.val();

            for (let orderId in orders) {
                if (orders.hasOwnProperty(orderId)) {
                    const customerId = orders[orderId].customer_id;

                    orderItemsRef.child(orderId).once('value', (itemSnapshot) => {
                        const item = itemSnapshot.val();

                        if (item) {
                            const row = document.createElement("tr");

                            row.innerHTML = `
                            <td>${customerId}</td>
                            <td>${item.item_name}</td>
                            <td>${item.quantity}</td>
                            <td>${item.total_price}</td>
                            `;

                            orderRows.appendChild(row);
                        }
                        else {
                            console.log(`No item found for order ID: ${orderId}`);
                        }
                    });
                }
            }
        });

        orderHistoryBtn.blur();
    });
});