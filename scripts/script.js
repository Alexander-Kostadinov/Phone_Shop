document.addEventListener('DOMContentLoaded', function () {
    const loginContainer = document.getElementById('loginContainer');
    const loginLink = document.getElementById('loginLink');
    const loginConfirmButton = document.getElementById('loginConfirmButton');
    const orderHistoryBtn = document.getElementById('order-history');
    const logoutBtn = document.getElementById('logoutLink');

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
        loginLink.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        orderHistoryBtn.classList.remove('hidden');
    }
    else {
        logoutBtn.classList.add('hidden');
        orderHistoryBtn.classList.add('hidden');
    }

    loginLink.addEventListener('click', function () {
        loginContainer.classList.toggle('hidden');
    });

    document.addEventListener('click', function (event) {
        if (!loginContainer.contains(event.target) && !loginLink.contains(event.target)) {
            if (!loginContainer.classList.contains('hidden')) {
                loginContainer.classList.add('hidden');
            }
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
});