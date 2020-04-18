$(document).ready(function() {

    $('.column100').on('mouseover', function() {
        let table1 = $(this).parent().parent().parent();
        let table2 = $(this).parent().parent();
        let verTable = $(table1).data('vertable') + "";
        let column = $(this).data('column') + "";

        $(table2).find("." + column).addClass('hov-column-' + verTable);
        $(table1).find(".row100.head ." + column).addClass('hov-column-head-' + verTable);
    });

    $('.column100').on('mouseout', function() {
        let table1 = $(this).parent().parent().parent();
        let table2 = $(this).parent().parent();
        let verTable = $(table1).data('vertable') + "";
        let column = $(this).data('column') + "";

        $(table2).find("." + column).removeClass('hov-column-' + verTable);
        $(table1).find(".row100.head ." + column).removeClass('hov-column-head-' + verTable);
    });

    $('#wrap-game').bind("contextmenu", function(e) {
        return false;
    });

    showSketch = function(timer) {
        // debugger;
        loop();
        $('#menu').fadeOut(timer, () => {
            $('#menu').hide();
            $('body').css('overflow', 'hidden');
            changeTitle('Đang chờ người chơi . . .', false);
            $('#wrap-game').fadeIn(timer);
        });
    }

    showMenu = function(timer) {
        // debugger;
        noLoop();
        $('#wrap-game').fadeOut(timer, ()=> {
            $('#wrap-game').hide();
            $('body').css('overflow', '');
            changeTitle('', false);
            $('#menu').fadeIn(500);
        });
    }

    addMessage = function(id, time, message) {
        let c = new Date(time);
        let text = '[' + c.getHours() + ':' + c.getMinutes() + '] ' + id + ': ' + message + '<br>';
        let ele = $('.scrollable');
        if (ele.scrollTop() + ele.height() == ele[0].scrollHeight) {
            $('#chat').append(text);
            ele.scrollTop(ele[0].scrollHeight);
        } else {
            $('#chat').append(text);
        }
    }

    updateRoom = function(master, id, text, maxPlayer, time, playing) {
        let thaotac = playing.length >= maxPlayer ? 'style="color: red; cursor:no-drop">Fulled' : 'style = "color: green; cursor:pointer" onclick = "socket.emit(`room join`, `' + id + '`);">Vào!!';
        let c = new Date(time);
        let datetime = c.getDate() + '/' + c.getMonth() + ' ' + c.getHours() + ':' + c.getMinutes();
        $('#' + id).html('<td class="column100 column1" data-column="column1" >' + master + '</td><td class="column100 column2" data-column="column2">' + id + '</td><td class="column100 column3" data-column="column3">' + text + '</td><td class="column100 column4" data-column="column4">' + playing.length + '/' + maxPlayer + '</td><td class="column100 column5" data-column="column5">' + datetime + '</td><td class="column100 column6 noselect" data-column="column6"' + thaotac + '</td>');
    }

    addRoom = function(master, id, text, maxPlayer, time, playing) {
        let thaotac = playing.length >= maxPlayer ? 'style="color: red; cursor:no-drop">Fulled' : 'style = "color: green; cursor:pointer" onclick = "socket.emit(`room join`, `' + id + '`);">Vào!!';
        let c = new Date(time);
        let datetime = c.getDate() + '/' + c.getMonth() + ' ' + c.getHours() + ':' + c.getMinutes();
        $('#ban > tbody').append('<tr id="' + id + '" class="row100"><td class="column100 column1" data-column="column1" >' + master + '</td><td class="column100 column2" data-column="column2">' + id + '</td><td class="column100 column3" data-column="column3">' + text + '</td><td class="column100 column4" data-column="column4">' + playing.length + '/' + maxPlayer + '</td><td class="column100 column5" data-column="column5">' + datetime + '</td><td class="column100 column6 noselect" data-column="column6"' + thaotac + '</td></tr>');
    }

    changeTitle = function(text, willClose) {
        $('#t').stop().fadeOut(() => {
            $('#t').html(text);
            $('#t').stop().fadeIn();
            if (willClose)
                setTimeout(() => changeTitle('', false));
        })
    }
    

    $('#create').click(function() {
        (async function taoPhong() {
            const { value: mode } = await swal.fire({
                title: 'Tạo Phòng',
                html: '<select id="mode" name="mode" class="swal2-input"><option value="creative">CREATIVE</option><option value="pubg" disabled>PUBG (sắp xong :V)</option><option value="c4" disabled>C4 BOMB (đang nghiên cứu)</option></select>',
                preConfirm: () => {
                    return $('#mode').val();
                },
                showCancelButton: true,
                background: `url('${ip}img/avatarpage-min.png') no-repeat center center`
            })
            swal.close();
            switch (mode) {
                case "creative":
                    const { value } = await swal.fire({
                        title: "Tùy chọn",
                        html: 
                            '<form class="pubg_form">' +
                            '<label for="swal-input1">Nhập số lượng người chơi có thể vào</label>'+
                            '<input placeholder="Max player" type="number" name="maxplayer" id="swal-input1" class="swal2-input">' +
                            '<input placeholder="Dòng thông điệp" name="text" maxLength="30" id="swal-input2" class="swal2-input">' +
                            '</form>',
                        allowOutsideClick:false,
                        showCancelButton:true,
                        background: `url('${ip}img/avatarpage-min.png') no-repeat center center`,
                        preConfirm: () => {
                            $('.pubg_form').validate({
                                rules: {
                                    maxplayer: {
                                        required: true,
                                        range: [3, 100]
                                    }
                                },
                                messages: {
                                    maxplayer: {
                                        required: "Bạn phải điền ô này",
                                        range: "3 đến 100 bruh"
                                    }
                                }
                            })
                            return $('.pubg_form').valid() && {
                                maxPlayer: $('input[name="maxplayer"]').val(),
                                text: $('input[name="text"]').val()
                            }
                        }
                    })
                    if (value) {
                        socket.emit('room create', {
                            mode,
                            maxPlayer: value.maxPlayer,
                            text: value.text
                        })
                        swal.showLoading();
                    }
                    break;
                // case "pubg":
                     // case "csgo":

                //     break;
                // default:

                //     taoPhong();
                //     break;
            }
        })()

        // swal.fire({
        //     title: 'Tạo Phòng',
        //     useRejections: true,
        //     html:'<form class="swal_form">' + 
        //         '<input placeholder="Max player" type="number" name="maxplayer" id="swal-input1" class="swal2-input">' +
        //         '<input placeholder="Dòng thông điệp" name="text" id="swal-input2" class="swal2-input">' + 
        //         '<select id="mode" name="mode" class="swal2-input"><option value="pubg">PUBG</option><option value="c4" disabled>C4 BOMB (đang nghiên cứu)</option><option value="creative">CREATIVE</option></select>' +
        //         '</form>',
        //     background: 'url("https://ewscripps.brightspotcdn.com/dims4/default/71f7e7d/2147483647/strip/true/crop/640x360+0+60/resize/1280x720!/quality/90/?url=https%3A%2F%2Fmediaassets.turnto23.com%2Fphoto%2F2017%2F07%2F08%2FFIRE_FLAMES_1355200006501_337979_ver1.0_640_480_1499544067481_62454557_ver1.0_640_480.png")',
        //     backdrop: 'url("https://wallpaperaccess.com/full/712356.jpg") no-repeat',
        //     preConfirm: function() {
        //         return $('.swal_form').valid();
        //     },
        //     onOpen: function() {
        //         $('#swal-input1').focus()
        //     }
        // }).then(function(result) {
        //     console.log(result);
        // })
        // $('.swal_form').validate({
        //     rules: {
        //         maxplayer: {
        //             required: true,
        //             range: [3,100]
        //         }
        //     },
        //     messages: {
        //         maxplayer: {
        //             required: "Bạn phải điền ô này",
        //             range: "3 đến 100 thôi -.-"
        //         }
        //     }
        // })
        // (async function getMax(text) {
        //     const { value: maxPlayer } = await Swal.fire({
        //         title: 'Enter your max player',
        //         input: 'number',
        //         inputPlaceholder: text,
        //         showCancelButton: true,
        //         inputValidator: (value) => {
        //             return new Promise((resolve) => {
        //                 if (value < 3 || value > 100) {
        //                     resolve(text + ' :)')
        //                 }
        //                 resolve();
        //             })
        //         }
        //     })

        //     if (maxPlayer) {
        //         socket.emit('room create', { maxPlayer });
        //     }

        // })("3 - 100");
    });

    $('#chatinput').keypress((e) => { // cần xem lại cái này
        if (e.keyCode == 13) {
            socket.emit('room chat', $('#chatinput').val());
            $('#chatinput').val('');
        }
    })

    $('#error').click(function() {
        Swal.fire({
            title: 'Hế lô, xin chào :3',
            text: "Nếu tìm thấy lỗi vui lòng chụp ảnh màn hình lỗi và gửi cho tui mau!!",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Vào trang cá nhân của tác giả!'
        }).then((result) => {
            if (result.value) {
                window.open("https://www.facebook.com/hacccu2004", '_blank');
            }
        })
    });

    $('#exit').click(function() {
        reset();
        showMenu(500);
        socket.emit('room leave');
        $('body').css('overflow', '');
    })

    $('#refresh').click(function() {
        socket.emit('rooms update');
    })

    $('#rename').click(async function() {
        let { value: name } = await swal.fire({
            input: "text",
            width: 674,
            height: 425,
            inputAttributes: {
                autocapitalize: 'on',
                maxlength: 20,
                placeholder: "Hãy nhập tên của bạn . . ."
            },
            showCancelButton: true,
            background: "url('../../img/menu-min.png')  no-repeat center center",
        });
        if (name) {
            socket.emit('name', name);
        }
    })

    $('#page').click(function() {
        window.open('https://www.facebook.com/KB2A.Team/', '_blank');
    })
})