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
    shoulD:{
        loby: dooD.querySelector(".area.loby"),
        nero: dooD.querySelector(".area.nero"),
        cave: dooD.querySelector(".area.cave")
    }
};
let dooF = {};

homF.came = () => {
    dooF.move("loby");
}
dooF.load = () => {
    for(let name of Object.keys(dooC.shoulD)){
        if(name == "loby") continue;
        let img = images.systems[name]?.cloneNode();
        let txt = El("div", "text");
         txt.textContent = name;
        let div = El("div", `paint ${name}`, [img, txt]);

        div.addEventListener("click", () => {
            dooF.move(name);
        })
        dooC.lobC.paintsD.appendChild(div);
    }

    dooF.move("loby");
}
dooF.move = (to) => {
    if(dooC.now == to) return console.log('どういうわけか もう そこにいる');
	if(!to) return console.error(`せんぱ〜い？${to}ってどこですか〜？笑`);
	
	for(let a of Object.keys(dooC.shoulD)) dooC.shoulD[a].classList.remove('show');
    dooC.shoulD[to].classList.add('show');
    dooC.now = to;
}

// #region loby
dooC.lobD = dooC.shoulD["loby"];
dooC.lobC = {
    paintsD: dooC.lobD.querySelector(".paints")
}
dooC.lobF = {};
// #endregion


// #region nero
dooC.nerC = {

}
dooC.nerF = {};
// #endregion


// #region cave
dooC.cavD = dooC.shoulD["cave"];
dooC.cavC = {
    btDs:{
        start: dooC.cavD.querySelector(".bts .bt.start"),
    },
    racersD: dooC.cavD.querySelector(".racers"),
    
    ing:0,
    waiting:0,

    time:0,
    timer:null,

    aflike: 2000, //後隙(あとすき):規定値2000ms
    num: 4,
    longleg: 15,
    racers:[],
}
dooC.cavF = {};

dooC.cavF.tekiou = () => {
    // timer
    if(dooC.cavC.timer) dooC.cavC.time = dooC.cavC.timer.time;

    for(let racer of dooC.cavC.racers){
        let div = racer.div;
        let at0 = div.querySelector(".at");
         if(at0) at0.remove();

        let pos = racer.pos;
        let at = document.createElement("img");
        at.className = "at";
        at.src = `assets/images/racers/${racer.name}.png`;
        div.querySelector(`.road${pos}`).appendChild(at);
        racer.atD = at;
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
	        let racer = dooC.cavF.racerMake(i);
	    }
	
	    dooC.cavF.tekiou();
	
	    dooC.cavC.timer = new Timer(0, 1);
	}

	//re:start
    for(let racer of dooC.cavC.racers){
        console.log(`[racer] ${racer.name}の行動ループを開始します`);

        (async () => {
            await delay(3000);

            while (dooC.cavC.ing){
                if(dooC.cavC.waiting){
                    await delay(10, racer);
                    continue;
                }

                // おわり？
                if(racer.pos == dooC.cavC.longleg-1 && dooC.cavF.goal(racer)) return 1;

                let wait = await dooC.cavF.act(racer) ?? dooC.cavC.aflike;
                await delay(wait, racer);
            }
        })();
    }

    dooC.cavC.timer.start();
}
dooC.cavF.restart = () => {
    if(!dooC.cavC.ing) return 0;
    dooC.cavC.waiting = 0;
    dooC.cavC.timer.start();
}
dooC.cavF.stop = () => {
    if(!dooC.cavC.ing) return 0;
    dooC.cavC.waiting = 1;
    dooC.cavC.timer.stop();

    for(let racer of dooC.cavC.racers){
        clearTimeout(racer.loop);
        racer.loop = null;
    }
}
dooC.cavC.btDs["start"].addEventListener("click", () => {
    if(!dooC.cavC.ing) dooC.cavF.start();
    else{
        if(!dooC.cavC.stop) dooC.cavF.stop();
        else dooC.cavF.restart();
    }
});

dooC.cavF.passi = (who, wuzzat = []) => {
    if(!who || !wuzzat) return;
    
    // wuzzat:: [act_pre] [buff_rem, stan] [buff_add, are, name, time]
    if((who.data.P??0) == wuzzat[0] && typeof who.data.PF == "function"){
        let res = who.data.PF(who, ...wuzzat.slice(1));
        if(res) return res;
    }
}


dooC.cavF.racerMake = (id, name = 0) => {
    if(!name) name = arraySelect(Racers.filter(a => !a.no)).name;
    let data = findRacer(name);

    let racer = {
        id,
        name,
        pos: 0,
        spd: data.spd,
        aga: data.aga,
        buffs: [],
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

let has = (arr, name) => {
    if(arr.includes(name)) return name;
    let mono = arr.find(a => a.startsWith(name));
     if(mono) return mono;
    return "";
}
dooC.cavF.ri = (code, who) => {
    let arr = copy(dooC.cavC.racers.filter(a => !a.goaled))

    let res = 0;
    if(code == "me") res = who;
    if(code == "over") res = arr.filter(a => a.id != who.id);
    if(code == "all") res = arr;

    
    arr = arr.sort((a, b) => b.pos - a.pos);
    if(code == "fir") res = arr[0];
    if(code == "las") res = arr[arr.length-1];

    return res;
}
dooC.cavF.act = async(who) => {
    let data = findRacer(who.name);
    let actor = {...who};
    let aflike = dooC.cavC.aflike;

    let act = arraySelect(data.acts);
    let actL = act.split(",");

    // becauseof: act_pre
    for(let buff of who.buffs){
        // console.log(`[buff] ${who.name}の${buff.name}を確認します`);
        let data = findBuff(buff.name);
        if(data.becauseof == "act_pre") dooC.cavF.buffDec(who, buff.name, 1);
        let efs = data.efs ?? [];

        let 行動 = has(efs, "行動"); 
        if(行動){
            let li = 行動.split(",");
            if(行動 == "行動不可") return 10;
            if(行動.startsWith("行動阻害")){ //行動阻害,確率
                if(hit(+li[1])){
                    nicoText("[act] 麻痺った！")
                    return 1000;
                }
            }
        };

        let 後隙 = has(efs, "後隙");
        if(後隙){
            let li = 後隙.split(",");
            if(li[0].startsWith("後隙カット") || li[0].startsWith("後隙ヴァイ")){ //後隙〜〜〜,割合
                if(+li[2] && !hit(+li[2])) continue;
                
                let ryou = aflike*(+li[1]/100);
                if(li[0].startsWith("後隙カット")) aflike -= ryou;
                if(li[0].startsWith("後隙ヴァイ")) aflike += ryou;
            }
        }
    }
    
    let res = await dooC.cavF.passi(who, ["act_pre", ...actL.filter(a => !a.startsWith("%"))]);
     if(res) act = res, actL = res.split(",");
    

    if(actL[0].startsWith("%")){
        aflike = +actL[0].slice(1);
        actL.splice(0,1);
    }
    aflike =  Math.max(aflike - who.spd*10, 0); //敏捷による後隙減少
    

    // -# 複数いる場合はidが若い人を選択
    // me 自分自身 | over 自分以外の全員 | all 自分含む全員
    // fir 先頭の人 | las 最後尾の人
    let celeste = ["me", "over", "all", "fir", "las"]
    let li = actL.map((a) => {
        if(celeste.includes(a)) return dooC.cavF.ri(a, who);
        else return a;
    })

    // new super nintendo switchΩ
    let pref = li[0];
     tobiText(who.atD, pref)
    if(dooC.cavF.ri("fir").id == who.id){
        // console.log(li);
        console.log(`[act]{${who.id}} ${who.name}の行動: ${pref}[${li.slice(1).join(", ")}] | 後隙: ${aflike}ms`);
    }
    switch(pref){
        case "無":
        case "集中":
        case "転倒":
        case "大破":
        case "事故":{
            let [, atai] = li;
            if(pref == "集中") who.ep += +atai;
            if(pref == "事故") dooC.cavF.move(atai, -1);
            
            break;
        }

        case "移動":
        case "前進":
        case "転移":{
            let [, num] = li;
            // if(pref == "前進") console.warn("ごめんパズルやるね");
            let res = dooC.cavF.move(who, +num);
            //  if(res == 0) return "oh";
            break;
        }
        
        //buff
        case "効果":{
            let [, are, name, time] = li;
            // console.log(are)
            dooC.cavF.buffAdd(who, are, name, time);
            break;
        }
        case "効果解除":{
            let [, name] = li;
            dooC.cavF.buffRem(who, name);
            break;
        }
    }
    
    return aflike;
}

dooC.cavF.move = async(who, hos, props=[]) => {
    if(!who || !hos) return console.log(who, hos, props);

    let dir = 1;
     if(hos < 0) dir = -1;
    let num = Math.abs(hos);
    for(let i=0; i<num; i++){
        await dooC.cavF.moveGo(who, dir);
        await delay(200, who);
    }

    return dooC.cavC.aflike;
}
dooC.cavF.moveGo = async(who, dir, props=[]) => {
    let pos = who.pos + dir;
    if(pos < 0) pos = 0;
    if(dooC.cavC.longleg <= pos) pos = dooC.cavC.longleg-1;
    who.pos = pos;

    dooC.cavF.tekiou();
}


dooC.cavF.buffAdd = (who, are, name, time) => {
    console.log(who.name, are.name, name, time)
    let data = findBuff(name);
     name = data.name; //nameがjpnmで与えられている可能性有り

    let 効果F = (data, mono) => {
        let li = mono.split(",");
        if(li[0] == "効果無効" && (li[1] == name || li[1] == data.jpnm)){
            console.error("うおお効果無効！無効無効！！", are.name, name)
            return dooC.cavC.aflike;
        }
        
    }

    // あるかも？無効かも？？
    for(let buff of are.buffs){
        let data2 = findBuff(buff.name);
        if(buff.name == name) return dooC.cavC.aflike;
        let 効果 = has(data2.efs ?? [], "効果");
        if(効果) return 効果F(data, 効果);
    }
    for(let sei of are.data.sei ?? []){
        if(sei.startsWith("効果")) return 効果F(data, sei)
    }
    

    let buff = {
        name,
        type: data.type, //timeかstack
        time,
    }
    are.buffs.push(buff);
    if(name == "stan") kirameki(are.div)

    return dooC.cavC.aflike;
}
dooC.cavF.buffRem = (who, name) => {
    let buff = who.buffs.filter(a => a.name == name);
     if(buff.length == 0) return 0;
    for(let b of buff) who.buffs.splice(who.buffs.indexOf(b), 1);

    let res = dooC.cavF.passi(who, ["buff_rem", name]);
     if(res) return res;

    return dooC.cavC.aflike;
}
dooC.cavF.buffDec = (who, name, time = 0) => {
    let buff = who.buffs.find(a => a.name == name);
     if(!buff) return 0;
    let data = findBuff(name);
    if(buff.type == "time") buff.time -= time ?? 1000;
    if(buff.type == "stack") buff.time -= data.heru ?? 1;
     if(buff.time <= 0) dooC.cavF.buffRem(who, name);

    return dooC.cavC.aflike;
}
dooC.cavF.buffDecZen = (who, time = 0) => {
    for(let buff of who.buffs) dooC.cavF.buffDec(who, buff.name, time);

    return dooC.cavC.aflike;
}

dooC.cavF.goal = (who) => {
    if(who.pos < dooC.cavC.longleg-1) return 0;
    
    // buffとかスキルでなんか阻害あったらここで判定

    who.goaled = 1;
    let len = dooC.cavC.racers.filter(a => a.goaled).length;
    console.error(`[racer] ${who.name}がゴールしました！(${len}位 /${dooC.cavC.num}人) タイム: ${dooC.cavC.timer.time}s`);

    // num-1人終わった？
    if(len >= dooC.cavC.num-1) dooC.cavF.end();

    return 1;
}
dooC.cavF.end = () => {
    dooC.cavC.waiing = 0;
    dooC.cavC.ing = 0;

    console.error("[racer] --- レース終了 ---");
    dooC.cavF.stop();
    dooC.cavC.timer.stop();

}

// #endregion 

// #endregion door



//#region start
function start(){
    Style.tekiou();
    OBS.load();

    mainF.load();
    homF.load();
    dooF.load();

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

