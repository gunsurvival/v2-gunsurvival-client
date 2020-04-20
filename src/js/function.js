function Random(start, end, round = false) {
    out = Math.random() * (end - start + 1) + start;
    if (round)
        out = Math.floor(out);
    return out;
}

function shuffle(arr) { // thuật toán bogo-sort
    let count = arr.length,
        temp, index;

    while (count > 0) {
        index = Math.floor(Math.random() * count);
        count--;
        temp = arr[count];
        arr[count] = arr[index];
        arr[index] = temp;
    }

    return arr; //Bogosort with no điều kiện dừng
}

function clearArray(arr, method) {
    switch (method) {
        case 1:
            arr.length = 0;
            break;
        case 2:
            arr.splice(0, arr.length);
            break;
        case 3:
            while (arr.length > 0) {
                arr.pop();
            }
            break;
    }
}

function reset() {
    clearArray(gunners, 2);
    clearArray(_map, 2);
    clearArray(ground, 2);
    clearArray(bullets, 2);
    spectator.stop();
    bloodBar.updateBlood(100);
    hotbar.reset();
    _camera.zoom(1);
}

let getImages = () => {
    $.ajax({
        url: ip + 'list-images',
        method: 'GET'
    }).then(res => {
        images = new Images(res);
    });
}