document.addEventListener('DOMContentLoaded', function () {
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

                const editButton = document.createElement('button');
                editButton.classList.add('edit-btn', 'btn', 'btn-primary', 'mt-2');
                editButton.textContent = 'Edit';

                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete-btn', 'btn', 'btn-danger', 'mt-2');
                deleteButton.textContent = 'Delete';

                const buttonGroup = document.createElement('div');
                buttonGroup.classList.add('button-group', 'full-width');
                buttonGroup.style.display = 'flex';
                buttonGroup.style.gap = '10px';

                if (localStorage.getItem('isLoggedIn') === 'true') {
                    buttonGroup.appendChild(editButton);
                    buttonGroup.appendChild(deleteButton);
                }

                cardBody.appendChild(cardTitle);
                cardBody.appendChild(cardText);
                cardBody.appendChild(price);
                cardBody.appendChild(stock);
                cardBody.appendChild(buyButton);
                cardBody.appendChild(buttonGroup);

                card.appendChild(image);
                card.appendChild(cardBody);

                itemsList.appendChild(card);
            }
        }
    });
});