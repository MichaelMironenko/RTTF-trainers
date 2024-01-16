const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      isContainerCentered: false,
      isReviewsContainerCentered: false,
      isVideosContainerCentered: false,
      reviews: [],
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
      isLoading: true,
      activeIndex: null,
      subdomain: null,
      activeVideoID: null,
      showModal: false,
      errorMessage: null,
    };
  },

  created() {
    this.loadData();

    // Устанавливаем заголовок страницы после того, как данные загружены

    setTimeout(this.loadMapScript, 4000); // Задержка в 1 секунду после полной загрузки страницы
  },
  mounted() {
    this.$nextTick(() => {
      this.adjustAlignment();
      window.addEventListener("resize", this.adjustAlignment);
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.adjustAlignment);
  },
  watch: {
    trainingsData(newVal) {
      if (newVal && newVal.length) {
        this.$nextTick(this.adjustAlignment);
      }
    },
    reviewsData(newVal) {
      if (newVal && newVal.length) {
        this.$nextTick(this.adjustAlignment);
      }
    },
  },
  methods: {
    async loadData() {
      this.isLoading = true;
      try {
        this.subdomain = window.location.hostname.split(".")[0];
        console.log(this.subdomain);
        const dataUrl = `/json/${this.subdomain}.json`;
        const response = await fetch(dataUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
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
        console.log(this.mainInfo);
        await this.loadAndProcessExtraData();

        // Продолжение присваивания данных, если это необходимо...
      } catch (e) {
        console.error("Ошибка при загрузке данных: ", e);
      } finally {
        this.isLoading = false;
        console.log("isLoading =", this.isLoading);
        setTimeout(() => {
          this.adjustAlignment();
        }, 0);

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
    adjustAlignment() {
      this.adjustScheduleAlignment();
      this.adjustReviewsAlignment();
      this.adjustVideosAlignment();
    },
    adjustScheduleAlignment() {
      const container = this.$refs.scheduleContainer;
      if (container) {
        let totalWidth = 0;
        const children = container.getElementsByClassName("training-day");
        for (let child of children) {
          totalWidth += child.offsetWidth;
        }
        const windowWidth = window.innerWidth;
        this.isContainerCentered = totalWidth < windowWidth;
      }
    },
    adjustReviewsAlignment() {
      const reviewsContainer = this.$refs.reviewsContainer;
      if (reviewsContainer) {
        let totalWidth = 0;
        const children = reviewsContainer.getElementsByClassName("review-card");
        for (let child of children) {
          totalWidth += child.offsetWidth;
        }
        const windowWidth = window.innerWidth;
        this.isReviewsContainerCentered = totalWidth < windowWidth;
      }
    },
    adjustVideosAlignment() {
      const videosContainer = this.$refs.videosContainer;
      if (videosContainer) {
        let totalWidth = 0;
        const children = videosContainer.getElementsByClassName("lazy-video");
        for (let child of children) {
          totalWidth += child.offsetWidth;
        }
        const windowWidth = window.innerWidth;
        this.isVideosContainerCentered = totalWidth < windowWidth;
      }
    },
    async loadAndProcessExtraData() {
      const extraDataUrl = `/php/getData.php?trainer=${this.subdomain}`;
      try {
        const response = await fetch(extraDataUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const extraData = await response.json();

        if (extraData.err) {
          throw new Error(`Server error: ${extraData.err}`);
        }

        this.trainingsData = this.processTrainingData(extraData.trainings);
        this.reviews.reviewData = extraData.reviews;
        this.reviews.averageRating = extraData.averageRating;
        this.videos.videoIDs = extraData.videos;
        setTimeout(() => {
          this.adjustAlignment();
        }, 0);
      } catch (error) {
        console.error("Ошибка при загрузке данных о тренировках: ", error);
      }
    },

    // setMeta(metaName, content) {
    //   let metas = document.getElementsByTagName("meta");
    //   for (let i = 0; i < metas.length; i++) {
    //     if (metas[i].getAttribute("name") === metaName) {
    //       metas[i].setAttribute("content", content);
    //       return;
    //     }
    //   }
    //   // Если мета-тег не найден, создаем новый
    //   let meta = document.createElement("meta");
    //   meta.setAttribute("name", metaName);
    //   meta.setAttribute("content", content);
    //   document.getElementsByTagName("head")[0].appendChild(meta);
    // },
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
      if (this.clubs.list.length > 0) {
        const script = document.createElement("script");
        script.src =
          "https://api-maps.yandex.ru/2.1/?apikey=b8881559-3564-4ced-9428-3763a582d14d&lang=ru_RU";
        script.type = "text/javascript";
        document.body.appendChild(script);

        // Инициализация карты после загрузки скрипта
        script.onload = () => {
          ymaps.ready(this.initMap);
        };
      }
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
    processTrainingData(rawData) {
      return Object.keys(rawData).map((dateStr) => {
        return {
          date: this.getFormattedDate(dateStr),
          trainings: rawData[dateStr].trainings.map((t) => ({
            ...t,
            duration: `${t.duration} ч`,
            price: `${t.price}₽`,
          })),
        };
      });
    },

    getFormattedDate(dateStr) {
      const date = new Date(dateStr);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const options = { month: "long", day: "numeric" };
      const formattedDate = date.toLocaleDateString("ru-RU", options);

      if (date.toDateString() === today.toDateString()) {
        return `Сегодня, ${formattedDate}`;
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return `Завтра, ${formattedDate}`;
      } else {
        return `${this.getDayOfWeek(date)}, ${formattedDate}`;
      }
    },

    getDayOfWeek(date) {
      const days = [
        "Воскресенье",
        "Понедельник",
        "Вторник",
        "Среда",
        "Четверг",
        "Пятница",
        "Суббота",
      ];
      return days[date.getDay()];
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
      this.activeVideoID = videoID;
    },
    async submitForm() {
      // Сохраняем данные формы
      const formData = new FormData();
      formData.append("trainer", this.subdomain);
      formData.append("name", this.form.name);
      formData.append("phone", this.form.phone);
      formData.append("message", this.form.message);
      formData.append("contact_method", this.form.contact_method);
      console.log(formData);
      try {
        // Отправляем данные на сервер
        const response = await fetch("php/request.php", {
          method: "POST",
          body: formData,
        });

        const responseData = await response.json();

        if (responseData.err) {
          this.errorMessage = data.err;
          this.showModal = true;
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
    closeErrorMessage() {
      this.errorMessage = "";
      this.showModal = false;
    },
    handleNavLinkClick(section) {
      const navbarHeight = document.querySelector(".navbar").offsetHeight;
      const element = document.querySelector(section);
      if (element) {
        const elementPosition =
          element.getBoundingClientRect().top + window.scrollY - navbarHeight;
        window.scrollTo({ top: elementPosition, behavior: "smooth" });
      }
      this.closeNav();
    },
  },
  computed: {
    // isCommentLong() {
    //   return (comment) => comment.length > 200;
    // },
    formattedAboutText() {
      // Use double <br> to create a space between paragraphs
      return this.aboutMe.description.replace(/\n/g, "<br>");
    },
  },
});
app.mount("#app");
