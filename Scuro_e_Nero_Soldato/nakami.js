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
        name: "コッペ",
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
        let cardDiv = cardMake(card);

        cardDiv.addEventListener("click", (event) => zoomCard(event, card, cardDiv));

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
        cardDiv.classList.add("flipped");
        return;
    } else if (cardDiv.classList.contains("flipped")) {
        // 再度クリックで戻す（裏面→表面）
        cardDiv.classList.remove("flipped");
        return;
    }

    resetCard();
    
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


//カードを成型する
function cardMold(name, suit, prop, attend, melted, elseed){ 
    let cardData = Cards[name]
    let card = {
        name: name,
        value: cardData.val,
        suit: suit,
        prop: cardData.prop??[].concat(prop??[]),
        attend: cardData.attend??[].concat(attend??[]),
        melted: cardData.melted??[].concat(melted??[]),
        elseed: cardData.elseed??[].concat(elseed??[]),
        data: cardData
    };

    return card;
}

//カードを素材の状態からMoldを通して正式なカードにする
async function cardBecome(cam, type, cardOrigin){
    let [name, suit, prop, attend, melted, elseed] = cardOrigin

    let card = cardMold(name, suit, prop, attend, melted, elseed);
    humans[cam][type].push(card);
}

//カードをdeck/melt/cardsに入れる(だけ～ 歩いて～走って～ 日の光浴びながぁら～～～)
async function cardAdd(cam, type, card){
    
    
    humans[cam][type].push(card);

    return card
}

//カードをデッキから引く
async function cardDraw(cam, name = null, suit = null, prop, attend, melted, elseed){
    let deck = humans[cam].deck;
    if(deck.length === 0) return null;

    let card = null;
    if(name != null && suit != null){
        card = cardMold(name, suit, prop, attend, melted, elseed)
        console.log('オーダー織田「カード作っといたわ笑」', `['${name}','${suit}']`);
    }else{
        card = deck.shift();
        // card = cardMold(cardPre[0], cardPre[1])
    }

    cardAdd(cam, 'cards', card)

    let cardDiv = cardMake(card);
    cardPlace(cam, cardDiv)

    tekiou();
    return card
}

//カードをDivにする
function cardMake(card){
    let name = card.name;
    let suit = card.suit;
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

    let reTitle = document.createElement('div');
    reTitle.className = 'title';
    reTitle.textContent = name;
    rever.appendChild(reTitle);

    let reDetail = document.createElement('div');
    reDetail.className = 'detail';
    reDetail.innerHTML = Cards[card.name].description;
    rever.appendChild(reDetail);

    let reProps = document.createElement('div'); //こいつらをそれぞれでやるようにして、 if length != 0 で作成〜って感じに
    reProps.className = 'attributi';
    reProps.innerHTML = `
        <span class="prop">prop:${card.prop}</span><br>
        <span class="attend">attend:${card.attend}</span><br>
        <span class="melted">melted:${card.melted}</span><br>
        <span class="else">else:${card.elseed}</span><br>
    `;
    rever.appendChild(reProps);

    newCard.appendChild(rever);
    
    return newCard;
}

//Divになったカードをデッキから置き場に置く動き
function cardPlace(cam, cardDiv){
    document.querySelector(`#cardPlaces .${cam}`).appendChild(cardDiv);
    
    let fromRect = document.querySelector('#else .info .deck').getBoundingClientRect();
    
    let toRect = cardDiv.getBoundingClientRect();
    
    let cloneKun = cardDiv.cloneNode(true);
    cloneKun.classList.add('clone')
    cloneKun.style.left = `${fromRect.left + window.scrollX}px`;
    cloneKun.style.top = `${fromRect.top + window.scrollY}px`;
    cloneKun.style.width = `${toRect.width}px`;
    cloneKun.style.height = `${toRect.height}px`;

    document.body.appendChild(cloneKun);

    cardDiv.classList.add('invisibility')
    
    // console.log(`${fromRect.left}, ${fromRect.top} => ${toRect.left}, ${toRect.top}`)

    requestAnimationFrame(() => {
        cloneKun.style.left = `${toRect.left + window.scrollX}px`;
        cloneKun.style.top = `${toRect.top + window.scrollY}px`;
    });
    
    cloneKun.addEventListener('transitionend', () => {
        cloneKun.remove();
        cardDiv.style.opacity = '1';  
    });

    return 1;
}


//プレイヤーの操作s
let hitButton = document.querySelector("#buttons .hit");
let standButton = document.querySelector("#buttons .stand");

hitButton.addEventListener("click", async function (){
    if(!actable) return;
    
    actable = 0;
    let player = humans['player'];
    let dealer = humans['dealer'];
    if(!player.standed){
        let drawCard = await cardDraw('player')
        let isburst = await isBurst('player');
        await delay(750);
        if(isburst) return result('player');

        if(!dealer.standed){
            drawCard = await cardDraw('dealer');
            if(dealer.value >= 17) dealer.standed = 1;
            let isburst = await isBurst('dealer');
            await delay(750);
            turn += 1;

            if(isburst) return result('dealer');
        }
    }

    actable = 1;
});

standButton.addEventListener("click", async function (){
    if(!actable) return;

    actable = 0;
    let player = humans['player'];
    let dealer = humans['dealer'];

    player.standed = 1;

    if(!dealer.standed){
        do{
            let drawCard = await cardDraw('dealer');
            let isburst = await isBurst('dealer');
            await delay(750);
            turn += 1;
            
            if(isburst) return result('dealer');
        }while(humans["dealer"].value < 17);

        dealer.standed = 1;
    }


    await delay(1000);

    //result
    result()
});

function hasAttributo(card, type, name){
    let attributi = card[type];
    attributi.forEach(a => {
        if(a[0] == name){
            return 1
        }
    })

    return 0;
}

function checkAttributo(card, type, name, num){
    let attributi = card[type];
    let attributo = attributi.find(a => a[0] == name);
    let value = attributo[num];

    return value;
}

let executions = {
    cardDraw,
    cardMelt
}
async function executeAttributo(card, type, name){
    let attributi = card[type];
    let attributo = attributi.find(a => a[0] == name);

    let [functionName, ...args] = attributo;
    let result = await executions[functionName](...args);

    return result
}


async function isBurst(cam){
    let human = humans[cam];

    if(human.value > spada){
        console.log(`${cam}:「burstしたぜぇ」`)
        //when burst, suddenly lose
        human.cards.forEach(card => {
            if(card.name == 'strength' && !card.happend){
                card.happend = 1;
                let disCard = human.cards.pop();
                human.melt.push(disCard);

                cardDraw(cam, 'A', '♡', [['vanish']]); //vanish..つまりは消滅 そのラウンドの終了時meltに行かず消える
                
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

//勝敗、ドローか、バーストかどうか whetherですね
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

//ステータスを増減させるやつ increase/decreaseのindec
async function buffAdd(cam, buff, val){
    let human = humans[cam];
    
    let buffData = Buffs[buff];
    switch(buffData.kind){
        case 'stack':{
            let resent
        };
        case 'turn':{
            let valuen = buffData.type == 'freely' ? {[buffData.prop]: val} : buffData.lves[val];
            let newbuff = {
                name: buff,
                value: valuen,
            }
            break;
        };
    }
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

    let dealer = humans['dealer'];
    await addtext(`${dealer.name}「${winner == 'player' ? Dealers[dealer.name].lose : Dealers[dealer.name].win}」`);

    await delay(1000);

    if(winner == 'player') battleStart();
    if(winner == 'dealer') checkout();
}

//負け処理(適当)
async function checkout(){ 
    window.open('about:blank', '_self').close();
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


async function reset() {
    let player = humans["player"];
    let dealer = humans["dealer"];

    player.standed = 0;
    dealer.standed = 0;

    const playerDOM = document.querySelector("#cardPlaces .player");
    const dealerDOM = document.querySelector("#cardPlaces .dealer");


    while(player.cards.length > 0){
        const card = player.cards.shift(); // 先頭から1枚ずつ
        if(hasAttributo(card, 'prop', 'vanish') == 0){//vanishがないならば
            await cardMelt('player', card);
        }
        if(playerDOM.children.length > 0){
            playerDOM.children[0].remove();
        }
    }

    while(dealer.cards.length > 0){
        const card = dealer.cards.shift();
        if(hasAttributo(card, 'prop', 'vanish') == 0){
            await cardMelt('dealer', card);
        }
        if(dealerDOM.children.length > 0){
            dealerDOM.children[0].remove();
        }
    }

    tekiou();

    actable = 1;
}
async function cardMelt(cam, card){
    //cardMelt == カードをmeltに移動する
    //つまるところcardMelt使う前にcardsから消えてるんだから、cardをcardMeltにpushするだけの動き

    if(card.melted.length != 0){
        let results = [];
        card.melted.forEach(thing => async function(){
            let [functionName, ...args] = thing;
            let result = await executions[functionName](...args);
            results.push(result);
        })
    }

    humans[cam].melt.push(card);
}

async function battleStart(){
    turn = 0;
    round = 0;
    
    let dealer = decideDealerName();
    humans['dealer'] = {};
    Object.keys(dealer).forEach(key => {
        humans['dealer'][key] = dealer[key]
    })

    humans['player'].deck = arrayShuffle(humans['player'].deck);
    dealer.deck = arrayShuffle(dealer.deck);

    addtext(`${dealer.name}「${Dealers[dealer.name].opening}」`);
    
    reset();
}

function decideDealerName(){
    //一応
    document.querySelector('#cardPlaces .dealer').innerHTML = '';
    let names = Object.keys(Dealers).filter(a => Dealers[a].stage == stage).map(a => Dealers[a].name);
    let dealername = arraySelect(names);
    let nameData = Dealers[dealername];
    
    let dealer = {
        cam: 'dealer',
        id: dealername,
        name: dealername,
        value: 0,
        cards: [],
        deck: [],
        melt: [],
        standed: 0,
        atk: 0,
        def: 0,
        shl: 0,
        hp: nameData.maxhp,
        maxhp: nameData.maxhp,
        buffs: [],
    };

    humans['dealer'].deck = [];
    deckKinds[nameData.deckKind].deck.forEach(card => {
        cardBecome('dealer', 'deck', card);
    })
    dealer.deck = humans['dealer'].deck

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
    

    return dealer;
}

deckKinds['normal'].deck.forEach(card => {
    cardBecome('player', 'deck', card)
})

cardBecome('player', 'deck', ['wheel of fourtune','♡']);
cardBecome('player', 'deck', ['strength', '♧']);
cardBecome('player', 'deck', ['emperor', '♢']);
cardBecome('player', 'deck', ['empress', '♢']);
cardBecome('player', 'deck', ['justice', '♤']);
cardBecome('player', 'deck', ['hermit', '♡']);


//一旦のやつ
battleStart();