// admin.js
fetch('/orders')
    .then(response => response.json())
    .then(orders => {
        const orderList = document.getElementById('order-list');
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

// user.js
fetch('/my-orders')
    .then(response => response.json())
    .then(orders => {
        const orderList = document.getElementById('order-list');
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
