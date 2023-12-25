Vue.component("input-field", {
  props: {
    id: String,
    label: String,
    type: { type: String, default: "text" },
    value: String,
    rows: { type: Number, default: 3 },
    maxlength: Number,
    required: Boolean,
    error: Boolean,
    errorMessage: String,
    largeTextarea: Boolean,
    isSubmitAttempted: Boolean,
    sectionName: String,
  },
  data() {
    return {
      userHasInput: false,
      inputValue: this.value || "",
    };
  },
  computed: {
    charsLeft() {
      return this.maxlength - this.inputValue.length;
    },
    inputClass() {
      return this.largeTextarea ? "large-textarea-wrapper" : "";
    },
    effectiveErrorMessage() {
      return this.errorMessage || "Введите текст";
    },
    shouldShowError() {
      return (
        this.error &&
        (this.isSubmitAttempted || this.userHasInput) &&
        this.inputValue === ""
      );
    },
  },
  methods: {
    handleInput() {
      this.userHasInput = true;
      this.$emit("input-section", {
        sectionName: this.sectionName,
        inputData: { id: this.id, value: this.inputValue },
      });
    },
  },
  watch: {
    value(newValue) {
      this.inputValue = newValue;
    },
  },
  template: `
    <div class="input-wrapper">
      <label :for="id" :class="{ 'required-label': required }">{{ label }}</label>
      <div class="input-and-error">
        <input v-if="type !== 'textarea'" :type="type" :id="id" :class="{ 'error-border': shouldShowError }"  v-model="inputValue" :maxlength="maxlength"
            @input="handleInput" />
        <textarea v-else :id="id" v-model="inputValue" :class="{ 'error-border': shouldShowError }"   :maxlength="maxlength" :rows="rows"
            @input="handleInput"></textarea>
        <div class="input-feedback">
          <div class="error-message" v-if="shouldShowError">{{ effectiveErrorMessage }}</div>
          <div class="character-count" v-if="charsLeft <= 10">{{ charsLeft }}</div>
        </div>
      </div>
    </div>`,
});

Vue.component("photo-upload", {
  data() {
    return {
      imageData: null,
    };
  },
  props: {
    label: String,
    value: String,
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
          this.$emit("input", e.target.result);
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
          <img v-if="value" :src="value" :alt="label + ' preview'" class="avatar-placeholder" />
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
});

Vue.component("feature-list", {
  props: {
    initialFeatures: Array,
    includeTitle: Boolean,
    isSubmitAttempted: Boolean,
    listTitle: String,
    sectionId: String,
  },
  data: function () {
    return {
      features: this.initialFeatures || [],
    };
  },
  created() {
    this.features = this.initialFeatures || [];
  },

  methods: {
    addFeature: function () {
      this.features.push({
        emoji: "",
        title: "",
        description: "",
        error: false,
        errorMessage: "",
      });
    },
    emitUpdate() {
      console.log("Emitting updateFeatures with features:", this.features);

      this.$emit("update-features", {
        sectionId: this.sectionId,
        features: this.features,
      });
    },
    removeFeature: function (index) {
      this.features.splice(index, 1);
    },
    validateFeature(index) {
      const feature = this.features[index];
      const isInvalid =
        !feature.emoji ||
        !feature.description ||
        (this.includeTitle && !feature.title);

      feature.error = isInvalid;
      feature.errorMessage = isInvalid
        ? "Заполните все поля или удалите лишние"
        : "";
      this.emitUpdate();
    },
    validateAllFeatures: function () {
      let isValid = true;
      this.features.forEach((feature, index) => {
        this.validateFeature(index);
        if (feature.error) {
          isValid = false;
        }
      });
      console.log("validateAllFeatures result:", isValid);

      return isValid;
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
});

new Vue({
  el: "#vue-app",
  data: {
    sections: {
      mainInfo: {
        title: "Основная информация",
        inputs: [
          {
            id: "surname",
            label: "Фамилия",
            type: "text",
            value: "",
            maxlength: 20,
            required: true,
            charsLeft: 20,
            error: false,
            errorMessage: "Введите фамилию",
          },
          {
            id: "name",
            label: "Имя",
            type: "text",
            value: "",
            maxlength: 20,
            required: true,
            charsLeft: 20,
            error: false,
            errorMessage: "Введите имя",
          },
          {
            id: "profile",
            label: "Логин на RTTF",
            type: "text",
            value: "",
            maxlength: 30,
            required: true,
            charsLeft: 30,
            error: false,
            errorMessage: "Введите ваш логин",
          },
          {
            id: "subtitle",
            label: "Подзаголовок",
            type: "text",
            value: "",
            maxlength: 50,
            required: true,
            charsLeft: 50,
            error: false,
            errorMessage: "Введите подзаголовок сайта",
          },
          {
            id: "title",
            label: "Заголовок",
            type: "textarea",
            value: "",
            maxlength: 100,
            required: true,
            charsLeft: 100,
            error: false,
            errorMessage: "Введите заголовок сайта",
          },
        ],
        imageData: null,
      },
      aboutMe: {
        title: "Обо мне",
        inputs: [
          {
            id: "displayedTitle",
            label: "Заголовок",
            type: "text",
            value: "",
            maxlength: 30,
            required: true,
            charsLeft: 30,
            error: false,
            errorMessage: "Введите отображаемый заголовок",
          },
          {
            id: "description",
            label: "Краткое описание",
            type: "textarea",
            value: "",
            maxlength: 1000,
            required: true,
            largeTextarea: true,
            charsLeft: 1000,
            error: false,
            errorMessage: "Введите краткое описание",
          },
        ],
        imageData: null,
        featuresList: [
          {
            emoji: "🛺",
            description: "hheyt",
            error: false,
            errorMessage: "Введите текст достижения",
            emojiErrorMessage: "Добавьте эмодзи",
          },
        ],
      },
      groupTraining: {
        title: "Групповые тренировки",
        editable: true,
        showRTTF: false,
        inputs: [
          {
            id: "displayedTitle",
            label: "Заголовок",
            type: "text",
            value: "",
            maxlength: 30,
            required: true,
            charsLeft: 30,
            error: false,
            errorMessage: "Введите отображаемый заголовок",
          },
          {
            id: "description",
            label: "Краткое описание (не более 1000 символов)",
            type: "textarea",
            value: "",
            maxlength: 1000,
            required: true,
            largeTextarea: true,
            charsLeft: 1000,
            error: false,
            errorMessage: "Введите краткое описание",
          },
        ],
      },
      individualTraining: {
        title: "Индивидуальные тренировки",
        editable: true,
        showRTTF: false,
        inputs: [
          {
            id: "displayedTitle",
            label: "Заголовок",
            type: "text",
            value: "",
            maxlength: 30,
            required: true,
            charsLeft: 30,
            error: false,
            errorMessage: "Введите отображаемый заголовок",
          },
          {
            id: "description",
            label: "Краткое описание (не более 1000 символов)",
            type: "textarea",
            value: "",
            maxlength: 1000,
            required: true,
            largeTextarea: true,
            charsLeft: 1000,
            error: false,
            errorMessage: "Введите краткое описание",
          },
        ],
        featuresList: [
          {
            emoji: "1",
            title: "2",
            description: "3",
            error: false,
            errorMessage: "Введите текст достижения",
            emojiErrorMessage: "Добавьте эмодзи",
          },
        ],
      },
      prices: {
        title: "Цены",
        editable: true,
        inputs: [
          {
            id: "pricesTitle",
            label: "Заголовок",
            type: "text",
            value: "",
            maxlength: 50,
            required: true,
            charsLeft: 50,
            error: false,
            errorMessage: "Введите заголовок раздела",
          },
        ],
        cards: [
          {
            title: "",
            price: "",
            description: "",
            error: false,
            errorMessage: "Заполните все поля карточки",
          },
        ],
      },
      reviews: {
        title: "Отзывы с RTTF",
        editable: true,
        showAverageRating: true,
        inputs: [
          {
            id: "reviewsTitle",
            label: "Заголовок",
            type: "text",
            value: "",
            maxlength: 50,
            required: true,
            charsLeft: 50,
            error: false,
            errorMessage: "Введите заголовок раздела",
          },
        ],
      },
      clubs: {
        title: "Клубы",
        editable: true,

        list: [],
        clubnames: [
          { id: 1, name: "Ассоциация Спин" },
          { id: 2, name: "Быстрые Лупы" },
          { id: 3, name: "Ракетка и Мяч" },
          { id: 4, name: "Пинг-Понг Мастеры" },
          { id: 5, name: "СпортМастер ТТ" },
          { id: 6, name: "Гранд Слам ТТ" },
          { id: 7, name: "Турбо Теннис" },
          { id: 8, name: "ТТ Шторм" },
          { id: 9, name: "Теннисный Вихрь" },
          { id: 10, name: "Академия ТТ" },
          { id: 11, name: "Spin Masters" },
          { id: 12, name: "Rapid Rackets" },
          { id: 13, name: "Ball & Paddle" },
          { id: 14, name: "Ping-Pong Club" },
          { id: 15, name: "SportElite TT" },
          { id: 16, name: "Slam Champions TT" },
          { id: 17, name: "Turbo Spin Club" },
          { id: 18, name: "TT Cyclone" },
          { id: 19, name: "Tennis Tornado" },
          { id: 20, name: "Table Tennis Scholars" },
        ],
      },
      benefitsTT: {
        title: "Польза настольного тенниса",
        featuresList: [
          {
            emoji: "",
            description: "",
            error: false,
            errorMessage: "Введите текст достижения",
            emojiErrorMessage: "Добавьте эмодзи",
          },
        ],
        editable: true,
        inputs: [
          {
            id: "reviewsTitle",
            label: "Заголовок",
            type: "text",
            value: "",
            maxlength: 50,
            required: true,
            charsLeft: 50,
            error: false,
            errorMessage: "Введите заголовок раздела",
          },
        ],
      },
      faq: {
        title: "Часто задаваемые вопросы",
        editable: true,
        inputs: [
          {
            id: "faqTitle",
            label: "Заголовок",
            type: "text",
            value: "",
            maxlength: 50,
            required: true,
            charsLeft: 50,
            error: false,
            errorMessage: "Введите заголовок раздела",
          },
        ],
        qas: [
          {
            question: "",
            answer: "",
            questionCharsLeft: 200,
            answerCharsLeft: 500,
            questionError: false,
            answerError: false,
            questionErrorMessage: "Вопрос обязателен к заполнению",
            answerErrorMessage: "Ответ обязателен к заполнению",
          },
        ],
      },
      videos: {
        title: "Видео со мной",
        editable: true,
        inputs: [
          {
            id: "videosTitle",
            label: "Заголовок",
            type: "text",
            value: "",
            maxlength: 50,
            required: true,
            charsLeft: 50,
            error: false,
            errorMessage: "Введите заголовок раздела",
          },
        ],
      },
      contacts: {
        title: "Контакты",
        editable: true,
        inputs: [
          {
            id: "phone",
            label: "Телефон",
            type: "text",
            value: "",
            maxlength: 20,
            required: true,
            charsLeft: 20,
            error: false,
            errorMessage: "Телефон обязателен к заполнению",
          },
          {
            id: "whatsapp",
            label: "WhatsApp",
            type: "text",
            value: "",
            maxlength: 20,
            required: false,
            charsLeft: 20,
            error: false,
            errorMessage: "",
          },
          {
            id: "telegram",
            label: "Telegram",
            type: "text",
            value: "",
            maxlength: 20,
            required: false,
            charsLeft: 20,
            error: false,
            errorMessage: "",
          },
        ],
      },
    },
    activeTab: "mainInfo",
    isSubmitAttempted: false,
    currentSuggestions: [],
    currentSuggestionIndex: -1,
    highlightedSuggestion: -1,
    currentSuggestionListElement: null,
    saveSuccessful: false,
  },
  created() {
    this.$on("input-section", this.handleInputSection);
    this.loadFromLocalStorage();
  },

  mounted() {
    this.$nextTick(() => {
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
    handleInput(data) {},
    handleInputSection(event) {
      console.log(event);
      const { sectionName, inputData } = event;
      const section = this.sections[sectionName];
      if (section && section.inputs) {
        const input = section.inputs.find((i) => i.id === inputData.id);
        if (input) {
          input.value = inputData.value;
        }
      }
    },

    handleFeatureUpdate({ sectionId, features }) {
      console.log("hey", sectionId, features);
      if (this.sections[sectionId]) {
        this.sections[sectionId].featuresList = features;
        this.saveToLocalStorage();
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
      console.log("Saving sections to localStorage", this.sections);

      localStorage.setItem("sections", JSON.stringify(this.sections));
    },
    updateCharsLeftAndValidate(section, inputId) {
      const sectionData = this.sections[section];
      if (sectionData.inputs) {
        const input = sectionData.inputs.find((i) => i.id === inputId);
        if (input) {
          input.charsLeft = input.maxlength - input.value.length;

          if (this.isSubmitAttempted) {
            input.error = input.required && !input.value;
          }
        }
      }
    },
    validateAndSubmit(sectionId) {
      this.isSubmitAttempted = true;
      let isValid = true;
      const section = this.sections[sectionId];

      if (section.inputs) {
        section.inputs.forEach((input) => {
          this.updateCharsLeftAndValidate(sectionId, input.id);
          if (input.required && !input.value) {
            input.error = true;
            isValid = false;
            console.log(isValid);
          } else {
            input.error = false;
          }
        });
      }

      if (
        sectionId === "aboutMe" &&
        this.$refs.featureList &&
        this.$refs.featureList.length > 0
      ) {
        const featureListComponent = this.$refs.featureList[0];
        if (typeof featureListComponent.validateAllFeatures === "function") {
          const isFeaturesValid = featureListComponent.validateAllFeatures();

          if (!isFeaturesValid) {
            isValid = false;
          }
        }
      }

      // if (section.trainingElements) {
      //   section.trainingElements.forEach((element) => {
      //     if (!element.emoji || !element.title || !element.description) {
      //       element.error = true;
      //       element.errorMessage =
      //         "Пожалуйста, заполните все поля или удалите элемент";
      //       isValid = false;
      //     } else {
      //       element.error = false;
      //     }
      //   });
      // }

      if (section.qas) {
        console.log("hey hey");
        section.qas.forEach((qa, index) => {
          this.updateCharsLeftAndValidateFAQ(qa, index);
          if (qa.question && !qa.answer) {
            qa.answerError = true;
            isValid = false;
          } else if (!qa.question && qa.answer) {
            qa.questionError = true;
            isValid = false;
          } else {
            qa.questionError = false;
            qa.answerError = false;
          }
        });
      }

      if (sectionId === "prices" && section.cards) {
        section.cards.forEach((card, index) => {
          this.validateCardFields(sectionId, index);
          if (card.error) isValid = false;
        });
      }

      if (isValid) {
        this.saveToLocalStorage();
        console.log("kek");
        this.saveSuccessful = true;
        console.log(this.saveSuccessful);

        setTimeout(() => {
          this.saveSuccessful = false;
          console.log(this.saveSuccessful);
        }, 2000);

        this.isSubmitAttempted = false;
      }
    },

    handlePriceCards(section, field, index, eventData) {
      console.log(section, field, index, eventData);
      const value = eventData.inputData.value;
      if (section === "prices") {
        let card = this.sections.prices.cards[index];
        if (card) {
          card[field] = value;
          this.validateCardFields(section, index);
        }
      }
    },
    addCard(section) {
      this.sections[section].cards.push({
        title: "",
        price: "",
        description: "",
        error: false,
        errorMessage: "",
      });
    },
    removeCard(section, index) {
      this.sections[section].cards.splice(index, 1);
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
        const scrollAmount = activeTab.offsetLeft - scrollContainer.offsetLeft;
        scrollContainer.scrollLeft =
          scrollAmount -
          (scrollContainer.offsetWidth / 2 - activeTab.offsetWidth / 2);
      }
    },

    addClub() {
      this.sections.clubs.list.push({ id: null, name: "" });
    },
    filterClubs(value, index) {
      const selectedClubs = this.sections.clubs.list.map((club) => club.name);
      if (value) {
        this.currentSuggestions = this.sections.clubs.clubnames
          .filter((club) => {
            const words = club.name.toLowerCase().split(" ");
            return (
              words.some((word) => word.startsWith(value.toLowerCase())) &&
              !selectedClubs.includes(club.name)
            );
          })
          .slice(0, 6);
      } else {
        this.currentSuggestions = [];
      }
      this.currentSuggestionIndex = index;
      this.highlightedSuggestion = -1;
    },

    selectClub(selectedClub) {
      if (this.currentSuggestionIndex >= 0) {
        this.sections.clubs.list[this.currentSuggestionIndex].id =
          selectedClub.id;
        this.sections.clubs.list[this.currentSuggestionIndex].name =
          selectedClub.name;
      }

      this.currentSuggestions = [];
      this.currentSuggestionIndex = -1;
      this.highlightedSuggestion = -1;
    },
    handleKeyDown(event) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
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

    handleSuggestionsInteraction(event) {
      if (event.type === "blur") {
        setTimeout(() => this.closeSuggestions(), 100);
      } else if (event.type === "click" && this.currentSuggestionIndex >= 0) {
        const suggestionList =
          this.$refs.suggestionsList[this.currentSuggestionIndex];
        if (suggestionList && !suggestionList.contains(event.target)) {
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
      const clubExists = this.sections.clubs.clubnames.some(
        (club) => club.name === currentClub.name
      );

      if (!clubExists && currentClub.name) {
        this.sections.clubs.list[this.currentSuggestionIndex].name =
          "Не выбран";
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
          questionCharsLeft: 200,
          answerCharsLeft: 500,
          questionError: false,
          answerError: false,
          questionErrorMessage: "Вопрос обязателен к заполнению",
          answerErrorMessage: "Ответ обязателен к заполнению",
        });
      }
    },
    removeQA(index) {
      // Добавляем класс для анимации исчезновения
      this.$set(this.sections.faq.qas[index], "fadeOut", true);

      // После задержки удаляем элемент из массива
      setTimeout(() => {
        this.sections.faq.qas.splice(index, 1);
      }, 500); // 500 мс - время анимации
    },
    updateCharsLeftAndValidateFAQ(qa, index) {
      qa.questionCharsLeft = 200 - qa.question.length;
      qa.answerCharsLeft = 500 - qa.answer.length;

      if (this.isSubmitAttempted) {
        qa.questionError = !qa.question && qa.answer;
        qa.answerError = !qa.answer && qa.question;
      }
    },
    validateAndSubmitFAQ() {
      console.log("validateandsubmitFAQ");
      this.sections.faq.qas.forEach((qa, index) => {
        this.updateCharsLeftAndValidateFAQ(index);
      });

      let isValid = true;
      this.sections.faq.qas.forEach((qa) => {
        if (!qa.question || !qa.answer) {
          isValid = false;
        }
      });

      if (isValid) {
      }
    },
  },
});
