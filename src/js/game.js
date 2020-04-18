const BULLET_CONFIG = {
    ak47: {
        shake: 5,
        holdWait: 40,
        reload: 90
    },
    awp: {
        shake: 30,
        holdWait: 100,
        delayFire: 100,
        reload: 220
    },
    m4a1: {
        shake: 3,
        holdWait: 40,
        reload: 100
    },
    paint: {
        shake: 8,
        holdWait: 40,
        reload: 120
    },
    shotgun: {
        shake: 12,
        holdWait: 40,
        reload: 100
    }
}

let images, gunners = [],
    _camera, _map = [],
    ground = [],
    bullets = [],
    bloodBar = new BloodBar(),
    animations = [ground, bullets, gunners, _map],
    spectator = new Spectator(),
    hotbar = new Hotbar(),
    pingms = 0,
    fps = 60,
    socket,
    backgroundColor,
    indexGun = 0,
    boundary = new Rectangle(0, 0, 2000, 2000);

let reason = () => {
    swal.fire({
        title: "KB2A - TEAM",
        text: "Do team bọn mình không đủ tiền để thuê server :)) nên mình lấy máy của mình (khoa ko mlem) làm server luôn. Mà máy mình đâu online thường xuyên nên đã làm server heroku để dự phòng (server này ping khoảng 200ms)",
        icon: "info",
        background: `url('${ip}img/avatarpage-min.png') no-repeat center center`,
        allowOutsideClick: false,
        allowEscapeKey: false
    })
}

let changeServer = () => {
    let serverName = ((ip == "http://gunsurvival2.herokuapp.com/") ? "Heroku" : "Khoa Ko Mlem");
    if (serverName == "Heroku")
        location.assign('?server=khoakomlem');
    else
        location.assign('?server=heroku');
}

function preload() {
    noLoop();
    backgroundColor = color('#668E38');

    socket = io(ip);

    socket.on('connect', () => {
        socket.emit('rooms update');
        $('#exit').click();
        getImages();
        swal.fire({
            title: "Yes",
            text: "Đã kết nối tới server của " + ((ip == "http://gunsurvival2.herokuapp.com/") ? "Heroku" : "Khoa Ko Mlem"),
            icon: "success",
            footer: '<a onclick="reason()" href="#">Tại sao lại hiện bảng này?</a>',
            background: `url('${ip}img/avatarpage-min.png') no-repeat center center`,
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(()=>{
            if (!images)
                getImages();
        })
    });

    socket.on('connect_error', (error) => {
        socket.emit('rooms update');
        $('#exit').click();
        swal.fire({
            title: "Ooops!",
            text: "Có vẻ như server " + ((ip == "http://gunsurvival2.herokuapp.com/") ? "Heroku" : "Khoa Ko Mlem") + " đã offline :(",
            icon: "error",
            footer: '<a onclick="changeServer()" href="#">Bấm vào đây để đổi server</a>',
            allowOutsideClick: false,
            allowEscapeKey: false
        })
    })

    socket.on('update private', myData => { // update chỉ của riêng bạn
        // debugger;
        // console.log(myData);
        let { name, pos, degree, gun } = myData;
        let indexG = gunners.findIndex(e => e.id == socket.id);

        if (indexG != -1) { // nếu user đã có sẵn thì cập nhật position
            let gunner = gunners[indexG];

            gunner.moveTo(pos);
            //end of position

            gunner.degree %= 360;
            let num = [],
                alpha = gunner.degree,
                beta = degree;
            num.push({
                result: abs(alpha - beta),
                beta
            });
            num.push({
                result: abs(alpha - (beta + 360)),
                beta: beta + 360
            });
            num.push({
                result: abs(alpha - (beta - 360)),
                beta: beta - 360
            });
            num.sort((a, b) => a.result - b.result);
            gunner.toDegree = num[0].beta;
            //end of update degree
        } else { // nếu như đang trốn trong cây và mình chưa đc khởi tạo
            gunners.push(new Gunner({
                id: socket.id,
                name,
                pos,
                gun
            }));

            if (hotbar.items.findIndex(e => e.name == gun.name) == -1) { // nếu hotbar chưa có vũ khí đó thì cập nhật
                hotbar.add({
                    name: gun.name,
                    imgName: gun.name.toLowerCase()
                })
                hotbar.choose(hotbar.items.length - 1);
            }

            _camera.follow(gunners[gunners.length - 1].pos); // follow mình

            setInterval(() => {
                let GCCPOFO = _camera.GCCPOFO();
                let degree = atan2(mouseY - GCCPOFO.y, mouseX - GCCPOFO.x);
                socket.emit('gunner degree', degree);
            }, 50);
            // end of socket.id == id
        }
    }) // end of update private

    socket.on('update game', gunnersData => {
        // debugger;
        for (let gunnerData of gunnersData) {
            let { id, privateData, publicData } = gunnerData;

            if (publicData) { // publicData hiện giờ gồm bullet
                let { bulletsData, dead } = publicData;

                let indexG = gunners.findIndex(e => e.id == id);
                if (indexG != -1)
                    gunners[indexG].dead = dead;

                //bullet job
                for (bulletData of bulletsData) {
                    let indexB = bullets.findIndex(e => e.id == bulletData.id);

                    if (indexB == -1) { // nếu không tìm thấy bullet
                        bullets.push(new Bullet(bulletData));

                        if (bulletData.owner == socket.id) { // nếu chủ sở hữu là mình
                            _camera.shake(BULLET_CONFIG[bulletData.name].shake); // giật camera theo tên đạn khi bắn
                            let myIndex = gunners.findIndex(e => e.id == socket.id);
                            if (myIndex != -1) {
                                if (bulletData.type == 'awp') {
                                    gunners[myIndex].reloadGun('delayFire');
                                }
                                if (gunners[myIndex].gun.bulletCount > 0)
                                    gunners[myIndex].gun.bulletCount--;
                            }
                        }

                    } else { // đạn có sẵn thì cập nhật vị trí
                        let bullet = bullets[indexB];
                        bullet.moveTo(bulletData.pos);
                        bullet.lifeTime = 40;
                    }
                }
            }

            if (privateData) {
                let { name, pos, degree, gun } = privateData;

                let indexG = gunners.findIndex(e => e.id == id);

                if (indexG == -1) { // add nếu chưa có user đó thì add
                    if (id != socket.id)
                        Toast.fire({
                            icon: "info",
                            title: id + " đã vào phòng!"
                        });
                    gunners.push(new Gunner({
                        id,
                        name,
                        pos,
                        gun
                    }));
                    if (id == socket.id) { // nếu đó là mình
                        if (hotbar.items.findIndex(e => e.name == gun.name) == -1) { // nếu hotbar chưa có vũ khí đó thì cập nhật
                            hotbar.add({
                                name: gun.name,
                                imgName: gun.name.toLowerCase()
                            })
                            hotbar.choose(hotbar.items.length - 1);
                        }

                        _camera.follow(gunners[gunners.length - 1].pos); // follow mình

                        setInterval(() => {
                            let GCCPOFO = _camera.GCCPOFO();
                            let degree = atan2(mouseY - GCCPOFO.y, mouseX - GCCPOFO.x);
                            socket.emit('gunner degree', degree);
                        }, 50);
                        // end of socket.id == id
                    }
                    // end of indexG == -1
                } else { // nếu user đã có sẵn thì cập nhật position
                    let gunner = gunners[indexG];

                    gunner.moveTo(pos);
                    //end of position

                    gunner.degree %= 360;
                    let num = [],
                        alpha = gunner.degree,
                        beta = degree;
                    num.push({
                        result: abs(alpha - beta),
                        beta
                    });
                    num.push({
                        result: abs(alpha - (beta + 360)),
                        beta: beta + 360
                    });
                    num.push({
                        result: abs(alpha - (beta - 360)),
                        beta: beta - 360
                    });
                    num.sort((a, b) => a.result - b.result);
                    gunner.toDegree = num[0].beta;
                    //end of update degree
                }
            }
        }
    })

    socket.on('weapon change', ({ id, gun } = {}) => {
        let index = gunners.findIndex(e => e.id == id);
        if (index == -1) return;
        let gunner = gunners[index];

        if (id == socket.id) {
            let indexHotbar = hotbar.items.findIndex(e => e.name == gun.name);
            if (indexHotbar == -1) {
                hotbar.add({
                    name: gun.name,
                    imgName: gun.name.toLowerCase()
                })
                hotbar.choose(hotbar.items.length - 1);
            } else {
                hotbar.choose(indexHotbar);
            }

            if (gunner.gun.name != gun.name) {
                _camera.zoom(1);
            }
        }
        gunner.updateGun(gun);
    })

    socket.on('hideintree', ({ id } = {}) => {
        if (id == socket.id)
            return;
        let index = gunners.findIndex(e => e.id == id);
        if (index == -1) return;
        let gunner = gunners[index];
        gunner.hideInTree();
    })

    socket.on('unhideintree', ({ id, pos } = {}) => {
        if (id == socket.id)
            return;
        let index = gunners.findIndex(e => e.id == id);
        if (index == -1) return;
        let gunner = gunners[index];
        gunner.unHideInTree();
        gunner.pos.x = pos.x;
        gunner.pos.y = pos.y;
        gunner.target = { ...pos };
    })

    socket.on('map', map => {
        showSketch(500);
        let object = {
            Tree,
            Rock,
            Roof_brown,
            Box_wooden,
            Box_emty,
            Door
        }
        let tansuat = {
            leaf: 2,
            gravel: 3
        }
        for (let i in map) {
            switch (map[i].type) {
                case "Bullet":
                    for (let bullet of map[i].arr) {
                        bullets.push(new Bullet(bullet));
                    }
                    break;
                default:
                    switch (map[i].type) {
                        case "Tree":
                            tansuat.leaf--;
                            if (tansuat.leaf <= 0) {
                                ground.push(new Leaf(map[i]));
                                tansuat.leaf = 2;
                            }
                            break;
                        case "Rock":
                            tansuat.gravel--;
                            if (tansuat.gravel <= 0) {
                                ground.push(new Gravel(map[i]));
                                tansuat.gravel = 3;
                            }
                            break;
                    }
                    _map.push(new object[map[i].type](map[i]));
            }
        }
    })
    socket.on('pingms', time => {
        pingms = Date.now() - time;
        fps = Math.round(frameRate());
        setTimeout(() => {
            socket.emit('pingms', Date.now());
        }, 500)
    })

    socket.on('room leave', id => {
        if (id != socket.id) {
            Toast.fire({
                icon: "info",
                title: id + " đã thoát phòng!"
            });
        }
        if (spectator.isSpectator) {
            _camera.follow(spectator.delete(id));
        }
        gunners.splice(gunners.findIndex(e => e.id == id), 1);
    })

    socket.on('addTreeShake', addArr => {
        for (let i in addArr) {
            let indexT = _map.findIndex(e => e.id == addArr[i]);
            if (indexT == -1)
                continue;
            _map[indexT].gunnerCount++;
        }
    })

    socket.on('spliceTreeShake', spliceArr => {
        for (let i in spliceArr) {
            let indexT = _map.findIndex(e => e.id == spliceArr[i]);
            if (indexT == -1)
                continue;
            _map[indexT].gunnerCount--;
        }
    })


    socket.on('gun reloaded', gun => {
        let myIndex = gunners.findIndex(e => e.id == socket.id);
        if (myIndex == -1)
            return;
        gunners[myIndex].gun.bulletCount = gun.bulletCount;
        gunners[myIndex].gun.magazine = gun.magazine;
    })

    socket.on('gun reloading', () => {
        let myIndex = gunners.findIndex(e => e.id == socket.id);
        if (myIndex == -1)
            return;
        let gunner = gunners[myIndex];
        gunner.reloadGun('reload');
    })

    socket.on('update blood', blood => {
        let myIndex = gunners.findIndex(e => e.id == socket.id);
        if (myIndex == -1) return;
        let gunner = gunners[myIndex];
        gunner.hurt();
        bloodBar.updateBlood(blood);
    })

    socket.on('gunner dead', ({ id, killedBy } = {}) => {
        let index = gunners.findIndex(e => e.id == id);
        if (index == -1) return;
        let gunner = gunners[index];
        gunner.dead = true;
        if (id == socket.id) {
            _camera.follow(spectator.start(killedBy));
        }
    })


    // =============================================================

    socket.on('dialog alert', text => {
        if (typeof(text) == "object") {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: text.text,
                preConfirm: () => {
                    eval(text.preConfirm_string);
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: text
            });
        }
    })

    socket.on('toast alert', text => {
        Toast.fire({
            icon: "info",
            title: text
        });
    })

    socket.on('room alert', data => {
        swal.fire(data);
    })

    socket.on('room chat', data => { // cần xem lại khúc này 
        if (Array.isArray(data)) {
            // alert(1)
            if (data[1] == socket.id)
                addMessage('[Hệ thống]', data[0], data[2]);
            else
                addMessage('[Hệ thống]', data[0], data[3]);
            return;
        }

        let { id, time, message } = data;
        addMessage(id, time, message);
    })

    socket.on('room create', ({ master, id, text, maxPlayer, time, playing } = { ...data }) => {
        addRoom(master, id, text, maxPlayer, time, playing);
    })

    socket.on('room update', ({ master, id, text, maxPlayer, time, playing } = data) => {
        updateRoom(master, id, text, maxPlayer, time, playing);
    });

    socket.on('room delete', id => {
        $('#' + id).remove();
    })

    socket.on('rooms update', rooms => {
        $('#ban > tbody').html('');
        for (let room of rooms) {
            let { master, id, text, maxPlayer, time, playing } = room;
            addRoom(master, id, text, maxPlayer, time, playing);
        }
    })

    socket.on('room created', roomID => {
        swal.close();
        Toast.fire({
            icon: "success",
            title: "Đã tạo thành công phòng với mã ID: " + roomID
        });
        socket.emit('room join', roomID);
    })

    socket.on('online', online => {
        $('#online').html(online);
    })

}

function setup() {

    _camera = new Camera();
    let canv = createCanvas(WIDTH, HEIGHT);
    canv.parent('wrap-game');
    angleMode(DEGREES);
    smooth();

    socket.emit('pingms', Date.now());
}

function keyPressed() { // on key down
    socket.emit('keydown', keyCode);
    if ([49, 50, 51, 52, 53].indexOf(keyCode) != -1) {
        socket.emit('weapon change', {
            method: 'number',
            value: keyCode - 49
        });
    }
}

function keyReleased() { // on key up
    socket.emit('keyup', keyCode);
}

function mousePressed() { // mouse down
    if (mouseButton == 'left')
        socket.emit('firedown');
}

function mouseReleased() { // mouse up
    if (mouseButton == 'left') {
        if (spectator.isSpectator) {
            _camera.follow(spectator.next());
        } else
            socket.emit('fireup');
    }

    if (mouseButton == 'right') {
        if (spectator.isSpectator) {
            _camera.follow(spectator.previous());
        } else {
            let myIndex = gunners.findIndex(e => e.id == socket.id);
            if (myIndex == -1)
                return;
            let me = gunners[myIndex];
            if (['awp'].indexOf(me.gun.name) != -1) {
                _camera.zoom(0.5);
            }
        }
    }
}

function draw() {
    push();
    debugger;
    // qtree = new QuadTree(boundary, 4);
    // for (let object of _map) {
    //     if (object.name != "Tree") 
    //         continue;
    //     let point = new Point(object.pos.x, object.pos.y, object);
    //     qtree.insert(point);
    // }
    // for (let gunner of gunners) {
    //     if (gunner.id == socket.id) 
    //         continue;
    //     let point = new Point(gunner.pos.x, gunner.pos.y, gunner);
    //     qtree.insert(point);
    // }

    background(backgroundColor);
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

    pop();
    bloodBar.update();
    bloodBar.draw();

    textSize(20);
    fill('white');
    text('PING: ' + pingms + ' ms', 10, 30);
    text('FPS: ' + fps, 10, 60);

    hotbar.draw();

    let myIndex = gunners.findIndex(e => e.id == socket.id);
    if (myIndex != -1) {
        let me = gunners[myIndex];
        let bulletInfo = me.gun.name + ' | ' + me.gun.bulletCount + ' / ' + me.gun.magazine + ' mag';
        text(bulletInfo, width / 2 - textWidth(bulletInfo) / 2, height - 85);
    }


    if (spectator.isSpectator)
        spectator.showText();
}

function mouseWheel(event) {
    socket.emit('weapon change', {
        method: 'wheel',
        value: event.delta / Math.abs(event.delta)
    });
}