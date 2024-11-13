document.addEventListener('DOMContentLoaded', function () {
    let itemId = 0;
    let itemLocation = "";
    let addItemClicked = false;
    const links = document.querySelectorAll('nav a');
    const editForm = document.getElementById('edit-form');
    const itemsList = document.getElementById('items-list');
    const editButtons = document.querySelectorAll('.edit-btn');
    const viewButtons = document.querySelectorAll('.view-btn');

    const pageName = window.location.pathname.split("/").pop().split(".")[0];

    if (editButtons.length > 0 && viewButtons.length > 0) {
        editButtons.forEach(btn => {
            btn.addEventListener('click', function (event) {
                editForm.classList.remove('hidden');
                itemId = parseInt(event.target.id.split('-')[2]);
                itemLocation = "Phones/" + itemId;

                [...links, ...editButtons, ...viewButtons].forEach(btn => {
                    btn.style.pointerEvents = 'none';
                });

                btn.blur();
            });
        });
    }
    else if (itemsList) {
        const itemCategory = new URLSearchParams(window.location.search).get('item');

        itemsList.addEventListener('click', function (event) {
            if (event.target.matches('.button-group .edit-btn')) {
                editForm.classList.remove('hidden');

                itemId = parseInt(event.target.id.split('-')[2]);
                itemLocation = itemCategory + '/' + itemId;

                const editButtons = document.querySelectorAll('.edit-btn');
                const deleteButtons = document.querySelectorAll('.delete-btn');
                const dynamicButtons = document.querySelectorAll('.dynamic-button');

                [...links, ...dynamicButtons, ...editButtons, ...deleteButtons].forEach(btn => {
                    btn.style.pointerEvents = 'none';
                });
            }
            else if (event.target.matches('.button-group .delete-btn')) {
                itemId = parseInt(event.target.id.split('-')[2]);
                const confirmDelete = window.confirm('Are you sure want to delete the item?');

                if (confirmDelete) {
                    deleteItem(itemCategory, itemId);
                    location.reload();
                }
            }
        });

        const addItemLink = document.getElementById('add-item');

        addItemLink.addEventListener('click', function () {
            addItemClicked = true;
            itemLocation = itemCategory;
            editForm.querySelector('h2').textContent = 'Add item';
            editForm.classList.remove('hidden');

            const editButtons = document.querySelectorAll('.edit-btn');
            const deleteButtons = document.querySelectorAll('.delete-btn');
            const dynamicButtons = document.querySelectorAll('.dynamic-button');

            [...links, ...dynamicButtons, ...editButtons, ...deleteButtons].forEach(btn => {
                btn.style.pointerEvents = 'none';
            });
        });
    }

    const brand = document.getElementById('edit-brand');
    const description = document.getElementById('edit-description');
    const imageUrl = document.getElementById('edit-image-url');
    const price = document.getElementById('edit-price');
    const stock = document.getElementById('edit-stock');

    const cancelBtn = document.getElementById('cancel-btn');

    cancelBtn.addEventListener('click', function () {
        CloseEditForm();
    });

    const saveBtn = document.getElementById('save-btn');

    saveBtn.addEventListener('click', function () {
        const card = document.getElementById('card-' + itemId);

        if (card) {
            const cradImg = card.querySelector('.card-img-top');
            const cardTitle = card.querySelector('.card-title');
            const cardDescription = card.querySelector('.card-text');

            if (imageUrl.value !== "") cradImg.src = imageUrl.value;
            if (description.value !== "") cardDescription.textContent = description.value;
            if (brand.value !== "") cardTitle.textContent = brand.value;

            if (pageName === 'items') {
                if (price.value !== "") card.querySelectorAll('p')[1].textContent = price.value;
                if (stock.value !== "") card.querySelectorAll('p')[2].textContent = stock.value;
            }
        }

        EdtiItem();
        CloseEditForm();
    });

    function EdtiItem() {
        let updates = {};

        if (brand.value.trim() !== "") updates.brand = brand.value;
        if (description.value.trim() !== "") updates.description = description.value;
        if (imageUrl.value.trim() !== "") updates.image = imageUrl.value;
        if (price.value.trim() !== "") updates.price = parseFloat(price.value);
        if (stock.value.trim() !== "") updates.stock = parseInt(stock.value);

        if (Object.keys(updates).length === 0) {
            alert("There are no new values to update.");
            return;
        }

        if (addItemClicked) {
            addItem(itemLocation, updates);
        }
        else {
            const database = firebase.database();
            const editItem = database.ref(itemLocation);

            editItem.update(updates)
            .then(() => {
                console.log("The item is updated successfully!");
            })
            .catch((error) => {
                console.error("Error with updating the item:", error);
            });
        }
    }

    function CloseEditForm() {
        brand.value = "";
        imageUrl.value = "";
        price.value = "";
        stock.value = "";
        description.value = "";
        addItemClicked = false;

        editForm.classList.add('hidden');
        const editButtons = document.querySelectorAll('.edit-btn');
        const deleteButtons = document.querySelectorAll('.delete-btn');
        const dynamicButtons = document.querySelectorAll('.dynamic-button');

        [...links, ...dynamicButtons, ...editButtons, ...deleteButtons, ...viewButtons].forEach(btn => {
            btn.style.pointerEvents = 'auto';
        });
    }

    function deleteItem(category, id) {
        const database = firebase.database();
        const itemsRef = database.ref(category);

        itemsRef.child(id).remove()
            .then(() => {
                alert("The item was deleted successfully!");
            })
            .catch((error) => {
                alert("Error with deleting the item!", error);
            });
    }

    async function newItemId(category) {
        const database = firebase.database();
        const itemsRef = database.ref(category);

        const snapshot = await itemsRef.once('value');
        let nextItemId = 0;

        if (!snapshot.exists()) {
            return 1;
        }

        snapshot.forEach((childSnapshot) => {
            const currentItemId = parseInt(childSnapshot.key, 10);

            if (currentItemId - nextItemId > 1) {
                return true;
            } else if (currentItemId >= nextItemId) {
                nextItemId = currentItemId;
            }
        });

        return nextItemId + 1;
    }

    async function addItem(category, newItemData) {
        try {
            const nextId = await newItemId(category);

            const database = firebase.database();
            const newItemRef = database.ref(`${category}/${nextId}`);

            await newItemRef.set(newItemData);
            console.log("New item is successfully added with ID:", nextId);
        } catch {
            console.error("Error with adding new item!", error);
        }
    }
});