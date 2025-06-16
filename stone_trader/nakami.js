//#region komagome
function delay(ms){
    return new Promise(resolve=>setTimeout(resolve,ms));
};
async function nicoText(mes){
    const newDiv = document.createElement('div');
    newDiv.textContent = mes;
    newDiv.className = 'nicotext';
    newDiv.style.top = `calc(${random(0,100)}vh - 20px)`
    body.appendChild(newDiv);
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

//#region 画像とかをロードする機構
let imagesLoaded = 0;
let images = {};
let imageNames = {
    'stones':['coal','iron','ruby','gold','larimar'/*,'stone_stone','coal_stone','iron_stone','ruby_stone','gold_stone','larimar_stone'*/],
}
let totalImages = Object.keys(imageNames).map(a => imageNames[a].length).reduce((a, b) => a + b);
Object.keys(imageNames).forEach(belong => {
    imageNames[belong].forEach(num => {
        let img = new Image();
        img.src = `assets/${belong}/${num}.png`;
        img.onload = () => {
            imagesLoaded++;
            if(imagesLoaded === totalImages){
                gameloop()
            }
        };
        img.onerror = () => {
            console.error(`Image ${num} failed to load.`);
        };
        if(!images[belong]){
            images[belong] = {}
        }
        images[belong][num] = img;
    });
});
//#endregion
//#region zentai-toshite-noyatsu
let gameZone = document.getElementById('gameZone');
let debugData = document.querySelector('#debug .data');
let debugMenu = document.querySelector('#debug .menu');
document.querySelectorAll('.draggable').forEach(a => {
    a.addEventListener('mousedown', e => {
        offsetX = e.clientX - a.getBoundingClientRect().left;
        offsetY = e.clientY - a.getBoundingClientRect().top;
        
        function onMouseMove(e){
            a.style.left = `${e.clientX - offsetX}px`;
            a.style.top = `${e.clientY - offsetY}px`;
        }
    
        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }); 
});

let ores =  {
    coal:{
        id:'coal',
        name:'石炭',
        num:0,
        price:10,
        domain:[10,30],
        value:[1,3]
    },
    iron:{
        id:'iron',
        name:'鉄',
        num:0,
        price:20,
        domain:[20,60],
        value:[1,5]
    },
    ruby:{
        id:'ruby',
        name:'ルビー',
        num:0,
        price:80,
        domain:[80,240],
        value:[1,25]
    },
    gold:{
        id:'gold',
        name:'金',
        num:0,
        price:180,
        domain:[180,600],
        value:[2,10]
    },
    larimar:{
        id:'larimar',
        name:'ラリマー',
        num:0,
        price:300,
        domain:[300,1000],
        value:[5,15]
    }
}

function tekiou(){
    debugData.innerHTML = `
    <span class="ore"><img src="${images.stones['coal'].src}"/>:${ores.coal.price}</span>
    <span class="ore"><img src="${images.stones['iron'].src}"/>:${ores.iron.price}</span>
    <span class="ore"><img src="${images.stones['ruby'].src}"/>:${ores.ruby.price}</span>
    <span class="ore"><img src="${images.stones['gold'].src}"/>:${ores.gold.price}</span>
    <span class="ore"><img src="${images.stones['larimar'].src}"/>:${ores.larimar.price}</span>
    `;
}
function change(){
    Object.values(ores).forEach(a => {
        let min = a.domain[0];
        let max = a.domain[1];

        let val = random(...a.value);
        if(probability(50)) val *= -1;

        a.price += val;
        if(a.price < min) a.price = min;
        if(a.price > max) a.price = max;
    })
    tekiou();
}
function gameloop(){
    change();
    setTimeout(gameloop, 4000)
}

//#endregion

//#region select
let selectArea = document.getElementById('select');
document.querySelectorAll('.selection').forEach(a => 
    a.addEventListener('click', () => {
        let goto = a.classList[1];
        console.log(`フォリア「${goto}に行きますよ〜〜！！」`);
        
        selectArea.style.display = 'none';
        document.getElementById(goto).style.display = 'block';

        Selections[goto].process();
    })
);
//#endregion
//#region buyer
let buyerArea = document.getElementById('buyer');
let buyerOwnertextD = buyerArea.querySelector('.owner .text');
let buyerOwnertext = 'いらっしゃ〜い'
buyerArea.querySelectorAll('.item').forEach(a => {
    a.addEventListener('mouseover', e => {
        const targetUM = e.target.closest('[data-text]');
        if (targetUM){
            const text = targetText.dataset.description;
            buyerOwnertext.innerHTML = text;
        }
    });
    a.addEventListener('mouseout', (e) => {
        const targetText = e.target.closest('[data-text]');
        if(targetText){
            buyerOwnertext.innerHTML = buyerOwnertext;
        }
    });
})
//#endregion

let mineArea = document.getElementById('mine');
let shopArea = document.getElementById('shop');
let stillArea = document.getElementById('still');