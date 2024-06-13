document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Отменяем стандартное поведение формы

        // Получаем данные из формы
        const formData = new FormData(loginForm);

        // Опционально: можно проверить данные перед отправкой на сервер

        // Отправляем данные на сервер
        fetch('/login', {
            method: 'POST',
            body: formData,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка при входе. Проверьте правильность введенных данных.');
                }
                return response.json();
            })
            .then(data => {
                // Обработка успешного входа, например, перенаправление на другую страницу
                window.location.href = '/dashboard'; // Предположим, что '/dashboard' - это страница администратора
            })
            .catch(error => {
                console.error('Ошибка при входе:', error.message);
                // Здесь можно отобразить сообщение об ошибке пользователю
            });
    });
});
