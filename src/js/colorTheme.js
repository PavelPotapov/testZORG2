import { delay } from "./utils"

class ToggleThemeHelper {
	constructor() {
		if (ToggleThemeHelper.instance) {
			ToggleThemeHelper.instance = this
		}

		this.selectors = {
			toggleInput: "#toggle-change-color-theme",
			toggleInputContainer: `[data-js="theme-checker-container"]`,
		}

		this.classes = {
			darkMode: "dark-mode",
			activeContainer: "active",
		}

		this.darkModeState = false
		this.findElements()
		this.firstInit()
		this.acceptEvents()
		return ToggleThemeHelper.instance
	}

	findElements() {
		this.toggleInputContainer = document.querySelector(
			this.selectors.toggleInputContainer
		)
		this.toggleInput = document.querySelector(this.selectors.toggleInput)
	}

	firstInit() {
		if (!(localStorage.getItem("dark-mode") === null)) {
			console.log(localStorage.getItem("dark-mode"))
			this.toggleDarkMode(localStorage.getItem("dark-mode") === "true")
		} else {
			if (document.documentElement.classList.contains(this.classes.darkMode)) {
				this.toggleDarkMode(true)
			} else {
				this.toggleDarkMode(false)
			}
		}
		delay(100).then(() => {
			this.makeVisible()
		})
	}

	makeVisible() {
		this.toggleInputContainer.classList.add(this.classes.activeContainer)
	}

	setDarkModeLocalStorage(state) {
		localStorage.setItem("dark-mode", state)
	}

	toggleDarkMode(state) {
		this.toggleInput.checked = state
		this.darkModeState = state
		document.documentElement.classList.toggle("dark-mode", this.darkModeState)
		this.setDarkModeLocalStorage(this.darkModeState)
	}

	acceptEvents() {
		this.toggleInput.addEventListener("change", () => {
			this.toggleDarkMode(!this.darkModeState)
		})
	}
}

const colorTheme = new ToggleThemeHelper()
