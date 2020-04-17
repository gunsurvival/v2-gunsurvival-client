class Images2 {
    constructor() {
        for (var i in listImages) {
            let file = listImages[i];
            let subname = /^(.*)\-min\.png$/.exec(file)[1];
            this[subname] = loadImage('../img/' + file);
        }
    }
}

var images,
    _camera, _map = [],
    bullets = [],
    grids = [],
    animations = [_map, grids],
    backgroundColor,
    paint = {
        arr: ['Tree', 'Rock', 'Box_wooden', 'Box_emty', 'Door'],
        index: 0
    },
    mouse = {
        x: 0,
        y: 0
    },
    circles = [],
    gridLevel = 50,
    congdon = [],
    congdonTO,
    toggleGrid = true,
    degree = 0,
    size = 1;

function preload() {
    backgroundColor = color('#668E38');
}

function setup() {
    images = new Images2();
    _camera = new Camera();
    _camera.unSmooth();
    let canv = createCanvas(WIDTH, HEIGHT);
    canv.parent('wrap-game');
    angleMode(DEGREES);
    smooth();
    imageMode(CENTER);
    ellipseMode(CENTER);
    noLoop();
    strokeWeight(4)
    textSize(20);
    textAlign(CENTER, CENTER);

    let w = 5000,
        h = 5000;

    // for (let i = -w/2; i < w/2; i += 50) {
    //     for (let j = -h/2; j < h/2; j += 50) {
    //         grids.push(new Grid(i,j));
    //     }
    // }
}

function mousePressed() { // mouse down
    if (frameCount == 1) {
        loop();
        return;
    }
    if (mouseButton == 'left') {
        let sprites = {
            Tree,
            Rock,
            Roof_brown,
            Box_wooden,
            Box_emty,
            Door
        }
        let config = {
            pos: _camera.screenToWorld(mouse),
            size: size,
            degree: degree,
            name: paint.arr[paint.index],
            id: _map.length,
            mode: 'draw'
        }
        _map.push(new sprites[paint.arr[paint.index]](config));
    }

    if (mouseButton == 'right') {
        _map.splice(_map.length - 1, 1);
    }
}

function draw() {
    // push();
    background(backgroundColor);
    push();
    _camera.update(); // hàm này có scale và translate

    for (let group of animations) {
        for (let i = 0; i < group.length; i++) {
            let animation = group[i];
            animation.update();
            animation.draw();
            if (animation.delete) {
                group.splice(i, 1);
                i--;
            }
        }
    }
    text('+', 0, 0);
    pop();
    if (toggleGrid) {
        let mPos = {
            x: mouseX,
            y: mouseY
        }
        let _gridLevel = gridLevel * _camera.scale;
        let world = {
            x: Math.round(_camera.screenToWorld(mPos).x/_gridLevel) * _gridLevel,
            y: Math.round(_camera.screenToWorld(mPos).y/_gridLevel) * _gridLevel
        }
        let screen = _camera.worldToScreen(world);
        mouse.x = screen.x;
        mouse.y = screen.y;
    } else {
        mouse.x = mouseX;
        mouse.y = mouseY;
    }
    
    let sprite = paint.arr[paint.index];
    let img = images[sprite.toLowerCase()];
    push();
    translate(mouse.x, mouse.y);
    rotate(degree);
    scale(size);
    image(img, 0, 0, img.width * _camera.scale, img.height * _camera.scale);
    pop();
    let fit = 100,
        speed = 10;
    if (frameCount<10)
        return;
    if (mouseX < fit)
        _camera.toX -= speed;
    if (mouseX > width - fit)
        _camera.toX += speed;
    if (mouseY < fit)
        _camera.toY -= speed;
    if (mouseY > height - fit)
        _camera.toY += speed;
    line(mouse.x, mouse.y, mouseX, mouseY);
    text('Camera zoom: ' + _camera.scale, 80, 20)
    text(_camera.x+ ' ' + _camera.y, width/2, height-100);

    if (keyIsDown(87)) {
        degree -= 1;
    }
    if (keyIsDown(83)) {
        degree += 1;
    }
    if (keyIsDown(65)) {
        size -= 0.01;
    }
    if (keyIsDown(68)) {
        size += 0.01;
    }
    degree %= 180;
    if (size < 0.1)
        size = 0.1
    if (size > 2)
        size = 2;
    size = Number(size.toFixed(2));
}

function mouseWheel(event) {
    let moreS = -0.05 * event.delta / Math.abs(event.delta);
    let newS = _camera.scale + Number(moreS.toFixed(2));
    _camera.zoom(Number(newS.toFixed(2)));
}

function keyPressed() {
    if (keyCode != congdon.length-1) {
        congdon.length = 0;
        congdon[keyCode] = 0;
    }
    congdon[keyCode]++;
    clearTimeout(congdonTO);
    congdonTO = setTimeout(()=>{
        congdon.length = 0;
    }, 500);

    if (keyCode == 32) { //SPACE
        paint.index++;
        if (paint.index > paint.arr.length - 1)
            paint.index = 0;
    }
    if (keyCode == 13 && congdon[keyCode] == 2) { //ENTER
        let mapJSON = [];
        for (let e of _map) {
            mapJSON.push({
                pos: e.pos,
                size: e.size,
                degree: e.degree,
                name: e.name,
                id: e.id
            })
        }
        console.log(mapJSON)
        $.post("/mapeditor", {map: JSON.stringify(mapJSON) }, (data)=>{
            Swal.fire(data);
        })
    }
    if (keyCode == 71) { // G
        toggleGrid = !toggleGrid;
    }
}

$(document).ready(function() {
    $(document).bind("contextmenu", function(e) {
        return false;
    });
});