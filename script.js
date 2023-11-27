document.addEventListener("DOMContentLoaded", function () {
  var hamburger = document.querySelector(".nav-hamburger");
  var navLinks = document.querySelector(".nav-links");
  var navClose = document.querySelector(".nav-close");

  hamburger.addEventListener("click", function () {
    navLinks.classList.add("active");
    navClose.classList.add("active");
    hamburger.classList.add("active");
  });

  navClose.addEventListener("click", function () {
    navLinks.classList.remove("active");
    navClose.classList.remove("active");
    hamburger.classList.remove("active");
  });
});

new Vue({
  el: "#app",
  data: {
    mainSection: {
      subtitle: "Анна Вознесенская, тренер",
      heading: "Групповые и персональные тренировки",
      image: "images/anna-transparent.png",
    },
    trainingsData: [
      {
        date: "Сегодня, 15 ноября",
        trainings: [
          {
            time: "10:30",
            duration: "1,5 ч",
            name: "Групповая тренировка",
            location: "Люблино",
            participants: 2,
            price: "900₽",
          },
          {
            time: "11:00",
            duration: "1,5 ч",
            name: "Боковые подачи и их прием. Топ-спин справа со всего стола",
            location: "HurricaneTT",
            participants: 0,
            price: "700₽",
          },
          {
            time: "13:30",
            duration: "1,5 ч",
            name: "Групповая тренировка",
            location: "Люблино",
            participants: 0,
            price: "800₽",
          },
        ],
      },
      {
        date: "Завтра, 16 ноября",
        trainings: [
          {
            time: "19:00",
            duration: "2 ч",
            name: "Топ-спины справа с продолжением (двух и трехходовки)",
            location: "ЛуЦентр",
            participants: 2,
            price: "1000₽",
          },
          {
            time: "20:00",
            duration: "1,5 ч",
            name: "Отработка подач в сочетании с топ-спином",
            location: "Люблино",
            participants: "0/12",
            price: "1000₽",
          },
        ],
      },
      {
        date: "Четверг, 17 ноября",
        trainings: [
          {
            time: "15:00",
            duration: "1,5 ч",
            name: "Отработка базовых элементов",
            location: "HurricaneTT",
            participants: 6,
            price: "500₽",
          },
          {
            time: "17:00",
            duration: "2 ч",
            name: "Индивидуальная тренировка",
            location: "TTL-Savel",
            participants: 4,
            price: "800₽",
          },
          {
            time: "18:30",
            duration: "1,5 ч",
            name: "Группа повышения мастерства",
            location: "HurricaneTT",
            participants: "3/12",
            price: "1000₽",
          },
        ],
      },
    ],
    activeDay: 0,
    aboutMeData: {
      aboutTitle: "Обо мне",
      photoUrl: "images/Anna2.jpg",
      aboutText:
        "Привет! Меня зовут Анна Вознесенская, и я тренер по настольному теннису. \n\nОбучаю детей и взрослых, вдохновляю на достижения в спорте и в жизни. Персональные тренировки и групповые занятия проходят в дружелюбной, поддерживающей атмосфере. Моя методика — это сбалансированное сочетание физической нагрузки и психологического комфорта. Я стараюсь быть не просто тренером, но и наставником, который всегда поддержит и поможет. \n\nЛегкость в общении и вежливость — мои неизменные спутники. Ценю индивидуальный подход к каждому ученику, верю в мощь личного примера и постоянного самосовершенствования. Давайте вместе стремиться к лучшей версии себя!",
      achievements: [
        {
          emoji: "🏆",
          text: "Кандидат в мастера спорта по настольному теннису",
        },
        { emoji: "🥇", text: "Победитель Первенства Москвы" },
        { emoji: "🏆", text: "Призер Чемпионата России" },
        { emoji: "🏆", text: "Призер Международных соревнований" },
        { emoji: "👩‍🏫", text: "Более 5 лет опыта работы тренером" },
        { emoji: "👨‍👩‍👦", text: "Обучаю взрослых и детей" },
      ],
    },

    personalTrainings: {
      title: "Индивидуальные тренировки",
      imageUrl: "images/personal-training.jpg",
      description:
        "Не важно, планируете ли вы стать чемпионом России или выигрывать на любительских турнирах, я помогу вам достичь вашей цели. Вы заметите прогресс уже после первого занятия, а регулярные занятия постепенно поднимут ваше мастерство на новый уровень. Тренировки разнообразны по содержанию и включают в себя следующие элементы:",
      trainingTopics: [
        {
          emoji: "👟",
          title: "Разминка",
          text: "Для разогрева мышц, чтобы подготовить тело к тренировке и не допустить получения травм.",
        },
        {
          emoji: "🏋️‍♀️",
          title: "Физическая подготовка",
          text: "Специальные упражнения для усиления силы, ловкости и быстроты реакции.",
        },
        {
          emoji: "🏓",
          title: "Постановка техники",
          text: "Корректировка ошибок или постановка техники с нуля. Игра по элементам.",
        },
        {
          emoji: "🧠",
          title: "Игровые упражнения",
          text: "Чтобы тренировочный процесс был более интересным.",
        },
        {
          emoji: "🤾‍♂️",
          title: "Шпиль",
          text: "Игра как шпилями, так и против них.",
        },
        {
          emoji: "🏆",
          title: "Игра в турнирах",
          text: "Советы по игре на счет, тактика, выявление слабых сторон соперника, выигрышные комбинации.",
        },
        {
          emoji: "⚔️",
          title: "Атакующая игра",
          text: 'Постановка топ-спинов справа и игра против блоков/подставок, "свечек".',
        },
        {
          emoji: "🛡",
          title: "Защитная игра",
          text: "Научимся играть по защите, так и против неё.",
        },
        {
          emoji: "🤹‍♂️",
          title: "Подачи",
          text: "Разучим разные варианты подач (нижние, верхние, боковые и левые).",
        },
        {
          emoji: "📹",
          title: "Видео",
          text: "Запись тренировки на видео, чтобы увидев себя со стороны, работать над ошибками.",
        },
      ],
    },
    prices: {
      title: "Цены на индивидуальные тренировки",
      priceCards: [
        {
          duration: "1 час",
          price: "2500 ₽",
          features: [
            "Постановка техники",
            "Игровые упражнения",
            "Атака и защита",
            "Аренда стола уже включена",
          ],
        },
        {
          duration: "1,5 часа",
          price: "3500 ₽",
          features: [
            "Углубленная работа над техникой",
            "Специализированные упражнения",
            "Индивидуальная тактическая подготовка",
            "Разбор игровых ситуаций",
          ],
        },
        {
          duration: "2 часа",
          price: "4500 ₽",
          features: [
            "Комплексная тренировка",
            "Физическая подготовка",
            "Ментальная подготовка",
            "Полная разработка игрового стиля",
          ],
        },
      ],
    },
    reviews: {
      title: "Отзывы с сайта RTTF",
      reviewData: [
        {
          name: "Александр Семёнов",
          rating: 5,
          gameRating: 950,
          comment:
            "Тренер на высоте! Методики преподавания новые и эффективные, заметный результат уже после нескольких занятий.",
          date: "24 июня 2023 г.",
          avatar: "images/user1.png",
        },
        {
          name: "Дмитрий Смирнов",
          rating: 4,
          gameRating: 870,
          comment:
            "Хорошо структурированные тренировки. Много полезной информации, но иногда хочется больше практики.",
          date: "15 июля 2023 г.",
          avatar: "images/user2.png",
        },
        {
          name: "Игорь Николаев",
          rating: 5,
          gameRating: 820,
          comment:
            "Отличная работа! Тренер уделяет внимание каждому ученику, помогает разобраться в сложных моментах.",
          date: "10 августа 2023 г.",
          avatar: "images/user3.png",
        },
        {
          name: "Елена Петрова",
          rating: 5,
          gameRating: 910,
          comment:
            "Тренер внимательный и профессиональный. Занятия проходят интересно, есть четкий план на каждую тренировку.",
          date: "21 августа 2023 г.",
          avatar: "images/user4.png",
        },
        {
          name: "Мария Иванова",
          rating: 3,
          gameRating: 780,
          comment:
            "Занятия в целом неплохие, но ожидал более интенсивной программы. Занятия в целом неплохие, но ожидал более интенсивной программы.Занятия в целом неплохие, но ожидал более интенсивной программы.Иногда кажется, что времени уделяется меньше, чем заявлено.",
          date: "2 сентября 2023 г.",
          avatar: "images/user5.png",
        },
      ],
    },
    locations: {
      title: "Я тренирую в следующих клубах",

      clubsData: [
        {
          name: "Крылья Советов",
          address: 'г. Москва, ул. Толбухина, д. 10, к. 4, ДС "Крылья Советов"',
          metro: "Молодежная, Лужники",
          link: "https://rttf.ru/halls/1", //
        },
        {
          name: "Лужники",
          address: "ул. Лужники, 24, стр. 3",
          metro: "Воробьевы горы, Спортивная",
          link: "https://rttf.ru/halls/21",
        },
        {
          name: "Wing's Club",
          address: "г. Москва, Баргатионовский пр., д. 5 (ТЦ Филион 4 этаж)",
          metro: "Багратионовская, Фили",
          link: "https://rttf.ru/halls/360",
        },
      ],
    },
    faq: {
      title: "Часто задаваемые вопросы",
      items: [
        {
          question: "Как мне записаться на тренировки по настольному теннису?",
          answer:
            "Записаться можно через наш сайт в разделе расписания или позвонив по телефону, указанному в контактах.",
        },
        {
          question:
            "Какова разница между групповыми и индивидуальными тренировками?",
          answer:
            "Групповые тренировки направлены на командную работу, в то время как индивидуальные тренировки фокусируются на ваших личных целях и навыках.",
        },
        {
          question: "Есть ли у вас абонементы на тренировки?",
          answer:
            "Да, у нас есть различные абонементы, чтобы вы могли выбрать наиболее подходящий для себя вариант.",
        },
        {
          question:
            "Могу ли я присоединиться к групповым занятиям, если я никогда раньше не играл в настольный теннис?",
          answer:
            "Конечно, наши групповые занятия подходят для всех уровней подготовки, включая начинающих.",
        },
        {
          question:
            "Предоставляете ли вы все необходимое оборудование для тренировок?",
          answer:
            "Да, мы предоставляем все необходимое оборудование. Вам нужно только прийти и наслаждаться игрой!",
        },
      ],
      activeIndex: null, // Индекс активного вопроса
    },
    videos: {
      title: "Видео со мной",
      videoIDs: ["kWmhrjJQe9Q", "a5iF83N9P1A", "hBckMNiZ-MI", "rW623Kugitc"],
      activeVideoID: null,
    },
    contacts: {
      title: "Контакты",
      trainerName: "Анна",
      trainerSurname: "Вознесенская",
      avatar: "images/Anna-40px.png",
      phoneLink: "https://wa.me/71234567890",
      telegramLink: "https://t.me/71234567890",
      phoneNumber: "+7 123 456-78-90",
      email: "anna-voznesenskaya@example.com",
      rttfLink: "https://rttf.ru/anna-voznesenskaya",
      rttfProfile: "@anna-voznesenskaya",
    },
    isNavOpen: false,
  },

  mounted() {
    this.initMap();
  },
  methods: {
    switchDay(index) {
      this.activeDay = index;
    },
    getDayDisplay(index) {
      return window.innerWidth < 430 && this.activeDay !== index
        ? "none"
        : "block";
    },
    getStarImage(rating, index) {
      return index < rating ? "images/full-star.svg" : "images/empty-star.svg";
    },
    initMap() {
      ymaps.ready(() => {
        this.myMap = new ymaps.Map("map", {
          center: [55.76, 37.64], // Изначальные координаты центра карты
          zoom: 10,
        });

        this.addClubsToMap();
      });
    },
    addClubsToMap() {
      var geoObjects = [];

      for (let club of this.locations.clubsData) {
        ymaps.geocode(club.address, { results: 1 }).then((res) => {
          var firstGeoObject = res.geoObjects.get(0),
            coords = firstGeoObject.geometry.getCoordinates();

          // Создаем метку с названием клуба
          var placemark = new ymaps.Placemark(
            coords,
            {
              balloonContentHeader: club.name,
              balloonContent: `<a href="${club.link}" target="_blank">${club.name}</a><br>${club.address}<br>Метро: ${club.metro}`,
              iconContent: club.name, // Текст надписи на метке
            },
            {
              preset: "islands#blueStretchyIcon", // Стиль метки с надписью
            }
          );

          this.myMap.geoObjects.add(placemark);
          geoObjects.push(placemark);

          if (geoObjects.length === this.locations.clubsData.length) {
            var bounds = this.myMap.geoObjects.getBounds();
            if (bounds) {
              this.myMap.setBounds(bounds, {
                checkZoomRange: true,
                zoomMargin: 9,
              });
            }
          }
        });
      }
    },
    toggleActive(index) {
      if (this.faq.activeIndex === index) {
        // Если нажатый вопрос уже активен, закрываем его
        this.faq.activeIndex = null;
      } else {
        if (this.faq.activeIndex !== null) {
          // Сначала закрываем текущий активный вопрос
          const currentActiveIndex = this.faq.activeIndex;
          this.faq.activeIndex = null;

          // Задержка перед открытием нового вопроса
          setTimeout(() => {
            this.faq.activeIndex = index;
          }, 200); // Задержка должна соответствовать времени анимации
        } else {
          // Если ни один вопрос не активен, открываем новый сразу
          this.faq.activeIndex = index;
        }
      }
    },
    isActive(index) {
      return index === this.faq.activeIndex;
    },
    playVideo(videoID) {
      this.videos.activeVideoID = videoID;
    },
    toggleNav() {
      this.isNavOpen = !this.isNavOpen;
    },
    closeNav() {
      this.isNavOpen = false;
    },
  },
  computed: {
    formattedAboutText() {
      // Use double <br> to create a space between paragraphs
      return this.aboutMeData.aboutText.replace(/\n/g, "<br>");
    },
  },
});
