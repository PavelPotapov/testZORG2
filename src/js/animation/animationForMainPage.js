import * as ScrollMagic from "scrollmagic"
import { TweenMax, TimelineMax, Power2 } from "gsap"
import { ScrollMagicPluginGsap } from "scrollmagic-plugin-gsap"

ScrollMagicPluginGsap(ScrollMagic, TweenMax, TimelineMax)

const controller0 = new ScrollMagic.Controller()
const controller1 = new ScrollMagic.Controller()
const controller2 = new ScrollMagic.Controller()
const controller3 = new ScrollMagic.Controller()
const controller4 = new ScrollMagic.Controller()

const scene0 = new ScrollMagic.Scene({
	triggerElement: ".gallery",
	triggerHook: 0.2,
	reverse: false,
})

const scene1 = new ScrollMagic.Scene({
	triggerElement: ".projects",
	triggerHook: 0.5,
	reverse: false,
})

const scene2 = new ScrollMagic.Scene({
	triggerElement: ".services__profile",
	triggerHook: 0.8,
	reverse: false,
})

const scene3 = new ScrollMagic.Scene({
	triggerElement: ".carrier__vacancy",
	triggerHook: 0.5,
	reverse: false,
})

const scene4 = new ScrollMagic.Scene({
	triggerElement: ".intro",
	triggerHook: 0.7,
	reverse: false,
})

const tween0 = new TimelineMax().to(".gallery", 0.5, {
	opacity: 1,
	ease: Power2.easeInOut,
	delay: 0.4,
})

const tween1 = new TimelineMax().to(".projects", 0.5, {
	opacity: 1,
	ease: Power2.easeInOut,
	delay: 0.5,
})

const tween2 = new TimelineMax()
	.to(".services", 0.5, {
		opacity: 1,
		ease: Power2.easeInOut,
		delay: 0.3,
	})
	.to(
		".services__profile-title",
		0.5,
		{
			opacity: 1,
			x: 0,
			ease: Power2.easeInOut,
			delay: 0.3,
		},
		"-=0.3"
	)
	.to(
		".services__profile-subtitle",
		0.5,
		{
			opacity: 1,
			x: 0,
			ease: Power2.easeInOut,
			delay: 0.3,
		},
		"-=0.3"
	)

var listItems = document.querySelectorAll(`[data-js="vacancy-item"]`)
const tween3 = new TimelineMax()
listItems.forEach(function (item, index) {
	const tween = TweenMax.to(item, 0.2, {
		opacity: 1,
		ease: Power2.easeInOut,
	})
	tween3.add(tween, 0.1 * index) // 0.1 - интервал между анимациями
})

const formAnimation = TweenMax.to(
	document.querySelector(".carrier__application"),
	0.3,
	{
		opacity: 1,
	}
)
tween3.add(formAnimation, 1.2)

const tween4 = new TimelineMax().to(".intro", 0.5, {
	opacity: 1,
	ease: Power2.easeInOut,
	delay: 0.4,
})

scene0.setTween(tween0).addTo(controller0)
scene1.setTween(tween1).addTo(controller1)
scene2.setTween(tween2).addTo(controller2)
scene3.setTween(tween3).addTo(controller3)
scene4.setTween(tween4).addTo(controller4)
