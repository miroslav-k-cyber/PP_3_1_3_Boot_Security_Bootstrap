// Ждем, пока вся HTML-страница полностью загрузится в браузере
document.addEventListener("DOMContentLoaded", () => {
    loadAllUsers();
    loadCurrentUserInfo();
});

// ФУНКЦИЯ 1: Получаем список юзеров и строим таблицу
function loadAllUsers() {
    fetch('/api/admin')
        .then(response => response.json())
        .then(users => {
            const tableBody = document.getElementById('all-users-table-body');
            tableBody.innerHTML = '';

            users.forEach(user => {
                const rolesNames = user.roles.map(role => role.name.replace('ROLE_', '')).join(' ');
                // Используем firstName (как в сущности User)
                const currentName = user.firstName || '';

                const row = `
                    <tr>
                        <td>${user.id}</td>
                        <td>${currentName}</td>
                        <td>${user.lastName || ''}</td>
                        <td>${user.age || ''}</td>
                        <td>${user.email}</td>
                        <td>${rolesNames}</td>
                        <td>
                            <button class="btn btn-info btn-sm text-white" onclick="openEditModal(${user.id})">Edit</button>
                        </td>
                        <td>
                            <button class="btn btn-danger btn-sm" onclick="openDeleteModal(${user.id})">Delete</button>
                        </td>
                    </tr>
                `;
                tableBody.insertAdjacentHTML('beforeend', row);
            });
        })
        .catch(error => console.error('Ошибка загрузки пользователей:', error));
}

// ФОРМА СОЗДАНИЯ
const newUserForm = document.getElementById('newUserForm');

if (newUserForm) {
    newUserForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // 1. Собираем ID выбранных ролей (а не объекты!)
        const roleIds = [];
        const rolesOptions = document.getElementById('new-roles').selectedOptions;
        for (let i = 0; i < rolesOptions.length; i++) {
            roleIds.push(Number(rolesOptions[i].value)); // value должен быть ID роли!
        }

        // 2. Создаем JSON под UserRequestDto
        const newUser = {
            firstName: document.getElementById('new-name').value, // ← firstName
            lastName: document.getElementById('new-lastName').value,
            age: parseInt(document.getElementById('new-age').value),
            email: document.getElementById('new-email').value,
            password: document.getElementById('new-password').value,
            roleIds: roleIds // ← roleIds
        };

        fetch('/api/admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        })
            .then(response => {
                if (response.ok) {
                    newUserForm.reset();
                    loadAllUsers();
                    const usersTableTab = new bootstrap.Tab(document.getElementById('users-table-tab'));
                    usersTableTab.show();
                } else {
                    alert('Не удалось добавить пользователя. Проверь логи сервера.');
                }
            })
            .catch(error => console.error('Ошибка при создании пользователя:', error));
    });
}

let editModal, deleteModal;

// ФУНКЦИЯ 3: Открываем окно редактирования
function openEditModal(id) {
    fetch(`/api/admin/${id}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById('edit-id').value = user.id;
            document.getElementById('edit-name').value = user.firstName || ''; // ← firstName
            document.getElementById('edit-lastName').value = user.lastName || '';
            document.getElementById('edit-age').value = user.age || '';
            document.getElementById('edit-email').value = user.email;
            document.getElementById('edit-password').value = '';

            // Выбираем роли: сравниваем option.value (ID) с role.id
            const selectRoles = document.getElementById('edit-roles');
            for (let i = 0; i < selectRoles.options.length; i++) {
                const option = selectRoles.options[i];
                option.selected = user.roles.some(role => role.id === Number(option.value));
            }

            editModal = new bootstrap.Modal(document.getElementById('editModal'));
            editModal.show();
        });
}

// ФОРМА РЕДАКТИРОВАНИЯ
document.getElementById('editModalForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.getElementById('edit-id').value;

    const roleIds = [];
    const rolesOptions = document.getElementById('edit-roles').selectedOptions;
    for (let i = 0; i < rolesOptions.length; i++) {
        roleIds.push(Number(rolesOptions[i].value)); // ← ID ролей
    }

    const updatedUser = {
        firstName: document.getElementById('edit-name').value, // ← firstName
        lastName: document.getElementById('edit-lastName').value,
        age: parseInt(document.getElementById('edit-age').value),
        email: document.getElementById('edit-email').value,
        password: document.getElementById('edit-password').value,
        roleIds: roleIds // ← roleIds
    };

    // PUT на /api/admin/{id} (ID в URL!)
    fetch(`/api/admin/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
    })
        .then(response => {
            if (response.ok) {
                editModal.hide();
                loadAllUsers();
            } else {
                alert('Не удалось обновить пользователя.');
            }
        })
        .catch(error => console.error('Ошибка при обновлении:', error));
});

// ФУНКЦИЯ 4: Открываем окно удаления
function openDeleteModal(id) {
    fetch(`/api/admin/${id}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById('delete-id').value = user.id;
            document.getElementById('delete-name').value = user.firstName || '';
            document.getElementById('delete-lastName').value = user.lastName || '';
            document.getElementById('delete-age').value = user.age || '';
            document.getElementById('delete-email').value = user.email;

            const selectRoles = document.getElementById('delete-roles');
            for (let i = 0; i < selectRoles.options.length; i++) {
                const option = selectRoles.options[i];
                option.selected = user.roles.some(role => role.id === Number(option.value));
            }

            deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
            deleteModal.show();
        });
}

// ФОРМА УДАЛЕНИЯ
document.getElementById('deleteModalForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('delete-id').value;

    fetch(`/api/admin/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                deleteModal.hide();
                loadAllUsers();
            }
        })
        .catch(error => console.error('Ошибка при удалении:', error));
});

// ФУНКЦИЯ 5: Заполняем шапку
function loadCurrentUserInfo() {
    fetch('/api/user')
        .then(response => response.json())
        .then(currentUser => {
            const emailElement = document.getElementById('navbar-email');
            const rolesElement = document.getElementById('navbar-roles');

            if (emailElement && rolesElement) {
                emailElement.textContent = currentUser.email;
                const rolesNames = currentUser.roles.map(role => role.name.replace('ROLE_', '')).join(' ');
                rolesElement.textContent = `with roles: ${rolesNames}`;
            }
        })
        .catch(error => console.error('Ошибка загрузки данных шапки:', error));
}