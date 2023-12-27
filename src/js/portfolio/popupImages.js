import {
	delay,
	createElement,
	disableScroll,
	clearChildElements,
	enableScroll,
	getDataFromDataJS,
} from "../utils"

/**
 * Класс для открытия модального окна игры
 *@class
 */
export class PopupHelper {
	/**
	 * @constructor
	 * @returns {PopupHelper.instance} ссылка на единственный экземпляр
	 */
	constructor() {
		if (!PopupHelper.instance) {
			PopupHelper.instance = this
		}
		/**
		 * Состояние popup окна
		 * @type {Object}
		 * @property {bool} open - true если открыт
		 */
		this.state = {
			open: false,
		}
		/**
		 * Селекторы для DOM элементов popup окна
		 * @type {Object}
		 * @property {string} popup - сам poup элемент
		 * @property {string} cross - крести для закрытия popup
		 * @property {string} logo - логотип игры
		 * @property {string} container - container для скриншотов
		 * @property {string} images - картинки внутри container
		 * @property {string} text - описание игры
		 * @property {string} date - дата релиза
		 * @property {string} title - заголовок игры
		 * @property {string} detail - детальная информация об игре
		 * @property {string} overlay - задний overlay
		 * @property {string} item - элемент, который триггерит открытие popup
		 * @property {string} itemsContainer - контейнер, в котором лежат триггеры
		 */
		this.selectors = {
			popup: `[data-js="popup-block"]`,
			cross: `[data-js="popup-cross"]`,
			logo: `[data-js="popup-logo"]`,
			container: `[data-js="popup-container-images"]`,
			images: `[data-js="popup-image"]`,
			text: `[data-js="popup-text"]`,
			date: `[data-js="popup-date"]`,
			title: `[data-js="popup-title"]`,
			detail: `data-js-portfolio-detail`, //именно строка, чтобы по названию с помощью функции вытащить информацию из data атрибута
			htmlDetail: `data-js-portfolio-detail-start`, //именно строка, чтобы по названию с помощью функции вытащить информацию из data атрибута
			overlay: `[data-js="popup-overlay"]`,
			item: `[data-js="game-item"]`,
			itemsContainer: `[data-js="portfolio-content"]`,
		}

		/**
		 * Data атрибуты для картинок. Нужны при создании новых элементов
		 * @type {Object}
		 * @property {Object} images
		 * @property {string} images.name
		 * @property {string} images.value
		 */
		this.dataAttributes = {
			images: {
				name: `data-js`,
				value: "popup-image",
			},
		}
		/**
		 * Классы для управления popup окном, а также для создания элементов
		 * @type {Object}
		 * @property {Object} images
		 * @property {string} images.block контейнер скриншота игры
		 * @property {string} images.image картинка скриншота
		 * @property {string} popup открыть poup
		 * @property {string} overlay активировать overlay
		 *
		 */
		this.classes = {
			images: {
				block: "portfolio__main-game-card",
				image: "portfolio__main-game-card-img",
			},
			popup: "portfolio__main-block--open",
			overlay: "active",
		}
		//Вызываем внутренние методы в конструкторе
		this.findElements()
		this.acceptEvents()
		this.getStartConfiguration()
		return PopupHelper.instance
	}

	/**
	 * Внутренний метод необходимый для открытия popup окна в случае, если задана стартовая конфигурация у тега html
	 * Если пользователь с главной страницы будет переходить например по url "/pages/portfolio?id=243" - это значит, что эта страница должна открыть уже по умолчанию с открытым popup, тогда backend отдает страницу со сгенерированными данными для модального окна в дата атрибуте this.selectors.htmlDetail и оно автоматически открывается
	 * @method
	 * @returns {undefined}
	 */
	getStartConfiguration() {
		this.htmlDetail = getDataFromDataJS(
			document.documentElement,
			this.selectors.htmlDetail
		)
		if (this.htmlDetail) {
			this.togglePopup(document.documentElement, this.selectors.htmlDetail)
		}
	}

	findElements() {
		this.popup = document.querySelector(this.selectors.popup)
		this.cross = this.popup.querySelector(this.selectors.cross)
		this.logo = this.popup.querySelector(this.selectors.logo)
		this.container = this.popup.querySelector(this.selectors.container)
		this.images = this.popup.querySelectorAll(this.selectors.images)
		this.text = this.popup.querySelector(this.selectors.text)
		this.date = this.popup.querySelector(this.selectors.date)
		this.title = this.popup.querySelector(this.selectors.title)
		this.items = document.querySelectorAll(this.selectors.item)
		this.itemsContainer = document.querySelector(this.selectors.itemsContainer)
		this.overlay = document.querySelector(this.selectors.overlay)
	}

	/**
	 * Внутренний метод очистки DOM элементов в контейнере popup, чтобы при следующем открытии заполнить его необходимыми скриншотами игры
	 * @method
	 * @returns {Promise}
	 */
	clearImages() {
		return new Promise((resolve, reject) => {
			try {
				clearChildElements(this.container)
				this.logo.src = ""
				this.title = ""
				this.text = ""
				this.date = ""
				resolve()
			} catch {
				reject()
			}
		})
	}

	/**
	 * Внутренний метод открытия / закрытия popup окна
	 * @method
	 * @param {HTMLElement | undefined} item Если item пустой, значит вызывали метод закрытия окна.
	 * Внутри элемента должен находиться дата атрибут который находится в selectors.detail. Внутри этого атрибута должная лежать строка из сериализованного объекта
	 * Поля объекта:
	 * @param {String | undefined} selector строка селектора дата атрибута из которого достаются данные popup окна.
	 * @param {date} item.date - дата релиза игры
	 * @param {String[]} images - список ссылок на скриншоты игры
	 * @param {String} logo	- ссылка на логотип игры
	 * @param {String} text - текстовое описание игры
	 * @param {String} title - заголовок игры
	 * @returns {Promise}
	 */
	async togglePopup(item, selector) {
		this.state.open = !this.state.open
		if (this.state.open) {
			//отключаем скролл на всей странице
			disableScroll()
			//очищаем внутри popup все внутренние картинки, если они там были
			await this.clearImages()
			//получаем данные из data атрибута элемента, по которому кликнули
			const detailData = getDataFromDataJS(item, selector)
			console.log(detailData)
			//заменяем данные внутри popup на те, что были в data атрибуте
			this.logo.src = detailData.logo
			this.title = detailData.title
			this.text = detailData.text
			this.date = detailData.date
			detailData.images.forEach((image) => {
				/*создаем div */
				const rootDIV = createElement(
					"div",
					{
						class: this.classes.images.block,
						[this.dataAttributes.images.name]: [
							this.dataAttributes.images.value,
						],
					},
					this.container
				)

				/* внутри div создаем картинку */
				createElement(
					"img",
					{
						src: image,
						class: this.classes.images.image,
					},
					rootDIV
				)
			})
			//Активируем overlay и открываем окно
			this.overlay.classList.toggle(this.classes.overlay)
			this.popup.classList.toggle(this.classes.popup)
			//через 1 сек добавляем возможность прокрутки по оси y.
			/*
			Важно делать это с задержкой, иначе анимация открытия формы, которая реализована 
			через изменение max-height будет выглядеть некрасиво, постоянно отображая вертикальный скролл
			до момент полного открытия формы
			*/
			delay(1000).then(() => (this.popup.style.overflowY = "auto"))
		} else {
			enableScroll()
			this.popup.classList.toggle(this.classes.popup)
			this.overlay.classList.toggle(this.classes.overlay)
			this.popup.style.overflowY = "hidden"
		}
	}

	findGameItems() {
		this.items = document.querySelectorAll(this.selectors.item)
		this.bindItemsClick()
	}

	bindCrossClick() {
		if (this.cross) {
			this.cross.addEventListener("click", () => {
				this.togglePopup()
			})
		}
	}

	bindClickOverlay() {
		if (this.overlay) {
			this.overlay.addEventListener("click", (e) => {
				this.cross.click()
			})
		}
	}

	itemClick(item) {
		this.togglePopup(item, this.selectors.detail)
	}

	bindItemsClick() {
		this.items.forEach((item) =>
			item.addEventListener("click", this.itemClick.bind(this, item))
		)
	}
	/**
	 * Подписка на все события, включая submit
	 * @method
	 * @private
	 * @returns {undefined}
	 */
	acceptEvents() {
		this.bindItemsClick()
		this.bindCrossClick()
		this.bindClickOverlay()
	}
}

// export const popupHelper = new PopupHelper()
