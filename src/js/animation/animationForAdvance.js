import * as ScrollMagic from "scrollmagic"
import { TweenMax, TimelineMax, Power2 } from "gsap"
import { ScrollMagicPluginGsap } from "scrollmagic-plugin-gsap"

ScrollMagicPluginGsap(ScrollMagic, TweenMax, TimelineMax)

const controller0 = new ScrollMagic.Controller()
const controller1 = new ScrollMagic.Controller()
const controller2 = new ScrollMagic.Controller()

const scene0 = new ScrollMagic.Scene({
	triggerElement: ".advance",
	triggerHook: 0.2,
	reverse: false,
})

const scene1 = new ScrollMagic.Scene({
	triggerElement: ".work-condition",
	triggerHook: 0.7,
	reverse: false,
})

const scene2 = new ScrollMagic.Scene({
	triggerElement: ".carrier__vacancy",
	triggerHook: 0.5,
	reverse: false,
})

const tween0 = new TimelineMax().to(".advance", 0.5, {
	opacity: 1,
	ease: Power2.easeInOut,
	delay: 0.4,
})

const tween1 = new TimelineMax().to(".work-condition", 0.5, {
	opacity: 1,
	ease: Power2.easeInOut,
	delay: 0.3,
})

var listItems = document.querySelectorAll(`[data-js="vacancy-item"]`)
const tween2 = new TimelineMax()
listItems.forEach(function (item, index) {
	const tween = TweenMax.to(item, 0.2, {
		opacity: 1,
		ease: Power2.easeInOut,
	})
	tween2.add(tween, 0.1 * index) // 0.1 - интервал между анимациями
})

const formAnimation = TweenMax.to(
	document.querySelector(".carrier__application"),
	0.3,
	{
		opacity: 1,
	}
)
tween2.add(formAnimation, 1.2)
scene0.setTween(tween0).addTo(controller0)
scene1.setTween(tween1).addTo(controller1)
scene2.setTween(tween2).addTo(controller2)
