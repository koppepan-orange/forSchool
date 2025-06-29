//#region komagome
function delay(ms){
   return new Promise(resolve=>setTimeout(resolve,ms));
};
async function nicoText(mes){
   const newDiv = document.createElement('div');
   newDiv.textContent = mes;
   newDiv.className = 'nicotext';
   newDiv.style.top = `calc(${random(0,100)}vh - 20px)`
   document.querySelector('body').appendChild(newDiv);
   //let speed = (Math.random()*100+1)*0.1;
   //let speed = mes.toString().length*2 
   let speed = 2;
   for(let i = 0; window.innerWidth > i*speed; i++){
      let val = i*speed;
      newDiv.style.right = `${val}px`
      await delay(5);
   }
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

function resizeCanvas(){
   canvas.width = window.innerHeight;
   canvas.height = window.innerHeight;
   mass = window.innerHeight/12;
   draw();
}

//ちょっと物珍しいことにチャレンジしてみますね
let mass = window.innerHeight/12; //1マスの大きさ
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
   for(let i = 0; i < 12; i++){
      backmap[i] = [];

      for(let j = 0; j < 12; j++){
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
   for(let i = 0; i < 12; i++){
      objmap[i] = [];
      for(let j = 0; j < 12; j++){
         objmap[i][j] = {
            id: 0,
            x: j,
            y: i
         };
      }
   }
   let maxKira = random(0, 5)
   while(maxKira > 0){
      let y = random(0, 11);
      let x = random(0, 11);
      if(objmap[y][x].id == 'kira') continue;

      let ichi = arraySelect([[0, 0], [0, 1], [1, 0], [1, 1]]);
      objmap[y][x] = {
         id: 'kira',
         name: 'kira',
         kind: 'maps', //画像指定用
         cam: 'objects', //識別用
         me: get('objects').length, //仮。tekiou毎に変えてもいいかも
         x: 0,
         y: 0,
         dir: 1,
         sx: 0,
         sy: 0,
         spd: 20,
         moving: 0,
         ables: ['pass'],
         beacten: 'none',
         group: 0,
         bt: {
            hp: 10,
            maxhp: 10,
            shl: 0,
            atk: 3,
            oriatk: 3,
            def: 0,
            oridef: 0,
         },
         data: {
            ichi: ichi,
         },
      };

      maxKira -= 1;
   }

   // 48%で自販機が出現
   if(probability(48)){
      let y = random(0, 11);
      let x = random(0, 11);
      while(objmap[y][x].id){ //0じゃないならば
         y = random(0, 11);
         x = random(0, 11);
      };

      objmap[y][x] = {
         id: 'machine', //vendでvending machineの略..はむりがーるか
         name: 'kira',
         kind: 'maps', //画像指定用
         cam: 'objects', //識別用
         me: get('objects').length, //仮。tekiou毎に変えてもいいかも
         x: 0,
         y: 0,
         dir: 1,
         sx: 0,
         sy: 0,
         spd: 20,
         moving: 0,
         ables: ['pass'],
         beacten: 'none',
         group: 0,
         bt: {
            hp: 10,
            maxhp: 10,
            shl: 0,
            atk: 3,
            oriatk: 3,
            def: 0,
            oridef: 0,
         },
         data: {
            with: probability(85) ? 1 : 0, //1なら"ゴミ箱付き"
            max: random(40, 60),
            now: random(0, 30),
         }
      }; 
   }
   //#endregion
   //#region enemy
   for(let i = 0; i < 12; i++){
      movemap[i] = [];
      for(let j = 0; j < 12; j++){
         movemap[i][j] = {
            id: 0,
            x: j,
            y: i
         };
      }
   }
   let maxEnemy = random(3, 6);
   while(maxEnemy > 0){
      let y = random(0, 11);
      let x = random(0, 11);
      let hp = random(2, 5);
      let atk = random(1, 3);
      let def = 0;
      let newEne = {
         id: 'enemy',
         name: arraySelect(Object.keys(images.enemies)),
         kind: 'enemies', //画像指定用
         cam: 'enemies', //識別用
         me: Objects['enemies'].length, //仮。tekiou毎に変えてもいいかも
         x: x,
         y: y,
         dir: 0,
         sx: x,
         sy: y,
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
   for(let i = 0; i < 12; i++){
      if(!backmap[i]) continue;

      for(let j = 0; j < 12; j++){
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
         x: ob.x*mass,
         y: ob.y*mass,
         w: mass,
         h: mass
      }
      
      if(youso.id == 'kira'){
         let harf = mass/2;
         console.log('kiraのターン！！')
         youso.x = j*mass + (ob.data.ichi[0] * harf);
         youso.y = i*mass + (ob.data.ichi[1] * harf);
         youso.w = harf;
         youso.h = harf;
      }

      // console.log(ob.kind, ob.id)
      // console.log(`${ob.name}(${ob.cam})「srcは${youso.src}。 座標は(${youso.x}, ${youso.y})、 大きさは${youso.w}x${youso.h}」`)
      ctx.drawImage(youso.src, youso.x, youso.y, youso.w, youso.h);
   })

   // for(let i = 0; i < 12; i++){
   //    if(!objmap[i]) continue;

   //    for(let j = 0; j < 12; j++){
   //       let youso = objmap[i][j];
   //       if(!youso) continue;
   //       if(youso.id == 'kira'){
   //          let harf = mass/2;
   //          ctx.drawImage(images['maps']['kira'], j*mass+(youso.ichi[0] * harf), i*mass+(youso.ichi[1] * harf), harf, harf);
   //       }else{
   //          ctx.drawImage(images['maps'][youso.id], j*mass, i*mass, mass, mass)
   //       };
   //    }
   // }

   // Objects['enemies'].forEach(ene => {
   //    ctx.drawImage(images[ene.kind][ene.name], ene.x*mass, ene.y*mass, mass, mass)
   // })

   // ctx.drawImage(images['maps']['select'], get().x*mass, get().y*mass, mass, mass)
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
async function update(en = 0){
   let p = get();
   //#region playerの挙動
   if((keys.w || keys.arrowup) && !p.moving){
      p.dir = 0;
      await move('player', 0, 0, -1);
   }
   if((keys.s || keys.arrowdown) && !p.moving){
      p.dir = 2;
      await move('player', 0, 0, 1);
   };
   if((keys.a || keys.arrowleft) && !p.moving){
      p.dir = 3;
      await move('player', 0, -1, 0);
   };
   if((keys.d || keys.arrowright) && !p.moving){
      p.dir = 1;
      await move('player', 0, 1, 0);
   };
   draw();
   //#endregion
   //#region 攻撃タイム
   if((keys.z || keys.enter) && !p.moving){
      p.moving = 1;
      let karix = 0, kariy = 0;
      switch(p.dir){
         case 0: kariy -= 1; break;
         case 1: karix += 1; break;
         case 2: kariy += 1; break;
         case 3: karix -= 1; break;
      }
      Object.values(Objects).flat().filter(e => e.x == p.x + karix && e.y == p.y + kariy).forEach(e => {
         // nicoText('うわーー！！')
         if(able(e, 'beattack')) attack(p.cam, p.me, e.cam, e.me, 1);
         if(able(e, 'bepush')) move(e.cam, e.me, karix, kariy, 1);
      });
      p.moving = 0;
   }
   //#endregion

   //#region 敵の動き
   if(en){
      let promises = [];
      for(const e of get('enemies')){
         if(!e.moving){
            let a = random(-1, 1);
            let dir = random(0, 1); // 0:x, 1:y
            let x = 0, y = 0;
            if(dir == 0) x = a;
            if(dir == 1) y = a;
            promises.push(move('enemies', e.me, x, y));
         }
      }
      await Promise.all(promises); // まとめて待つ
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
async function move(cam, me, x, y, force = 0){
   let who = get(cam, me);

   // console.log(`想定: x|${who.x.toString().padStart(2, '0')}, y|${who.y.toString().padStart(2, '0')} => x|${(who.x + x).toString().padStart(2, '0')}, y|${(who.y + y).toString().padStart(2, '0')}`)

   if(who.x + x < 0 || 11 < who.x + x) x = 0;
   if(who.y + y < 0 || 11 < who.y + y) y = 0;
   if(Object.values(Objects).flat().filter(w => w.sx == who.x + x && w.sy == who.y).length > 0) x = 0;
   if(Object.values(Objects).flat().filter(w => w.sx == who.x && w.sy == who.y + y).length > 0) y = 0;
   if(x == 0 && y == 0) return //console.log(`${who.name}「移動量が0ですわ〜〜！！」`);

   if(!able(who, 'move') && !force) return //console.log(`${who.name}「動けないっっ...!!」`);

   who.sx += x;
   who.sy += y;
   let addx = x/who.spd;
   let addy = y/who.spd;

   // console.log(`想定: x|${who.x.toString().padStart(2, '0')}, y|${who.y.toString().padStart(2, '0')} => x|${(who.x + x).toString().padStart(2, '0')}, y|${(who.y + y).toString().padStart(2, '0')} || 実行: x|${addx.toString().padStart(5, ' ')}, y|${addy.toString().padStart(5, ' ')} 計${who.spd}回反復`)

   who.moving = 1;
   for(let i = 0; i < who.spd; i++){
      who.x += addx;
      who.y += addy;
      await delay(10);
      draw();
   }
   who.x = Math.round(who.x);
   who.y = Math.round(who.y);

   draw();

   who.moving = 0;
}

async function attack(...arr){
   let [cam, me, tcam, tme, rate = 1, ...prop] = arr;
   let who = get(cam, me);
   let tag = get(tcam, tme);
   let hasp = (name) => {return prop.some(p => p == name)};

   //console.log(`自分:${who.group}  相手:${tag.group}`);
   if(who.group == tag.group) return// console.log(`さすがに同種喰らいは..無理っすよ`);
   if(!able(who, 'attack') && !hasp('force')) return// console.log(`${who.name}「攻撃できないっっ...!!」`);
   if(!able(tag, 'beattack') && !hasp('force')) return// console.log(`${tag.name}「攻撃が効かない..だと....!?」`);

   let dmg = (who.bt.atk * rate);
   if(!hasp('penetrate')) dmg -= (tag.bt.def);
   dmg = Math.round(dmg);

   //バフの処理がしたいならここで

   if(dmg > 0) await damage(cam, me, tcam, tme, dmg, ...prop);
   else if(dmg < 0) await heal(cam, me, tcam, tme, (dmg*-1), prop);
   else return console.log('しかし なにも おこらなかった');

}
async function damage(...arr){
   let [cam, me, tcam, tme, dmg, ...prop] = arr;
   let who = get(cam, me);
   let tag = get(tcam, tme);
   let hasp = (name) => {return prop.some(p => p == name)};

   tag.bt.hp -= dmg;
   if(tag.bt.hp < 0) tag.bt.hp = 0;
   nicoText(`${tag.name}は${dmg}ダメージを受けた!! (残り:${tag.bt.hp}/${tag.bt.maxhp})`);

   if(tag.bt.hp <= 0) await death(cam, me, tcam, tme);
};

async function heal(...arr){
   let [cam, me, tcam, tme, dmg, ...prop] = arr;
   let who = get(cam, me);
   let tag = get(tcam, tme);
   let hasp = (name) => {return prop.some(p => p == name)};

   tag.bt.hp += dmg;
   if(tag.bt.hp > tag.bt.maxhp) tag.bt.hp = tag.bt.maxhp;
   nicoText(`${tag.name}は${dmg}回復した!!`);
};

async function death(...arr){
   let [cam, me, tcam, tme, ...prop] = arr;
   let who = get(cam, me);
   let tag = get(tcam, tme);
   let hasp = (name) => {return prop.some(p => p == name)};

   nicoText(`${tag.name}の消失`);

   Objects[tcam].splice(tme, 1);

   Objects[tcam].forEach((obj, i) => obj.me = i);

   //if(Object.values(Objects[tcam]).length == 0) delete Objects[tcam];
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
   'objects':['box']
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
   if(e.key == 'n' && get().name == 'player') UI_name.style.display = 'flex';
   if(e.key == 'b' && !get().moving){
      let p = get();
      let x = p.x;
      if(p.dir == 1 && x == 11) return;
      else if(p.dir == 1) x += 1;
      if(p.dir == 3 && x == 0) return;
      else if(p.dir == 3) x -= 1;
      
      let y = p.y;
      if(p.dir == 0 && y == 0) return;
      else if(p.dir == 0) y -= 1;
      if(p.dir == 2 && y == 11) return;
      else if(p.dir == 2) y += 1;

      if(Object.values(Objects).flat().some(o => o.x == x && o.y == y)) return;

      let newOb = {
         id: 'objects',
         name: 'box',
         kind: 'objects', //画像指定用
         cam: 'objects', //識別用
         me: Objects['objects'].length,
         x: x,
         y: y,
         dir: 0,
         sx: x,
         sy: y,
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
   }
});


UI_name.querySelector('.button').addEventListener('click', () => {
   get().name = UI_name.querySelector('.input').value;
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

   await update(en);
   if(loop) requestAnimationFrame(gameloop);
}

let playername = 'player';
let x = 0;
let y = 0;  
let z = 0;
let pt = 0;
let ptkari = 0;
let have = 0;
let hour = 14
let min = 0;
let traveled = 0;
let traveledmax = 0;
let strollnow = 0;
let gohomeroot = 0;
let gohomenow = 0;
let phase = 0;
const gostraightmove = '<button class="button" id="Select1" onclick="select1()">go straight</button><br><br><button class="button" id="Select2" onclick="select2()">return home</button>';
const lobyscreen = '<button class="button" onclick="LetsStroll()">Go to stroll</button><br><br><button class="button" onclick-"GoShop()">Shop</button>';
let vendingnum = []

function delay(ms){return new Promise(function(resolve){setTimeout(resolve,ms);});}//遅延がやってみたかったのです
function disappear(){document.getElementById('Select1').textContent = '';document.getElementById('Select2').textContent = '';}
//起動時にやっちゃいます！
playername = 'player'; reset();
async function reset(){
   x = 0; y = 0; z = 0;
   pt = 0; ptkari = 0;
   have = 0; traveled = 0;
   gohomeroot = 0; gohomenow = 0;
   hour = 14; min = 0; phase = 0;
   vendingnum = [];
   window.setTimeout(BackToLoby,1000)
}
async function Timetekiou(){
   if(min == 60){min = 0; hour += 1;};
   if(min == 0){x = '00'}else if(min == 5){x = '05'}else{x = min};
   document.getElementById('Time').textContent = hour + ':' + x;
   if(hour == 18 && strollnow == 1){document.getElementById('log').textContent = 'あなたは家に帰れなかった....'; await delay(2000); reset();}
}
function tekiou(){
   
}
async function LetsStroll(){
   strollnow = 1;
   x = 0; y = 0; z = 0;
   pt = 0; ptkari = 0;
   have = 0; traveled = 0;
   gohomeroot = 0; gohomenow = 0;
   hour = 14; min = 0; Timetekiou();
   vendingnum = [];
   for(i = 0; i < 8; i++){vendingnum.push((Math.floor(Math.random()*6)+1)+(6*i));};
   document.getElementById('log').textContent = 'Lets Go!';
   await delay(1000);
   document.getElementById('scene').innerHTML = gostraightmove;
   yourturn();
}
function yourturn(){
   tekiou();
   if(gohomenow == 0){
      x = gostraightmove;
      document.getElementById('Select1').textContent = 'go straight';
      document.getElementById('Select2').textContent = 'return home';
      phase = 1;
   }else if(gohomenow = 1){
      x = gostraightmove;
      document.getElementById('Select1').textContent = 'go straight';
      document.getElementById('Select2').textContent = '';
      phase = 3;
   };
   document.getElementById('log').textContent = 'さあ、どうしようか？'
}
async function select1(){
   disappear();
   if(phase == 1){
   phase = 0;
   traveled += 1;
   min += 5;
   if(have < 4 && Math.floor(Math.random()*4) == 0){min -= 5; document.getElementById('log').textContent = 'るんるる〜ん♪'; await delay(500);};//3個以下ならたまにスキップする
   if(6 > have > 3 && Math.floor(Math.random()*5)  == 0){document.getElementById('log').textContent = 'すこしゴミを落としてしまった！'; await delay(500); min += 5; Timetekiou(); document.getElementById('log').textContent = '全て拾い終えた!'; await delay(500);}//4個以上ならたまに時間ロス
   if(have > 6 && Math.floor(Math.random()*2)  == 0){document.getElementById('log').textContent = 'すこしゴミを落としてしまった！'; await delay(500); min += 5; Timetekiou(); document.getElementById('log').textContent = '全て拾い終えた!'; await delay(500);}//4個以上ならすごい時間ロス
   Timetekiou();
   tekiou();
   if(Math.floor(Math.random()*2) == 0){
      x = Math.floor(Math.random()*6);
      if(x == 6){y = '瓶'}else if(x == 5){y = '空き缶'}else{y = 'ペットボトル'};
      document.getElementById('log').textContent = y + 'を発見した！';//缶、瓶とか増やして難易度上げてもいいかも
      document.getElementById('Select1').textContent = 'Pick Up';
      document.getElementById('Select2').textContent = 'Leave It';
      phase = 2;
   } else {
      document.getElementById('log').textContent = '何も見つからなかった..'
      window.setTimeout(vending,500)
   }
   } else if(phase == 2){
   phase = 0;
   if(have < 10){
      have += 1;
      document.getElementById('log').textContent = playername + 'は'+ y +'を拾った！';
      tekiou();
      window.setTimeout(vending,500);
   }else{
      document.getElementById('log').textContent = 'もう持てない...!!';
      phase = 2;
      document.getElementById('Select1').textContent = 'Pick Up';
      document.getElementById('Select2').textContent = 'Leave It';
   };
   } else if(phase == 3){
   phase = 0;
   traveled -= 1;
   min += 5;
   if(traveled > 0){
      tekiou(); Timetekiou();
      if(Math.floor(Math.random()*4) == 0){
      document.getElementById('log').textContent = 'なんとペットボトルを発見した！';
      document.getElementById('Select1').textContent = 'Pick Up';
      document.getElementById('Select2').textContent = 'Leave It';
      phase = 2;
      } else {
         document.getElementById('log').textContent = '進んだ...';
         window.setTimeout(vending,100);
      }
   } else if(traveled == 0){
      tekiou(); strollnow = 0;
      Timetekiou();
      document.getElementById('log').textContent = playername + 'は家に帰りました!';
      await delay(1500);
      document.getElementById('scene').innerHTML = '<span id="PointScore"></span><br><span id="MovedScore"></span><br><span id="TimeScore"></span><br><br><button class="button" onclick="BackToLoby()">Back to loby</button>'
      document.getElementById('PointScore').textContent = 'ポイント:' + ptkari + 'pt';
      document.getElementById('MovedScore').textContent = '移動距離:' + traveledmax + 'km';
      if(min == 0){x = '00'}else if(min == 5){x = '05'}else{x = min};
      document.getElementById('TimeScore').textContent = '帰宅時間:' + hour + ':' + x;
      document.getElementById('log').textContent = 'これが今回のスコア!';
      pt += ptkari; ptkari = 0;
   }
   } else if(phase == 4){
   phase = 0;
   if(have < 10){
      have += 1;
      document.getElementById('log').textContent = playername + 'はペットボトルを拾った！';
      tekiou();
      window.setTimeout(vending,500);
   }else{document.getElementById('log').textContent = 'もう持てない...!!'}
   }
}
function select2(){
   disappear();
   if(phase == 1){
   phase = 0;
   gohomenow = 1;
   traveledmax = traveled;
   document.getElementById('log').textContent = 'さあ、家に帰ろう！';
   window.setTimeout(yourturn,500)
   } else if(phase == 2){
   phase = 0;
   document.getElementById('log').textContent = '見捨てることにした！';
   window.setTimeout(vending,1000);
   } else if(phase == 3){
   phase = 0;
   yourturn();
   } else if(phase == 4){
   phase = 0;
   document.getElementById('log').textContent = '見捨てることにした！';
   window.setTimeout(vending,1000);
   }   
}
async function vending(){
   phase = 0;
   disappear();
   if(vendingnum.includes(traveled)){
      document.getElementById('log').textContent = '自動販売機を発見した！';
   if(have > 0){
      await delay(500);
      document.getElementById('log').textContent = playername + 'はすべてのペットボトルを捨て、';
      x = ptkari
      ptkari += have;
      y = ptkari - x
      have = 0;
      await delay(500);
      document.getElementById('log').textContent = y + 'ptを得た!';
      tekiou();
   }
   await delay(750);
   };
   yourturn();
}
function BackToLoby(){
   tekiou();
   document.getElementById('scene').innerHTML = lobyscreen;
   document.getElementById('log').textContent = 'さて、何をしようか?';
}
function GoShop(){
}