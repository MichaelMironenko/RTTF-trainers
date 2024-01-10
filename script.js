console.log("start loading");
const { createApp } = Vue;

const app = createApp({
  data() {
    return {
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

      submitted: false,
      form: {
        name: "",
        phone: "",
        message: "",
        contact_method: "",
      },
      isNavOpen: false,
      activeDay: 0,
      expandedComment: null,
      isLoading: false,
      activeIndex: null,
    };
  },

  created() {
    this.loadData();

    // Устанавливаем заголовок страницы после того, как данные загружены

    setTimeout(this.loadMapScript, 4000); // Задержка в 1 секунду после полной загрузки страницы
  },
  methods: {
    async loadData() {
      this.isLoading = true;
      try {
        const subdomain = window.location.hostname.split(".")[0];
        console.log(subdomain);
        const dataUrl = `/json/${subdomain}.json`;
        const response = await fetch(dataUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Присваивание данных к вашим переменным
        this.mainInfo = data.sections.mainInfo;
        this.aboutMe = data.sections.aboutMe;
        this.groupTraining = data.sections.groupTraining;
        this.individualTraining = data.sections.individualTraining;
        this.prices = data.sections.prices;
        this.reviews = data.sections.reviews;
        this.clubs = data.sections.clubs;
        this.benefitsTT = data.sections.benefitsTT;
        this.faq = data.sections.faq;
        this.videos = data.sections.videos;
        this.contacts = data.sections.contacts;

        // Продолжение присваивания данных, если это необходимо...
      } catch (e) {
        console.error("Ошибка при загрузке данных: ", e);
      } finally {
        this.isLoading = false;

        document.title =
          this.mainInfo.name +
          " " +
          this.mainInfo.surname +
          " - Тренер по настольному теннису";

        // Устанавливаем мета-теги
        this.setMeta(
          "description",
          "Профессиональные уроки и тренировки по настольному теннису с " +
            this.mainInfo.name +
            " " +
            this.mainInfo.surname
        );
        this.setMeta(
          "keywords",
          "настольный теннис, тренировки, " +
            this.mainInfo.name +
            " " +
            this.mainInfo.surname
        );
      }
    },

    setMeta(metaName, content) {
      let metas = document.getElementsByTagName("meta");
      for (let i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute("name") === metaName) {
          metas[i].setAttribute("content", content);
          return;
        }
      }
      // Если мета-тег не найден, создаем новый
      let meta = document.createElement("meta");
      meta.setAttribute("name", metaName);
      meta.setAttribute("content", content);
      document.getElementsByTagName("head")[0].appendChild(meta);
    },
    switchDay(index) {
      this.activeDay = index;
    },
    toggleComment(index) {
      this.expandedComment = this.expandedComment === index ? null : index;
    },
    getDayDisplay(index) {
      return window.innerWidth < 430 && this.activeDay !== index
        ? "none"
        : "block";
    },
    getStarImage(rating, index) {
      const fullStarIndex = Math.floor(rating);
      const halfStarIndex = fullStarIndex + (rating % 1 > 0 ? 1 : 0);

      if (index <= fullStarIndex) {
        return "images/full-star.svg";
      } else if (index === halfStarIndex) {
        return "images/half-star.svg"; // Путь к изображению полупустой звезды
      } else {
        return "images/empty-star.svg";
      }
    },
    loadMapScript() {
      // Создаем тег script для загрузки Yandex карты
      const script = document.createElement("script");
      script.src =
        "https://api-maps.yandex.ru/2.1/?apikey=b8881559-3564-4ced-9428-3763a582d14d&lang=ru_RU";
      script.type = "text/javascript";
      document.body.appendChild(script);

      // Инициализация карты после загрузки скрипта
      script.onload = () => {
        ymaps.ready(this.initMap);
      };
    },
    initMap() {
      this.myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 10,
      });
      this.addClubsToMap();
    },
    addClubsToMap() {
      var geoObjects = [];

      for (let club of this.clubs.list) {
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

          if (geoObjects.length === this.clubs.list.length) {
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
      if (this.activeIndex === index) {
        // Если нажатый вопрос уже активен, закрываем его
        this.activeIndex = null;
      } else {
        if (this.activeIndex !== null) {
          // Сначала закрываем текущий активный вопрос
          const currentActiveIndex = this.activeIndex;
          this.activeIndex = null;

          // Задержка перед открытием нового вопроса
          setTimeout(() => {
            this.activeIndex = index;
          }, 200);
        } else {
          // Если ни один вопрос не активен, открываем новый сразу
          this.activeIndex = index;
        }
      }
    },
    isActive(index) {
      return index === this.activeIndex;
    },
    playVideo(videoID) {
      this.videos.activeVideoID = videoID;
    },
    async submitForm() {
      // Сохраняем данные формы
      const formData = new FormData();
      formData.append("name", this.form.name);
      formData.append("phone", this.form.phone);
      formData.append("message", this.form.message);
      formData.append("contact_method", this.form.contact_method);

      try {
        // Отправляем данные на сервер
        const response = await fetch("php/request.php", {
          method: "POST",
          body: formData,
        });

        const responseData = await response.json();

        if (responseData.err) {
          // Обработка ошибок, если они есть
          console.error(responseData.err);
          // Показать сообщение об ошибке пользователю
        } else {
          // Успешная отправка данных
          this.submitted = true; // Показываем сообщение об успешной отправке

          // Очищаем форму
          this.form.name = "";
          this.form.phone = "";
          this.form.message = "";
          this.form.contact_method = "";

          // Скрываем сообщение об успешной отправке через 3 секунды
          setTimeout(() => {
            this.submitted = false;
          }, 3000);
        }
      } catch (error) {
        console.error("Ошибка отправки формы:", error);
        // Показать сообщение об ошибке пользователю
      }
    },
    toggleNav() {
      this.isNavOpen = !this.isNavOpen;
    },
    closeNav() {
      this.isNavOpen = false;
    },
    handleNavClick(event) {
      if (event.target.tagName === "A") {
        event.preventDefault();
        this.handleNavLinkClick(event.target.getAttribute("href"));
      }
    },
    handleNavLinkClick(section) {
      const element = document.querySelector(section);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      this.closeNav();
    },
  },
  computed: {
    isCommentLong() {
      return (comment) => comment.length > 200;
    },
    formattedAboutText() {
      // Use double <br> to create a space between paragraphs
      return this.aboutMe.description.replace(/\n/g, "<br>");
    },
  },
});
app.mount("#app");
