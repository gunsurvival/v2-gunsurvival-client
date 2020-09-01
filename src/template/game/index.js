import Uniqid from "./helper/Uniqid.js";
import * as Middleware from "./animation/middleware/index.js"; // middleware RENDERING game (GUI)
import * as Sprite from "./animation/sprite/index.js"; // sprite (game world)
import * as Helper from "./helper/index.js"; // helper for client (load image, mobile control . . .)
import Renderer from "./Renderer.js"; // hỗ trợ render mọi animation
import initSocketEvent from "./SocketEvent.js";

export default ({
    socket,
    utils
} = {}) => {
    window.uniqid = new Uniqid();
    const { p5 } = window;
    p5.disableFriendlyErrors = true;
    const Game = function(s) {
        // s is sketch (p5 instance mode)
        const renderer = new Renderer(s);

        s.preload = () => {
            // load ảnh game
            const imageNames = [
                "BoxEmty",
                "BoxNormal",
                "Door",
                "Gravel1",
                "Gravel2",
                "Gravel3",
                "Gunner",
                "Leaf1",
                "Leaf2",
                "Leaf3",
                "Rock",
                "RoofBrown",
                "Tree"
            ];
            const imageLoader = new Helper.ImageLoader();
            window.GameImages = {};
            imageLoader.load(s, imageNames, window.GameImages, "./game/game_assets/img/");
        }

        s.setup = () => {
            // sắp xếp thứ tự ưu tiên vẽ
            // luôn ưu tiên các middleware trước
            const priorityQueue = [];
            // --middlewares
            priorityQueue.push("Announce");
            priorityQueue.push("Bloodbar");
            priorityQueue.push("Hotbar");
            priorityQueue.push("Camera"); // middleware "Camera" luôn ở cuối cùng của list
            // --sprites
            priorityQueue.push("Gravel");
            priorityQueue.push("Leaf");
            priorityQueue.push("Bullet");
            priorityQueue.push("BoxEmty");
            priorityQueue.push("BoxNormal");
            priorityQueue.push("Door");
            priorityQueue.push("Rock");
            priorityQueue.push("Tree");
            priorityQueue.push("Score");
            priorityQueue.push("Gunner");
            priorityQueue.push("RoofBrown");
            priorityQueue.push("ChatText"); // chat luôn ở cuối
            renderer.usePriorityQueue(priorityQueue);

            // init other middleware
            renderer.add(new Middleware.Announce());
            renderer.add(new Middleware.Bloodbar());
            renderer.add(new Middleware.Hotbar());
            renderer.add(new Middleware.Camera());
            // init middleware Game World
            // renderer.add(new Sprite.Rock({ pos: { x: 100, y: 10 } }));
            // renderer.add(new Sprite.ChatText({text: ""}));
            renderer.sort();

            const canv = s.createCanvas(window.innerWidth, window.innerHeight);
            canv.parent("wrap-game");
            s.ellipseMode(s.CENTER); // xài mode center cho hình elíp, tròn
            s.rectMode(s.CENTER); // xài mode center cho hình vuông
            s.imageMode(s.CENTER); // xài mode center cho ảnh
            s.angleMode(s.RADIANS); // xài radian để tính góc
        };
        s.draw = () => {
            // s.clear();
            s.background("#27422D");
            renderer.sort();
            renderer.render(s);
        };

        const env = {
        	socket,
        	utils,
        	renderer
        };
        initSocketEvent(env);
    };
    new p5(Game);
};;