import * as ScrollMagic from "scrollmagic"
import { TweenMax, TimelineMax, Power2 } from "gsap"
import { ScrollMagicPluginGsap } from "scrollmagic-plugin-gsap"

ScrollMagicPluginGsap(ScrollMagic, TweenMax, TimelineMax)

const controller0 = new ScrollMagic.Controller()
const controller1 = new ScrollMagic.Controller()
const controller2 = new ScrollMagic.Controller()

const scene0 = new ScrollMagic.Scene({
	triggerElement: ".about",
	triggerHook: 0.2,
	reverse: false,
})

const scene1 = new ScrollMagic.Scene({
	triggerElement: ".activity",
	triggerHook: 0.7,
	reverse: false,
})

const scene2 = new ScrollMagic.Scene({
	triggerElement: ".team",
	triggerHook: 0.5,
	reverse: false,
})

const tween0 = new TimelineMax().to(".about", 0.5, {
	opacity: 1,
	ease: Power2.easeInOut,
	delay: 0.4,
})

const tween1 = new TimelineMax().to(".activity", 0.5, {
	opacity: 1,
	ease: Power2.easeInOut,
	delay: 0.3,
})

const tween2 = new TimelineMax().to(".team", 0.5, {
	opacity: 1,
	x: 0,
	ease: Power2.easeInOut,
	delay: 0.3,
})

scene0.setTween(tween0).addTo(controller0)
scene1.setTween(tween1).addTo(controller1)
scene2.setTween(tween2).addTo(controller2)
