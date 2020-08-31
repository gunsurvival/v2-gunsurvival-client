import Game from "./Game.js";
import Uniqid from "./helper/Uniqid.js";
window.onload = () => {
	window.uniqid = new Uniqid();
	const {p5} = window;
	p5.disableFriendlyErrors = true;
	new p5(Game);
};