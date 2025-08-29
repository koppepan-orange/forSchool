//#region komagome
function delay(ms){
    return new Promise(resolve=>setTimeout(resolve,ms));
};
async function nicoText(mes){
    const newDiv = document.createElement('div');
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
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
function arraySize(array){
    let res = new Set(array).size;
    return res;
};
function arrayCount(array){
    const counts = {};
    for (let value of array) {
        counts[value] = (counts[value] || 0) + 1;
    }
    return counts;
}
function arrayMult(array){
    return array.reduce((a, v) => a * v, 1);
}
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
    window.open('about:blank', '_self').close();
}
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
        if(rawtext[i] == "*" && rawtext[i + 1] == "*"){
            isRed = !isRed; // 状態を切り替える
            i++; // 次の * をスキップ
        }else if(rawtext[i] == "&" && rawtext[i + 1] == "&"){
            isPink = !isPink;
            i++; // 次の & をスキップ
        }else if(rawtext[i] == "^" && rawtext[i + 1] == "^"){
            isBlue = !isBlue;
            i++;
        }else{
            let color = null;
            if(isRed) color = 'red';
            if(isPink) color = 'pink';
            if(isBlue) color = 'blue';
            text.push({
                char: rawtext[i],
                color: color
            });
        }
    }
    return text;
}

// ↓一瞬これにしようとしてた
// if(textShowing){
//     queueAddtext.push(text);
//     while(textShowing){
//         await delay(10);
//     }
// };

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
    console.log(`${raw}を送信します`);
    console.log(`残り: (${len - 1})[${queueAddtext}]`);
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
    if(event.key === 'z' || event.key === 'Enter'){
        skipText = true;
    }
});

document.addEventListener('keyup', (event) => {
    if(event.key === 'z' || event.key === 'Enter'){
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
//#region description
let movableDescription = document.getElementById('movableDescription');
document.addEventListener('mousemove', (e) => {
    movableDescription.style.left = `${e.clientX + 10}px`;
    movableDescription.style.top = `${e.clientY + 10}px`;
});
document.addEventListener('mouseover', (e) => {
    const descTarget = e.target.closest('[data-description]');
    if (descTarget) {
        const desc = descTarget.dataset.description;
        movableDescription.innerHTML = desc;
        movableDescription.style.display = 'block';
    }
});
document.addEventListener('mouseout', (e) => {
    const descTarget = e.target.closest('[data-description]');
    if (descTarget) {
        movableDescription.innerHTML = '';
        movableDescription.style.display = 'none';
    }
});
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

//#region addpop
let addpopB = document.getElementById('add');
let addpopD = document.getElementById('addpop');
let addpop = {
    x: addpopD.querySelector('.x'),
    name: addpopD.querySelector('.names .imp'),
    year:{
        before: addpopD.querySelector('.years .b'),
        after: addpopD.querySelector('.years .a'),
    },
    month:{
        before: addpopD.querySelector('.months .b'),
        after: addpopD.querySelector('.months .a'),
    },
    day:{
        before: addpopD.querySelector('.days .b'),
        after: addpopD.querySelector('.days .a'),
    },
    belong: addpopD.querySelector('.belongs .imp'),
    tags: addpopD.querySelector('.tags .imp'),
    explain: addpopD.querySelector('.explain .imp'),
    sendB: addpopD.querySelector('.send'),
    toggle: () => {
        addpopB.classList.toggle('tap');
        addpopD.classList.toggle('tap');
        
        addpop.name.innerText = '';
        addpop.year.before.innerText = '';
        addpop.year.after.innerText = '';
        addpop.month.before.innerText = '';
        addpop.month.after.innerText = '';
        addpop.day.before.innerText = '';
        addpop.day.after.innerText = '';
        addpop.belong.innerText = '';
        addpop.tags.innerText = '';
        addpop.explain.innerText = '';
    }
};

addpopB.addEventListener('click', addpop.toggle);
addpop.x.addEventListener('click',addpop.toggle);

addpop.tags.addEventListener('keydown', e => {
    if(e.key == 'Enter'){
        e.preventDefault();
        
        const comma = document.createTextNode(',');
        addpop.tags.appendChild(comma);

        const sel = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(addpop.tags);
        range.collapse(false); // falseで末尾に移動
        sel.removeAllRanges();
        sel.addRange(range);
    }
});

addpop.sendB.addEventListener('click', () => {
    let name = addpop.name.innerText.trim();
    let year = [+addpop.year.before.innerText.trim(), +addpop.year.after.innerText.trim()];
    let month = [+addpop.month.before.innerText.trim(), +addpop.month.after.innerText.trim()];
    let day = [+addpop.day.before.innerText.trim(), +addpop.day.after.innerText.trim()];
    let belong = addpop.belong.innerText.trim();
    let tags = addpop.tags.innerText.trim();
    tags = tags.split(',');
    tags = tags.map(a => a.trim());
    let explain = addpop.explain.innerText;

    if(!name) return addtext('名前は必須でござんす..');
    if(year[0] == 0 && year[1] == 0){
        if(addpop.year.after.innerText.trim() == '') return addtext('..どっちも0は流石に....お前のミスだよな？')
        console.log('一回疑いかけたけど、後者入ってないから違うっぽい')
    
        if(addpop.year.before.innerText.trim() == '') return addtext(`ごめん、!@#年から${year[1]}年までって何？せめて0を入れてくれんかね`)
        console.log(year, addpop.year.before.innerText, addpop.year.after.innerText);
    };

    if( year.some(a => Number.isNaN(a))) return addtext('年..書いてあるけど文字だよね？これ');
    if(month.some(a => Number.isNaN(a))) return addtext('月..書いてあるけど文字だよね？これ');
    if(  day.some(a => Number.isNaN(a))) return addtext('日..書いてあるけど文字だよね？これ');

    if(year[1] == 0) year[1] = '解なし';
    if(year[1] < year[0] && year[1] != 0) return addtext(`残念ながら${year[0]}年より${year[1]}年のほうが昔なんですよ..知ってました？`);

    if(month[0] == '' || month[0] == 0) month[0] = '未記入';
    if(month[1] == '' || month[1] == 0) month[1] = '未記入';
    if(day[0] == '' || day[0] == 0) day[0] = '未記入';
    if(day[1] == '' || day[1] == 0) day[1] = '未記入';
    
    console.log(`名前:${name} 年:${year[0]} ~ ${year[1]} 月:${month[0]} ~ ${month[1]} 日:${day[0]} ~ ${day[1]} 所属:${belong} タグ:${tags} コメント:${explain}`);

    mainMake(name, year, month, day, belong, tags, explain);

    addpop.toggle();
});
//#endregion addpop

//#region side
let sideD = document.getElementById('side');
let side = {
    B: sideD.querySelector('.tog'),
    toggle: () => {
        side.B.classList.toggle('tap');
        sideD.classList.toggle('tap');
    }
    //以下D内の諸々要素
};
side.B.addEventListener('click', side.toggle);

//まあ直に追加しますよ、諸々

//#endregion side

//#region main
let mainD = document.getElementById('main');
let main = {
    sideD: mainD.querySelector('.side'),
    bodyD: mainD.querySelector('.body'),
    desc: mainD.querySelector('.desc'),
    /* all: [], //objたち */
    list: {},
    'kari':{ //listにはいるであろうもの
        div: document.getElementById('div'),
        items: [], //objたち new
    }
}

function mainMake(...arr){
    let [name, year, month, day, belong, tags, explain] = arr;

    let obj = {
        name,
        year,
        month,
        day,
        belong,
        tags,
        explain
    }
    
    let div = document.createElement('div');
    div.className = 'item';

    let nameD = document.createElement('div');
    nameD.className = 'name';
    nameD.innerText = name;
    div.appendChild(nameD);

    let monthes = {
        b: month[0] == '未記入' ? '' : `${month[0]}月`,
        a: month[1] == '未記入' ? '' : `${month[1]}月`,
    };
    let dayes = {
        b: day[0] == '未記入' ? '' : `${day[0]}日`,
        a: day[1] == '未記入' ? '' : `${day[1]}日`,
    };

    let mdb = '', mba = '';
    if(monthes.b != '' || dayes.b != '') mdb = `<div class="detail">(${monthes.b}${dayes.b})</div>`;
    
    if((monthes.a != '' || dayes.a != '')&& year[1] != '解なし') mba = `<div class="detail">(${monthes.a}${dayes.a})</div>`;

    let whenD = document.createElement('div');
    whenD.className = 'when';

        let befD = document.createElement('div');
        befD.className = 'before';
        let befeed = `<div class="year">${year[0]}年</div>`;
        befD.innerHTML = `${befeed}${mdb}`;
        whenD.appendChild(befD);

        let kanD = document.createElement('div');
        kanD.className = 'nobashi';
        kanD.innerText = '〜';
        whenD.appendChild(kanD);

        let aftD = document.createElement('div');
        aftD.className = 'after';
        let afteed = `<div class="year">${year[1]}年</div>`;
        if(year[1] != '解なし') aftD.innerHTML = `${afteed}${mba}`;
        else aftD.innerHTML = '<div class="year">解なし(今に至る)</div>';
        whenD.appendChild(aftD);
    
    div.appendChild(whenD);

    //belongは所属、つまりappendChildの時に使います

    let tagD = document.createElement('div');
    tagD.className = 'tags';
    tags.forEach(a => {
        let aD = document.createElement('div');
        aD.className = 'tag';
        aD.innerText = a;
        //addEventListenerで押したらそのtagがあるやつだけ表示、(そのtagを再度押す || 右上に出る"検索解除"を押す)で全て表示、やってもいいかも
        tagD.appendChild(aD);
    })
    div.appendChild(tagD);

    let explainD = document.createElement('div');
    explainD.className = 'explain';
    explainD.innerText = explain;
    div.appendChild(explainD);

    if(belong == '未記入') belong = 'その他';
    let oya = main.list[belong];
    if(!oya){
        let oyaLD = document.createElement('div');
        oyaLD.className = `item ${belong}`;
        oyaLD.innerText = belong;
        main.sideD.appendChild(oyaLD);

        let oyaBD = document.createElement('div');
        oyaBD.className = `kind ${belong}`;
        //配牌カラーでランダムセレクト、一巡するまで被りなし〜をやりたい、ね
        main.bodyD.appendChild(oyaBD);
        
        main.list[belong] = {
            li: main.sideD.querySelector(`.item.${belong}`),
            items: main.bodyD.querySelector(`.kind.${belong}`),
            all: []
        };

    }
    
    main.list[belong].all.push(obj);
    main.list[belong].items.appendChild(div);
}



//#endregion main


let migiueD = document.getElementById('migiue');
migiueD.addEventListener('click', () => {
    addpop.name.innerText = 'アメリカ独立戦争';
    addpop.year.before.innerText = '1775';
    addpop.year.after.innerText = '1783';
    addpop.month.before.innerText = '4';
    addpop.month.after.innerText = '9';
    addpop.day.before.innerText = '19';
    addpop.day.after.innerText = '3';
    addpop.belong.innerText = 'アメリカ';
    addpop.tags.innerText = '戦争,独立,米';
    addpop.explain.innerText = 'アメリカのイギリスからの独立のための戦争。\nアメリカ合衆国内ではアメリカ革命と呼ばれているらしい';

    addpop.sendB.click();
    addpop.toggle();
})