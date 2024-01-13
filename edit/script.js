const { createApp } = Vue;

const InputField = {
  props: {
    id: String,
    label: String,
    type: { type: String, default: "text" },
    rows: { type: Number, default: 3 },
    maxlength: Number,
    required: Boolean,
    error: Boolean,
    errorMessage: String,
    isSubmitAttempted: Boolean,
    sectionName: String,
    placeholder: String,
    modelValue: String,
  },

  computed: {
    charsLeft() {
      return this.maxlength - this.modelValue.length;
    },
    effectiveErrorMessage() {
      return this.errorMessage || "Введите текст";
    },
    shouldShowError() {
      return (
        this.required &&
        !this.modelValue &&
        (this.isSubmitAttempted || this.modelValue !== "")
      );
    },
  },
  methods: {
    updateValue(event) {
      this.$emit("update:modelValue", event.target.value);
    },
  },

  template: `
  <div class="input-wrapper">
      <label :for="id" :class="{ 'required-label': required }">{{ label }}</label>
      <div class="input-and-error">
        <input v-if="type !== 'textarea'" :type="type" :placeholder="placeholder" :id="id" :class="{ 'error-border': shouldShowError }" :value="modelValue" :maxlength="maxlength"
            @input="updateValue"/>
        <textarea v-else :id="id" :value="modelValue" :placeholder="placeholder" :class="{ 'error-border': shouldShowError }"   :maxlength="maxlength" :rows="rows"
            @input="updateValue"></textarea>
        <div class="input-feedback"> 
          <div class="error-message" v-if="shouldShowError">{{ effectiveErrorMessage }}</div>
          <div class="character-count" v-if="charsLeft <= 10">{{ charsLeft }}</div>
        </div>
      </div>
    </div>`,
};

const PhotoUpload = {
  data() {
    return {
      imageData: null,
    };
  },
  props: {
    label: String,
    modelValue: String,
    isAvatar: Boolean,
    sectionId: String,
  },
  methods: {
    triggerUpload() {
      this.$refs.fileInput.click();
    },
    handleFileSelected(event) {
      const file = event.target.files[0];
      this.previewImage(file);
    },
    previewImage(file) {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const scaleFactor = 600 / img.width;
            canvas.width = 600;
            canvas.height = img.height * scaleFactor;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const resizedImage = canvas.toDataURL();

            this.$emit("update:modelValue", resizedImage);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    dragOverHandler(event) {
      event.preventDefault();
      event.currentTarget.classList.add("dragover");
    },
    dragLeaveHandler(event) {
      event.currentTarget.classList.remove("dragover");
    },
    dropHandler(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      this.previewImage(file);
      event.currentTarget.classList.remove("dragover");
    },
  },
  template: `
   <div class="avatar-upload-area" >
      <label class="avatar-label">{{ label }}</label>
      <div class="upload-container">
        <div  :class="{ 'avatar-container': isAvatar }" >
          <img v-if="modelValue" :src="modelValue" :alt="label + ' preview'" class="avatar-placeholder" />
          <img v-else src="user-photo.svg" alt="label + ' placeholder'" class="avatar-placeholder" />
        </div>
        <div class="upload-area" @click="triggerUpload" @dragover="dragOverHandler" 
             @dragleave="dragLeaveHandler" @drop="dropHandler">
          <img src="upload-icon.svg" alt="Upload" class="upload-icon" />
          <span class="upload-text">Загрузить фото</span>
        </div>
        <input type="file" ref="fileInput" @change="handleFileSelected" class="upload-input" />
      </div>
    </div>
  `,
};

const featureList = {
  props: {
    initialFeatures: Array,
    includeTitle: Boolean,
    isSubmitAttempted: Boolean,
    listTitle: String,
    sectionId: String,
  },
  data() {
    return {
      features: this.initialFeatures || [],
    };
  },
  methods: {
    addFeature() {
      if (this.features.length < 12) {
        this.features.push({
          emoji: "",
          title: "",
          description: "",
          error: false,
        });
      }
    },
    removeFeature(index) {
      this.features.splice(index, 1);
    },

    validateFeature(index) {
      const feature = this.features[index];
      feature.error = this.isFeatureIncomplete(feature);
    },
    isFeatureIncomplete(feature) {
      return this.includeTitle
        ? !feature.emoji || !feature.title || !feature.description
        : !feature.emoji || !feature.description;
    },
    validateAllFeatures() {
      this.features = this.features.filter(
        (feature) => !this.isFeatureEmpty(feature)
      );
      return this.features.every(
        (feature) => !this.isFeatureIncomplete(feature)
      );
    },
    isFeatureEmpty(feature) {
      return !feature.emoji && !feature.title && !feature.description;
    },
  },
  template: `
     <div class="features-container">

        <div class="features-title">{{ listTitle }}</div>
        <div v-for="(feature, index) in features" :key="index" :class="['feature-item', { 'no-title': !includeTitle }]">

            <div class="inputs-container">
                <!-- Emoji Input -->
                <div class="emoji-group">
                    <label>Эмодзи</label>
                    <input v-model="feature.emoji" maxlength="2" @input="validateFeature(index)" class="emoji-input" />
                </div>

                <!-- Title Input - Only for training elements -->
                <div v-if="includeTitle" class="input-group title-group">
                    <label>Заголовок</label>
                    <input type="text" v-model="feature.title" maxlength="50" @input="validateFeature(index)"
                        class="title-input" />
                    <span class="character-count" v-if="(50 - feature.title.length) < 10">{{ 50 - feature.title.length
                    }}</span>
                </div>

                <!-- Description Input -->
                <div class="input-group description-group">
                    <label>Описание</label>
                    <textarea v-model="feature.description" maxlength="100" @input="validateFeature(index)"
                        class="description-textarea"></textarea>

                    <span class="character-count" v-if="(100 - feature.description.length) < 10">{{ 100 -
                        feature.description.length }}</span>
                </div>
            </div>
            <div class="actions-container">
                <!-- Error Message -->
                <p v-if="feature.error && isSubmitAttempted" class="error-message">Заполните все поля или удалите лишние</p>

                <!-- Delete Button -->
                <div class="remove-button" @click="removeFeature(index)">
                    <img src="delete.svg" alt="Удалить" class="remove-icon"  />
                    Удалить
                </div>

            </div>
        </div>
        <!-- Add Button -->
        <button @click="addFeature"  type="button" class="add-button" v-if="features.length < 10">+ Добавить еще</button>
    </div>
  `,
};

const App = {
  el: "#vue-app",
  data() {
    return {
      sections: {
        mainInfo: {
          title: "Основная информация",
          surname: "",
          name: "",
          profile: "",
          subtitle: "",
          displayedTitle: "",
          imageData: null,
        },
        aboutMe: {
          title: "Обо мне",
          displayedTitle: "Обо мне",
          description: "",
          imageData: null,
          featuresList: [],
        },
        groupTraining: {
          title: "Групповые тренировки",
          showBlock: false,
          showRTTF: false,
          displayedTitle: "Групповые тренировки",
          description: "",
        },
        individualTraining: {
          title: "Индивидуальные тренировки",
          showBlock: false,
          showRTTF: false,
          displayedTitle: "Индивидуальные тренировки",
          description: "",
          featuresList: [],
        },
        prices: {
          title: "Цены",
          displayedTitle: "Цены",
          showBlock: false,
          cards: [],
        },
        reviews: {
          title: "Отзывы с RTTF",
          showBlock: false,
          showAverageRating: true,
          displayedTitle: "Отзывы с RTTF",
        },
        clubs: {
          title: "Клубы",
          showBlock: false,
          displayedTitle: "Клубы",
          list: [],
        },
        benefitsTT: {
          title: "Польза настольного тенниса",
          displayedTitle: "Польза настольного тенниса",
          showBlock: false,
          featuresList: [],
        },
        faq: {
          title: "Часто задаваемые вопросы",
          showBlock: false,
          displayedTitle: "Часто задаваемые вопросы",
          qas: [],
        },
        videos: {
          title: "Видео со мной",
          showBlock: false,
          displayedTitle: "Видео со мной",
        },
        contacts: {
          title: "Контакты",
          phone: "",
          whatsapp: "",
          telegram: "",
        },
      },
      activeTab: "mainInfo",
      trainerName: null,
      trainerID: null,
      clubnames: [],
      isClubsDataFetched: false,
      isSubmitAttempted: false,
      navigatingSuggestions: false,
      currentSuggestions: [],
      currentSuggestionIndex: -1,
      highlightedSuggestion: -1,
      currentSuggestionListElement: null,
      saveSuccessful: false,
      isValid: false,
      errorMessage: "",
      requiredFields: {
        mainInfo: ["surname", "name", "subtitle", "displayedTitle"],
        aboutMe: ["displayedTitle", "description"],
        groupTraining: ["displayedTitle", "description"],
        individualTraining: ["displayedTitle", "description"],
        prices: ["displayedTitle"],
        reviews: ["displayedTitle"],
        contacts: [
          "address",
          "workingHoursWeekdays",
          "workingHoursWeekend",
          "phone",
          "email",
        ],
      },
    };
  },
  async created() {
    try {
      const subdomain = window.location.hostname.split(".")[0];
      this.trainerName = subdomain;
      const dataUrl = `/json/${subdomain}.json?timestamp=${new Date().getTime()}`;
      const response = await fetch(dataUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      this.sections = jsonData.sections;
    } catch (e) {
      this.loadFromLocalStorage();
      console.error("Ошибка при загрузке данных:", e);
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.fetchClubs();
      this.scrollToActiveTab();
    });
    document.addEventListener("click", this.handleSuggestionsInteraction);
    document.addEventListener("keydown", this.handleSuggestionsInteraction);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleSuggestionsInteraction);
    document.removeEventListener("keydown", this.handleSuggestionsInteraction);
  },
  methods: {
    handleFeatureUpdate({ sectionId, features }) {
      if (this.sections[sectionId]) {
        this.sections[sectionId].featuresList = features;
      }
    },
    handleImageUpload(data) {
      this.sections[data.sectionId].imageData = data.imageData;
      this.$forceUpdate();
    },
    loadFromLocalStorage() {
      if (localStorage.getItem("sections")) {
        this.sections = JSON.parse(localStorage.getItem("sections"));
      }
    },
    saveToLocalStorage() {
      // localStorage.setItem("sections", JSON.stringify(this.sections));

      const trainer = this.trainerName;
      const pwdMatch = document.cookie.match(/user_pass=([^;]+)/);
      const pwd = pwdMatch ? pwdMatch[1] : "";
      const json = JSON.stringify({ sections: this.sections });
      localStorage.setItem("sections", JSON.stringify(this.sections));
      fetch("/php/edit.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `trainer=${encodeURIComponent(trainer)}&pwd=${encodeURIComponent(
          pwd
        )}&json=${encodeURIComponent(json)}`,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.err) {
            this.errorMessage = data.err;
          } else {
            this.saveSuccessful = true;
            setTimeout(() => {
              this.saveSuccessful = false;
            }, 2000);
          }
        })
        .catch((error) => {
          console.error("Ошибка:", error);
          this.saveSuccessful = false;
        });
    },
    removeItem(itemIndex, itemsArray) {
      if (itemsArray[itemIndex]) {
        itemsArray[itemIndex].isDeleted = true;
      }
    },
    closeErrorMessage() {
      this.errorMessage = "";
    },
    openRTTF() {
      window.open("https://rttf.ru", "_blank");
    },
    // Метод для восстановления элемента
    restoreItem(itemIndex, itemsArray) {
      if (itemsArray[itemIndex]) {
        itemsArray[itemIndex].isDeleted = false;
      }
    },
    validateAndSubmit(sectionId) {
      this.isSubmitAttempted = true;
      const section = this.sections[sectionId];
      const requiredFields = this.requiredFields[sectionId] || [];

      if (section.showBlock === undefined || section.showBlock) {
        let isValid = true;
        let firstErrorElementId = null;

        requiredFields.forEach((fieldId) => {
          if (!section[fieldId]) {
            isValid = false;
            if (!firstErrorElementId) {
              firstErrorElementId = fieldId; // Присваиваем идентификатор первого элемента с ошибкой
            }
          }
        });

        // Валидация feature-list
        const featureListRef = `featureList-${sectionId}`;
        const featureListComponent = this.$refs[featureListRef];
        if (featureListComponent && featureListComponent.length) {
          // Предполагаем, что $refs возвращает массив, берем первый элемент
          isValid = isValid && featureListComponent[0].validateAllFeatures();
        }

        this.sections.faq.qas = this.sections.faq.qas.filter(
          (qa) => !qa.isDeleted
        );

        this.sections.faq.qas = this.sections.faq.qas.filter(
          (qa) => qa.question.trim() || qa.answer.trim()
        );
        this.sections.faq.qas = this.sections.faq.qas.filter(
          (qa) => !qa.isDeleted
        );

        this.sections.faq.qas.forEach((qa, index) => {
          // Сброс ошибок перед проверкой
          qa.questionError = false;
          qa.answerError = false;

          // Проверка вопроса и ответа
          if (!qa.question.trim()) {
            qa.questionError = true;
            if (!firstErrorElementId) {
              firstErrorElementId = "question-" + index;
            }
            isValid = false;
          }
          if (!qa.answer.trim()) {
            qa.answerError = true;
            if (!firstErrorElementId) {
              firstErrorElementId = "answer-" + index;
            }
            isValid = false;
          }
        });

        if (sectionId === "prices" && section.cards) {
          section.cards = section.cards.filter((card) => !card.isDeleted);

          section.cards.forEach((card, index) => {
            this.validateCardFields(sectionId, index);
            if (card.error) isValid = false;
          });
        }

        if (sectionId === "clubs") {
          // Remove clubs with empty names
          this.sections.clubs.list = this.sections.clubs.list.filter((club) =>
            club.title.trim()
          );
          const hasClubError = this.sections.clubs.list.some(
            (club) => club.error
          );
          if (hasClubError) {
            isValid = false;
          }
        }

        if (isValid) {
          this.saveToLocalStorage();
          this.isSubmitAttempted = false;
        } else if (firstErrorElementId) {
          this.$nextTick(() => {
            this.scrollToElement(firstErrorElementId);
          });
        }
      } else {
        // Если showBlock определен и равен false, сохраняем без валидации
        this.saveToLocalStorage();
      }
    },

    addCard(section) {
      this.sections[section].cards.push({
        title: "",
        price: "",
        description: "",
      });
    },

    validateCardFields(sectionName, index) {
      if (sectionName === "prices") {
        let card = this.sections.prices.cards[index];
        card.error =
          (card.title || card.price || card.description) &&
          (!card.title || !card.price || !card.description);
      }
    },

    selectTab(tabId) {
      this.activeTab = tabId;

      this.$nextTick(() => {
        this.scrollToActiveTab();
      });
    },
    scrollToActiveTab() {
      const activeTab = this.$el.querySelector(".tablinks.active");
      if (activeTab) {
        const scrollContainer = this.$el.querySelector(".tab");
        const targetScrollLeft =
          activeTab.offsetLeft -
          scrollContainer.offsetLeft -
          (scrollContainer.offsetWidth / 2 - activeTab.offsetWidth / 2);
        this.smoothScroll(scrollContainer, targetScrollLeft, 300);
      }
    },

    smoothScroll(element, target, duration) {
      const start = element.scrollLeft,
        change = target - start,
        startTime = performance.now();

      function animateScroll(timestamp) {
        const elapsed = timestamp - startTime;
        const fraction = Math.min(elapsed / duration, 1);

        element.scrollLeft = start + change * fraction;

        if (elapsed < duration) {
          requestAnimationFrame(animateScroll);
        }
      }

      requestAnimationFrame(animateScroll);
    },

    scrollToElement(elementId) {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },
    addClub() {
      this.sections.clubs.list.push({ id: null, title: "" });
    },
    fetchClubs() {
      if (!this.isClubsDataFetched) {
        fetch(`/php/getDataEdit.php?trainer=${this.trainerName}`)
          .then((response) => response.json())
          .then((data) => {
            this.clubnames = data.halls;
            this.trainerID = data.coachID;
            this.isClubsDataFetched = true;
          })
          .catch((error) => console.error("Ошибка:", error));
      }
    },
    filterClubs(value, index, event) {
      if (event.shiftKey) return;
      const selectedClubs = this.sections.clubs.list.map((club) => club.title);

      const inputWords = value.toLowerCase().trim().split(/\s+/);

      if (inputWords.length > 0 && inputWords[0] !== "") {
        this.currentSuggestions = this.clubnames
          .filter((club) => {
            const clubWords = club.title.toLowerCase().split(/\s+/);
            return (
              inputWords.every((inputWord) =>
                clubWords.some((clubWord) => clubWord.startsWith(inputWord))
              ) && !selectedClubs.includes(club.title)
            );
          })
          .slice(0, 6);
      } else {
        this.currentSuggestions = [];
      }
      this.currentSuggestionIndex = index;
      this.highlightedSuggestion = -1;
      if (this.sections.clubs.list[index]) {
        this.sections.clubs.list[index].error = false;
      }
    },

    selectClub(selectedClub) {
      if (this.currentSuggestionIndex >= 0) {
        this.sections.clubs.list[this.currentSuggestionIndex] = {
          ...selectedClub,
        };
      }

      this.currentSuggestions = [];
      this.currentSuggestionIndex = -1;
      this.highlightedSuggestion = -1;
    },
    handleKeyDown(event) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        this.navigatingSuggestions = true;
        setTimeout(() => {
          this.navigatingSuggestions = false;
        }, 300); // Добавьте таймаут

        const direction = event.key === "ArrowDown" ? 1 : -1;
        this.highlightedSuggestion =
          (this.highlightedSuggestion +
            direction +
            this.currentSuggestions.length) %
          this.currentSuggestions.length;
        event.preventDefault();
        this.scrollIntoView();
      } else if (event.key === "Enter") {
        if (
          this.highlightedSuggestion >= 0 &&
          this.highlightedSuggestion < this.currentSuggestions.length
        ) {
          const selectedClub =
            this.currentSuggestions[this.highlightedSuggestion];
          this.selectClub(selectedClub);
        }
      }
    },

    scrollIntoView() {
      this.$nextTick(() => {
        if (this.highlightedSuggestion < 0 || this.currentSuggestionIndex < 0)
          return;

        const suggestionList =
          this.$refs.suggestionsList[this.currentSuggestionIndex];
        if (
          !suggestionList ||
          !suggestionList.children[this.highlightedSuggestion]
        )
          return;

        const activeItem = suggestionList.children[this.highlightedSuggestion];
        activeItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    },

    delayedBlur() {
      setTimeout(this.handleSuggestionsInteraction, 300);
    },

    formatAddress(suggestion) {
      return `${suggestion.city} ${suggestion.address}`;
    },
    handleSuggestionsInteraction(event) {
      if (this.navigatingSuggestions) {
        return; // Не закрывайте подсказки, если происходит навигация
      }
      if (this.currentSuggestionIndex < 0 || !this.$refs.suggestionsList) {
        this.closeSuggestions();
        return;
      }

      const suggestionList =
        this.$refs.suggestionsList[this.currentSuggestionIndex];

      // Check if the suggestion list or the event target is not defined
      if (!suggestionList || !event.target) {
        this.closeSuggestions();
        return;
      }

      if (event.type === "blur") {
        setTimeout(() => this.closeSuggestions(), 100);
      } else if (event.type === "click") {
        if (!suggestionList.contains(event.target)) {
          this.closeSuggestions();
        }
      }
    },
    closeSuggestions() {
      if (this.currentSuggestionIndex === -1) {
        this.currentSuggestions = [];
        return;
      }

      const currentClub = this.sections.clubs.list[this.currentSuggestionIndex];
      const clubExists = this.clubnames.some(
        (club) => club.title === currentClub.title
      );

      if (!clubExists && currentClub.title) {
        // Keep the entered text but add an error state
        this.sections.clubs.list[this.currentSuggestionIndex].error = true;
      } else {
        // Clear the error state if the club exists
        this.sections.clubs.list[this.currentSuggestionIndex].error = false;
      }

      this.currentSuggestions = [];
      this.currentSuggestionIndex = -1;
      this.highlightedSuggestion = -1;
    },

    addQA() {
      if (this.sections.faq.qas.length < 10) {
        this.sections.faq.qas.push({
          question: "",
          answer: "",
        });
      }
    },
  },
};

const app = createApp(App);
app.component("input-field", InputField);
app.component("photo-upload", PhotoUpload);
app.component("feature-list", featureList);

// Монтирование приложения
app.mount("#vue-app");
