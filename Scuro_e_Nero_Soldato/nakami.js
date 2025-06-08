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
    speed = 2;
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
        cam: 'player',
        id: 'player',
        name: 'player',
        value: 0,
        cards: [],
        deck: [],
        melt: [],
        standed: 0,
        atk: 0,
        def: 0,
        shl: 0,
        hp: 40,
        maxhp: 40,
        buffs: [],
    },
    dealer:{
        cam: 'dealer',
        id: 'コッペ', //dealername
        name: 'コッペ', //dealername
        value: 0,
        cards: [],
        deck: [],
        melt: [],
        standed: 0,
        atk: 0,
        def: 0,
        shl: 0,
        hp: 1, //nameData.maxhp
        maxhp: 1, //nameData.maxhp
        buffs: [],
    }
}

function cocGacha(fixRare = 0){
    let list = Object.keys(Friends).map(a => Friends[a]);
    
    let p3 = 3, p2 = 17, p1 = 80;
    if(probability(7) && !fixRare){
        // console.log('確変！！！！！');
        p3 = 6, p2 = 24, p1 = 70;
    }
    
    let rare = arrayGacha([3,2,1],[p3,p2,p1]);
    if(fixRare){
        // console.log(`☆${fixRare}確定チケットを消費しました！`);
        rare = fixRare;
    };

    let narrowed = list.filter(a => a.rare == rare);

    let friend = arraySelect(narrowed);

    return `${friend.name}(☆${rare})`;
}
function re(cam){
    let res = cam == 'player' ? 'dealer' : 'player';
    return res;
}
function camS(card, code){
    let cam = '';
    switch(code){
        case 'me': cam = card.cam; break;
        case 'yo': cam = re(card.cam); break;
        case 'rn': cam = arraySelect(['player', 'dealer']); break;
        default: cam = code;
    }
    
    return cam;
}
function trans(card, arr){
    for(let i = 0; i < arr.length; i++){
        switch(arr[i]){
            case 'me':
            case 'yo':
            case 'rn':{
                arr[i] = camS(card, arr[i]);
                break;
            };
            case 'this':{
                arr[i] = card;
                break;
            };
            case 'me_fast':
            case 'yo_fast':
            case 'rn_fast':{
                let cam = camS(card, arr[i].substring(0, 2));
                arr[i] = humans[cam].cards[0];
                break;
            }
            case 'me_last':
            case 'yo_last':
            case 'rn_last':{
                let cam = camS(card, arr[i].substring(0, 2));
                arr[i] = humans[cam].cards[humans[cam].cards.length - 1];
                break;
            }
            case 'me_val':
            case 'yo_val':
            case 'rn_val':{
                let cam = camS(card, arr[i].substring(0, 2));
                arr[i] = humans[cam].value;
                break;
            };
        }
        
    }
    return arr;
}

let coin = 0;

let floor = 1;
let stage = 1; //訳: 1-1
let battle = 1; //if バトル中(バトル中かどうか)
let round = 1;
let turn = 1;

let piano = 0;  

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

        //deck/melt内の要素への番号振り(意味あるかは不明)
        for(let i = 0; i < human.deck.length; i++){human.deck[i].id = i; human.deck[i].cam = cam;}
        for(let i = 0; i < human.melt.length; i++){human.melt[i].id = i; human.melt[i].cam = cam;}
        for(let i = 0; i < human.cards.length; i++){human.cards[i].id = i; human.cards[i].cam = cam;}

        //DOMの方も
        let placeDOM = document.querySelector(`#cardPlaces .${cam}`);
        let children = Array.from(placeDOM.children);
        children.forEach((c,i) => {
            let ko = humans[cam].cards[i]
            if(!ko)return;
            c.setAttribute('data-id', i)
            c.setAttribute('data-description', `
                "${ko.name}" (suit:${ko.suit}) (id:${ko.id} cam:${ko.cam})<br>
                value:${ko.value} (prop:[${ko.prop}])<br>
                attend:[${ko.attend}]<br>
                melted:[${ko.melted}]<br>
                elseed:[${ko.elseed}]
            `)
        });
    });
    
    //#region playerのその他の要素のtekiou
    let elseInfo = document.querySelector("#else .info");
    elseInfo.innerHTML = '';
    
    let row1 = document.createElement("div");
    row1.className = "row";
    
    let deckDivpre = document.createElement("div");
    deckDivpre.className = "item deck";
    deckDivpre.dataset.type = 'deck';
    deckDivpre.textContent = `Deck: ${humans['player'].deck.length}`;
    deckDivpre.addEventListener("click", function(){
        DecksShow('deck');
    });
    row1.appendChild(deckDivpre);
    
    let meltDivpre = document.createElement("div"); //めーると とけてしまいそう〜〜〜〜
    meltDivpre.className = "item melt";
    meltDivpre.dataset.type = 'melt';
    meltDivpre.textContent = `Melt: ${humans['player'].melt.length}`;
    meltDivpre.addEventListener("click", function(){
        DecksShow('melt');   
    })
    row1.appendChild(meltDivpre);
    
    elseInfo.appendChild(row1);
    
    let row2 = document.createElement("div");
    row2.className = "row";

    let coinDivpre = document.createElement("div");
    coinDivpre.className = "item coin";
    coinDivpre.textContent = `Coin: ${coin}`;
    row2.appendChild(coinDivpre);
    
    let pianoDivpre = document.createElement("div");
    pianoDivpre.className = "item piano";
    pianoDivpre.textContent = `Piano: ${piano}`;
    row2.appendChild(pianoDivpre);
    
    elseInfo.appendChild(row2);

    let upperEngine = document.createElement('div');
    upperEngine.className = 'upper';

    let turnDivpre = document.createElement("div");
    turnDivpre.className = "item turn";
    turnDivpre.textContent = `Turn: ${turn}`;
    upperEngine.appendChild(turnDivpre);

    let spadaDivpre = document.createElement("div");
    spadaDivpre.className = "item spada";
    spadaDivpre.textContent = `Spada: ${spada}`;
    upperEngine.appendChild(spadaDivpre);
    
    let roundDivpre = document.createElement("div");
    roundDivpre.className = "item round";
    roundDivpre.textContent = `Round: ${round}`;
    upperEngine.appendChild(roundDivpre);
    
    elseInfo.appendChild(upperEngine);

    //#endregion
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

        suitsDiv.appendChild(cardDiv);
    });

    return suitsDiv;
}
document.addEventListener("click", function (e) {
    // すでに拡大してるカードがあるなら閉じるだけで終わり
    if(document.querySelector('.card.active') && !e.target.closest('.card')) {
        resetCard();
        return;
    }else if(document.querySelector('.card.active') && e.target.closest('.card')){
        return;
    }

    // 拡大カードもない == deck/meltを閉じたい
    if(e.target.closest('#upperLayer .deck') && deckDiv.style.display == 'flex' || e.target.closest('#upperLayer .melt') && meltDiv.style.display == 'flex' && !e.target.closest('.card')) {
        deckDiv.style.display = 'none';
        deckDiv.style.pointerEvents = 'none';
        meltDiv.style.display = 'none';
        meltDiv.style.pointerEvents = 'none';
        detailDiv.style.display = 'none';
    }
});
function zoomCard(event, card, cardDiv) {
    // document.querySelectorAll('.places').forEach(pa => {pa.style.overflowY = 'visible';});

    if (cardDiv.classList.contains("active") && !cardDiv.classList.contains("flipped")) {
        cardDiv.classList.add("flipped");
        return;
    } else if (cardDiv.classList.contains("flipped")) {
        cardDiv.classList.remove("flipped");
        return;
    }

    resetCard();
    
    cardDiv.classList.add("active");

    event.stopPropagation();
}

function resetCard() {
    document.querySelectorAll('.card.active').forEach(c => {
        c.classList.remove("active", "flipped");
        // document.querySelectorAll('.places').forEach(pa => {pa.style.overflowY = '';});
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

//カードをdeck/melt/cardsに入れる(だけ～ 歩いて～走って～ 日の光浴びながぁら～〜～～)
async function cardAdd(cam, type, card){
    humans[cam][type].push(card);

    return card
}

//カードをデッキから引く
async function cardDraw(cam, name = null, suit = null, prop, attend, melted, elseed){
    let deck = humans[cam].deck;
    if(deck.length === 0) return 'none'; //訳:ないぜ

    let card = null;
    if(name != null && suit != null){
        card = cardMold(name, suit, prop, attend, melted, elseed)
        console.log('オーダー織田「カード作っといたわ笑」', `['${name}','${suit}']`);
    }else{
        card = deck.shift();
    }

    cardAdd(cam, 'cards', card)

    let cardDiv = cardMake(card);
    await cardAPlace(cam, cardDiv)

    tekiou();


    let isburst = await isBurst(cam);
    if(isburst) return 1;

    let res = await hasAttend(card);
    if(res) return 1;

    return 0
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

    newCard.addEventListener("click", (event) => zoomCard(event, card, newCard));
    
    return newCard;
}

function searchDomCard(cam, id){
    placeDOM = document.querySelector(`#cardPlaces .${cam}`)
    children = Array.from(placeDOM.children);

    return children[id]
}

//Divになっているカードを置き場からメルトに置く動き
async function cardMelt(cam, card, without, edOccur){
    if(cam == 'all'){
        await allMelt();
        return;
    }else{
        cam = camS(card, cam);
    }

    let raison = humans[cam].cards.indexOf(card);
    let ran1 = random(1, 10), ran2 = random(0, 9);
    // console.log(raison < 0 ? `${cocGacha()}「${ran1}${raison}は${ran2}やで${ran2 + 1 == ran1 ? '(奇跡)' : ''}」` : `${cocGacha()}「${raison}..まあ1000の位で四捨五入したら0か」`);
    if(raison >= 0){
        // console.log('消し去って！青と白のセッション 太陽さんなら怖くな〜い');
        humans[cam].cards.splice(humans[cam].cards.indexOf(card), 1);
    }

    cardAdd(cam, 'melt', card)
    
    let cardDiv = searchDomCard(cam, card.id);
    
    let res = edOccur ? await hasMelted(card) : 0;
    if(res) return 1;
    
    if(!without) await cardAMelting(cam, cardDiv);
};

//カードを相手の場に送ったりする動き
async function cardSend(cam, card){
    if(cam == 'all'){
        //await allSend();
        console.error('まだないぜ〜〜')
        return;
    }else{
        cam = camS(card, cam);
    }

    let cardDiv = searchDomCard(cam, card.id);
    await cardASending(cam, cardDiv);

    cardAdd(cam, 'cards', card)
    cardMelt(cam, card, 1, 1);

    return 0
}

//カードを相手と交換する動き
async function cardTrade(cam, card){
    if(cam == 'all'){
        await cardASwap();

        let temp = humans.player.cards;
        humans.player.cards = humans.dealer.cards;
        humans.dealer.cards = temp;

        return 0;
    }
}

//#region Divになったカードを動かす"A"達
async function cardAPlace(cam, cardDiv){
    document.querySelector(`#cardPlaces .${cam}`).appendChild(cardDiv);
    
    let fromRect = null;
    if(cam == 'player') fromRect = document.querySelector('#else .info .deck').getBoundingClientRect();
    if(cam == 'dealer') fromRect = document.querySelector('#else .info .spada').getBoundingClientRect();
    
    let toRect = cardDiv.getBoundingClientRect();
    
    let cloneKun = cardDiv.cloneNode(true);
    cloneKun.classList.add('clone')
    cloneKun.style.left = `${fromRect.left + window.scrollX}px`;
    cloneKun.style.top = `${fromRect.top + window.scrollY}px`;
    cloneKun.style.width = `${toRect.width}px`;
    cloneKun.style.height = `${toRect.height}px`;
    cloneKun.style.transition = 'left 0.5s ease, top 0.5s ease';

    document.body.appendChild(cloneKun);

    cardDiv.classList.add('invisibility')
    
    // console.log(`${fromRect.left}, ${fromRect.top} => ${toRect.left}, ${toRect.top}`)

    requestAnimationFrame(() => {
        cloneKun.style.left = `${toRect.left + window.scrollX}px`;
        cloneKun.style.top = `${toRect.top + window.scrollY}px`;
    });
    
    await delay(500)

    cloneKun.remove();
    cardDiv.classList.remove('invisibility');

    return 1;
}
async function cardAMelting(cam, cardDiv){
    let fromRect = cardDiv.getBoundingClientRect();
    
    let toRect = null;
    if(cam == 'player') toRect = document.querySelector('#else .info .melt').getBoundingClientRect();
    if(cam == 'dealer') toRect = document.querySelector('#else .info .spada').getBoundingClientRect();

    let rare = arrayGacha(['ま、嘘なんですけどね','ねずっちでもあります！！！！！',''],[3,17,80]);
    // console.log(cam+'です！！！！' + rare)
    if(rare == 'ま、嘘なんですけどね') console.log(`${cocGacha(3)}「酒飲みてぇ～」`);

    let cloneKun = cardDiv.cloneNode(true);
    cloneKun.classList.add('clone');
    cloneKun.style.left = `${fromRect.left + window.scrollX}px`;
    cloneKun.style.top = `${fromRect.top + window.scrollY}px`;
    cloneKun.style.width = `${fromRect.width}px`;
    cloneKun.style.height = `${fromRect.height}px`;

    document.body.appendChild(cloneKun);

    cardDiv.classList.add('invisibility')
    
    // console.log(`${fromRect.left}, ${fromRect.top} => ${toRect.left}, ${toRect.top}`)

    requestAnimationFrame(() => {
        cloneKun.style.left = `${toRect.left + window.scrollX}px`;
        cloneKun.style.top = `${toRect.top + window.scrollY}px`;
    });

    await delay(500)
    
    cloneKun.remove();
    cardDiv.remove();
}
async function cardASwap() {
    const playerDOM = document.querySelector('#cardPlaces .player');
    const dealerDOM = document.querySelector('#cardPlaces .dealer');

    const playerRect = playerDOM.getBoundingClientRect();
    const dealerRect = dealerDOM.getBoundingClientRect();

    let pLeft = playerRect.left;
    let pTop = playerRect.top;
    let dLeft = dealerRect.left;
    let dTop = dealerRect.top;

    let pClone = playerDOM.cloneNode(true);
     pClone.classList.add('clone');
    let dClone = dealerDOM.cloneNode(true);
     dClone.classList.add('clone');


    pClone.style.left = `${pLeft - 15}px`;
    pClone.style.top = `${pTop - 15}px`;
    dClone.style.left = `${dLeft - 15}px`;
    dClone.style.top = `${dTop - 15}px`;

    playerDOM.classList.add('invisibility');
    dealerDOM.classList.add('invisibility');

    document.querySelector('#cardPlaces').appendChild(pClone);
    document.querySelector('#cardPlaces').appendChild(dClone);

    await delay(200);
    
    requestAnimationFrame(() => {
        pClone.style.left = `${dLeft -15}px`;
        pClone.style.top = `${dTop -15}px`;
        dClone.style.left = `${pLeft -15}px`;
        dClone.style.top = `${pTop -15}px`;
    });

    await delay(800);

    let pChild = Array.from(playerDOM.children);
    let dChild = Array.from(dealerDOM.children);


    playerDOM.innerHTML = '';
    dealerDOM.innerHTML = '';

    await delay(50);

    // pChild.forEach(child => dealerDOM.appendChild(child));
    // dChild.forEach(child => playerDOM.appendChild(child));
    //forで(forEachは変？)
    for(let i = 0; i < pChild.length; i++){
        dealerDOM.appendChild(pChild[i]);
    }
    for(let i = 0; i < dChild.length; i++){
        playerDOM.appendChild(dChild[i]);
    }

    pClone.remove();
    dClone.remove();

    playerDOM.classList.remove('invisibility');
    dealerDOM.classList.remove('invisibility');

    return 1;
}
async function cardAJump(cardDiv){
    let fromRect = cardDiv.getBoundingClientRect();

    let cloneKun = cardDiv.cloneNode(true);
    cloneKun.classList.add('clone');
    cloneKun.style.left = `${fromRect.left + window.scrollX}px`;
    cloneKun.style.top = `${fromRect.top + window.scrollY}px`;
    cloneKun.style.width = `${fromRect.width - 8}px`;
    cloneKun.style.height = `${fromRect.height - 8}px`;

    document.body.appendChild(cloneKun);

    cardDiv.classList.add('invisibility')
    
    // console.log(`${fromRect.left}, ${fromRect.top} => ${toRect.left}, ${toRect.top}`)

    cloneKun.transition = 'left 0.4s ease, top 0.4s ease';

    requestAnimationFrame(() => {
        cloneKun.style.left = `${fromRect.left + window.scrollX}px`;
        cloneKun.style.top = `${fromRect.top - 50 + window.scrollY}px`;
    });
    await delay(400)

    requestAnimationFrame(() => {
        cloneKun.style.left = `${fromRect.left + window.scrollX}px`;
        cloneKun.style.top = `${fromRect.top + window.scrollY}px`;
    })
    await delay(400)
    
    cloneKun.remove();
    cardDiv.classList.remove('invisibility');
}
async function cardAQuake(cardDiv){
    let fromRect = cardDiv.getBoundingClientRect();

    let cloneKun = cardDiv.cloneNode(true);
    cloneKun.classList.add('clone');
    cloneKun.style.left = `${fromRect.left + window.scrollX}px`;
    cloneKun.style.top = `${fromRect.top + window.scrollY}px`;
    cloneKun.style.width = `${fromRect.width - 8}px`;
    cloneKun.style.height = `${fromRect.height - 8}px`;

    document.body.appendChild(cloneKun);

    cardDiv.classList.add('invisibility')
    
    // console.log(`${fromRect.left}, ${fromRect.top} => ${toRect.left}, ${toRect.top}`)

    cloneKun.transition = 'all 0.2s ease';

    requestAnimationFrame(() => {
        cloneKun.style.left = `${fromRect.left - 20 + window.scrollX}px`;
    });
    await delay(200)

    requestAnimationFrame(() => {
        cloneKun.style.left = `${fromRect.left + 20 + window.scrollX}px`;
    })
    await delay(200)

    requestAnimationFrame(() => {
        cloneKun.style.left = `${fromRect.left -20 + window.scrollX}px`;
    })
    await delay(200)

    cloneKun.transition = 'all 0.1s ease';

    requestAnimationFrame(() => {
        cloneKun.style.left = `${fromRect.left + window.scrollX}px`;
    })
    await delay(200)
    
    cloneKun.remove();
    cardDiv.classList.remove('invisibility');
}
//#endregion

//#region プレイヤーの操作s
let hitButton = document.querySelector("#buttons .hit");
let standButton = document.querySelector("#buttons .stand");

hitButton.addEventListener("click", async function (){
    if(!actable) return;
    actable = 0;
    waitButton();

    let player = humans['player'];
    let dealer = humans['dealer'];
    if(!player.standed){
        let res = await cardDraw('player');
        if(res) return 1;

        if(!dealer.standed){
            res = await cardDraw('dealer');
            if(res) return 1;

            if(dealer.value >= 17) res = await stand('dealer');
            if(res) return 1;
        }
    }

    turn += 1;

    actable = 1;
    resetButton();
});


standButton.addEventListener("click", async function (){
    if(!actable) return;
    actable = 0;
    waitButton();

    let player = humans['player'];
    let dealer = humans['dealer'];

    let res = await stand('player');
    if(res)return;

    await delay(1000);

    if(!dealer.standed){
        do{
            let res = await cardDraw('dealer');
            await delay(750);
            turn += 1;
            
            if(res) return 1
        }while(humans["dealer"].value < 17);

        let res = await stand('dealer');
        if(res)return;
    }

    await delay(1000);

    //result
    results()
});
//#endregion
//#region Attributoのやつ
function hasProp(card, name){
    let attributi = card.prop;
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

async function hasAttend(card){
    let attributi = card.attend;

    if(attributi.length <= 0) return 0;

    for(let a of attributi){
        console.log(`${cocGacha()}「あってんど..うアリスってね〜〜？？」`)
        await delay(1000);
        a = trans(card, a);
        let res = await execute(a);
        if(res) return 1;
    }

    return 0;
}
async function hasMelted(card){
    let attributi = card.melted;
    

    if(attributi.length <= 0) return 0;

    for (const a of attributi){
        console.log(`${cocGacha()}「メ〜ルト 熔けてしまいそう〜〜〜」`);
        await delay(1000);
        a = trans(card, a);
        await execute(a);
    }

    return 0;
}
async function hasElseed(card, event){
    let attributi = card.elseed;

    //elseed:[[['endRound'],['buffAdd','me','power-up',1,1]]],

    if(attributi.length <= 0) return 0;

    for(let a of attributi){
        console.log(`「条件文:[${a[0]}] 実行文:[${a[1]}]」`)
        a[0] = trans(card, a[0]);
        if(checkElseed(a[0], event)){
            console.log(`${cocGacha()}「お前誰？」`)
            await delay(1000);
            a[1] = trans(card, a[1]);
            console.log(a)
            let res = await execute(a[1]);
            // tekiou();
            console.log(res)
            if(res) return 1;
        };
    };

    return 0;
}

function checkElseed(arr, event){
    if(arr[0] != event) return 0;

    let checkList = {bursted, endRound};
    function checkExecute(arr){
        let [functionName, ...args] = arr;
        if(!checkList[functionName]) console.error(`${event}はcheckListに存在しないぜ〜〜〜`);
        return checkList[functionName](...args);
    }
    
    function bursted(cam){
        if(humans[cam].value > spada) return 1;
        return 0;
    }
    function endRound(){
        return 1;
    }

    return checkExecute(arr);
};

async function letsElseed(event){
    let queue = ['player','dealer'];
    
    for(let cam of queue){
        for(let card of humans[cam].cards){
            let res = await hasElseed(card, event);
            if(res) return 1;
        }
    }
}

async function executeAttributo(card, type, name){
    let attributi = card[type];
    let attributo = attributi.find(a => a[0] == name);

    await execute(attributo);

    return 1;
}

let executions = {cardDraw, cardMelt, cardTrade, cardSend, results, buffAdd, damage, heal}
async function execute(arr){
    let [functionName, ...args] = arr;
    if(!executions[functionName]) console.error(`${functionName}はcheckListに存在しないぜ〜〜〜`);
    let res = await executions[functionName](...args);

    return res;
}
//#endregion

async function stand(cam){
    humans[cam].standed = 1;

    let code = cam == 'player' ? 'P' : 'D';
    let standeden = document.createElement('div');
    standeden.className = 'standeden';
    let standedenImg = document.createElement('img');
    standedenImg.src = `assets/systems/standed${code}.png`;
    standedenImg.alt = 'standeden(すたんででん)';
    standeden.appendChild(standedenImg);
    document.querySelector(`#UIs .${cam} .health`).appendChild(standeden);

    let res = await letsElseed('standed');
    if(res) return 1;

    return 0;
}
async function isBurst(cam){
    let human = humans[cam];

    tekiou();

    // if(human.value > spada)console.log(`dealer:${humans.dealer.value} vs player:${humans.player.value}`);
    if(human.value > spada){
        console.log(`${cam}:「burstしたぜぇ」`)
        //when burst, suddenly lose

        let res = await letsElseed('bursted');
        if(res) return 0;
        if(human.value <= spada){
            console.log('って、変わっとるやないか〜い！')
            return 0;
        }
        //console.log(`☆ dealer:${humans.dealer.value} vs player:${humans.player.value} ☆`);

        tekiou();
        
        console.log(`${cam}:「ワイルドだろぉ？」`)
        human.standed = 1;

        //おそらくスレンダーマン的な、別の場所で同時に二つの動きが進行している感じになってる。どーにかしといて

        results('burst', cam);
        return 1
    }else{
        return 0
    }
}

async function results(code = 'none', o = 0){ //o = 目的語
    let player = humans["player"];
    let dealer = humans["dealer"];
    
    player.standed = 1;
    dealer.standed = 1;

    tekiou();
    console.log(`dealer:${dealer.value} player:${player.value}`);

    await letsElseed('endRound');

    let res = 1;
    console.log(`${cocGacha()}「${code}だよ」`)
    switch(code){       
        case 'none':{
            let difference = player.value - dealer.value;
            if(difference > 0) res = await damage('dealer', difference)
            else if(difference < 0) res = await damage('player', -difference)
            else res = await damage(0, 0);
            break;
        };
        case 'burst':{
            let attackerCam = o == 'player' ? 'dealer' : 'player';
            res = await damage(o, humans[attackerCam].value);
            break;
        };
        case 'emperor': {
            let diff = humans[o].value - humans[re(o)].value;
            if (diff > 0) {
                //負けててもその差で殴る。勝ってたらそのままダメ
                res = await damage(re(o), diff);
            } else {
                res = await damage(re(o), -diff);
            }
            break;
        }
        case 'death': {
            let diff = humans[o].value - humans[re(o)].value;
            if(diff > 0){
                //勝ってても、その差で自分が殴られる。負けてたら0ダメ。
                res = await damage(o, diff);
            }else{
                res = await damage(o, -diff);
            }
            break;
        }
    }

    
    if(!res) reset(); //もし"死んでいない"ならば、続行(reset) ここだけ!resですまない
}


//ステータスを増減させるやつ increase/decreaseのindec
async function buffAdd(cam, buff, val, time){
    let human = humans[cam];
    
    let buffData = Buffs[buff];
    switch(buffData.kind){
        case 'stack':{
            let resentBuff = human.buffs.find(a => a.name == buff);
            if(resentBuff){
                resentBuff.value += val;
            }else{
                let newbuff = {
                    name: buff,
                    effects: {[buffData.prop]: buffData.rate * val},
                    time: val, //時間 == stack数
                }
                human.buffs.push(newbuff);
            }
        };
        case 'turn':{
            let valuen = buffData.type == 'freely' ? {[buffData.prop]: val} : buffData.lves[val];
            let newbuff = {
                name: buff,
                effects: valuen,
                time: time,
            }
            human.buffs.push(newbuff);
            break;
        };
    }
}

async function damage(cam, dmg){
    if(!cam) return 0;
    let attacker = humans[cam == 'player' ? 'dealer' : 'player'];
    let defender = humans[cam];
    let motoHP = defender.hp;

    //加算(attacker)
    let power = 1; //倍率 *power みたいに使うから初期値は1
    let attack = 0; //加算分
    attacker.buffs.forEach(buff => {
        Object.keys(buff.effects).forEach(effect => {
            switch(effect){
                case 'power':
                    // console.log(buff, effect, buff.effects[effect].value);
                    power += buff.effects[effect];
                    break;
                case 'attack':
                    attack += buff.effects[effect];
                    break;
            }
        })
    })

    //減算(defender)
    let suffer = 1; //被ダメ率、みたいなもん
    let defense = 0; //基礎控除みたいなもん
    defender.buffs.forEach(buff => {
        Object.keys(buff.effects).forEach(effect => {
            switch(effect){
                case 'suffer':
                    suffer += buff.effects[effect];
                    break;
                case 'defense':
                    defense += buff.effects[effect];
                    break;
            }
        });
    });

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

    console.log(`${attacker.name} => ${defender.name} | ${motoHP} => ${defender.hp}`);

    if(defender.hp < 0) defender.hp = 0;

    tekiou();

    if(humans['player'].hp == 0){
        outcome('dealer');
        return 1;
    };

    if(humans['dealer'].hp == 0){
        outcome('player');
        return 1;
    };
    
    return 0; //どちらかが死んだならば処理を停止するため0を、そうでなければ1をお返し申す
}

async function heal(cam, dmg){
    if(!cam) return 0;

    let defender = humans[cam];
    
    defender.hp += dmg;

    if(defender.hp > defender.maxhp) defender.hp = defender.maxhp;

    if(defender.hp <= 0){
        defender.hp = 1;
        console.error(`${defender.name}「なんか知らんけど死にかけたぜ。バグの恐れがあるから要チェックだ！！」`)
    };
    
    addlog(`${defender.name}を${dmg}回復した！！`);

    tekiou();

    return 0;
}

//負け/勝ちのセリフの表示、次のバトルへ
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


//#region debug
let debugMenu = document.querySelector("#debug .menu");
let debugDiv = document.querySelector('#debug .div');
let debugging = 0;
document.addEventListener("keydown", (e) =>{
    if(e.key == 'h'){
        if(debugging){
            debugging = 0;
            NicoNicoText('debug off');
        }else{
            debugging = 1;
            NicoNicoText('debug on');
        }
    }else if(e.key == "g"){
        if(debugMenu.style.display == 'block'){
            debugMenu.style.display = 'none';
        }else{
            debugMenu.style.display = 'block';
        }
    }
});

document.addEventListener('mousemove', (e) => {
    debugDiv.style.left = `${e.clientX + 10}px`;
    debugDiv.style.top = `${e.clientY + 10}px`;
});
document.addEventListener('mouseover', (e) => {
    if (!debugging) return;

    const descTarget = e.target.closest('[data-description]');
    if (descTarget) {
        const desc = descTarget.dataset.description;
        debugDiv.innerHTML = desc;
        debugDiv.style.display = 'block';
    }
});
document.addEventListener('mouseout', (e) => {
    if (!debugging) return;

    const descTarget = e.target.closest('[data-description]');
    if (descTarget) {
        debugDiv.innerHTML = '';
        debugDiv.style.display = 'none';
    }
});


debugMenu.addEventListener('mousedown', (e) => {
    offsetX = e.clientX - debugMenu.getBoundingClientRect().left;
    offsetY = e.clientY - debugMenu.getBoundingClientRect().top;
    
    function onMouseMove(e) {
        debugMenu.style.left = `${e.clientX - offsetX}px`;
        debugMenu.style.top = `${e.clientY - offsetY}px`;
    }

    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    // ドラッグ中のイベントリスナーを追加
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});


let DMcam = debugMenu.querySelector('.cam');
let DMtekiou = debugMenu.querySelector('.tekiou');
let DMdrawCard = debugMenu.querySelector('.draw');
let DMdrawCard_name = debugMenu.querySelector('.draw-name');
let DMdrawCard_suit = debugMenu.querySelector('.draw-suit');
let DMdrawCard_prop = debugMenu.querySelector('.draw-prop');
let DMdrawCard_attend = debugMenu.querySelector('.draw-attend');
let DMdrawCard_melted = debugMenu.querySelector('.draw-melted');
let DMdrawCard_elseed = debugMenu.querySelector('.draw-elseed');
let DMmeltCard = debugMenu.querySelector('.melt');
let DMmeltCard_id = debugMenu.querySelector('.melt-id');
let DMaCard = debugMenu.querySelector('.a');
let DMaCard_id = debugMenu.querySelector('.a-id');
let DMaCard_name = debugMenu.querySelector('.a-name');


Object.keys(Cards).forEach(name => {
    DMdrawCard_name.options.add(new Option(name, name));
})

DMtekiou.addEventListener('click', () => {
    tekiou();
})

DMdrawCard.addEventListener('click', () => {
    let Dcam = DMcam.value;
    let Dname = DMdrawCard_name.value;
    let Dsuit = DMdrawCard_suit.value;

    if(!Dname || !Dsuit) return;

    let Dprop = DMdrawCard_prop.value == '' ? undefined : DMdrawCard_prop.value;
    let Dattend = DMdrawCard_attend.value == '' ? undefined : DMdrawCard_attend.value;
    let Dmelted = DMdrawCard_melted.value == '' ? undefined : DMdrawCard_melted.value;
    let Delseed = DMdrawCard_elseed.value == '' ? undefined : DMdrawCard_elseed.value;

    cardDraw(Dcam, Dname, Dsuit, Dprop, Dattend, Dmelted, Delseed);
    tekiou();
})
DMmeltCard.addEventListener('click', () => {
    let Dcam = DMcam.value;
    let Did = DMmeltCard_id.value;

    cardMelt(Dcam, humans[Dcam].cards[Did]);
    tekiou();
})
DMaCard.addEventListener('click', () => {
    let Dcam = DMcam.value;
    let Did = DMaCard_id.value;
    
    let animations = {cardAJump,cardAQuake}
    animations[DMaCard_name.value](searchDomCard(Dcam, Did));
})
//#endregion


function waitButton(){
    hitButton.classList.add("wait");
    standButton.classList.add("wait");
}
function resetButton(){
    hitButton.classList.remove("wait");
    standButton.classList.remove("wait");
    tekiou();
}
async function reset() {
    let player = humans["player"];
    let dealer = humans["dealer"];

    player.standed = 0;
    dealer.standed = 0;
    document.querySelectorAll('.standeden').forEach(a => a.remove());

    await allMelt();

    tekiou();
    
    turn = 1;
    round += 1;
    actable = 1;
    resetButton();
}
async function allMelt(){
    for (let cam of ['player', 'dealer']) {
        let DOM = document.querySelector(`#cardPlaces .${cam}`);
    
        let meltingTasks = [];
    
        let i = 0;
        while (humans[cam].cards.length > 0) {
            const card = humans[cam].cards.shift(); // 先頭から1枚ずつ
            if (hasProp(card, 'vanish') == 0) {
                await cardMelt(cam, card, 1);
            }

            meltingTasks.push(cardAMelting(cam, DOM.children[i]));

            i++;
        }

        await Promise.all([...meltingTasks]);
    }
}

async function battleStart(){
    turn = 1;
    round = 1;

    kariNokills += 1;
    
    let player = humans['player'];
    let dealer = decideDealerName();
    // humans['dealer'] = {};
    // Object.keys(dealer).forEach(key => {
    //     humans['dealer'][key] = dealer[key]
    // })

    

    player.deck = arrayShuffle(player.deck);
    dealer.deck = arrayShuffle(dealer.deck);

    addtext(`${dealer.name}「${Dealers[dealer.name].opening}」`);
    
    reset();
}

let kariNokarine = [1,2,4,7,11,16,22,29]
let kariNokills = 0;
function decideDealerName(){
    //一応
    document.querySelector('#cardPlaces .dealer').innerHTML = '';
    let names = Object.keys(Dealers).filter(a => Dealers[a].stage == stage).map(a => Dealers[a].name);
    let dealername = arraySelect(names);
    let nameData = Dealers[dealername];

    let kariMaxhp = kariNokarine[kariNokills-1];
    if(kariNokills > 8) kariMaxhp = random(1, 30);
    
    humans['dealer'] = {
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
        hp: kariMaxhp, //nameData.maxhp
        maxhp: kariMaxhp, //nameData.maxhp
        buffs: [],
    };

    rentalDecks[nameData.deckKind].deck.forEach(card => {
        cardBecome('dealer', 'deck', card);
    })



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
    

    return humans['dealer'];
}

//雑々デッキ作成
rentalDecks['normal'].deck.forEach(card => {
    cardBecome('player', 'deck', card)
})
cardBecome('player', 'deck', ['wheel of fourtune','♡']);
cardBecome('player', 'deck', ['strength', '♧']);
cardBecome('player', 'deck', ['emperor', '♢']);
cardBecome('player', 'deck', ['empress', '♢']);
cardBecome('player', 'deck', ['justice', '♤']);
cardBecome('player', 'deck', ['hermit', '♡']);
cardBecome('player', 'deck', ['fool', '♧']);
cardBecome('player', 'deck', ['death', '♤']);



//一旦のやつ
battleStart();

