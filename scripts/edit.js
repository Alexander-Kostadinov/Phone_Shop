document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('nav a');
    const editForm = document.getElementById('edit-form');
    const itemsList = document.getElementById('items-list');
    const editButtons = document.querySelectorAll('.edit-btn');
    const viewButtons = document.querySelectorAll('.view-btn');

    if (editButtons.length > 0 && viewButtons.length > 0) {
        editButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                editForm.classList.remove('hidden');

                links.forEach(link => {
                    link.style.pointerEvents = 'none';
                });

                viewButtons.forEach(button => {
                    button.style.pointerEvents = 'none';
                });

                editButtons.forEach(button => {
                    button.style.pointerEvents = 'none';
                });

                btn.blur();
            });
        });
    }
    else if (itemsList) {
        itemsList.addEventListener('click', function (event) {
            if (event.target.matches('.button-group .edit-btn')) {
                editForm.classList.remove('hidden');

                links.forEach(link => {
                    link.style.pointerEvents = 'none';
                });

                const editButtons = document.querySelectorAll('.edit-btn');
                const deleteButtons = document.querySelectorAll('.delete-btn');
                const dynamicButtons = document.querySelectorAll('.dynamic-button');

                [...dynamicButtons, ...editButtons, ...deleteButtons].forEach(btn => {
                    btn.style.pointerEvents = 'none';
                });

                event.target.blur();
            }
        });
    }

    const cancelBtn = document.getElementById('cancel-btn');

    cancelBtn.addEventListener('click', function() {
        editForm.classList.add('hidden');

        links.forEach(link => {
            link.style.pointerEvents = 'auto';
        });

        const editButtons = document.querySelectorAll('.edit-btn');
        const deleteButtons = document.querySelectorAll('.delete-btn');
        const dynamicButtons = document.querySelectorAll('.dynamic-button');

        [...dynamicButtons, ...editButtons, ...deleteButtons, ...viewButtons].forEach(btn => {
            btn.style.pointerEvents = 'auto';
        });
    });
});