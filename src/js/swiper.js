import Swiper from "swiper/bundle"
// import styles bundle
import "swiper/css/bundle"
import { delay } from "./utils"

export const swiper = new Swiper(".swiper-container", {
	effect: "coverflow",
	grabCursor: true,
	centeredSlides: true,
	slidesPerView: 1.5,
	coverflowEffect: {
		rotate: -8,
		stretch: 0,
		depth: 200,
		modifier: 4,
		slideShadows: true,
	},
	loop: true,
	autoplay: {
		delay: 5000,
	},
	navigation: {
		nextEl: ".swiper-button-next",
		prevEl: ".swiper-button-prev",
	},
	keyboard: {
		enabled: true,
	},
	mousewheel: {
		thresholdDelta: 70,
	},
	breakpoints: {
		400: {
			slidesPerView: 1.5,
		},
	},
	pagination: {
		el: ".swiper-pagination",
		dynamicMainBullets: 5,
		clickable: true,
	},
})

//если это не сделать, то почему-то autoplay не работает, он сработает только после взаимодействия со слайдером
delay(5000).then(() => {
	swiper.slideNext()
})
