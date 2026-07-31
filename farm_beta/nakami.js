// #region main
let mainD = document.getElementById('main');
let mainC = {
    spa: null,
    
    mvlsD: document.getElementById('movlis'),
     mvlsLD: document.querySelector('#movlis .list'),
    mvlsi: 0,

    returnDs: mainD.querySelectorAll('.return'),
}
let mainF = {};
mainF.move = (to) => {
    console.log(`[move] ${to}`);
    if(mainC.spa == to) return console.log('どういうわけか もう そこにいる');
	if(!to) return console.error(`せんぱ〜い？${to}ってどこですか〜？笑`);
	
	for(let a of Spaces) document.getElementById(a.name).classList.remove('show');
    document.getElementById(to).classList.add('show');
    mainC.spa = to;

    switch(to){
        case "home":{
            homF.came();
            break;
        }
    }

    history.replaceState(null, "", `?${to}`);
}

mainF.load = () => {
    for(let spa of Spaces){
        let div = document.getElementById(spa.name);
        if(!div) continue;

        div.style.zIndex = spa.rank;
        div.style.background = spa.back;
    }

    for(let a of mainC.returnDs){
        let from = a.dataset.belong; //これが所属spaceのはず
        
        new fuyoNagaOSU(a, () => {
            mainF.move("home");
        }, 1000);
    }
}

//#region movlis
for(let n of Spaces){
    let li = document.createElement('div');
    li.textContent = n.name;
    li.className = 'item';

    li.addEventListener('click', () => mainF.move(n.name));

    mainC.mvlsLD.appendChild(li);
}
document.addEventListener('keydown', (e) => {
    if(e.key != 'm' || mainC.mvlsi) return;
    mainC.mvlsD.style.left = `${OBS.mx - mainC.mvlsD.offsetWidth/2}px`;
    mainC.mvlsD.style.top = `${OBS.my}px`;
    mainC.mvlsD.classList.add('tog');
    mainC.mvlsi = 1;
})
document.addEventListener('keyup',e => {
    if(e.key != 'm') return;
    mainC.mvlsD.classList.remove('tog');
    mainC.mvlsi = 0;
})
//#endregion

//#endregion main


// #region home
let homD = document.getElementById("home");
let homC = {
    goDs:{
        farm: homD.querySelector(".uni1 .farm"),
        cook: homD.querySelector(".uni1 .cook"),
        shop: homD.querySelector(".uni2 .shop"),
        door: homD.querySelector(".uni2 .door")
    }
}
let homF = {};

homF.load = () => {
    for(let k of Object.keys(homC.goDs)) homC.goDs[k].addEventListener('click', () => mainF.move(k));
}
homF.came = () => {
    if(hit(6)) homC.goDs["cook"].textContent = "キッキンチキンに向かう";
}

// #endregion


function findGeneric(list, type, name, extraCheck = null) {
    let data;
    if(extraCheck) data = extraCheck(list, name);
     else data = list.find(a => a.name == name || a.jpnm == name);
    if(data) return data;
    
    console.log(`[find] ${type}で、「${name}」っていうものはないらしいです`);
    return 0;
}
const findBuff = (name) => findGeneric(Buffs, "Buffs", name);
const findRacer = (name) => findGeneric(Racers, "Racers", name);



// #region door
let dooD = document.getElementById("door");
let dooC = {
    areus: ["loby", "nero", "cave"],
    shuDs:{
        loby: dooD.querySelector(".area.loby"),
        nero: dooD.querySelector(".area.nero"),
        cave: dooD.querySelector(".area.cave")
    }
};
let dooF = {};

dooF.move = (to) => {
    if(dooC.now == to) return console.log('どういうわけか もう そこにいる');
	if(!to) return console.error(`せんぱ〜い？${to}ってどこですか〜？笑`);
	
	for(let a of Object.keys(dooC.shuDs)) dooC.shuDs[a].classList.remove('show');
    dooC.shuDs[to].classList.add('show');
    dooC.now = to;
}

// #region loby
dooC.lobC = {

}
dooC.lobF = {};
// #endregion


// #region nero
dooC.nerC = {

}
dooC.nerF = {};
// #endregion


// #region cave
dooC.cavD = dooC.shuDs.cave;
dooC.cavC = {
    btDs:{
        start: dooC.cavD.querySelector(".bts .bt.start"),
    },
    racersD: dooC.cavD.querySelector(".racers"),
    
    ing:0,
    waiting:0,

    aflike: 2000, //後隙:規定値2000ms
    num: 4,
    longleg: 15,
    racers:[],
}
dooC.cavF = {};

dooC.cavF.tekiou = () => {
    for(let racer of dooC.cavC.racers){
        let div = racer.div;
        let at0 = div.querySelector(".at");
         if(at0) at0.remove();

        let pos = racer.pos;
        let at = document.createElement("img");
        at.className = "at";
        at.src = `assets/images/racers/${racer.name}.png`;
        div.querySelector(`.road${pos}`).appendChild(at);
    }
}

dooC.cavF.start = () => {
    jump:{
        if(dooC.cavC.ing) break jump;
        dooC.cavC.ing = 1;

        console.log("[racer] 事前準備タイム")
        dooC.cavC.racersD.innerHTML = "";
        dooC.cavC.racers = [];

        let num = dooC.cavC.num;
        for(let i=0; i<num; i++){
            console.log(`[racer] racer作成日記: ${i}番目`);
            let racer = dooC.cavF.racerMake(i);
        }

        dooC.cavF.tekiou();
    }
}
dooC.cavC.btDs["start"].addEventListener("click", () => {
    if(!dooC.cavC.ing) dooC.cavF.start();
    else{
        if(!dooC.cavC.stop) dooC.cavF.stop();
        else dooC.cavF.start();
    }
});

dooC.cavF.racerMake = (id, name = 0) => {
    if(!name) name = arraySelect(Racers).name;
    let data = findRacer(name);

    let racer = {
        id,
        name,
        pos: 0,
        spd: data.spd,
        aga: data.aga,
        data
    }
    
    // div
    let div = El("div", `racer racer${id} ${name}`);
    let road = El("div", "road");
    for(let i=0; i<dooC.cavC.longleg; i++){
        let mich = road.cloneNode(true);
        mich.classList.add(`road${i}`);
         div.appendChild(mich);
    }
    dooC.cavC.racersD.appendChild(div);
    racer.div = div;

    dooC.cavC.racers.push(racer);

    return racer;
}


dooC.cavF.act = async(who) => {
    let hase = (arr, name) => {return arr.includes(name)};

    let actor = {...who};
    let act = arraySelect(who.acts);
     let actL = act.split(",");
    let aflike = dooC.cavC.aflike;
     if(actL[0].startsWith("%")){
        aflike = +actL[0].slice(1);
        actL.splice(0,1)
     }

    // becauseof: act_pre
    for(let buff of who.buffs){
        let data = findBuff(buff.name);
        if(data.becauseof == "act_pre") buff.time -= data.heru;
        
        if(data.efs.includes("行動不可")) return 0;
    }
}

dooC.cavF.move = async(who, hos, props=[]) => {
    if(!who || !hos) return console.log(who, hos, props);

    let dir = 1;
     if(hos < 0) dir = -1;
    let num = Math.abs(hos);
    for(let i=0; i<num; i++){
        await dooC.cavF.moveGo(who, dir);
        await delay(200);
    }
}
dooC.cavF.moveGo = async(who, dir, props=[]) => {
    let pos = who.pos + dir;
    if(pos < 0) pos = 0;
    if(dooC.cavC.longleg <= pos) pos = dooC.cavC.longleg-1;
    who.pos = pos;

    dooC.cavF.tekiou();
}

// #endregion 

// #endregion door



//#region start
function start(){
    Style.tekiou();
    OBS.load();

    mainF.load();
    homF.load();

    let hash = location.hash.replace("?", "");
    let space = Spaces.find(a => a.name == hash);
    if(!space) space = Spaces.find(a => a.sho);
    mainF.move(space.name);
}
//#endregion

//#region DOM
let LoadOfWait = async() => await loaF.load();
if(document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded", init);
}
else init();

async function init() {
    await LoadOfWait();
}
//#endregion

