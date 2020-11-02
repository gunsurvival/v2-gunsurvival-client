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
        utils.pauseGame = () => {
            s.noLoop();
        }
        utils.resumeGame = () => {
            s.loop();
        }
        utils.resetGame = () => {
            s.renderer.clear();
        }
        s.renderer = new Renderer(s);

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
                "Tree",
                "Bullet"
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
            priorityQueue.push("Score");
            priorityQueue.push("Player");
            priorityQueue.push("Rock");
            priorityQueue.push("Tree");
            priorityQueue.push("RoofBrown");
            priorityQueue.push("ChatText"); // chat luôn ở cuối
            s.renderer.usePriorityQueue(priorityQueue);

            // init other middleware
            s.renderer.add(new Middleware.Announce());
            s.renderer.add(new Middleware.Bloodbar());
            s.renderer.add(new Middleware.Hotbar());
            s.renderer.add(new Middleware.Camera());
            // init middleware Game World
            // s.renderer.add(new Sprite.Rock({ pos: { x: 100, y: 10 } }));
            // s.renderer.add(new Sprite.ChatText({text: ""}));
            s.renderer.sort();

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
            s.renderer.sort();
            s.renderer.render(s);

            const player = s.renderer.find({id: socket.id}); // check if able to send socket emit
            if (player) {
                const camera = s.renderer.find({name: "Camera"});
                const _screenPos = camera.worldToScreen(player.pos, s);
                socket.emit("UpdateRotate", {
                    rotate: s.atan2(s.mouseY - _screenPos.y, s.mouseX - _screenPos.x)
                });
            }
        };

        s.keyPressed = () => {
            // on key down
            const player = s.renderer.find({id: socket.id}); // check if able to send socket emit
            const isChatting = $("#chat").css("display") != "none";
            if (!player || isChatting){
                return;
            }
            if (s.keyCode == 13) { // ENTER
                if (!isChatting) {
                    $("#chat").fadeIn(100, () => {
                        $("#chat").focus();
                    });
                }
                return;
            }
            socket.emit("UpdateLogkm", {
                method: "keyboard",
                keyCode: s.keyCode,
                value: true
            });
            // if (keyCode >= 49 && keyCode <= 57) {
            //     // choose weapon
            //     hotbar.choose(keyCode - 49);
            // } else {
            //     socket.emit("keydown", key);
            // }
        }

        s.keyReleased = () => {
            // on key up
            const player = s.renderer.find({id: socket.id}); // check if able to send socket emit
            const isChatting = $("#chat").css("display") != "none";
            if (!player || isChatting) {
                return;
            }
            socket.emit("UpdateLogkm", {
                method: "keyboard",
                keyCode: s.keyCode,
                value: false
            });
        }

        s.mousePressed = () => {
            // on mouse down
            const player = s.renderer.find({id: socket.id}); // check if able to send socket emit
            if (!player) {
                return;
            }
            socket.emit("UpdateLogkm", {
                method: "mouse",
                mouseButton: s.mouseButton,
                value: true
            });
        }

        s.mouseReleased = () => {
            // on mouse down
            const player = s.renderer.find({id: socket.id}); // check if able to send socket emit
            if (!player) {
                return;
            }
            socket.emit("UpdateLogkm", {
                method: "mouse",
                mouseButton: s.mouseButton,
                value: false
            });
        }

        const env = {
            socket,
            utils,
            s
        };
        initSocketEvent(env);
    };
    new p5(Game);
};;