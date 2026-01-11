// Получаем элементы DOM
const cityRadios = document.querySelectorAll('input[name="city"]');
const cityInfoDiv = document.getElementById('city-info');

// Функция для загрузки HTML файла города
async function loadCityHTML(cityName) {
    try {
        const response = await fetch(`cities/${cityName}.html`);
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка: ${response.status}`);
        }
        
        const html = await response.text();
        return html;
    } catch (error) {
        console.error('Ошибка загрузки HTML:', error);
        return null;
    }
}

// Функция для отображения информации о городе
async function showCityInfo(cityName) {
    const cityHTML = await loadCityHTML(cityName);
    
    if (!cityHTML) {
        cityInfoDiv.innerHTML = `
            <div style="color: red; padding: 20px;">
                <h3>Ошибка загрузки данных</h3>
                <p>Не удалось загрузить информацию о городе "${cityName}"</p>
                <p>Проверьте файл: cities/${cityName}.html</p>
            </div>
        `;
        return;
    }
    
    // Извлекаем только содержимое body (игнорируем теги html и head)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cityHTML;
    
    // Находим содержимое .city-card
    const cityCard = tempDiv.querySelector('.city-card');
    
    if (cityCard) {
        cityInfoDiv.innerHTML = cityCard.outerHTML;
    } else {
        // Если нет .city-card, показываем всё содержимое body
        const bodyContent = tempDiv.querySelector('body');
        if (bodyContent) {
            cityInfoDiv.innerHTML = bodyContent.innerHTML;
        } else {
            cityInfoDiv.innerHTML = cityHTML;
        }
    }
}

// Функция для сброса информации
function resetInfo() {
    cityInfoDiv.innerHTML = `
        <div class="placeholder">
            <p>Выберите город для отображения информации</p>
        </div>
    `;
}

// Обработчики событий для радиокнопок
cityRadios.forEach(radio => {
    radio.addEventListener('change', async function() {
        if (this.checked) {
            await showCityInfo(this.value);
        } else {
            const anyChecked = Array.from(cityRadios).some(r => r.checked);
            if (!anyChecked) {
                resetInfo();
            }
        }
    });
});

// Инициализация
window.addEventListener('load', resetInfo);