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
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
        melt: [],
        cards: [],
        value: 0,
        standed: 0,
        hp: 40,
        maxhp: 40,
        shl: 0,
        atk: 0, //永続増加～みたいな用法予定
        def: 0, //上に同じく..いや強すぎるかも 
        buffs: [],
    },
    dealer:{
        name: "dealer",
        coinRate: 1,
        deck: [],
        melt: [],
        cards: [],
        value: 0,
        standed: 0,
        hp: 20,
        maxhp: 20,
        shl: 0,
        atk: 0,
        def: 0,
        buffs: [],
    }
}

let coin = 0;

let stage = 1;
let round = 0;
let turn = 0;

let spada = 21;

function tekiou(){
    //playerとdealerのvalueとhealthのtekiou
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
    
    //playerのその他の要素のtekiou
    let elseInfo = document.querySelector("#else .info");
    elseInfo.innerHTML = '';
    
    let row1 = document.createElement("div");
    row1.className = "row";
    
    let coinDivpre = document.createElement("div");
    coinDivpre.className = "item coin";
    coinDivpre.textContent = `Coin: ${coin}`;
    row1.appendChild(coinDivpre);
    
    let spadaDivpre = document.createElement("div");
    spadaDivpre.className = "item spada";
    spadaDivpre.textContent = `Spada: ${spada}`;
    row1.appendChild(spadaDivpre);
    elseInfo.appendChild(row1);
    
    let row2 = document.createElement("div");
    row2.className = "row";

    let deckDivpre = document.createElement("div");
    deckDivpre.className = "item deck";
    deckDivpre.dataset.type = 'deck';
    deckDivpre.textContent = `Deck: ${humans['player'].deck.length}`;
    deckDivpre.addEventListener("click", function(){
        DecksShow('deck');
    });
    row2.appendChild(deckDivpre);
    
    let meltDivpre = document.createElement("div"); //めーると とけてしまいそう〜〜〜〜
    meltDivpre.className = "item melt";
    meltDivpre.dataset.type = 'melt';
    meltDivpre.textContent = `Melt: ${humans['player'].melt.length}`;
    meltDivpre.addEventListener("click", function(){
        DecksShow('melt');   
    })
    row2.appendChild(meltDivpre);
    elseInfo.appendChild(row2);
}

//#region deckかmeltの表示処理
let deckDiv = document.querySelector('#upperLayer .deck');
let meltDiv = document.querySelector('#upperLayer .melt');
let detailDiv = document.querySelector('#upperLayer .detail')
function DecksShow(type){
    let appearDiv = document.querySelector(`#upperLayer .${type}`);
    appearDiv.innerHTML = '';

    ['hearts', 'spades', 'diamonds', 'clubs', 'elses'].forEach(suit => {
        appearDiv.appendChild(suitMake(suit, type));
    });


    appearDiv.style.display = 'flex';  
    appearDiv.style.pointerEvents = 'all';
}
function suitMake(suit, type){
    let player = humans['player'];
    let mark = suit == 'hearts' ? '♡' : suit == 'spades' ? '♤' : suit == 'diamonds' ? '♢' : suit == 'clubs' ? '♧' : 'X';
    let suits = player[type].filter(c => c.suit == mark);
    let order = Object.keys(Cards);
    order.splice(order.findIndex(card => card == 'A'), 1);
    order.unshift('A');//一旦の策。そのうちどーにかしよう
    suits.sort((a, b) => {
        return order.indexOf(a.name) - order.indexOf(b.name);
    });

    let suitsDiv = document.createElement("div");
    suitsDiv.className = suit;

    suits.forEach(card => {
        let cardDiv = cardMake(card.name, card.value, card.suit);

        cardDiv.addEventListener("click", (event) => zoomCard(event,card,cardDiv));

        suitsDiv.appendChild(cardDiv);
    });

    return suitsDiv;
}
document.addEventListener("click", function (e) {
    // すでに拡大してるカードがあるなら閉じるだけで終わり
    if(document.querySelector('#upperLayer .card.active') && !e.target.closest('.card')) {
        resetCard();
        return;
    }else if(document.querySelector('#upperLayer .card.active') && e.target.closest('.card')){
        return;
    }

    // 拡大カードもない＝deck/meltを閉じたい
    // && 
    if(e.target.closest('#upperLayer .deck') && deckDiv.style.display == 'flex' || e.target.closest('#upperLayer .melt') && meltDiv.style.display == 'flex' && !e.target.closest('.card')) {
        deckDiv.style.display = 'none';
        deckDiv.style.pointerEvents = 'none';
        meltDiv.style.display = 'none';
        meltDiv.style.pointerEvents = 'none';
        detailDiv.style.display = 'none';
    }
});
function zoomCard(event, card, cardDiv) {
    // すでに拡大中なら→裏返しにする
    if (cardDiv.classList.contains("active") && !cardDiv.classList.contains("flipped")) {
        // detailDiv の中身を裏面に入れる
        let rever = cardDiv.querySelector(".rever");
        rever.innerHTML = `
            <h3>${card.name}</h3>
            <p>Value: ${card.value}</p>
            <p>Suit: ${card.suit}</p>
            <p>${Cards[card.name].description}</p>
        `;

        cardDiv.classList.add("flipped");
        return;
    } else if (cardDiv.classList.contains("flipped")) {
        // 再度クリックで戻す（裏面→表面）
        cardDiv.classList.remove("flipped");
        return;
    }

    resetCard();

    // let rect = cardDiv.getBoundingClientRect();
    // cardDiv.style.position = "fixed";
    // cardDiv.style.left = rect.left + "px";
    // cardDiv.style.top = rect.top + "px";
    // cardDiv.style.width = rect.width + "px";
    // cardDiv.style.height = rect.height + "px";
    // cardDiv.style.zIndex = 105;
    // cardDiv.offsetWidth;
    // cardDiv.style.transition = 'transform 0.3s ease, left 0.3s ease, top 0.3s ease';
    // cardDiv.style.left = '50%';
    // cardDiv.style.top = '50%';
    // cardDiv.style.transform = "translate(-50%, -50%) scale(4)";
    cardDiv.classList.add("active");

    event.stopPropagation();
}

function resetCard() {
    document.querySelectorAll('#upperLayer .card.active').forEach(c => {
        c.style.transition = "transform 0.3s ease, left 0.3s ease, top 0.3s ease";
        c.style.left = '';
        c.style.top = '';
        c.style.transform = "translate(0, 0) scale(1)";
        c.style.position = '';
        c.style.width = '';
        c.style.height = '';
        c.style.zIndex = '';
        c.classList.remove("active", "flipped");
    });
}

//#endregion


let executions = {
    cardDraw,
    cardMelt
}
async function execute(arr){
    let [functionName, ...args] = arr;
    await executions[functionName](...args);
}

const context = {};


async function read(lines) {
    for (let line of lines) {
        line = line.trim();
        if(line.startsWith('変数')) {
            let [, varName, , expression] = line.split(/ +/); // 変数 x = 乱数生成(1,3)
            if(expression.startsWith('乱数生成')) {
                let args = expression.match(/\((.*?)\)/)[1].split(',').map(Number);
                context[varName] = random(...args);
            }else{
                context[varName] = JSON.parse(expression);
            }
        }


   else if(line.startsWith('if')){
            let [, leftSide, operator, rightSide] = line.split(/ +/);
            let left = 0, right = 0;
            function stringOrNumber(moto){
                if(typeof(leftSide) == 'string') left = context[leftSide];
           else if(typeof(leftSide) == 'number') left = JSON.parse(leftSide);         
            }
            // left = context[leftSide]
            // right = JSON.parse(rightSide);
            let condition = false;
            switch(operator){
                case '==': condition = left == right; break;
                case '!=': condition = left != right; break;
                case '<':  condition = left <  right; break;
                case '>':  condition = left >  right; break;
                case '<=': condition = left <= right; break;
                case '>=': condition = left >= right; break;
            }
            if (!condition) continue;
        }

        else if (line.startsWith('wait')) {
            let [, ms] = line.split(/ +/);
            await delay(parseInt(ms));
        }

        else if (line.startsWith('log')) {
            let match = line.match(/log +"(.*)"/);
            console.log(match?.[1] ?? '???');
        }

        // ...必要に応じて他の命令追加
    }
}


function cardDraw(cam, name = null, value = null, suit = null, prop = []){
    let deck = humans[cam].deck;
    if(deck.length === 0) return null;

    let card = null;

    if(name != null && value != null && suit != null){
        card = {
            name: name,
           value: value,
            suit: suit,
            prop: prop,
            data: Cards[name]
        }
        console.log('オーダー織田「カード作っといたわ笑」', card);
    }

    card = deck.shift();
    

    //console.log(card)

    let cardData = Cards[card.name];

    let drawCard = {
        name: card.name,
        value: card.value,
        suit: card.suit,
        prop: card.prop,
        data: cardData
    };
    humans[cam].cards.push(drawCard);

    let cardDiv = cardMake(card.name, card.value, card.suit);
    document.querySelector(`#cardPlaces .${cam}`).appendChild(cardDiv);

    tekiou();
    return [card.name, card.value, card.suit];
}
function cardMake(name, value, suit){
    //description とか用にvalue使え
    let cardData = Cards[name];

    let newCard = document.createElement("div");
    newCard.className = `card ${cardData.kind}`;

    let front = document.createElement('div');
    front.className = 'front'

    switch(cardData.kind){
        case 'normal':{
            let upper = document.createElement("div");
            upper.className = "upper";
            upper.textContent = suit
            front.appendChild(upper)

            let num = document.createElement("div");
            num.className = "num";
            num.textContent = name;
            front.appendChild(num)

            let lower = document.createElement("div");
            lower.className = "lower";
            lower.textContent = suit
            front.appendChild(lower)

            break;
        };
        case 'tarot':{
            let upper = document.createElement("div");
            upper.className = "upper";
            upper.textContent = suit
            front.appendChild(upper);
            
            let img = document.createElement("img");
            img.className = 'img';
            img.src = `assets/cards/${cardData.kind}/${cardData.id}.png`;
            front.appendChild(img);
            break;
        };
        
    };

    newCard.appendChild(front);

    let rever = document.createElement('div');
    rever.className = 'rever';
    rever.innerHTML = '';

    newCard.appendChild(rever);
    
    return newCard;
}


//プレイヤーの操作
let uiButtons = document.getElementById('buttons');
let hitButton = uiButtons.querySelector(".hit");
let standButton = uiButtons.querySelector(".stand");

hitButton.addEventListener("click", async function (){
    let player = humans['player'];
    let dealer = humans['dealer'];
    if(!player.standed){
        let drawCard = cardDraw('player')
        let isburst = isBurst('player');
        await delay(750);
        if(isburst) return result('player');

        if(!dealer.standed){
            drawCard = cardDraw('dealer');
            if(dealer.value >= 17) dealer.standed = 1;
            let isburst = isBurst('dealer');
            await delay(750);
            turn += 1;

            if(isburst) return result('dealer');
        }
    }
});

standButton.addEventListener("click", async function (){
    let player = humans['player'];
    let dealer = humans['dealer'];

    player.standed = 1;zz

    if(!dealer.standed){
        do{
            let drawCard = cardDraw('dealer');
            let isburst = isBurst('dealer');
            await delay(750);
            if(isburst) return result('dealer');
        }while(humans["dealer"].value < 17);

        dealer.standed = 1;
    }


    await delay(1000);

    //result
    result()
});


function isBurst(cam){
    let human = humans[cam];

    if(human.value > spada){
        console.log(`${cam}:「burstしたぜぇ」`)
        //when burst, suddenly lose
        human.cards.forEach(card => {
            if(card.name == 'strength' && !card.happend){
                card.happend = 1;
                let disCard = human.cards.pop();
                human.melt.push(disCard);

                cardDraw(cam, 'A', 'A', '♡', ['vanish']); //vanish..つまりは消滅 そのラウンドの終了時meltに行かず消える
                
                return 0
                //もしcardsの中にstrength(tarot,UR)があるのならば、今引いたカードをA(normal,N)に変化させる～って動き
                //スツ金みたいな感じにさせたい
            }
        })
        console.log(`${cam}:「ワイルドだろぉ？」`)
        human.standed = 1;
        return 1
    }else{
        return 0
    }
}

async function result(code = 'none'){
    //codeが${cam}ならば、${cam}がburstしたということ。!${cam}のvalueをそのままdamage
    let player = humans["player"];
    let dealer = humans["dealer"];
    
    player.standed = 1;
    dealer.standed = 1;

    tekiou();
    console.log(`dealer:${dealer.value} player:${player.value}`);

    let res = 1;
    if(code == 'none'){
        let difference = player.value - dealer.value;
        if(difference > 0) res = await damage('dealer', difference)
        else if(difference < 0) res = await damage('player', -difference)
        else res = await damage(0, 0);
    }else{
        let attackerCam = code == 'player' ? 'dealer' : 'player';
        res = await damage(code, humans[attackerCam].value);
    }
    //soldatoならばダメージ二倍とかあってもいいかも
    //相手バーストの自分soldatoだったら42っていう激ヤバなダメージになるわけだし いややばくね？それ

    round += 1;
    if(res) reset(); //もし死んでいないならば、続行(reset)
}
async function damage(cam, dmg){
    if(!cam) return 1;
    let attacker = humans[cam == 'player' ? 'dealer' : 'player'];
    let defender = humans[cam];

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
    addlog(`${defender.name}に${deal}ダメージ`);

    if(defender.hp < 0) defender.hp = 0;

    tekiou();

    if(humans['player'].hp == 0){
        outcome('dealer');
        return 0;
    };

    if(humans['dealer'].hp == 0){
        outcome('player');
        return 0;
    };
    
    return 1; //どちらかが死んだならば処理を停止するため0を、そうでなければ1をお返し申す
}
async function outcome(winner){
    let rate = 2
    switch(winner){
        case 'player':
            coin += (5 * rate);
            break;
        case 'dealer':
            break;
    }
    tekiou();

    //ここいらないゾーンです
    await addtext(`${humans['dealer'].name}「${winner == 'player' ? Dealers[humans['dealer'].name].lose : Dealers[humans['dealer'].name].win}」`);

    await delay(3000);
    battleStart();
}
async function checkout(){
    //result, outcome, checkout　の三つ目くん
}
let debugMenu = document.querySelector("#debug .menu");
let debugData = document.querySelector("#debug .data");
document.addEventListener("keydown", (e) =>{
    if(e.key == 'y'){
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


function reset() {
    let player = humans["player"];
    let dealer = humans["dealer"];

    player.standed = 0;
    dealer.standed = 0;

    const playerDOM = document.querySelector("#cardPlaces .player");
    const dealerDOM = document.querySelector("#cardPlaces .dealer");

    // プレイヤー
    while (player.cards.length > 0) {
        const card = player.cards.shift(); // 先頭から1枚ずつ
        if (!card.prop?.includes("vanish")) {
            player.melt.push(card);
        }
        if (playerDOM.children.length > 0) {
            playerDOM.children[0].remove();
        }
    }

    // ディーラー
    while (dealer.cards.length > 0) {
        const card = dealer.cards.shift();
        if (!card.prop?.includes("vanish")) {
            dealer.melt.push(card);
        }
        if (dealerDOM.children.length > 0) {
            dealerDOM.children[0].remove();
        }
    }

    tekiou();
}
function cardMelt(card){
    let cards = [
        {
            name:'A',
            suit:'♡',
            prop:['vanish'],
            attend:[],
            melted:[],
        },
        {
            name:'5',
            suit:'♢',
            prop:[],
            attend:[['']],
            melted:[],
        },
        {
            name:'A',
            suit:'♤',
            prop:[],
            attend:[],
            melted:[],
        }
    ]
}

async function battleStart(){
    turn = 0;
    round = 0;
    humans['dealer'] = decideDealerName();

    addtext(`${humans['dealer'].name}「${Dealers[humans['dealer'].name].opening}」`);
    
    humans['player'].deck = arrayShuffle(humans['player'].deck);
    
    reset();
}

function decideDealerName(){
    let names = Object.keys(Dealers).filter(a => Dealers[a].stage == stage).map(a => Dealers[a].name);
    let dealername = arraySelect(names);
    let nameData = Dealers[dealername];
    let dealer = {};

    dealer.cam = 'dealer';
    
    dealer.id = dealername; //nameは表示用、idは内部処理用
    dealer.name = dealername;

    dealer.value = 0;
    dealer.cards = [];
    dealer.deck = [];
    dealer.melt = [];
    dealer.standed = 0;
    dealer.atk = 0;
    dealer.def = 0;
    dealer.shl = 0;
    
    deckKinds[nameData.deckKind].deck.forEach(card => {
        let cardName = card[0]
        dealer.deck.push({
            name: Cards[cardName].name,
            value: Cards[cardName].val,
            suit: card[1],
            prop: Cards[cardName].prop,
            data: Cards[cardName]
        })
    })
    dealer.deck = arrayShuffle(dealer.deck);

    dealer.maxhp = nameData.maxhp;
    dealer.buffs = [];

    // ステータスの上下ありかどうかはファローズでよろっぷ
    // let statuses = ['attack','defense','mattack','mdefense','maxhealth','maxmp','critlate','critdmg','critresist','speed'];
    // statuses.forEach(statu => {
    // if(nameData[statu].startsWith('+') || nameData[statu].startsWith('-')){
    //     let num = Number(nameData[statu].slice(1));
    //     if(nameData[statu].startsWith('-')){num *= -1};
    //     dealer[statu] += num;
    // }else if(nameData[statu].startsWith('=')){
    //     let num = Number(nameData[statu].slice(1));
    //     dealer[statu] = num;
    // }
    // //'0'なら変動無し
    // })

    //つける〜〜〜？？ まあ一旦保留で
    // dealer.prefixe = '';
    // let prefixe = arraySelect(Object.keys(Prefixes));
    // if(Math.floor(Math.random() * 5) == 0){
    //     dealer.prefixe = Prefixes[prefixe].name;
    //     Prefixes[prefixe].process('enemies',target);
    // };

    dealer.hp = dealer.maxhp;
    

    return dealer;
}

deckKinds['normal'].deck.forEach(card => {
    let cardName = card[0]
    humans['player'].deck.push({
        name: Cards[cardName].name,
        value: Cards[cardName].val,
        suit: card[1],
        prop: Cards[cardName].prop,
        data: Cards[cardName]
    })
})
humans['player'].deck = arrayShuffle(humans['player'].deck);

let card1 = {
    name: 'wheel of fourtune',
    value: 0,
    suit: '♡',
    prop: [],
    data: Cards['wheel of fourtune']
};
humans.player.deck.push(card1);
let card2 = {
    name: 'strength',
    value: 0,
    suit: '♧',
    prop: [],
    data: Cards['strength']
};
humans.player.deck.push(card2);

//一旦のやつ
battleStart();