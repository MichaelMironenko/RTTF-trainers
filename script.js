document.addEventListener('DOMContentLoaded', function() {
  var hamburger = document.querySelector('.nav-hamburger');
  var navLinks = document.querySelector('.nav-links');
  var navClose = document.querySelector('.nav-close');

  hamburger.addEventListener('click', function() {
    navLinks.classList.add('active');
    navClose.classList.add('active');
    hamburger.classList.add('active');
  });

  navClose.addEventListener('click', function() {
    navLinks.classList.remove('active');
    navClose.classList.remove('active');
    hamburger.classList.remove('active');
  });
});


const trainingsData = [
    {
        "date": "Сегодня, 15 ноября",
        "trainings": [
            {
                "time": "10:30",
                "duration": "1,5 ч",
                "name": "Групповая тренировка",
                "location": "Люблино",
                "participants": 2,
                "price": "900₽"
            },
            {
                "time": "11:00",
                "duration": "1,5 ч",
                "name": "Боковые подачи и их прием. Топ-спин справа со всего стола",
                "location": "HurricaneTT",
                "participants": 0,
                "price": "700₽"
            },
            {
                "time": "13:30",
                "duration": "1,5 ч",
                "name": "Групповая тренировка",
                "location": "Люблино",
                "participants": 0,
                "price": "800₽"
            }
        ]
    },
    {
        "date": "Завтра, 16 ноября",
        "trainings": [
            {
                "time": "19:00",
                "duration": "2 ч",
                "name": "Топ-спины справа с продолжением (двух и трехходовки)",
                "location": "ЛуЦентр",
                "participants": 2,
                "price": "1000₽"
            },
            {
                "time": "20:00",
                "duration": "1,5 ч",
                "name": "Отработка подач в сочетании с топ-спином",
                "location": "Люблино",
                "participants": "0/12",
                "price": "1000₽"
            }
        ]
    },
    {
        "date": "Четверг, 17 ноября",
        "trainings": [
            {
                "time": "15:00",
                "duration": "1,5 ч",
                "name": "Отработка базовых элементов",
                "location": "HurricaneTT",
                "participants": 6,
                "price": "500₽"
            },
            {
                "time": "17:00",
                "duration": "2 ч",
                "name": "Индивидуальная тренировка",
                "location": "TTL-Savel",
                "participants": 4,
                "price": "800₽"
            },
            {
                "time": "18:30",
                "duration": "1,5 ч",
                "name": "Группа повышения мастерства",
                "location": "HurricaneTT",
                "participants": "3/12",
                "price": "1000₽"
            }
        ]
    }
];

const dayTemplate = document.getElementById('training-day-template').innerHTML;
const cardTemplate = document.getElementById('training-card-template').innerHTML;
const scheduleContainer = document.querySelector('.training-schedule-container');

// Function to create buttons
function createDayButtons() {
  const sessionDaysContainer = document.querySelector('.session-days');
  sessionDaysContainer.innerHTML = '';  // Clear existing buttons

  // Create buttons from training data
  trainingsData.forEach((day, index) => {
    const dayParts = day.date.split(', ');
    const button = document.createElement('button');
    button.className = 'day-button';
    button.dataset.day = 'day' + (index + 1);  // Match data-day with day IDs
    button.innerHTML = `
      <span class="weekday">${dayParts[0]}</span>
      <span>${dayParts[1]}</span>
    `;
    // Attach event listener to each button
    button.addEventListener('click', function() {
      switchDay(button.dataset.day);
    });
    sessionDaysContainer.appendChild(button);
  });
}

// Function to create training day schedules
function createTrainingDays() {
  scheduleContainer.innerHTML = '';  // Clear existing schedules

  trainingsData.forEach((day, index) => {
    const dayId = 'day' + (index + 1);
    let dayHtml = dayTemplate.replace('%DATE%', day.date).replace('class="training-day"', `class="training-day" id="${dayId}"`);
    let cardsHtml = day.trainings.map(training => cardTemplate
      .replace('%TIME%', training.time)
      .replace('%DURATION%', training.duration)
      .replace('%NAME%', training.name)
      .replace('%LOCATION%', training.location)
      .replace('%PARTICIPANTS%', training.participants)
      .replace('%PRICE%', training.price)
    ).join('');
    
    dayHtml = dayHtml.replace('<!-- Карточки тренировок будут вставлены сюда -->', cardsHtml);
    scheduleContainer.innerHTML += dayHtml;
  });
}

// Function to switch training days
function switchDay(dayId) {
    // Check if the screen width is less than 430px
    if (window.innerWidth < 430) {
        // Mobile view: show only the selected day
        document.querySelectorAll('.training-day').forEach(function(day) {
            day.style.display = 'none';
        });
        const activeDay = document.getElementById(dayId);
        if (activeDay) {
            activeDay.style.display = 'block';
        }
    }
    // For desktop view, all days are already visible due to CSS

    // Update the active state for buttons regardless of screen width
    document.querySelectorAll('.day-button').forEach(function(button) {
        button.classList.remove('active');
        if (button.dataset.day === dayId) {
            button.classList.add('active');
        }
    });
}

// Initialize the page
createDayButtons();
createTrainingDays();// Display the first day by default

// Call switchDay on initial load only if it's a mobile view
if (window.innerWidth < 430) {
    console.log("<430")
    switchDay('day1'); // Display the first day by default on mobile
} else {
    // On desktop, display all days and set the first day as active
    document.querySelectorAll('.training-day').forEach(function(day) {
        day.style.display = 'block'; // Show all days
    });
    document.querySelector('.day-button[data-day="day1"]').classList.add('active');
}

// Массив объектов с информацией для каждого пункта списка
const trainingTopics = [
{
    emoji: '👟',
    title: 'Разминка',
    text: 'Для разогрева мышц, чтобы подготовить тело к тренировке и не допустить получения травм.'
  },
  {
    emoji: '🏋️‍♀️',
    title: 'Физическая подготовка',
    text: 'Специальные упражнения для усиления силы, ловкости и быстроты реакции.'
  },
  {
    emoji: '🏓',
    title: 'Постановка техники',
    text: 'Корректировка ошибок или постановка техники с нуля. Игра по элементам.'
  },
  {
    emoji: '🧠',
    title: 'Игровые упражнения',
    text: 'Чтобы тренировочный процесс был более интересным.'
  },
  {
    emoji: '🤾‍♂️',
    title: 'Шпиль',
    text: 'Игра как шпилями, так и против них.'
  },
  {
    emoji: '🏆',
    title: 'Игра в турнирах',
    text: 'Советы по игре на счет, тактика, выявление слабых сторон соперника, выигрышные комбинации.'
  },
  {
    emoji: '⚔️',
    title: 'Атакующая игра',
    text: 'Постановка топ-спинов справа и игра против блоков/подставок, "свечек".'
  },
  {
    emoji: '🛡',
    title: 'Защитная игра',
    text: 'Научимся играть по защите, так и против неё.'
  },
  {
    emoji: '🤹‍♂️',
    title: 'Подачи',
    text: 'Разучим разные варианты подач (нижние, верхние, боковые и левые).'
  },
  {
    emoji: '📹',
    title: 'Видео',
    text: 'Запись тренировки на видео, чтобы увидев себя со стороны, работать над ошибками.'
  }
];

// Функция для создания HTML для каждого элемента списка
function createTrainingTopicHTML(topic) {
  return `
    <div class="training-points">
      <div class="emoji">${topic.emoji}</div>
      <div class="bullet-title">${topic.title}</div>
      <div class="point-text">${topic.text}</div>
    </div>
  `;
}

// Функция для заполнения списка на странице
function fillTrainingTopicsList() {
  const listContainer = document.querySelector('.training-topics-list');
  const topicsHTML = trainingTopics.map(createTrainingTopicHTML).join('');
  listContainer.innerHTML = topicsHTML;
}

// Вызов функции заполнения списка при загрузке страницы
document.addEventListener('DOMContentLoaded', fillTrainingTopicsList);

const cardDataArray = [
  {
    duration: "1 час",
    price: "2500 ₽",
    features: [
      "Постановка техники",
      "Игровые упражнения",
      "Атака и защита",
      "Аренда стола уже включена"
    ]
  },
  {
    duration: "1,5 часа",
    price: "3500 ₽",
    features: [
      "Углубленная работа над техникой",
      "Специализированные упражнения",
      "Индивидуальная тактическая подготовка",
      "Разбор игровых ситуаций"
    ]
  },
  {
    duration: "2 часа",
    price: "4500 ₽",
    features: [
      "Комплексная тренировка",
      "Физическая подготовка",
      "Ментальная подготовка",
      "Полная разработка игрового стиля"
    ]
  }
];

function createPersonalTrainingCard(data) {
  const template = document.getElementById('personal-training-card-template').content.cloneNode(true);

  template.querySelector('.personal-training-time').textContent = data.duration;
  template.querySelector('.personal-training-price').textContent = data.price;

  const featuresList = template.querySelector('.training-features');
  data.features.forEach(feature => {
    const li = document.createElement('li');
    li.textContent = feature;
    featuresList.appendChild(li);
  });

  return template;
}

document.addEventListener('DOMContentLoaded', () => {
  const cardContainer = document.getElementById('card-container');
  cardDataArray.forEach(cardData => {
    const cardElement = createPersonalTrainingCard(cardData);
    cardContainer.appendChild(cardElement);
  });
});

const reviewData = [
  {
    name: "Александр Семёнов",
    rating: 5,
    gameRating: 950,
    comment: "Тренер на высоте! Методики преподавания новые и эффективные, заметный результат уже после нескольких занятий.",
    date: "24 июня 2023 г.",
    avatar: "images/user1.png"
  },
  {
    name: "Дмитрий Смирнов",
    rating: 4,
    gameRating: 870,
    comment: "Хорошо структурированные тренировки. Много полезной информации, но иногда хочется больше практики.",
    date: "15 июля 2023 г.",
    avatar: "images/user2.png"
  },
  {
    name: "Игорь Николаев",
    rating: 5,
    gameRating: 820,
    comment: "Отличная работа! Тренер уделяет внимание каждому ученику, помогает разобраться в сложных моментах.",
    date: "10 августа 2023 г.",
    avatar: "images/user3.png"
  },
  {
    name: "Елена Петрова",
    rating: 5,
    gameRating: 910,
    comment: "Тренер внимательный и профессиональный. Занятия проходят интересно, есть четкий план на каждую тренировку.",
    date: "21 августа 2023 г.",
    avatar: "images/user4.png"
  },
  {
    name: "Мария Иванова",
    rating: 3,
    gameRating: 780,
    comment: "Занятия в целом неплохие, но ожидал более интенсивной программы. Занятия в целом неплохие, но ожидал более интенсивной программы.Занятия в целом неплохие, но ожидал более интенсивной программы.Иногда кажется, что времени уделяется меньше, чем заявлено.",
    date: "2 сентября 2023 г.",
    avatar: "images/user5.png"
  }
];

function createStars(rating) {
  const roundedRating = Math.round(rating);
  let starsHtml = '';
  
  for (let i = 0; i < 5; i++) {
    if (i < roundedRating) {
      starsHtml += '<img src="images/full-star.svg" alt="Full Star" class="star">';
    } else {
      starsHtml += '<img src="images/empty-star.svg" alt="Empty Star" class="star">';
    }
  }

  return starsHtml;
}

function createReviewCard(data) {
  const template = document.getElementById('review-card-template').content.cloneNode(true);

  template.querySelector('.review-avatar').src = data.avatar;
  template.querySelector('.reviewer-name').textContent = data.name;
  template.querySelector('.review-rating').innerHTML = createStars(data.rating); // Используйте innerHTML, так как мы добавляем HTML-контент
  template.querySelector('.review-date').textContent = data.date;
  template.querySelector('.review-comment').textContent = data.comment;
  template.querySelector('.rating-number').textContent = data.gameRating;

  return template;
}

document.addEventListener('DOMContentLoaded', () => {
  const reviewsContainer = document.getElementById('reviews-container');
  reviewData.forEach(data => {
    const reviewCard = createReviewCard(data);
    reviewsContainer.appendChild(reviewCard);
  });
});

const clubsData = [
  {
    name: "Крылья",
    address: "г. Москва, ул. Толбухина, д. 10, к. 4, ДС \"Крылья Советов\"",
    metro: "Молодежная, Лужники",
    link: "url_to_club_page" // Замените на актуальную ссылку на страницу клуба
  },
  {
    name: "Лужники",
    address: "г. Москва, СК Лужники, Малая спортивная арена",
    metro: "Воробьевы горы, Спортивная",
    link: "url_to_club_page"
  },
  {
    name: "Wing's Club",
    address: "г. Москва, Баргатионовский пр., д. 5 (ТЦ Филион 4 этаж)",
    metro: "Багратионовская, Фили",
    link: "url_to_club_page"
  }
];

function createClubElement(club) {
  const clubElement = document.createElement('div');
  clubElement.classList.add('club');

  const clubName = document.createElement('a');
  clubName.textContent = club.name;
  clubName.href = club.link;
  clubName.classList.add('club-name');
  clubElement.appendChild(clubName);

  const clubAddress = document.createElement('div');
  clubAddress.textContent = club.address;
  clubAddress.classList.add('club-address');
  clubElement.appendChild(clubAddress);

const clubMetroContainer = document.createElement('div');
  clubMetroContainer.classList.add('club-metro-container');

  const metroIcon = document.createElement('img');
  metroIcon.src = 'images/metro.svg'; // Убедитесь, что путь к файлу верный
  metroIcon.alt = 'Метро';
  metroIcon.classList.add('metro-icon');
  clubMetroContainer.appendChild(metroIcon);

  const clubMetro = document.createElement('div');
  clubMetro.textContent = club.metro;
  clubMetro.classList.add('club-metro');
  clubMetroContainer.appendChild(clubMetro);

  clubElement.appendChild(clubMetroContainer);

  return clubElement;
}
document.addEventListener('DOMContentLoaded', () => {
  const clubsContainer = document.getElementById('clubs-container'); // Получаем уже существующий элемент

  clubsData.forEach(club => {
    const clubElement = createClubElement(club);
    clubsContainer.appendChild(clubElement);
  });

  // Больше не нужно добавлять clubsContainer в body, так как он уже в DOM
});

document.addEventListener('DOMContentLoaded', () => {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const currentActiveQuestion = document.querySelector('.faq-question.active');
      if (currentActiveQuestion && currentActiveQuestion !== question) {
        currentActiveQuestion.classList.remove('active');
        currentActiveQuestion.nextElementSibling.classList.remove('active');
        currentActiveQuestion.nextElementSibling.style.maxHeight = 0;
      }

      question.classList.toggle('active');
      const answer = question.nextElementSibling;
      answer.classList.toggle('active');
      answer.style.maxHeight = answer.classList.contains('active') ? `${answer.scrollHeight}px` : '0';
    });
  });
});

const faqData = [
  {
    question: 'Как мне записаться на тренировки по настольному теннису?',
    answer: 'Записаться можно через наш сайт в разделе расписания или позвонив по телефону, указанному в контактах.'
  },
  {
    question: 'Какова разница между групповыми и индивидуальными тренировками?',
    answer: 'Групповые тренировки направлены на командную работу, в то время как индивидуальные тренировки фокусируются на ваших личных целях и навыках.'
  },
  {
    question: 'Есть ли у вас абонементы на тренировки?',
    answer: 'Да, у нас есть различные абонементы, чтобы вы могли выбрать наиболее подходящий для себя вариант.'
  },
  {
    question: 'Могу ли я присоединиться к групповым занятиям, если я никогда раньше не играл в настольный теннис?',
    answer: 'Конечно, наши групповые занятия подходят для всех уровней подготовки, включая начинающих.'
  },
  {
    question: 'Предоставляете ли вы все необходимое оборудование для тренировок?',
    answer: 'Да, мы предоставляем все необходимое оборудование. Вам нужно только прийти и наслаждаться игрой!'
  }
];

// Функция для создания элемента вопроса и ответа
function createFaqItem(question, answer) {
  const faqItem = document.createElement('div');
  faqItem.classList.add('faq-item');

  const faqQuestion = document.createElement('button');
  faqQuestion.classList.add('faq-question');
  faqQuestion.innerHTML = `${question} <span class="arrow">&#9660;</span>`;
  faqItem.appendChild(faqQuestion);

  const faqAnswer = document.createElement('div');
  faqAnswer.classList.add('faq-answer');
  faqAnswer.innerHTML = `<p>${answer}</p>`;
  faqItem.appendChild(faqAnswer);

  return faqItem;
}

// Функция для инициализации FAQ блока
function initFaq(faqData) {
  const faqContainer = document.createElement('div');
  faqContainer.classList.add('faq-container');

  faqData.forEach(faq => {
    const faqItem = createFaqItem(faq.question, faq.answer);
    faqContainer.appendChild(faqItem);
  });

  const faqSection = document.getElementById('faq-section');
  faqSection.appendChild(faqContainer);

  // Аккордеон логика
  faqContainer.addEventListener('click', function(event) {
    const target = event.target.closest('.faq-question');
    if (!target) return;

    const isActive = target.classList.contains('active');
    faqContainer.querySelectorAll('.faq-question').forEach(question => {
      question.classList.remove('active');
      question.nextElementSibling.style.maxHeight = 0;
    });

    if (!isActive) {
      target.classList.add('active');
      const answer = target.nextElementSibling;
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initFaq(faqData);
});

const videoIDs = [
  'kWmhrjJQe9Q',
  'a5iF83N9P1A',
  'hBckMNiZ-MI',
  'rW623Kugitc'
];

// Функция для создания и возврата элемента iframe для видео на YouTube
function createVideoIframe(videoID) {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('width', '100%');
  iframe.setAttribute('height', '100%');
  iframe.setAttribute('src', `https://www.youtube.com/embed/${videoID}`);
  iframe.setAttribute('title', 'YouTube video player');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
  iframe.setAttribute('allowfullscreen', true);
  return iframe;
}

// Функция для добавления видео в контейнер
function addVideosToContainer(videoIDs) {
  const videoContainer = document.querySelector('.video-container');
  videoIDs.forEach(videoID => {
    const videoWrapper = document.createElement('div');
    videoWrapper.classList.add('video-wrapper');
    const iframe = createVideoIframe(videoID);
    videoWrapper.appendChild(iframe);
    videoContainer.appendChild(videoWrapper);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  addVideosToContainer(videoIDs);
});

document.addEventListener('DOMContentLoaded', () => {
    
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', function(event) {
    console.log("errorMessage")
    event.preventDefault();
    let valid = true;

    this.querySelectorAll('.input-group input, .input-group textarea').forEach(input => {
      const errorMessage = input.nextElementSibling; 
      console.log(errorMessage) // Получаем элемент сообщения об ошибке
      if (!input.value.trim()) {
        errorMessage.textContent = 'Это поле необходимо заполнить'; // Устанавливаем текст сообщения об ошибке
        errorMessage.style.display = 'block'; // Делаем сообщение об ошибке видимым
        valid = false;
      } else {
        errorMessage.style.display = 'none'; // Скрываем сообщение об ошибке
      }
    });

    if (valid) {
      // Если форма валидна, отправляем данные
      // Здесь может быть код для отправки данных через AJAX или другой
      console.log('Форма отправлена'); // Заглушка для демонстрации отправки формы
    }
  });
});