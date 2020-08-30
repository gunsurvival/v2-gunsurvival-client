class ImageLoader {
	constructor() {
		// swal.showLoading();
	}

	load(s, listName, store) {
		console.log(window.location.pathname.split("/"));
		// let count = 0;
		for (const name of listName) {
			const filename = name + "-min.png";
			const subname = name;
			store[subname] = s.loadImage("../assets/img/" + filename, () => {
				store[subname].tint = s.createGraphics(
					store[subname].width,
					store[subname].height
				);
				store[subname].tint.tint(255, 70);
				store[subname].tint.image(store[subname], 0, 0);
				store[subname].tint.noTint();
			});
		}

		/*
        	for (let i in listImages) {
            const file = listImages[i];
            const subname = /^(.*)\-min\.png$/.exec(file)[1];
            let count = 0;
            store[subname] = s.loadImage(ip + "img/" + file, () => {
                if (++this.count == listImages.length) {
                    // $("#swal2-content").html("Chờ xử lí hình ảnh :V");
                    this.drawTint(s, store, () => {
                        // $("#swal2-content").html("Đã xong!");
                        // swal.hideLoading();
                        // setTimeout(swal.close, 1000);
                    });
                } else {
                    // $("#swal2-content").html("Chờ tải game: " + Math.round(this.count / listImages.length * 100) + "%");
                }
            });
        }
        */
	}
}

export default ImageLoader;
