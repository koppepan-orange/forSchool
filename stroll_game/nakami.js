//#region komagome
function delay(ms){
    return new Promise(resolve=>setTimeout(resolve,ms));
};
async function nicoText(mes){
    const newDiv = document.createElement('div');
    newDiv.textContent = mes;
    newDiv.className = 'nicotext';
    newDiv.style.top = `calc(${random(0,100)}vh - 20px)`;
    newDiv.style.right = '0px';
    document.querySelector('body').appendChild(newDiv);

    requestAnimationFrame(() => {
        newDiv.style.right = `${window.innerWidth + newDiv.offsetWidth}px`; //なんか電車の問題解いてるみたいだね
    });
    
    await delay(2000); 
    newDiv.remove();
};
function arraySelect(array){
     let select = Math.floor(Math.random()*array.length);
     return array[select];
};
function arrayShuffle(array) {
     for(let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
     }
     return array;
};
function arrayGacha(array,probability){
     if(array.length !== probability.length){throw new Error("長さがあってないっす！先輩、ちゃんとチェックした方がいいっすよ〜？");}
     const total = probability.reduce((sum, p) => sum + p, 0);
     let random = Math.random() * total;
     for (let i = 0; i < array.length; i++) {
          if(random < probability[i]){
          return array[i];
          }
          random -= probability[i];
     }
};
function copy(obj){
     if (obj === null || typeof obj !== 'object') {
          return obj; // 基本型はそのまま返す
     }
     if (Array.isArray(obj)) {
          return obj.map(copy); // 配列の各要素を再帰コピー
     }
     const result = {};
     for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
                result[key] = copy(obj[key]); // オブジェクトのプロパティを再帰コピー
          }
     }
     return result;
};
function probability(num){
     return Math.random()*100 <= num;
     //例:num == 20 → randomが20以内ならtrue,elseならfalseを返す
};
function random(min, max) {
     return Math.floor(Math.random() * (max - min + 1)) + min;
};
function countText(text){
    if(typeof text !== 'string'){text = text.toString();}
    let count = 0;
    text.split('').forEach(a => {
        if(/^[a-z_0-9]+$/.test(a)){
            count += 1;
        }else{
            count += 2;
        }
    })
    return count;
}
function setLocalStorage(name, value) {
    localStorage.setItem(name, value || "");
}
function getLocalStorage(name) {
    return localStorage.getItem(name);
}
async function error(){
    addtext('errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
    await delay(2000);
    window.open('about:blank', '_self').close();
}
//#endregion
//#region drag
document.addEventListener('mousedown', e => {
    // const descTarget = e.target.closest('[data-description]');
    let div = e.target;
    if(!div.classList.contains('draggable')) return;
    offsetX = e.clientX - div.getBoundingClientRect().left;
    offsetY = e.clientY - div.getBoundingClientRect().top;
    
    function onMouseMove(e) {
            div.style.left = `${e.clientX - offsetX}px`;
            div.style.top = `${e.clientY - offsetY}px`;
    }

    function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});
//#endregion
//#region マップの生成
const canvas = document.querySelector('#exploreArea .map');
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#f0f8ff';
ctx.fillRect(0, 0, canvas.width, canvas.height);

let mapSize = 12;

function resizeCanvas(){
    canvas.width = window.innerHeight;
    canvas.height = window.innerHeight;
    mass = window.innerHeight/mapSize;
    draw();
}

//ちょっと物珍しいことにチャレンジしてみますね
let mass = window.innerHeight/mapSize; //1マスの大きさ
let backmap = [];
let objmap = [];
let movemap = [];
let Objects = {
    player: [
        {
            id: 'select',
            name: 'player',
            kind: 'systems', //画像指定用
            cam: 'player', //識別用
            me: 0, //仮。tekiou毎に変えてもいいかも
            x: 0,
            y: 0,
            ox: 0,
            oy: 0,
            w: mass,
            h: mass,
            dir: 1,
            sx: 0,
            sy: 0,
            spd: 20,
            moving: 0,
            ables: ['move', 'attack', 'beattack'],
            beacten: 'none',
            group: 1,
            bt: {
                hp: 10,
                maxhp: 10,
                shl: 0,
                atk: 3,
                oriatk: 3,
                def: 0,
                oridef: 0,
            },
        }
    ],
    enemies: [],
    objects: [],
};
function mapMake(code){
    //#region back
    for(let i = 0; i < mapSize; i++){
        backmap[i] = [];

        for(let j = 0; j < mapSize; j++){
            let p = 10;
            if(i == 0 || j == 0) p = random(0, 100);
            if(backmap[i][j-1] == 'a') p += 40;
            if(backmap[i-1] && backmap[i-1][j] == 'a') p += 40;
            if(probability(p)) backmap[i][j] = 'a'; //10, 50, 90%
            else backmap[i][j] = 'b'; //90, 50, 10%
        }
    }
    //#endregion
    //#region obj
    for(let i = 0; i < mapSize; i++){
        objmap[i] = [];
        for(let j = 0; j < mapSize; j++){
            objmap[i][j] = {
                id: 0,
                x: j,
                y: i
            };
        }
    }
    //#endregion
    //#region enemy
    for(let i = 0; i < mapSize; i++){
        movemap[i] = [];
        for(let j = 0; j < mapSize; j++){
            movemap[i][j] = {
                id: 0,
                x: j,
                y: i
            };
        }
    }
    let maxEnemy = random(3, 6);
    while(maxEnemy > 0){
        let y = random(0, mapSize - 1);
        let x = random(0, mapSize - 1);
        let hp = random(2, 5);
        let atk = random(1, 3);
        let def = 0;
        let newEne = {
            id: 'enemy',
            name: arraySelect(Object.keys(images.enemies)),
            kind: 'enemies',
            cam: 'enemies',
            me: Objects['enemies'].length, //仮。tekiou毎に変えてもいいかも
            x: x,
            y: y,
            ox: x*mass,
            oy: y*mass,
            w: mass,
            h: mass,
            dir: 0,
            sx: x*mass,
            sy: y*mass,
            spd: 20,
            moving: 0,
            ables: ['move', 'attack', 'beattack'],
            group: 2,
            bt: {
                hp: hp,
                maxhp: hp,
                shl: 0,
                atk: atk,
                oriatk: atk,
                def: def, //一旦
                oridef: def,
            }
        };
        Objects['enemies'].push(newEne);

        maxEnemy -= 1;
    }
    //#endregion
}
function draw(){
    for(let i = 0; i < mapSize; i++){
        if(!backmap[i]) continue;

        for(let j = 0; j < mapSize; j++){
            if(!backmap[i][j]) continue;
            ctx.drawImage(images['maps'][backmap[i][j]], j*mass, i*mass, mass, mass);
        }
    }

    Object.values(Objects).flat().forEach(ob => {
        let src;

        if(images[ob.kind]?.[ob.name]) src = images[ob.kind][ob.name];
        else if(images[ob.kind]?.[ob.id]) src = images[ob.kind][ob.id];
        else src = images['systems']['error'], console.error(`画像が見つからない: kind=${ob.kind}, name=${ob.name}, id=${ob.id}`);
        

        let youso = {
            src: src,
            x: ob.ox,
            y: ob.oy,
            w: ob.w,
            h: ob.h,
        }
        
        // console.log(ob.kind, ob.id)
        // console.log(`${ob.name}(${ob.cam})「srcは${youso.src}。 座標は(${youso.x}, ${youso.y})、 大きさは${youso.w}x${youso.h}」`)
        ctx.drawImage(youso.src, youso.x, youso.y, youso.w, youso.h);
    })
}
//#endregion

let keys = {}
document.addEventListener('keydown', e => {
    let key = e.key.toLowerCase();
    if(e.key == ' ') key = 'space';
    keys[key] = true;
});
document.addEventListener('keyup', e => {
    let key = e.key.toLowerCase();
    if(e.key == ' ') key = 'space';
    keys[key] = false;
});

let movemode = 0;
async function Pupdate(en = 0){
    let p = get();
    let mv = 1;
    //#region 挙動
    if(movemode == 0){
        if((keys.w || keys.arrowup) && !p.moving){
            if(keys.shift) mv = p.y;
            if(p.dir == 0) await move(p, 'add', 0, -mv);
            else p.dir = 0;
        }
        if((keys.s || keys.arrowdown) && !p.moving){
            if(keys.shift) mv = (mapSize - 1) - p.y;
            if(p.dir == 180) await move(p, 'add', 0, mv);
            else p.dir = 180;
        };
        if((keys.a || keys.arrowleft) && !p.moving){
            if(keys.shift) mv = p.x;
            if(p.dir == 270) await move(p, 'add', -mv, 0);
            else p.dir = 270;
        };
        if((keys.d || keys.arrowright) && !p.moving){
            if(keys.shift) mv = (mapSize - 1) - p.x;
            if(p.dir == 90) await move(p, 'add', mv, 0);
            else p.dir = 90;
        };
    }else if(!p.moving){
        let ac = 0;
        if((keys.w || keys.arrowdown) && (keys.d || keys.arrowright)){
            p.dir = 45;
        }else if((keys.d || keys.arrowdown) && (keys.s || keys.arrowleft)){
            p.dir = 135;
        }else if((keys.s || keys.arrowdown) && (keys.a || keys.arrowright)){
            p.dir = 225;
        }else if((keys.a || keys.arrowdown) && (keys.w || keys.arrowright)){
            p.dir = 315;
        }else if(keys.w || keys.arrowup){
            p.dir = 0;
        }else if(keys.d || keys.arrowright){
            p.dir = 90;
        }else if(keys.s || keys.arrowleft){
            p.dir = 180;
        }else if(keys.a || keys.arrowleft){
            p.dir = 270;
        }
        if((keys.w || keys.arrowdown) || (keys.a || keys.arrowleft) || (keys.s || keys.arrowright) || (keys.d || keys.arrowup)){
            ac = 1;
            if(keys.shift) ac = 2;
        }
        move(p, 'drive', ac, 0);
    }
    draw();
    //#endregion
    //#region 攻撃タイム
    if((keys.z || keys.enter) && !p.moving){
        console.log('攻撃！');
        p.moving = 1;
        while(keys.z || keys.enter){
            await delay(10);
        };
        let karix = 0, kariy = 0;
        switch(p.dir){
            case 0: kariy -= 1; break;
            case 90: karix += 1; break;
            case 180: kariy += 1; break;
            case 270: karix -= 1; break;
        }
        Object.values(Objects).flat().filter(e => e.x == p.x + karix && e.y == p.y + kariy).forEach(e => {
            // nicoText('うわーー！！')
            if(able(e, 'beattack')) attack(p, e, 1);
            if(able(e, 'bepush')) move(e, 'add', karix, kariy, 1);
        });
        p.moving = 0;
    }
    //#endregion
}
async function Eupdate(en = 0){
    //#region 敵の動き
    if(en){
        let promises = [];
        for(const e of get('enemies')){
            if(!e.moving){
                let a = random(-1, 1);
                let which = random(0, 1); // 0:x, 1:y
                let x = 0, y = 0;
                if(which == 0) x = a;
                if(which == 1) y = a;
                promises.push(move(e, 'add', x, y));
            }
        }
        await Promise.all(promises); // まとめて待つ
    }
    //#endregion

    //#region tower
    get('objects').filter(o => o.id == 'tower').forEach(t => {
        if(probability(10)){ // 10%くらいで発射（毎回出すと多すぎる）
            fireBullet(t);
        }
    });
    let bullets = get('objects').filter(o => o.id == 'bullet');
    for(let b of bullets){
        move(b, 'drive', b.data.dx, b.data.dy); // 移動
        b.data.life--;

        Object.values(Objects).flat().filter(e => e.id != 'tower' && e.id != 'bullet').forEach(e => {
            if(Math.abs(e.x - b.x) < 0.2 && Math.abs(e.y - b.y) < 0.2) {
                attack(b, e, 1);
                if(!prop(b, 'penetrate')) b.data.life = 0;
            }
        });

        // 範囲外 or 寿命
        if (b.data.life <= 0 || b.x < 0 || b.x > mapSize || b.y < 0 || b.y > mapSize) {
            let i = Objects['objects'].indexOf(b);
            if (i != -1) Objects['objects'].splice(i, 1);
        }
    }
    //#endregion  
}

//#region komagome2 - original
function get(cam = '指定なし', me = '指定なし'){
    if(cam == '指定なし' && me == '指定なし') cam = 'player', me = 0; //超特別扱い
    
    let who;
    if(me == '指定なし') who = Objects[cam];
    else who = Objects[cam][me];

    return who;
}
function able(who, type){
    return who.ables.some(a => a == type);
}
function prop(who, type){
    return who.prop && who.prop.some(a => a == type);
}
async function move(who, code, x, y, force = 0){
    // let who = get(cam, me);

    // console.log(`想定: x|${who.x.toString().padStart(2, '0')}, y|${who.y.toString().padStart(2, '0')} => x|${(who.x + x).toString().padStart(2, '0')}, y|${(who.y + y).toString().padStart(2, '0')}`)

    if(who.x + x < 0 || 11 < who.x + x) x = 0;
    if(who.y + y < 0 || 11 < who.y + y) y = 0;
    
    if(x == 0 && y == 0) return //console.log(`${who.name}「移動量が0ですわ〜〜！！」`);

    if(!able(who, 'move') && !force) return //console.log(`${who.name}「動けないっっ...!!」`);

    let addx, addy;
    let ssx = who.sx, ssy = who.sy; //save sxの略
    if(code == 'add'){
        who.sx += x*mass;
        who.sy += y*mass;
        addx = x*mass/who.spd;
        addy = y*mass/who.spd;
    }
    if(code == 'set'){
        who.sx = x*mass;
        who.sy = y*mass;
        addx = Math.abs(who.x - x) / who.spd;
        addy = Math.abs(who.y - y) / who.spd;
    }
    if(code == 'drive'){
        let rad = (who.dir - 90) * Math.PI / 180;
        
        y = 0; //これ無視した方がいいかも。使い所isない
        let noise = random(-y, y);

        let dx = x * mass * Math.cos(rad) - noise * Math.sin(rad);
        let dy = x * mass * Math.sin(rad) + noise * Math.cos(rad);

        who.sx += dx;
        who.sy += dy;

        addx = dx / who.spd;
        addy = dy / who.spd;
    }

    let list = Object.values(Objects).flat();
    // console.log(`(${looped})${who.name}「${able(who, 'pass')}, ${list.some(t => over(who, t))}, ${list.some(t => able(t, 'bepass'))}」`);
    if(list.some(t => over(who, t))){
        list.forEach(t => {
            if(over(who, t) && !able(t, 'bepass')){
                // console.log(`(${looped})${who.name}[${who.x},${who.y}]「${t.name}[${t.x},${t.y}]とぶつかる〜〜〜〜！！」`)
                // console.log(`(${looped})自分: ${who.name} x:${who.x} y:${who.y} sx:${who.sx} sy:${who.sy} w:${who.w} h:${who.h} dir:${who.dir} spd:${who.spd}`);
                // console.log(`(${looped})相手: ${t.name}) x:${t.x} y:${t.y} sx:${t.sx} sy:${t.sy} w:${t.w} h:${t.h} dir:${t.dir} spd:${t.spd}`);
            };
        })
    }
    if(!able(who, 'pass') && list.some(t => over(who, t) && !able(t, 'bepass'))) return who.sx = ssx, who.sy = ssy, draw()//, console.log(`(${looped})${who.name}「この先に何かあるっぽい？」`);

    // console.log(`(${looped})想定: x|${who.x.toString().padStart(2, '0')}, y|${who.y.toString().padStart(2, '0')} => x|${(who.x + x).toString().padStart(2, '0')}, y|${(who.y + y).toString().padStart(2, '0')} || 実行: x|${addx.toString().padStart(5, ' ')}, y|${addy.toString().padStart(5, ' ')} 計${who.spd}回反復`)

    who.moving = 1;
    for(let i = 0; i < who.spd; i++){
        who.ox += addx;
        who.oy += addy;
        await delay(10);
        draw();
    }

    who.x = Math.round(who.ox / mass);
    who.y = Math.round(who.oy / mass);
    who.ox = who.sx
    who.oy = who.sy;

    draw();

    who.moving = 0;
}
const EPSILON = 0.01;
function over(a, b) {
    if (a.cam == b.cam && a.me == b.me) return false;

    let sx1 = a.sx, sy1 = a.sy, ex1 = a.sx + a.w, ey1 = a.sy + a.h;
    let sx2 = b.sx, sy2 = b.sy, ex2 = b.sx + b.w, ey2 = b.sy + b.h;

    let overlapX = (sx1 < ex2 - EPSILON) && (ex1 > sx2 + EPSILON);
    let overlapY = (sy1 < ey2 - EPSILON) && (ey1 > sy2 + EPSILON);

    return overlapX && overlapY;
}

function fireBullet(from) {
    //const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    // const [dx, dy] = arraySelect(dirs);
    let dir = random(0,359)

    const bullet = {
        id: 'bullet',
        name: '1',
        kind: 'bullets',
        cam: 'objects',
        me: Objects['objects'].length,
        x: from.x,
        y: from.y,
        ox: from.ox + (from.w / 2),
        oy: from.oy + (from.h / 2),
        w: mass/2,
        h: mass/2,
        dir: dir,
        sx: from.ox + (from.w / 2),
        sy: from.oy + (from.h / 2),
        spd: 5,
        moving: 1,
        ables: ['attack', 'move', 'pass', 'bepass'],
        group: 1,
        bt: {
            hp: 1,
            maxhp: 1,
            shl: 0,
            atk: 1,
            oriatk: 1,
            def: 0,
            oridef: 0,
        },
        data: {
            dx: 0.2,
            dy: 0,
            life: 40, // 移動回数
        }
    };

    Objects['objects'].push(bullet);
}


async function attack(...arr){
    let [who, tag, rate = 1, ...prop] = arr;
    let hasp = (name) => {return prop.some(p => p == name)};

    // console.log(who), console.log(tag);
    // console.log(`自分:${who.group}  相手:${tag.group}`);
    if(who.group == tag.group) return// console.log(`さすがに同種喰らいは..無理っすよ`);
    if(!able(who, 'attack') && !hasp('force')) return// console.log(`${who.name}「攻撃できないっっ...!!」`);
    if(!able(tag, 'beattack') && !hasp('force')) return// console.log(`${tag.name}「攻撃が効かない..だと....!?」`);
    
    let dmg = (who.bt.atk * rate);
    if(!hasp('penetrate')) dmg -= (tag.bt.def);
    dmg = Math.round(dmg);

    //バフの処理がしたいならここで

    if(dmg > 0) await damage(who, tag, dmg, ...prop);
    else if(dmg < 0) await heal(who, tag, (dmg*-1), prop);
    else return console.log('しかし なにも おこらなかった');

}
async function damage(...arr){
    let [who, tag, dmg, ...prop] = arr;
    let hasp = (name) => {return prop.some(p => p == name)};

    tag.bt.hp -= dmg;
    if(tag.bt.hp < 0) tag.bt.hp = 0;
    nicoText(`${tag.name}は${dmg}ダメージを受けた!! (残り:${tag.bt.hp}/${tag.bt.maxhp})`);

    if(tag.bt.hp <= 0) await death(who, tag);
};

async function heal(...arr){
    let [who, tag, dmg, ...prop] = arr;
    let hasp = (name) => {return prop.some(p => p == name)};

    tag.bt.hp += dmg;
    if(tag.bt.hp > tag.bt.maxhp) tag.bt.hp = tag.bt.maxhp;
    nicoText(`${tag.name}は${dmg}回復した!!`);
};

async function death(...arr){
    let [who, tag, ...prop] = arr;
    let hasp = (name) => {return prop.some(p => p == name)};

    nicoText(`${tag.name}の消失`);

    Objects[tag.cam].splice(tag.me, 1);

    Objects[tag.cam].forEach((obj, i) => obj.me = i);

    //if(Object.values(Objects[tag.cam]).length == 0) delete Objects[tag.cam];
}
//#endregion
//#region 画像をロードする機構
let imagesLoaded = 0;
let images = {};
let imageNames = {
    'systems':['select', 'error', 'error_nico'],
    'maps':['0', 'a', 'b', 'kira', 'machine'],
    'players':[],
    'enemies':['ghost_b', 'ghost_r', 'skeleton', '蒼白の粘液'],
    'objects':['box', 'tower'],
    'bullets':['1']
}
let totalImages = Object.keys(imageNames).map(a => imageNames[a].length).reduce((a, b) => a + b);
Object.keys(imageNames).forEach(belong => {
    imageNames[belong].forEach(num => {
        let img = new Image();
        img.src = `assets/${belong}/${num}.png`;
        img.onload = () => {
            imagesLoaded++;
            if(imagesLoaded == totalImages) start();
        };
        img.onerror = () => {
            console.error(`Image (${belong}/${num}) failed to load.`);
        };
        if(!images[belong]) images[belong] = {};
        images[belong][num] = img;
    });
});
//#endregion

//#region uiとか
let UI = document.getElementById('UI');
let UI_name = UI.querySelector('.nameSend');
document.addEventListener('keydown', e => {
    if(e.key == 'n' && get().name == 'player') UI_name.style.display = 'flex', UI_name.querySelector('.input').focus();
    if(e.key == 'm') mapMake();
    if(e.key == 'c') movemode = movemode == 0 ? 1 : 0;
    if(e.key == 'h') Object.values(Objects).flat().forEach((o, i) => {
        //camがenemiesならば消し去る
        if(o.cam == 'enemies'){
            death(0, o)
        }
    })
    if(e.key == 'b' && !get().moving){
        let p = get();
        let x = p.x;
        let y = p.y;
        switch(p.dir){
            case 0: if(y > 0) y--; else return; break;
            case 90: if(x < 11) x++; else return; break;
            case 180: if(y < 11) y++; else return; break;
            case 270: if(x > 0) x--; else return; break;
        }

        if(Object.values(Objects).flat().some(o => o.x == x && o.y == y)) return;

        let newOb = {
            id: 'objects',
            name: 'box',
            kind: 'objects', //画像指定用
            cam: 'objects', //識別用
            me: Objects['objects'].length,
            x: x,
            y: y,
            ox: x*mass,
            oy: y*mass,
            w: mass,
            h: mass,
            dir: 0,
            sx: x*mass,
            sy: y*mass,
            spd: 20,
            moving: 0,
            ables: ['bepush', 'beattack'],
            group: 1,
            //これ、playerの味方と敵で分け..いや、攻撃可能whetherをグループで分けるようにしようか、fortniteのクリエイティブのように
            bt: {
                hp: 10,
                maxhp: 10,
                shl: 0,
                atk: 0,
                oriatk: 0,
                def: 0,
                oridef: 0,
            }
        };
        Objects['objects'].push(newOb);
    };
    if(e.key == 't' && !get().moving){
        let p = get();
        let x = p.x;
        let y = p.y;

        switch(p.dir){
            case 0: if(y > 0) y--; else return; break;
            case 90: if(x < 11) x++; else return; break;
            case 180: if(y < 11) y++; else return; break;
            case 270: if(x > 0) x--; else return; break;
        }

        if(Object.values(Objects).flat().some(o => o.x == x && o.y == y)) return;

        let newOb = {
            id: 'tower',
            name: 'tower',
            kind: 'objects',
            cam: 'objects',
            me: Objects['objects'].length,
            x: x,
            y: y,
            ox: x*mass,
            oy: y*mass,
            w: mass,
            h: mass,
            dir: 0,
            sx: x*mass,
            sy: y*mass,
            spd: 20,
            moving: 0,
            ables: ['bepush'],
            group: 1,
            bt: {
                hp: 6,
                maxhp: 6,
                shl: 0,
                atk: 0,
                oriatk: 0,
                def: 0,
                oridef: 0,
            },
        };
        Objects['objects'].push(newOb);
    }

});


UI_name.querySelector('.input').addEventListener('keydown', e => {
    if(e.key != 'Enter') return;
    e.preventDefault();
    if(UI_name.querySelector('.input').value == ''){
        nicoText('何かは入れろよ');
        return;
    }
    get().name = UI_name.querySelector('.input').value;
    UI_name.querySelector('.input').value = '';
    UI_name.style.display = 'none';
})
//#endregion

function start(){
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas); //リサイズにも対応

    //仮
    loop = 1;
    mapMake();
    gameloop();
}

let loop = 1;
let looped = 0;
async function gameloop(){
    looped++;
    let en = looped % 30 == 0 ? 1 : 0;
    // console.log(`えー..${looped}めのループ...です`)
    // if(en) looped = 0;

    Pupdate(en);
    Eupdate(en);
    if(loop) requestAnimationFrame(gameloop);
}
