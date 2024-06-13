document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = {
        laptops: document.querySelector('#laptops .products'),
        phones: document.querySelector('#phones .products'),
        tablets: document.querySelector('#tablets .products'),
        accessories: document.querySelector('#accessories .products')
    };

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const orderForm = document.getElementById('order-form');
    const orderList = document.getElementById('order-list');

    // Функция для добавления товара в корзину
    function addToCart(category, id) {
        fetch('products.json')
            .then(response => response.json())
            .then(products => {
                const product = products[category].find(item => item.id == id);
                cart.push(product);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
            })
            .catch(error => console.error('Ошибка при добавлении товара в корзину:', error));
    }

    // Функция для обновления корзины на странице
    function updateCart() {
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            let totalPrice = 0;
            cart.forEach((item, index) => {
                const cartItem = document.createElement('li');
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    ${item.name} - ${item.price} руб.
                    <button class="remove-item" data-index="${index}">Удалить</button>
                `;
                cartItemsContainer.appendChild(cartItem);
                totalPrice += item.price;
            });
            totalPriceElement.textContent = `Итого: ${totalPrice} руб.`;
            addRemoveEventListeners();
            orderForm.style.display = cart.length === 0 ? 'none' : 'block';
        }
    }

    // Функция для добавления обработчиков событий на кнопки удаления из корзины
    function addRemoveEventListeners() {
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
            });
        });
    }

    // Загрузка продуктов и добавление их на страницу
    for (const category in productsContainer) {
        if (productsContainer[category]) {
            fetch('products.json')
                .then(response => response.json())
                .then(products => {
                    products[category].forEach(product => {
                        const productElement = document.createElement('div');
                        productElement.classList.add('product');
                        productElement.innerHTML = `
                            <img src="${product.image}" alt="${product.name}">
                            <h3>${product.name}</h3>
                            <p>${product.price} руб.</p>
                            <button data-category="${category}" data-id="${product.id}">Добавить в корзину</button>
                        `;
                        productsContainer[category].appendChild(productElement);
                    });
                })
                .catch(error => console.error('Ошибка при загрузке продуктов:', error));
        }
    }

    // Используем делегирование событий для добавления товаров в корзину
    document.body.addEventListener('click', (event) => {
        if (event.target.matches('.product button')) {
            const category = event.target.getAttribute('data-category');
            const id = event.target.getAttribute('data-id');
            addToCart(category, id);
        }
    });

    // Обработчик для оформления заказа
    if (orderForm) {
        const checkoutButton = document.getElementById('checkout-btn');
        checkoutButton.addEventListener('click', (event) => {
            event.preventDefault(); // Отменяем стандартное поведение кнопки
            console.log('Нажата кнопка оформления заказа.'); // Выводим сообщение в консоль
            const order = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                items: cart
            };
            saveOrderToDB(order);
        });
    }

    // Функция для сохранения заказов в базу данных
    function saveOrderToDB(order) {
        console.log('Отправка заказа:', order);  // вывод информации о заказе в консоль

        fetch('/save-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка при сохранении заказа. Код ошибки: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    console.log('Заказ успешно сохранен в базе данных.');
                    localStorage.removeItem('cart');
                    cart = [];
                    updateCart();
                } else {
                    console.error('Ошибка при сохранении заказа:', data.error);
                }
            })
            .catch(error => {
                console.error('Ошибка при сохранении заказа:', error);
            });
    }

    // Функция для загрузки заказов из базы данных
    function loadOrders() {
        fetch('/orders')
            .then(response => response.json())
            .then(orders => {
                orderList.innerHTML = ''; // Очищаем список заказов перед загрузкой
                orders.forEach(order => {
                    const orderElement = document.createElement('li');
                    orderElement.innerHTML = `
                    <strong>Имя:</strong> ${order.name}<br>
                    <strong>Телефон:</strong> ${order.phone}<br>
                    <strong>Адрес:</strong> ${order.address}<br>
                    <strong>Корзина:</strong><br>
                    <ul>
                        ${JSON.parse(order.cart).map(item => `
                            <li>
                                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px;">
                                ${item.name} - ${item.price} руб.
                            </li>
                        `).join('')}
                    </ul>
                    <hr>
                `;
                    orderList.appendChild(orderElement);
                });
            })
            .catch(error => console.error('Ошибка при загрузке заказов:', error));
    }


    // Проверка, существует ли элемент orderList перед вызовом loadOrders()
    if (orderList) {
        loadOrders(); // Загружаем заказы при загрузке страницы
    }

    updateCart(); // Обновляем корзину при загрузке страницы
});
