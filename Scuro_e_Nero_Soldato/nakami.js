//#region komagome
function delay(ms){return new Promise(resolve=>setTimeout(resolve,ms));}
async function NicoNicoText(mes){
    const newDiv = document.createElement('div');
    newDiv.textContent = mes;
    newDiv.style = `
    position: absolute;
    top: ${Math.random()*100}vh;
    right: 0;
    background-color: rgba(228, 249, 255, 0.563);
    color: #000000;
    font-size: 50px;
    `
    document.querySelector('body').appendChild(newDiv);
    //let speed = (Math.random()*100+1)*0.1;
    //let speed = mes.toString().length*2 
    speed = 4;
    for(let i = 0; window.innerWidth > i*speed; i++){
        let val = i*speed;
        newDiv.style.right = `${val}px`
        await delay(10);
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
//#endregion
//#region log&text
let textDiv = document.querySelector('#text');
let autoDelay = 1;
let skipText = false; // スキップフラグ
let clearText = false; // テキスト消去フラグ
let textShowing = 0;

function colorcheck(rawtext) {
   const text = [];
   let isRed = false; // ** で囲まれた部分かどうか
   let isPink = false; // && で囲まれた部分かどうか
   let isBlue = false; // ^^ で囲まれた部分かどうか

   for(let i = 0; i < rawtext.length; i++){
      if(rawtext[i] === "*" && rawtext[i + 1] === "*"){
         isRed = !isRed; // 状態を切り替える
         i++; // 次の * をスキップ
      }else if(rawtext[i] === "&" && rawtext[i + 1] === "&"){
         isPink = !isPink;
         i++; // 次の & をスキップ
      }else if(rawtext[i] === "^" && rawtext[i + 1] === "^"){
         isBlue = !isBlue;
         i++;
      }else{
         text.push({ char: rawtext[i], color: isRed ? "red" : isPink ? "pink" : isBlue ? "blue" : null });
      }
   }
   return text;
}

async function addtext(text){
   textShowing = 1;
   text = colorcheck(text);
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
                        const span = document.createElement("span");
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
                  const span = document.createElement("span");
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
               const waitTime = autoDelay * 1000;
               const timeout = new Promise(resolve => setTimeout(resolve, waitTime));
               const userAction = new Promise(resolve => {
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
document.addEventListener('keydown', (event) => {
   if (event.key === 'z' || event.key === 'Enter') {
      skipText = true;
   }
});

document.addEventListener('keyup', (event) => {
   if (event.key === 'z' || event.key === 'Enter') {
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
logOpener.addEventListener('click', function(){
   if(logOOmoto.style.right == '-300px'){
      logOOmoto.style.right = '0px';
      logOpener.textContent = '>';
   }else{
      logOOmoto.style.right = '-300px';
      logOpener.textContent = '<';
   }
});
function addlog(text){
   log.innerHTML += text + '<br>';
   log.scrollTop = log.scrollHeight;
}
//#endregion
let humans = {
    player:{
        name: "player",
        deck: [],
        cards: [],
        value: 0,
        standed: 0,
        hp: 40,
        maxhp: 40,
        // mp: 10,
        // maxmp: 10,
        shl: 0,
        atk: 0, //永続増加～みたいな用法予定
        def: 0, //上に同じく..いや強すぎるかも 
        buffs: [],
    },
    dealer:{
        name: "dealer",
        deck: [],
        cards: [],
        value: 0,
        standed: 0,
        hp: 20,
        maxhp: 20,
        // mp: 10,
        // maxmp: 10,
        shl: 0,
        atk: 0,
        def: 0,
        buffs: [],
    }
}
let coin = 0;
let standed = 0;

let spada = 21; //仮名。

let uiButtons = document.getElementById('buttons')
let hitButton = uiButtons.querySelector(".hit");
let standButton = uiButtons.querySelector(".stand")

function tekiou(){
    Object.keys(humans).forEach(cam => {
        let div = document.querySelector(`#UIs .${cam}`);

        let human = humans[cam];
        
        //valueの計算
        human.value = 0;
        let aces = 0;
        humans[cam].cards.forEach(c => {
            if(c.value == 'A'){
                aces++;
                human.value += 1;
            }else{
                human.value += c.value;
            }
        });
        while(aces > 0 && human.value + 10 <= 21) {
            human.value += 10;
            aces--;
        };
        
        //適応
        div.querySelector(".health .hp .num .now").textContent = human.hp;
        div.querySelector(".health .hp .num .max").textContent = `/${human.maxhp}`;
        div.querySelector(".health .shl .num .now").textContent = human.shl;
        div.querySelector(".point").textContent = human.value;
    });
    
}
function getCard(cam){
    let deck = humans[cam].deck.filter(a => !a.showing);
    let card = arraySelect(deck); // ランダムに1枚選ぶ関数だと仮定
    card.showing = 1;
    return [card.name, card.value, card.suit];
}

hitButton.addEventListener("click", async function (){
    let player = humans['player'];
    let dealer = humans['dealer'];
    if(!player.standed){
        let drawCard = cardDraw('player')
        tekiou();
        await delay(750);
        
        let isburst = isBurst('player');
        if(isburst) return;

        if(!dealer.standed){
            drawCard = cardDraw('dealer');
            tekiou();
            await delay(750);

            let isburst = isBurst('dealer');
            if(isburst) return;
        }
    }
})

function cardDraw(cam){
    let deck = humans[cam].deck.filter(a => !a.showing);
    let card = arraySelect(deck);
    cardAdd(cam, card.name, card.value, card.suit)
    card.showing = 1;
    return [card.name, card.value, card.suit];
}
function cardAdd(cam, name, value, suit){
    let cardData = Cards[name];
    
    let drawCard = {
        name: name,
        value: value,
        suit: suit,
        data: cardData
    };
    
    humans[cam].cards.push(drawCard);

    let newCard = document.createElement("div");
    newCard.className = `card ${cardData.kind}`;

    switch(cardData.kind){
        case 'normal':{
            let upper = document.createElement("div");
            upper.className = "upper";
            upper.textContent = suit
            newCard.appendChild(upper)

            let num = document.createElement("div");
            num.className = "num";
            num.textContent = name;
            newCard.appendChild(num)

            let lower = document.createElement("div");
            lower.className = "lower";
            lower.textContent = suit
            newCard.appendChild(lower)

            break;
        };
        case 'tarot':{
            let upper = document.createElement("div");
            upper.className = "upper";
            upper.textContent = suit
            newCard.appendChild(upper);
            
            let img = document.createElement("img");
            img.className = 'img';
            console.log(`assets/cards/${cardData.kind}/${cardData.id}`)
            img.src = `assets/cards/${cardData.kind}/${cardData.id}.png`;
            newCard.appendChild(img);
            'assets/cards/tarot/wheel_of_fourtune'
            
            break;
        }
    };
    
    document.querySelector(`#cardPlaces .${cam}`).appendChild(newCard);
    return drawCard;
}
function isBurst(cam){
    let human = humans[cam];

    if(human.value > spada){
        console.log(`${cam}:「burstしたぜぇ」`)
        //when burst, suddenly lose
        human.cards.forEach(card => {
            if(card.name == 'strength' && !card.happend){
                card.happend = 1;
                let disCard = human.cards.pop();
                
                let newCardData = Cards['A']
                let newDrawCard = {
                    name: 'A',
                    value: '1',
                    suit: '♡',
                    data: newCardData
                }
                human.cards.push(newDrawCard);
                return 0
            }
        })
        //もしcardsの中にstrength(tarot,UR)があるのならば、今引いたカードをA(normal,N)に変化させる～って動き
        //スツ金みたいな感じにさせたい
        console.log(`${cam}:「ワイルドだろぉ？」`)
        result(cam);
        return 1
    }else{
        return 0
    }
}

standButton.addEventListener("click", async function (){
    standed = 1;
    
    //dealer's turn
    do{
        let [num, name, suit] = getCard('dealer');
        cardAdd("dealer", num, name, suit);
        tekiou();
        await delay(1000)
    } while(humans["dealer"].value < 17);
    //...ここ引かせる.....?

    await delay(1000);

    //result
    result()
});

async function result(code = 'none'){
    //codeが${cam}ならば、${cam}がburstしたということ。!${cam}のvalueをそのままdamage
    let player = humans["player"];
    let dealer = humans["dealer"];
    
    tekiou();
    console.log(`dealer:${dealer.value} player:${player.value}`);

    if(code == 'none'){
        let difference = player.value - dealer.value;
        if(difference > 0) await damage('dealer', difference)
        else if(difference < 0) await damage('player', -difference)
        else await damage(0, 0);
        reset();
    }else{
        let attackerCam = code == 'player' ? 'dealer' : 'player';
        damage(code, humans[attackerCam].value);
    }
}
async function damage(cam, dmg){
    if(!cam) return;
    let attacker = humans[cam];
    let defender = humans[cam == 'player' ? 'dealer' : 'player'];

    //加算(attacker)
    let power = 1; //倍率 *power みたいに使うから初期値は1
    let attack = attacker.atk; //加算分
    attacker.buffs.forEach(buff => {
        buff.effects.forEach(effect => {
            switch(effect){
                case 'power':
                    power += buff.value;
                    break;
                case 'attack':
                    attack += buff.value;
                    break;
            }
        })
    })

    //減算(defender)
    let suffer = 1; //被ダメ率、みたいなもん
    let defense = defender.def; //基礎控除みたいなもん
    defender.buffs.forEach(buff => {
        buff.effects.forEach(effect => {
            switch(effect){
                case 'suffer':
                    suffer += buff.value;
                    break;
                case 'defense':
                    defense += buff.value;
                    break;
            }
        })
    })

    //清算
    let deal = Math.max((dmg + attack) - defense, 0); //基礎控除
    deal *= power; //税率
    deal *= suffer; //－税率 (?????)
    
    //整え
    deal = Math.floor(deal);
    if(deal < 0) deal = 0;

    console.log(`${attacker.name} => ${defender.name} | dmg:${dmg} ( power:${power} attack:${attack} || suffer:${suffer} defense:${defense} )`);
    
    if(defender.shl){
        let diff = (defender.shl - deal);
        if(diff >= 0){
            defender.shl -= deal;
        }else{
            defender.shl = 0;
            deal = (diff * -1);
        }
    }

    defender.hp -= deal;

    if(defender.hp < 0) defender.hp = 0;
}
async function outcome(winner){
    let thisRate = 1;
    switch(winner){
        case 'player':
            coin += (5 * dealer.coinRate);
            break;
        case 'dealer':
            break;
    }
    tekiou();
    await delay(3000);
    // battleStart();
}
async function checkout(){
    //result, outcome, checkout　の三つ目くん
}
let debugMenu = document.querySelector("#debug .menu");
let debugData = document.querySelector("#debug .data");
document.addEventListener("keydown", (e) =>{
    if(e.key == "p"){
        let [num, name, suit] = getCard();
        cardAdd("player",num,name,suit);
    }else if(e.key == 'y'){
        if(debugData.style.display == 'block'){
            debugData.style.display = 'none';
            debugData.innerHTML = JSON.stringify(humans);
        }else{
            debugData.style.display = 'block';
        }
    }else if(e.key == "g"){
        if(debugMenu.style.display == 'block'){
            debugMenu.style.display = 'none';
        }else{
            debugMenu.style.display = 'block';
        }
    }
});


function reset(){
    document.querySelector("#cardPlaces .player").innerHTML = '';
    document.querySelector("#cardPlaces .dealer").innerHTML = '';

    let player = humans["player"];
    let dealer = humans["dealer"];

    player.standed = 0;
    dealer.standed = 0;

    player.cards = [];
    dealer.cards = [];
    tekiou();

    // console.log("resetですわ～")
}

function battleStart(){
    reset();
    addtext("dealerが現れた！")
}


//一旦のやつ
battleStart();

//本来はダンジョン開始時にやるべき動きを！なんと贅沢にコードの1番下に描かせていただきます！！
let nums = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
let suits = ['♡','♤','♢','♧'];
humans.player.deck = [];
humans.dealer.deck = [];
nums.forEach(num => {
    suits.forEach(suit => {
        const card = {
            name: num,
            value: Cards[num].val,
            suit: suit,
            showing: 0,
            data: Cards[num]
        };
        humans.player.deck.push(card);
        humans.dealer.deck.push(card);
    });
});