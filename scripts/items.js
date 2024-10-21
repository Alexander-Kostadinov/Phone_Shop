document.addEventListener('DOMContentLoaded', function () {
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

    const urlParams = new URLSearchParams(window.location.search);
    const pageName = urlParams.get('item');
    const database = firebase.database();
    const itemsRef = database.ref(pageName);

    document.querySelector('title').textContent = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    document.getElementById('pageTitle').textContent = pageName.charAt(0).toUpperCase() + pageName.slice(1);

    itemsRef.on('value', (snapshot) => {
        const items = snapshot.val();
        const itemsList = document.getElementById('items-list');

        itemsList.innerHTML = '';

        for (let key in items) {
            if (items.hasOwnProperty(key)) {
                const item = items[key];

                const card = document.createElement('div');
                card.classList.add('card');
                card.style.width = "16rem";

                const cardBody = document.createElement('div');
                cardBody.classList.add('card-body');

                const cardTitle = document.createElement('h5');
                cardTitle.classList.add('card-title');
                cardTitle.textContent = item.brand;

                const cardText = document.createElement('p');
                cardText.classList.add('card-text');
                cardText.textContent = item.description;

                const price = document.createElement('p');
                price.textContent = "Price: " + item.price + "$";

                const image = document.createElement('img');
                image.classList.add('card-img-top');
                image.src = item.image;

                const stock = document.createElement('p');
                stock.textContent = "Items " + `in stock: ${item.stock}`;

                const buyButton = document.createElement('button');
                buyButton.classList.add('dynamic-button', 'btn', 'btn-primary');
                buyButton.setAttribute('data-item-key', pageName + '/' + key);
                buyButton.textContent = 'Buy';

                cardBody.appendChild(cardTitle);
                cardBody.appendChild(cardText);
                cardBody.appendChild(price);
                cardBody.appendChild(stock);
                cardBody.appendChild(buyButton);

                card.appendChild(image);
                card.appendChild(cardBody);

                itemsList.appendChild(card);
            }
        }
    });
});