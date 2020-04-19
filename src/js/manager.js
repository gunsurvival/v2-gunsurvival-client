class Images {
    constructor(listImages) {
        swal.showLoading();
        this.listImages = listImages;
        this.count = 0;
        for (let i in listImages) {
            let file = listImages[i];
            let subname = /^(.*)\-min\.png$/.exec(file)[1];
            this[subname] = loadImage(ip + 'img/' + file, () => {
                if (++this.count == listImages.length) {
                    $('#swal2-content').html('Chờ xử lí hình ảnh :V');
                    this.drawTint(() => {
                        $('#swal2-content').html('Đã xong!');
                        swal.hideLoading();
                        setTimeout(swal.close, 1000);
                    });
                } else {
                    $('#swal2-content').html('Chờ tải game: ' + Math.round(this.count / listImages.length * 100) + '%');
                }
            });
        }
    }

    drawTint(callback) {
        // return;
        let list = ['tree-min.png'];
        for (let i in list) {
            let file = list[i];
            let subname = /^(.*)\-min\.png$/.exec(file)[1];
            this[subname].tint = createGraphics(this[subname].width, this[subname].height);
            this[subname].tint.tint(255, 70);
            this[subname].tint.image(this[subname], 0, 0);
            this[subname].tint.noTint();
            if (i == list.length - 1) {
                setTimeout(callback, 100);
            }
        }
    }
}

class Hotbar {
    constructor({ items = [], choosing = 0, bottom = 40, margin = 25, boxSize = 55 } = {}) {
        this.items = items; // balo
        this.choosing = choosing; // vũ khí đang chọn
        this.bottom = bottom; // vị trí ô chọn súng
        this.margin = margin; // khoảng cách các ô chọn súng
        this.boxSize = boxSize; // size của ô chọn súng
    }

    update() {}

    getBarWidth() {
        return this.items.length * (this.boxSize + this.margin) - this.margin;
    }

    getStartX() {
        return width / 2 - this.getBarWidth() / 2 + this.boxSize / 2;
    }

    wheel(delta) {
        let chooseIndex = this.choosing + delta / abs(delta);
        this.choose(chooseIndex);
    }

    draw() {
        push();
        rectMode(CENTER);
        imageMode(CENTER);
        strokeWeight(4);
        let count = 0;
        let widthBar = this.getBarWidth();
        let startX = this.getStartX();
        for (let e of this.items) { // >> rectMode(CENTER) <<
            let box = {
                x: startX + count * (this.boxSize + this.margin),
                y: height - this.bottom
            }
            let scale;
            if (this.choosing == count) {
                stroke('#f5f5f5');
                fill('#f5f5f5');
                rect(box.x, box.y, this.boxSize + 10, this.boxSize + 10, 10);
                scale = (this.boxSize + 10 - 5) / images[e.name].width;
            } else {
                stroke('#e0e0e0');
                fill('#858585');
                rect(box.x, box.y, this.boxSize, this.boxSize, 10);
                scale = (this.boxSize - 5) / images[e.name].width;
            }
            image(images[e.name], box.x, box.y, images[e.name].width * scale, images[e.name].height * scale);
            count++;
        }
        pop();
    }

    choose(index) {
    	this.choosing = index;
        if (this.choosing < 0)
            this.choosing = 0;
        if (this.choosing > this.items.length - 1)
            this.choosing = this.items.length - 1;
        socket.emit('weapon change', {
            method: 'number',
            value: this.choosing
        });
    }

    click(x, y) {
        let widthBar = this.getBarWidth();
        let startX = this.getStartX();
        let count = 0;
        for (let e of this.items) { // >> rectMode(CORNER) <<
            let box = {
                x: startX + count * (this.boxSize + this.margin) - this.boxSize / 2,
                y: height - this.bottom - this.boxSize / 2
            }
            if (collidePointRect(x, y, box.x, box.y, this.boxSize, this.boxSize)) {
            	this.choose(count);
                socket.emit('weapon change', {
                    method: 'number',
                    value: count
                });
                break;
            }
            count++;
        }
    }
}

class AnnounceText {
    constructor() {
        this.x = 0;
        this.y = 50;
        this.queue = [];
    }

    update() {
        if (this.queue.length == 0)
            return;
        if (this.x == 'done')
            this.x = -textWidth(this.queue[0]);
        this.x += width * 0.002;
        if (this.x > width) {
            this.queue.splice(0, 1);
            this.x = 'done';
        }
    }

    draw() {
        if (this.x == 'done')
            return;
        push();
        textSize(20);
        text(this.queue[0], this.x, this.y);
        pop();
    }

    add(text) {
        this.queue.push(text);
    }
}

class Spectator {
    constructor() {
        this.isSpectator = false;
        this.index = 0;
        this.queue = [];
        this.text = "";
        this.killedBy = "";
    }

    showText() {
        push();
        textAlign(CENTER, CENTER);
        text(this.text, width / 2, height / 4);
        pop();
    }

    stop() {
        this.isSpectator = false;
        this.queue.length = 0;
        this.text = "";
        this.killedBy = "";
        this.index = 0;
    }

    start(killedBy) {
        this.killedBy = killedBy;
        this.text = "LOL noob, you was killed by this pro gamer ¯\_(ツ)_/¯";
        this.isSpectator = true;
        this.createQueue();
        this.index = this.queue.findIndex(e => e.id == killedBy);
        if (this.index == -1)
            this.index = 0;
        return this.queue[this.index].pos;
    }

    next() {
        this.index++;
        if (this.index > this.queue.length - 1) {
            this.createQueue();
            this.index = 0;
        }
        this.updateText();
        return this.queue[this.index].pos; // return next element queue
    }

    previous() {
        this.index--;
        if (this.index < 0) {
            this.createQueue();
            this.index = this.queue.length - 1;
        }
        this.updateText();
        return this.queue[this.index].pos; // return previous element queue
    }

    updateText() {
        if (this.killedBy == this.queue[this.index].id)
            this.text = "LOL noob, you was killed by this pro gamer ¯\_(ツ)_/¯";
        else {
            this.text = "You are watching < " + this.queue[this.index].name + " >";
        }
    }

    createQueue() {
        this.queue.length = 0;
        for (let gunner of gunners) {
            if (gunner.id != socket.id)
                this.queue.push({
                    id: gunner.id,
                    name: gunner.name,
                    pos: gunner.pos
                });
        }
        // shuffle(this.queue);
        return this.queue[0].pos; // return first element when created new queue
    }

    delete(id) {
        let i = this.queue.findIndex(e => e.id == id);
        if (i != -1) { // found index of pos
            this.queue.splice(i, 1);
            if (i < this.index)
                this.index--;
            if (this.index > this.queue.length - 1)
                this.index = this.queue.length - 1;
        }
        if (this.queue.length == 0) {
        	let indexG = gunners.findIndex(e => e.id == socket.id);
        	if (indexG == -1)
        		return;
        	let gunner = gunners[indexG];
            this.queue.push({
                id: socket.id,
                name: gunner.name,
                pos: gunner.pos
            })
            this.index = 0;
            this.text = "This is you, there is no one else in this room :)";
        } else
            this.updateText();
        return this.queue[this.index].pos;
    }
}

class BloodBar {
    constructor({ width = 300, height = 30 } = {}) {
        this.blood = 100;
        this.toBlood = 100;
        this.timeOut;
        this.width = width;
        this.height = height;
        this.y = HEIGHT - 130;
    }

    updateBlood(blood) {
        if (blood < 0)
            blood = 0;
        this.toBlood = blood;
    }

    update() {
        this.blood = lerp(this.blood, this.toBlood, 0.1);
    }

    draw() {
        push();
        noStroke();

        rectMode(CENTER);
        fill('#474747');
        stroke('black');
        strokeWeight(5);
        rect(width / 2, this.y, this.width + 5, this.height+5, 20, 20);

        rectMode(CORNER);
        fill('red');
        strokeWeight(0);
        rect(width / 2 - this.width / 2, this.y - this.height / 2, this.width * this.blood / 100, this.height, 20, 20);
        pop();
    }
}

class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.toX = 0;
        this.toY = 0;
        this.smooth = true;
        this.mode = 'center';
        this.following = false;
        this.scale = 1;
        this.toScale = 1;
        this.speedMove = 0.1;
        this.speedScale = 0.08;
        this.isShaking = false;
    }

    update() {


        // scale(this.scale);

        if (this.smooth) {
            if (this.following) { //smooth move on following camera
                this.x = lerp(this.x, this.followPos.x, this.speedMove);
                this.y = lerp(this.y, this.followPos.y, this.speedMove);
            } else { //smooth move on static position camera
                this.x = lerp(this.x, this.toX, this.speedMove);
                this.y = lerp(this.y, this.toY, this.speedMove);
            }
            this.scale = lerp(this.scale, this.toScale, this.speedScale);
        } else {
            if (this.following) { //sharp move on following position camera
                this.x = this.follow.x;
                this.y = this.follow.y;
            } else { //sharp move on static position camera
                this.x = this.toX;
                this.y = this.toY;
            }
            this.scale = this.toScale;
        }

        switch (this.mode) {
            case 'normal':
                scale(this.scale);
                translate(this.x, this.y);

                break;
            case 'center':
                translate(WIDTH * .5, HEIGHT * .5);
                scale(this.scale);
                translate(-this.x, -this.y);
                break;
        }
    }

    unFollow() {
        this.following = false;
    }

    follow(pos) {
        this.followPos = pos;
        this.following = true;
    }

    shake(noise) {
        if (this.isShaking)
            return;
        let cX = this.x; // current X
        let cY = this.y; // current Y
        // let random = [-1, 1][Random(0, 1, true)];
        this.x = cX + random(-noise, noise);
        this.y = cY + random(-noise, noise);
    }

    GCCPOFO() { //get current camera position of following object (the mid point [ + ])
        return {
            x: this.followPos.x - this.x + WIDTH / 2,
            y: this.followPos.y - this.y + HEIGHT / 2
        }
    }

    moveTo(pos) {
        let { x, y } = pos;
        this.toX = x;
        this.toY = y;
    }

    changeMode(mode) {
        if (['center', 'normal'].indexOf(mode) != -1)
            this.mode = mode;
    }

    zoom(scale) {
        this.toScale = scale;
    }

    smooth() {
        this.smooth = true;
    }

    unSmooth() {
        this.smooth = false;
    }

    // Chuyển đổi vị trí thực của vật thể (theo hệ toạ độ của mapgame) về vị trí trên màn hình (theo hệ toạ độ màn hình)
    worldToScreen({ x, y } = {}) {
        let worldX = x;
        let worldY = y;
        let screenX = (worldX - this.x) * this.scale + width * .5
        let screenY = (worldY - this.y) * this.scale + height * .5
        return {
            x: screenX,
            y: screenY
        }
    }

    // Ngược lại worldToScreen
    screenToWorld({ x, y } = {}) {
        let screenX = x;
        let screenY = y;
        let worldX = (screenX - width * .5) / this.scale + this.x
        let worldY = (screenY - height * .5) / this.scale + this.y
        return {
            x: worldX,
            y: worldY
        }
    }
}