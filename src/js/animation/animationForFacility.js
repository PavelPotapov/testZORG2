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
	triggerElement: ".profile",
	triggerHook: 0.2,
	reverse: false,
})

const scene1 = new ScrollMagic.Scene({
	triggerElement: ".work-condition",
	triggerHook: 0.5,
	reverse: false,
})

const scene2 = new ScrollMagic.Scene({
	triggerElement: ".process",
	triggerHook: 0.7,
	reverse: false,
})

const scene3 = new ScrollMagic.Scene({
	triggerElement: ".carrier",
	triggerHook: 0.5,
	reverse: false,
})

const tween0 = new TimelineMax().to(".profile", 0.5, {
	opacity: 1,
	ease: Power2.easeInOut,
	delay: 0.4,
})

const tween1 = new TimelineMax().to(".work-condition", 0.5, {
	opacity: 1,
	ease: Power2.easeInOut,
	delay: 0.3,
})

const tween2 = new TimelineMax().to(".process", 0.5, {
	opacity: 1,
	ease: Power2.easeInOut,
	delay: 0.3,
})

const tween3 = new TimelineMax()
const formAnimation = TweenMax.to(
	document.querySelector(".carrier__application"),
	0.3,
	{
		opacity: 1,
	}
)
tween3.add(formAnimation, 0.5)

scene0.setTween(tween0).addTo(controller0)
scene1.setTween(tween1).addTo(controller1)
scene2.setTween(tween2).addTo(controller2)
scene3.setTween(tween3).addTo(controller3)

