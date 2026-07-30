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
    if(dooC.lis == to) return console.log('どういうわけか もう そこにいる');
	if(!to) return console.error(`せんぱ〜い？${to}ってどこですか〜？笑`);
	
	for(let a of dooC.lis) document.getElementById(a.name).classList.remove('show');
    document.getElementById(to).classList.add('show');
    dooC.lis = to;
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
    
    ing:0,
    waiting:0,

    racers:[],
    num: 4,
    longleg: 15,
}
dooC.cavF = {};

dooC.cavF.tekiou = () => {
    
}

dooC.cavF.start = () => {
    let num = dooC.cavC.num
    for(let i=0; i<num; i++){
        
    }
}
dooC.cavC.btDs["start"].addEventListener("click", () => {
    if(!ing) dooC.cavF.start();
    // else 1=1
});

dooC.cavF.racerMake = (name = 0) => {
    if(!name) arraySelect(Racers).name;
    let data = findRacer(name);

    let racer = {
        name,
        pos: 0,
        spd: data.spd,
        aga: data.aga,
        data
    }

    dooC.cavC.racers.push(racer);
}


dooC.cavF.act = async(who) => {
    let act = arraySelect(who.acts);

    let hase = (arr, name) => {return arr.includes(name)};

    // becauseof: act_pre
    for(let buff of who.buffs){
        let data = findBuff(buff.name);
        if(hase(data.effects, "行動不可")) return 0;

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
    
}

// #endregion 

// #endregion door



//#region start
function start(){
    Style.tekiou();
    OBS.load();

    mainF.load();

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

