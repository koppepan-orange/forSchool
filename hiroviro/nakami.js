//#region komagome
function delay(ms){
    return new Promise(resolve=>setTimeout(resolve,ms));
};
async function nicoText(mes){
    let newDiv = document.createElement('div');
    newDiv.textContent = mes;
    newDiv.className = 'nicotext';
    newDiv.style.top = `calc(${random(0, 100)}vh - 20px)`;
    newDiv.style.right = '0px';
    document.querySelector('body').appendChild(newDiv);

    requestAnimationFrame(() => {
    newDiv.style.right = `${window.innerWidth + newDiv.offsetWidth}px`; //なんか電車の問題解いてるみたいだね
    });
    
    await delay(2000); 
    newDiv.remove();
};
function kaijou(num){
    if(num == 0) return 0;
    if(num == 1) return 1;
    return num * kaijou(num - 1);
}
function arraySelect(array){
    let select = Math.floor(Math.random()*array.length);
    return array[select];
};
function arrayShuffle(array) {
    for(let i = array.length - 1; i > 0; i--) {
    let i2 = Math.floor(Math.random() * (i + 1));
    [array[i], array[i2]] = [array[i2], array[i]];
    }
    return array;
};
function arraySize(array){
    let res = new Set(array).size;
    return res;
};
function arrayCount(array){
    let counts = {};
    for (let value of array) {
    counts[value] = (counts[value] || 0) + 1;
    }
    return counts;
}
function arrayMult(array){
    return array.reduce((a, v) => a * v, 1);
}
function arrayGacha(array,probability){
    if(array.length != probability.length) throw new Error("長さがあってないっす！先輩、ちゃんとチェックした方がいいっすよ〜？");
    let total = probability.reduce((sum, p) => sum + p, 0);
    let random = Math.random() * total;
    for (let i = 0; i < array.length; i++) {
        if(random < probability[i]) return array[i];
        random -= probability[i];
    }
};
function hask(obj, key){
    let res = obj.hasOwnProperty(key);
    res = res ? 1 : 0;
    return res;
}
function copy(moto) {
    if(Array.isArray(moto)){
        let arr = [];
        for (let i = 0; i < moto.length; i++) {
            arr.push(copy(moto[i]));
        }
        return arr;
    }
    else if(moto != null && typeof moto == 'object'){
        let obj = {};
        for(let key in moto){
            if (moto.hasOwnProperty(key)){
                obj[key] = copy(moto[key]);
            }
        }
        return obj;
    }
    else{
        return moto;
    }
}
function probability(num){
    return Math.random()*100 <= num;
    //例:num == 20 → randomが20以内ならtrue,elseならfalseを返す
};
function random(min, max) {
    let num = Math.floor(Math.random() * (max - min + 1)) + min;
    return Math.floor(num);
};
function fl(num){
    let res = num ? 1 : 0;
    return res;
}
function anagramSaySay(text, loop = 10, bet = '<br>'){
    let menjo = 0;
    let len = text.length;
    if(len < 4) menjo = 1, console.log('長さが3以下なんで最大6っす');
    
    let optout = text.split('');
    let optcou = arrayCount(optout);
    let optvals = [];
    for(a of Object.keys(optcou)){
        let b = optcou[a];
        b = kaijou(b);
        optvals.push(b);
    }
    let optmat = arrayMult(optvals);
    let cal = (kaijou(len) / optmat) - 1;

    let loopen = loop;
    console.log(`総数:${cal} 回数:${loopen}`);
    if(cal < loopen) menjo = 1;
    
    let reses = [];
    while(loopen > 0){
        loopen -= 1;
        let res = arrayShuffle(optout).join(''); 
        if(reses.includes(res)){loopen += 1; continue}
        
        if(res == text && !menjo){loopen += 1; continue;}

        if(res == text && menjo && reses.length < cal){loopen += 1; continue}
        else if(res == text && menjo) res = '[重複エラー]';

        reses.push(res);
    }
    
    return reses.join(bet);
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
    // window.open('about:blank', '_self').close();
}
function hoshoku(color) {
    color = color.replace(/^#/, '');

    if(color.length != 6) return console.log('カラーコードは6桁、ですよ〜？楽しないでくださいね♪')

    let r = parseInt(color.slice(0, 2), 16);
    let g = parseInt(color.slice(2, 4), 16);
    let b = parseInt(color.slice(4, 6), 16);

    let compR = (255 - r).toString(16).padStart(2, '0');
    let compG = (255 - g).toString(16).padStart(2, '0');
    let compB = (255 - b).toString(16).padStart(2, '0');

    let ato = `#${compR}${compG}${compB}`

    return ;
}
function mixshoku(c1, c2, ratio = 0.5) {
    let toRGB = c => {
        c = c.replace('#', '');
        if (c.length === 3) c = c.split('').map(x => x + x).join('');
        let n = parseInt(c, 16);
        return [n >> 16, (n >> 8) & 255, n & 255];
    };

    let [r1, g1, b1] = toRGB(c1);
    let [r2, g2, b2] = toRGB(c2);

    let r = Math.round(r1 + (r2 - r1) * ratio);
    let g = Math.round(g1 + (g2 - g1) * ratio);
    let b = Math.round(b1 + (b2 - b1) * ratio);

    let ato = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');

    return ato;
}
//#endregion
//#region log&text
let textDiv = document.querySelector('#text');
let autoDelay = 1;
let skipText = false;
let clearText = false;
let textShowing = 0;

function colorcheck(rawtext) {
    let text = [];
    let color = null;
    let colors = [
        {
            name: 'red',
            sym: '*',
            col: '#ff4040'
        },
        {
            name: 'pink',
            sym: '&',
            col: '#ff80bf'
        },
        {
            name: 'yell',
            sym: '^',
            col: '#ffff40'
        }
    ]

    for(let i = 0; i < rawtext.length; i++){
        let sym = false;
        for(let c of colors){
            if(rawtext[i] == c.sym && rawtext[i + 1] == c.sym){
                console.log(`→${rawtext[i]}← 発見！ ${c.name}色です`)
                color = color ? null : c.col;
                i++;
                sym = true;
                break;
            }
        }
        
        if(sym) continue;
        if(color) console.log(color)
        text.push({
            char: rawtext[i],
            color: color
        });
    }
    return text;
}

let queueAddtext = [];
let loopAddtext = 0;
async function waitforAddtext(){
    let len = queueAddtext.length;

    if(len == 0) loopAddtext = 0;
    else loopAddtext = 1;

    if(!loopAddtext) return console.log('loopがないんでしゅーりょー');
    requestAnimationFrame(waitforAddtext);

    if(textShowing) return console.log('文字表示されたんでスキップ');
    
    let raw = queueAddtext.shift();
    // console.log(`${raw}を送信します`);
    // console.log(`残り: (${len - 1})[${queueAddtext}]`);
    await addtext(raw);
}
async function addtext(raw){
    if(!raw) return console.log('「内容が？内容が〜〜？ないよ〜〜〜つってwwww直せ」');

    if(textShowing){
        queueAddtext.push(raw);

        if(!loopAddtext) waitforAddtext();
        return;
    }
    
    textShowing = 1;
    text = colorcheck(raw);
    textDiv.innerHTML = ""; // 中身をリセット
    textDiv.style.display = "block"; // 表示
    let index = 0;
    clearText = false; // 消去フラグをリセット

    return new Promise((resolve) => {
        async function type() {
                if (index < text.length) {
                if (skipText) {
                    // スキップ処理
                    while (index < text.length) {
                            let span = document.createElement("span");
                            span.textContent = text[index].char;
                            if (text[index].color) {
                            span.classList.add(`color-${text[index].color}`);
                            }
                            textDiv.appendChild(span);
                            index++;
                    }
                    index = text.length; // 全ての文字を表示済みにする
                    skipText = false;
                    setTimeout(type, 10);
                } else {
                    // 通常の文字表示
                    let span = document.createElement("span");
                    span.textContent = text[index].char;
                    if (text[index].color) {
                            span.classList.add(`color-${text[index].color}`);
                    }
                    textDiv.appendChild(span);

                    index++;
                    setTimeout(type, 80); // 次の文字を表示する間隔
                }
                } else {
                addlog(textDiv.innerHTML);
                let waitTime = autoDelay * 1000;
                let timeout = new Promise(resolve => setTimeout(resolve, waitTime));
                let userAction = new Promise(resolve => {
                    function waitToClear(event) {
                            if (event.type === 'click' || event.key === 'z' || event.key === 'Enter') {
                            document.removeEventListener('click', waitToClear);
                            document.removeEventListener('keydown', waitToClear);
                            resolve();
                            }
                    }
                    document.addEventListener('click', waitToClear);
                    document.addEventListener('keydown', waitToClear);
                });

                Promise.race([timeout, userAction]).then(() => {
                    textDiv.textContent = "";
                    textDiv.style.display = "none";
                    clearText = true;
                    skipText = false
                    textShowing = 0;
                    resolve('end'); // Promiseを解決
                });
                }
        }
        type();
    });
}
document.addEventListener('keydown', (e) => {
    if(e.key === 'z' || e.key === 'Enter'){
        skipText = true;
    }
});

document.addEventListener('keyup', (e) => {
    if(e.key === 'z' || e.key === 'Enter'){
        skipText = false;
    }
});

document.addEventListener('click', () => {
    skipText = true;
    setTimeout(() => skipText = false, 50); // 一時的にスキップを有効化
});

let logOOmoto = document.querySelector('#log');
let log = document.querySelector('#log .log');
let logOpener = document.querySelector('#log .opener');
let log_open = (code) => {
    if((!logOOmoto.classList.contains('tog') || code == 'o') && code != 'c'){
        logOOmoto.classList.add('tog');
        logOpener.textContent = '<';

    }else{
        logOOmoto.classList.remove('tog');
        logOpener.textContent = '>';
    }
}
logOpener.addEventListener('click', log_open);

function addlog(text){
    log.innerHTML += text + '<br>';
    log.scrollTop = log.scrollHeight;
}
//#endregion
//#region description
let movableDescription = document.getElementById('movableDescription');
document.addEventListener('mousemove', (e) => {
    movableDescription.style.left = `${e.clientX + 10}px`;
    movableDescription.style.top = `${e.clientY + 10}px`;
});
document.addEventListener('mouseover', (e) => {
    let descTarget = e.target.closest('[data-description]');
    if (descTarget) {
        let desc = descTarget.dataset.description;
        movableDescription.innerText = desc;
        movableDescription.style.display = 'block';
    }
});
document.addEventListener('mouseout', (e) => {
    let descTarget = e.target.closest('[data-description]');
    if (descTarget) {
        movableDescription.innerText = '';
        movableDescription.style.display = 'none';
    }
});
//#endregion
//#region draggable
document.addEventListener('mousedown', e => {
    // let descTarget = e.target.closest('[data-description]');
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
//#region tk
class tk{
    letructor(type, x = 'half', y = 'half', w = window.innerWidth/2, h = window.innerWidth/2){
        let youso = document.createElement(type);
        youso.className = `tk ${type}`;

        let yoko = ['x', 'w'];
        for(let n of yoko){
            if(typeof eval(n) != 'string' || typeof eval(n) == 'string' && !eval(n).endsWith('%')) continue;
            let num = eval(n).slice(0, -1);
            eval(n) = num * window.innerWidth / 100;
        }

        let tate = ['y', 'h'];
        for(let n of tate){
            if(typeof eval(n) != 'string' || typeof eval(n) == 'string' && !eval(n).endsWith('%')) continue;
            let num = eval(n).slice(0, -1);
            eval(n) = num * window.innerHeight / 100;
        }

        console.log(x, y, w, h);

        youso.style.width = `${w}px`;
        youso.style.height = `${h}px`;

        youso.style.left = `${x}px`;
        youso.style.top = `${y}px`;
        
        if(x == 'half' && y == 'half') youso.classList.add('cenXY');
         else if(x == 'half') youso.classList.add('cenX');
         else if(y == 'half') youso.classList.add('cenY');

        this.youso = youso;
    };

    attrAdd(dict = 'none'){
        if(dict == 'none') return;
        
        if(typeof dict == 'string'){
            //attr: nanka
            let [key, val] = dict.split(':');
             key = key.trim();
             val = val.trim();
            this.youso.setAttribute(key, val);
            return 0;
        }

        if(typeof dict != 'object') return 1;

        for(let key in dict) this.youso.setAttribute(key, dict[key]);

        return 0;
    }

    styleAdd(dict){
        for(let key in dict) this.youso.style[key] = dict[key];
    }

    classAdd(name){this.youso.classList.add(name)};
    classRem(name){this.youso.classList.remove(name)};
    classTog(name){this.youso.classList.toggle(name)};
    classHas(name){
        let is = this.youso.classList.contains(name);
        return is;
    }

    evAdd(type, func){
        this.youso.addEventListener(type, func);
    }

    yousoAdd(youso){
        this.youso.appendChild(youso);
    }

    append(){
        document.body.appendChild(this.youso);
    };

    remove(){
        this.youso.remove();
    };
}

function tkTest(){
    let mono = new tk('div', 'half', 'half');
    mono.classAdd('draggable');
    mono.styleAdd({background: '#f0f8ff'});

    let mono2 = new tk('div', 'half', 'half');
    mono2.styleAdd({background: '#cfe9ff'});

    mono.yousoAdd(mono2.div);

    mono.evAdd('click', function(){
        nicoText('clicked');
    });

    mono.append();
}

//#endregion
//#region observer
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

let clicking = false;
let cricking = false;
document.addEventListener('pointerdown', (e) => {
    if(e.buttons == 0) clicking = true;
    if(e.buttons == 2) cricking = true;
});
document.addEventListener('pointerup', (e) => {
    if(e.buttons == 0) clicking = false;
    if(e.buttons == 2) cricking = false;
});
document.addEventListener('pointercancel', (e) => {
    if(e.buttons == 0) clicking = false;
    if(e.buttons == 2) cricking = false;
});
window.addEventListener('blur', () => { clicking = cricking = false; });
//#endregion

// #region canvas
let canvas = document.getElementById('c');
let ctx = canvas.getContext('2d');

function resizeCanvas(){
    let dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);




// #endregion

// #region sound
let souC = {
    volume: 0.5
}

function soundPlay(name){
    let sound = sounds[name];
    if(!sound) return soundPlay("error");

    sound.currentTime = 0;
    sound.volume = souC.volume;
    sound.play();
}

function soundStop(){
    document.querySelectorAll('audio,video').forEach(el => {
        el.pause();
        el.currentTime = 0;
    });
}

function soundVolume(val){
    const v = Math.max(0, Math.min(1, val/100));
    console.log(`[soundVolume] ${souC.volume??null} => ${v}`);
    souC.volume = v;
    document.querySelectorAll('audio,video').forEach(el => {
        el.volume = v
    });
}
soundVolume(50);
// #endregion

let p = {
    x: 200,
    y: 200,
    dx: 0,
    dy: 0,
    d:1
}

// #region Shape
let shaD = document.getElementById('shape_slsl');
let shaC = {
    tog:1
}
shaC.list = [
    {
        name:'three',
        color:'#ff6060',
        points:[
            {x:0, y:0},
            {x:20, y:10},
            {x:0, y:20},
        ]
    },
    {
        name:'four',
        color:'#8fe9ff',
        points:[
            {x:0, y:0},
            {x:20, y:0},
            {x:20, y:20},
            {x:0, y:20},
        ]
    }
]
let shaF = {};

shaF.tog = (c = NaN) => {
    shaD.classList.toggle('tog');
    if(c == 1) shaD.classList.add('tog');
    if(c == 0) shaD.classList.remove('tog');

    if(shaD.classList.contains('tog')) shaC.tog = 1;
    else shaC.tog = 0;
}
shaF.select = (name) => {
    let shape = shaC.list.find(a => a.name == name);
    let center = ((points) => {
        let sx = 0, sy = 0;
        for(let p of points){
            sx += p.x;
            sy += p.y;
        }

        return{
            x: sx / points.length,
            y: sy / points.length
        };
    })(shape.points);
    p.center = center;
    p.shape = shape;
}
shaF.select('three')
// #endregion

// #region move
// #endregion

// #region loooooop
function tekiou(){
    // 描画
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();


    ctx.translate(p.x+p.center.x, p.y+p.center.y);
    ctx.scale(1, 1);

    ctx.beginPath();
    for(let i = 0; i < p.shape.points.length; i++){
        let pt = p.shape.points[i];
        let sx = pt.x - p.center.x;
        let sy = pt.y - p.center.y;
        if(i == 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
    }
    ctx.closePath();

    ctx.fillStyle = p.shape.color;
    ctx.fill();

    ctx.restore();

    // 動こうとすると左上に固定。おそらくtekiouの処理が問題..?頑張れ
}
function update(){
    // let masa2 = 0.02
    // p.dx -= p.dx * masa2;
    // p.dy -= p.dy * masa2;
    
    if(keys['w'] || keys['arrowup'])    p.dy = -p.speed;
    if(keys['s'] || keys['arrowdown'])  p.dy =  p.speed;
    if(keys['a'] || keys['arrowleft'])  p.dx = -p.speed;
    if(keys['d'] || keys['arrowright']) p.dx =  p.speed;

    p.x += p.dx;
    p.y += p.dy;
}

let loop = 0;
function gameloop(){
    update();
    tekiou();

    if(!loop) return;
    requestAnimationFrame(gameloop);
}
// #endregion

// #region load
let sounds = {}
let loaC = {
    souT:0,
    souD:0,
    erd:0
}
loaC.souL = ["doom","damage"]
let loaF = {};
loaF.loadSon = async() => {
    loaC.souT = loaC.souL.length;

    for(let sou of loaC.souL){
        let sound = new Audio();
        sound.preload = 'auto';
        sound.src = `assets/sounds/${sou}.mp3`;
        sound.addEventListener('canplaythrough', () => {
            // console.log(`Sound ${sou} loaded.`);
            loaC.souD += 1;
            if(loaC.souD == loaC.souT) start();
        }, {once: 1});
        sound.onerror = () => {
            console.error(`Sound assets/sounds/${sou} failed to load.`);
            loaC.erd += 1;
            if(loaC.erd > 20) return console.error('さすがにやりすぎbonus'), 1;
            sound.src = `assets/error.mp3`;
            loaC.souD += 1;
            if(loaC.souD == loaC.souT) start();
        };
        sounds[sou] = sound;
    };
}
// #endregion

async function start(){
    await loaF.loadSon();

    loop = 1;
    gameloop();
}
document.addEventListener('DOMContentLoaded', start);