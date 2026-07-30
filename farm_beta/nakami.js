let dooD = document.getElementById("door");
let dooC = {
    areus: ["loby", "nero", "cave"],
    shuDs:{
        loby: dooC.querySelector(".area.loby"),
        nero: dooC.querySelector(".area.nero"),
        cave: dooC.querySelector(".area.cave")
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

dooC.lobC = {

}
dooC.lobF = {};


dooC.nerC = {

}
dooC.nerF = {};


dooC.cavC = {
    
}
dooC.cavF = {};