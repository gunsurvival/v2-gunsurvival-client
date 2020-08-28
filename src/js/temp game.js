// setup
// p5.cursor(ip + "img/aim-min.png", 32, 32);
// socket.emit("pingms", Date.now());

let boundary = new Rectangle(0, 0, 2000, 2000),
	gunners = [],
	// _camera, _map = [],
	spectator = new Spectator(),
	bloodBar = new BloodBar(),
	hotbar = new Hotbar(),
	mobileControl,
	backgroundColor,
	indexGun = 0,
	bullets = [],
	ground = [],
	scores = [],
	chats = [],
	pingms = 0,
	gameFont,
	fps = 60,
	images,
	socket;

let animations = [ground, bullets, scores, gunners, _map, chats];

let reason = () => {
	swal.fire({
		title: "KB2A - TEAM",
		text:
			"Do team bọn mình không đủ tiền để thuê server :)) nên mình lấy máy của mình (khoa ko mlem) làm server luôn. Mà máy mình đâu online thường xuyên nên đã làm server heroku để dự phòng (server này ping khoảng 200ms)",
		icon: "info",
		background: `url('${ip}img/avatarpage-min.png') no-repeat center center`,
		allowOutsideClick: false,
		allowEscapeKey: false
	});
};

let changeServer = () => {
	let serverName =
		ip == "http://gunsurvival2.herokuapp.com/" ? "Heroku" : "Khoa Ko Mlem";
	if (serverName == "Heroku") location.assign("?server=khoakomlem");
	else location.assign("?server=heroku");
};

function windowResized() {
	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;
	console.log(WIDTH);
	resizeCanvas(WIDTH, HEIGHT);
}

function preload() {
	noLoop();
	backgroundColor = color("#657d46");
	mobileControl = new MobileControl({
		position: createVector(WIDTH - 100, HEIGHT - 70)
	});

	socket = io(ip);

	socket.on("connect", () => {
		socket.emit("rooms update");
		$("#exit").click();
		swal.fire({
			title: "Yes",
			text:
				"Đã kết nối tới server của " +
				(ip == "http://gunsurvival2.herokuapp.com/"
					? "Heroku"
					: "Khoa Ko Mlem"),
			icon: "success",
			footer:
				'<a onclick="reason()" href="#">Tại sao lại hiện bảng này?</a>',
			background: `url('${ip}img/avatarpage-min.png') no-repeat center center`,
			allowOutsideClick: false,
			allowEscapeKey: false,
			showConfirmButton: false,
			onOpen: getImages
		});
	});

	socket.on("connect_error", error => {
		$("#exit").click();
		if (!$(".swal2-error").is(":visible"))
			swal.fire({
				title: "Ooops!",
				text:
					"Có vẻ như server " +
					(ip == "http://gunsurvival2.herokuapp.com/"
						? "Heroku"
						: "Khoa Ko Mlem") +
					" đã offline :(",
				icon: "error",
				footer:
					'<a onclick="changeServer()" href="#">Bấm vào đây để đổi server</a>',
				allowOutsideClick: false,
				allowEscapeKey: false
			});
	});

	socket.on("update game", gameDatas => {
		for (let groupName in gameDatas) {
			let group = gameDatas[groupName];
			for (let object of group) {
				switch (groupName) {
					case "gunners": {
						let {
							id,
							name,
							pos,
							degree,
							bag,
							dead,
							blood,
							size
						} = object;
						let indexG = gunners.findIndex(e => e.id == id);
						if (indexG == -1) {
							gunners.push(new Gunner(object));
							let gunner = gunners[gunners.length - 1];
							gunner.updateGun(bag.arr[bag.index]);

							if (id == socket.id) {
								hotbar.items = bag.arr;
								_camera.follow(gunner.pos); // follow mình
								setInterval(() => {
									let GCCPOFO = _camera.GCCPOFO();
									let degree = atan2(
										mouseY - GCCPOFO.y,
										mouseX - GCCPOFO.x
									);
									socket.emit("gunner degree", degree);
								}, 50);
							}
						} else {
							let gunner = gunners[indexG];
							gunner.moveTo(pos);
							gunner.rotateTo(degree);
							let gun = bag.arr[bag.index];
							if (gun.name != gunner.gun.name)
								gunner.updateGun(gun);
							gunner.updateSize(size);
							gunner.dead = dead;
							if (id == socket.id) {
								bloodBar.updateBlood(blood);
							}
						}
						break;
					}

					case "bullets":
						//bullet job
						// console.log(object);
						let {
							id,
							pos,
							size,
							name,
							ownerID,
							speed,
							imgName
						} = object;
						let index = bullets.findIndex(e => e.id == id);

						if (index == -1) {
							// nếu không tìm thấy bullet
							bullets.push(new Bullet(object));

							if (ownerID == socket.id) {
								// nếu chủ sở hữu là mình và ko phải loại đạn tách
								_camera.shake(BULLET_CONFIG[name].shake); // giật camera theo tên đạn khi bắn
								let myIndex = gunners.findIndex(
									e => e.id == socket.id
								);
								if (myIndex != -1) {
									let whiteList = ["awp"];
									if (whiteList.indexOf(name) != -1) {
										gunners[myIndex].reloadGun("delayFire");
									}
									if (gunners[myIndex].gun.bulletCount > 0)
										gunners[myIndex].gun.bulletCount--;
								}
							}
						} else {
							// đạn có sẵn thì cập nhật vị trí
							let bullet = bullets[index];
							bullet.moveTo(pos);
						}
						break;
					case "scores": {
						let {id, pos, value} = object;
						let index = scores.findIndex(e => e.id == id);

						if (index == -1) {
							scores.push(new Score(object));
						} else {
							let score = scores[index];
							score.moveTo(pos);
							score.value = value;
						}
						break;
					}
				}
			}
		}
	});

	socket.on("weapon change", ({id, gun} = {}) => {
		let index = gunners.findIndex(e => e.id == id);
		if (index == -1) return;
		let gunner = gunners[index];

		if (id == socket.id) {
			let indexHotbar = hotbar.items.findIndex(e => e.name == gun.name);
			if (indexHotbar == -1) {
				hotbar.items.push(gun);
			}

			if (gunner.gun.name != gun.name) {
				_camera.zoom(1);
			}
		}
		gunner.updateGun(gun);
	});

	socket.on("hideintree", ({id} = {}) => {
		if (id == socket.id) return;
		let index = gunners.findIndex(e => e.id == id);
		if (index == -1) return;
		let gunner = gunners[index];
		gunner.hideInTree();
	});

	socket.on("unhideintree", ({id, pos} = {}) => {
		if (id == socket.id) return;
		let index = gunners.findIndex(e => e.id == id);
		if (index == -1) return;
		let gunner = gunners[index];
		gunner.unHideInTree();
		gunner.pos.x = pos.x;
		gunner.pos.y = pos.y;
		gunner.target = {
			...pos
		};
	});

	socket.on("static objects", staticObjects => {
		showSketch(500);
		const OBJECTS = {
			Tree,
			Rock,
			Roof_brown,
			Box_wooden,
			Box_emty,
			Door
		};
		let tile = {
			leaf: 80,
			gravel: 40
		};

		for (let groupName in staticObjects) {
			let group = staticObjects[groupName];
			switch (groupName) {
				case "map": {
					for (let object of group) {
						switch (object.type) {
							case "Tree":
								if (Random(0, 100, true) < tile.leaf) {
									ground.push(new Leaf(object));
								}
								break;
							case "Rock":
								if (Random(0, 100) < tile.gravel) {
									ground.push(new Gravel(object));
								}
								break;
						}
						_map.push(new OBJECTS[object.type](object));
					}

					break;
				}
			}
		}
	});
	socket.on("pingms", time => {
		pingms = Date.now() - time;
		fps = Math.round(frameRate());
		setTimeout(() => {
			socket.emit("pingms", Date.now());
		}, 500);
	});

	socket.on("room leave", id => {
		let indexG = gunners.findIndex(e => e.id == id);
		if (indexG == -1) return;
		if (id != socket.id) {
			Toast.fire({
				icon: "info",
				title: gunners[indexG].name + " đã thoát phòng!"
			});
		}
		if (spectator.isSpectator) {
			_camera.follow(spectator.delete(id));
		}
		if (indexG != -1) gunners.splice(indexG, 1);
	});

	socket.on("addTreeShake", addArr => {
		for (let i in addArr) {
			let indexT = _map.findIndex(e => e.id == addArr[i]);
			if (indexT == -1) continue;
			_map[indexT].gunnerCount++;
		}
	});

	socket.on("spliceTreeShake", spliceArr => {
		for (let i in spliceArr) {
			let indexT = _map.findIndex(e => e.id == spliceArr[i]);
			if (indexT == -1) continue;
			_map[indexT].gunnerCount--;
		}
	});

	socket.on("gun reloaded", gun => {
		let myIndex = gunners.findIndex(e => e.id == socket.id);
		if (myIndex == -1) return;
		gunners[myIndex].gun.bulletCount = gun.bulletCount;
		gunners[myIndex].gun.magazine = gun.magazine;
	});

	socket.on("gun reloading", id => {
		let indexG = gunners.findIndex(e => e.id == id);
		if (indexG == -1) return;
		let gunner = gunners[indexG];
		gunner.reloadGun("reload");
	});

	socket.on("update blood", blood => {
		let myIndex = gunners.findIndex(e => e.id == socket.id);
		if (myIndex == -1) return;
		let gunner = gunners[myIndex];
		gunner.hurt();
		bloodBar.updateBlood(blood);
	});

	socket.on("gunner dead", ({id, killedBy} = {}) => {
		let index = gunners.findIndex(e => e.id == id);
		if (index == -1) return;
		let gunner = gunners[index];
		gunner.dead = true;
		if (id == socket.id) {
			// Nếu mình chết
			$("#respawn").fadeIn(200);
			_camera.follow(spectator.start(killedBy));
		}
	});

	socket.on("room respawn private", bag => {
		spectator.stop();
		bloodBar.updateBlood(100);
		hotbar.reset();
		_camera.zoom(1);
		let indexG = gunners.findIndex(e => e.id == socket.id);
		if (indexG == -1) return;
		let gunner = gunners[indexG];
		_camera.follow(gunner.pos);
		gunner.dead = false;
		hotbar.items = bag.arr;
		hotbar.choose(0);
	});

	socket.on("room respawn public", (id, gun) => {
		let indexG = gunners.findIndex(e => e.id == id);
		if (indexG == -1) return;
		let gunner = gunners[indexG];
		gunner.updateGun(gun);
	});

	socket.on("room chat", ({id, text} = {}) => {
		let indexG = gunners.findIndex(e => e.id == id);
		if (indexG == -1) return;
		let gunner = gunners[indexG];
		gunner.addChat(text);
	});

	// =============================================================

	socket.on("dialog alert", text => {
		if (typeof text == "object") {
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: text.text,
				preConfirm: () => {
					eval(text.preConfirm_string);
				}
			});
		} else {
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: text
			});
		}
	});

	socket.on("toast alert", text => {
		Toast.fire({
			icon: "info",
			title: text
		});
	});

	socket.on("room alert", data => {
		swal.fire(data);
	});

	socket.on(
		"room create",
		({master, id, text, maxPlayer, timeCreate, playing} = data) => {
			addRoom(master, id, text, maxPlayer, timeCreate, playing);
		}
	);

	socket.on(
		"room update",
		({master, id, text, maxPlayer, timeCreate, playing} = data) => {
			updateRoom(master, id, text, maxPlayer, timeCreate, playing);
		}
	);

	socket.on("room delete", id => {
		$("#" + id).remove();
	});

	socket.on("rooms update", rooms => {
		$("#ban > tbody").html("");
		for (let room of rooms) {
			let {master, id, text, maxPlayer, timeCreate, playing} = room;
			addRoom(master, id, text, maxPlayer, timeCreate, playing);
		}
	});

	socket.on("room created", roomID => {
		swal.close();
		Toast.fire({
			icon: "success",
			title: "Đã tạo thành công phòng với mã ID: " + roomID
		});
		socket.emit("room join", roomID);
	});

	socket.on("online", online => {
		$("#online").html(online);
	});
}

function setup() {
	_camera = new Camera();
	let canv = createCanvas(WIDTH, HEIGHT);
	canv.parent("wrap-game");

	angleMode(DEGREES);
	imageMode(CENTER);
	cursor(ip + "img/aim-min.png", 32, 32);
	// gameFont = loadFont(ip + "font/game_font.ttf");
	// textFont(gameFont);
	socket.emit("pingms", Date.now());
}

function keyPressed() {
	// on key down
	if ($("#chat").css("display") != "none") return;
	if (keyCode == 13) {
		if ($("#chat").css("display") == "none") {
			$("#chat").fadeIn(100, () => {
				$("#chat").focus();
			});
		}
		return;
	}
	if (keyCode >= 49 && keyCode <= 57) {
		// choose weapon
		hotbar.choose(keyCode - 49);
	} else {
		socket.emit("keydown", key);
	}
}

function keyReleased() {
	// on key up
	if ($("#chat").css("display") != "none") return;
	socket.emit("keyup", key);
}

function mousePressed() {
	// mouse down
	if (mouseButton == "left") socket.emit("mouseDown", "left");
	hotbar.click(mouseX, mouseY);
}

function mouseReleased() {
	// mouse up
	if (mouseButton == "left") {
		if (spectator.isSpectator) {
			_camera.follow(spectator.next());
		} else socket.emit("mouseUp", "left");
	}

	if (mouseButton == "right") {
		if (spectator.isSpectator) {
			_camera.follow(spectator.previous());
		} else {
			let myIndex = gunners.findIndex(e => e.id == socket.id);
			if (myIndex == -1) return;
			let me = gunners[myIndex];
			if (["awp"].indexOf(me.gun.name) != -1) {
				_camera.zoom(0.6);
			}
		}
	}
}

function draw() {
	if (frameCount == 1)
		// lúc khởi tạo setup nó sẽ chạy hàm draw, mặc dù đã noLoop()
		return;
	background(backgroundColor);

	push();
	smooth();
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
	if (ISMOBILE) {
		mobileControl.setControlable(true);
		mobileControl.position.x = width - 100;
		mobileControl.position.x = height - 100;
		mobileControl.display();
	}

	textSize(20);
	fill("white");
	text("PING: " + pingms + " ms", 10, 30);
	text("FPS: " + fps, 10, 60);

	let myIndex = gunners.findIndex(e => e.id == socket.id);
	if (myIndex != -1) {
		let me = gunners[myIndex];

		if (!me.dead) {
			// còn sống
			let bulletInfo =
				me.gun.name +
				" | " +
				me.gun.bulletCount +
				" / " +
				me.gun.magazine +
				" mag";
			text(
				bulletInfo,
				width / 2 - textWidth(bulletInfo) / 2,
				height - 85
			);
			hotbar.update();
			hotbar.draw();
			bloodBar.update();
			bloodBar.draw();
		} else {
			// đã chết
			spectator.showText();
		}
	}
}

function mouseWheel(event) {
	hotbar.wheel(event.delta);
}
