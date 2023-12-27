import {
	createElement,
	createSuccessfulToast,
	createErrorToast,
	delay,
	getDataFromDataJS,
} from "../utils"
import { PopupHelper } from "./popupImages"
import { GameItemsHelper } from "./gameItems"
import { Loader } from "../loader"
import { postFilterRequest } from "../API/filterAPI"
/**
 * Класс для  фильтра на странице с играми.
 * @class
 */
class FilterHelper {
	/**
	 * @constructor
	 * @param {number} maxWidth - Число пикселей, показывает с какого разрешения фильтр должен автоматически закрываться при поиске.
	 * @returns {FilterHelper.instance} ссылка на единственный экземпляр
	 */
	constructor({ maxWidth }) {
		if (!FilterHelper.instance) {
			FilterHelper.instance = this
		}
		/**
		 * Селекторы для DOM элементов фильтра
		 * @type {Object}
		 * @property {string} submitBtn - кнопка поиска
		 * @property {string} clearBtn - кнопка очистки фильтра (иногда она вызывает поиск)
		 * @property {string} filterBtn - кнопка открытия / закрытия фильтра
		 * @property {string} filterList - container для элементов фильтра
		 * @property {string} form - форма
		 * @property {string} checkboxes - элементы фильтров
		 */
		this.selectors = {
			submitBtn: "[data-js='filter-submit']",
			clearBtn: "[data-js='filter-clear']",
			filterBtn: "[data-js='filter']",
			filterList: "[data-js='filter-list']",
			form: "[data-js='form-filter']",
			checkboxes: "[data-js='filter-check']",
		}
		/**
		 * Состояния фильтра
		 * @type {Object}
		 * @property {bool} filterActive - показан ли фильтр
		 * @property {bool} clearBtnShown - отображена ли кнопка очистки фильтров
		 * @property {bool} searchBtnShown - отображена ли кнопка поиска
		 */
		this.state = {
			filterActive: false,
			clearBtnShown: false,
			searchBtnShown: true,
		}
		/**
		 * С какими классами нужно взаимодействовать, чтобы управлять фильтром
		 * @type {Object}
		 * @property {string} activeFilter - показать фильтр
		 * @property {string} activeSubmit - показать кнопку поиска
		 * @property {string} activeClearBtn - показать кнопку сброса фильтров
		 * @property {string} hiddenClearBtn - Скрыть кнопку сброса фильтров
		 */
		this.classes = {
			activeFilter: "portfolio__filter-list--active",
			activeSubmit: "portfolio__filter-submit--active",
			activeClearBtn: "portfolio__filter-clear--active",
			hiddenClearBtn: "portfolio__filter-clear--hidden",
		}
		/**
		 * Атрибуты из которых достаем информацию
		 * @type {Object}
		 * @property {string} form - из какого атрибута формы надо достать данные для отправки
		 */
		this.dataAttributes = {
			form: "data-js-details",
		}

		/**
		 * C какого разрешения фильтр должен автоматически закрываться при поиске.
		 * @type {number}
		 */
		this.maxWidth = maxWidth
		/**
		 * Мобильное ли разрешение, если да - то true
		 * @type {bool}
		 */
		this.isMobileSize = false
		/**
		 * Был ли когда-то поиск, если да - то при клике на сброс фильтра будет вызывать submit для получения информации, если нет - то фильтр просто сбрасывает checkboxes
		 * @type {bool}
		 */
		this.isSearching = false
		/**
		 * Кол-во выбранных checkbox элементов
		 * @type {bool}
		 */
		this.currentChecked = 0
		/**
		 * Ссылка на класс для управления элементами которые мы найдем
		 * @type {GameItemsHelper}
		 */
		this.gameItemsHelper = new GameItemsHelper()
		/**
		 * Объект loader для отображения во время отправки / загрузки
		 * Ссылается на единственный объект класса Loader
		 * @type {Loader}
		 */
		this.loader = new Loader()
		/**
		 * Объект popupHelper для
		 * Ссылается на единственный объект класса PopupHelper
		 * @type {PopupHelper}
		 */
		this.popupHelper = new PopupHelper()
		//Вызываем внутренние методы в конструкторе
		this.findElements()
		this.acceptEvents()
		return FilterHelper.instance
	}

	/**
	 * Внутренний метод поиска необходимых DOM элементов для фильтра
	 * @method
	 * @private
	 * @returns {undefined}
	 */
	findElements() {
		this.filterBtn = document.querySelector(this.selectors.filterBtn)
		this.filterList = document.querySelector(this.selectors.filterList)
		this.clearBtn = document.querySelector(this.selectors.clearBtn)
		this.submitBtn = document.querySelector(this.selectors.submitBtn)
		this.form = document.querySelector(this.selectors.form)
		this.checkboxes = document.querySelectorAll(this.selectors.checkboxes)
		this.overlay = document.querySelector(this.selectors.overlay)
	}

	//если данных от сервера нет - создаем пустой элемент с уведомлением
	emptyData(msg) {
		const info = createElement("p", {
			style:
				"color: var(--color-white); font-size: 20px; font-family: Montserrat",
			"data-js": "game-item",
		})
		info.textContent = msg
		this.gameItemsHelper.portfolioContent.appendChild(info)
	}

	/**
	 * Ассинхронная функция отправки данных с формы в фильтре в формате FormData post запросом
	 * У формы должен быть data атрибут описанный в dataAttributes.form = data-js-details внутри которого должно быть поле url, по этому url будет отправлен запрос
	 * @method
	 * @returns {Promise}
	 */
	async submitHandler(e) {
		this.isSearching = true
		e.preventDefault()
		//если мобильное разрешение
		if (this.isMobileSize) {
			//скрываем фильтр на мобильном разрешении
			this.toggleFilter()
		}
		const formData = new FormData(this.form)
		const data = getDataFromDataJS(this.form, this.dataAttributes.form)
		await this.gameItemsHelper.clearContents()
		this.loader.showLoader()
		try {
			const response = await postFilterRequest(data.url, formData)
			if (response) {
				await this.gameItemsHelper.clearContents()
				this.gameItemsHelper.createItems(response)
				this.popupHelper.findGameItems() //там же навешивается слушатель событий
			} else {
				this.emptyData("По данному запросу ничего не найдено 🙌🙌🙌")
				createSuccessfulToast("Попробуйте другие фильтры 🙃)")
			}
		} catch (err) {
			this.emptyData("Ошибка запроса. Попробуйте позже 🗿🗿🗿")
			createErrorToast("Что-то случилось на сервере...Попробуйте позже 🤔")
		} finally {
			delay(500).then(() => {
				this.loader.hideLoader()
			})
		}
	}

	bindFormSubmit() {
		this.form.addEventListener("submit", (e) => {
			this.submitHandler(e)
		})
	}

	bindCheckboxesClick() {
		this.checkboxes.forEach((checkbox) => {
			checkbox.addEventListener("change", (e) => {
				if (e.target.checked) {
					this.state.clearBtnShown = true
					this.currentChecked += 1
					this.clearBtn.classList.add(this.classes.activeClearBtn)
				} else {
					this.currentChecked -= 1
					if (this.currentChecked === 0) {
						this.state.clearBtnShown = false
						this.clearBtn.classList.remove(this.classes.activeClearBtn)
					}
				}
			})
		})
	}

	bindClearBtnClick() {
		this.clearBtn.addEventListener("click", () => {
			this.checkboxes.forEach((checkbox) => {
				checkbox.checked = false
			})
			this.currentChecked = 0
			this.state.clearBtnShown = false
			this.clearBtn.classList.remove(this.classes.activeClearBtn)
			if (this.isSearching) {
				this.submitBtn.click()
				this.isSearching = false
			}
		})
	}

	bindFilterClick() {
		this.filterBtn.addEventListener("click", () => {
			this.toggleFilter()
		})
	}

	toggleFilter() {
		this.state.filterActive = !this.state.filterActive
		if (this.state.filterActive) {
			this.filterList.classList.add(this.classes.activeFilter)
			this.submitBtn.classList.add(this.classes.activeSubmit)
			if (this.state.clearBtnShown) {
				this.clearBtn.classList.remove(this.classes.hiddenClearBtn)
			}
		} else {
			if (this.state.clearBtnShown) {
				this.clearBtn.classList.add(this.classes.hiddenClearBtn)
			}

			this.filterList.classList.remove(this.classes.activeFilter)
			this.submitBtn.classList.remove(this.classes.activeSubmit)
		}
	}

	hideFilter(matches) {
		if (matches) {
			this.state.filterActive = false
			if (this.state.clearBtnShown) {
				this.clearBtn.classList.add(this.classes.hiddenClearBtn)
			}
			this.filterList.classList.remove(this.classes.activeFilter)
			this.submitBtn.classList.remove(this.classes.activeSubmit)
		}
	}

	bindMediaQuery() {
		const mobileWidthMediaQuery = window.matchMedia(
			`(max-width: ${this.maxWidth}px)`
		)
		this.isMobileSize = mobileWidthMediaQuery.matches
		mobileWidthMediaQuery.addEventListener("change", (event) => {
			this.isMobileSize = event.matches
		})
	}
	/**
	 * Подписка на все события, включая submit
	 * @method
	 * @private
	 * @returns {undefined}
	 */
	acceptEvents() {
		this.bindMediaQuery()
		this.bindFilterClick()
		this.bindCheckboxesClick()
		this.bindClearBtnClick()
		this.bindFormSubmit()
	}
}

new FilterHelper({ maxWidth: 1056 })
