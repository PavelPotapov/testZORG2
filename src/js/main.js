import "../styles/scss/main.scss"
import { Burger } from "./burger"
import { AriaHidden } from "./areaHidden"
/**
 * Файл нужен для всех страниц. Точка входа в приложение.
 */
new Burger({ maxWidth: 1000 })
new AriaHidden('[data-js="laptop-menu"]', 1000)
