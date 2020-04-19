class Sprite {

    constructor({ id, pos, size, degree, name } = {}) {
        this.id = id;
        this.pos = pos;
        this.size = size;
        this.degree = degree;
        this.delete = false;
        this.name = name;
    }

    update() {
        this.lifeTime--;
        if (this.lifeTime <= 0)
            this.delete = true;
    }

    draw() {

    }

    isInCamera() {
        let width = this.img.width * this.size;
        let height = this.img.height * this.size;
        let halfWidth = width / 2;
        let halfHeight = height / 2;
        if (_camera.mode == 'center')
            return collideRectRect(_camera.x - (WIDTH / _camera.scale) / 2, _camera.y - (HEIGHT / _camera.scale) / 2, WIDTH / _camera.scale, HEIGHT / _camera.scale, this.pos.x - halfWidth, this.pos.y - halfHeight, width, height);
        else
            return collideRectRect(_camera.x , _camera.y, WIDTH , HEIGHT , this.pos.x - halfWidth, this.pos.y - halfHeight, width, height);
    }
}