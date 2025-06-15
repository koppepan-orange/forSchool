let Selections = {
    buyer:{
        id:'buyer',
        name:'売り屋',
        serifs:{
            normal:[
                'おや、お客さんとは珍しいね<br>まあゆっくりしていきなよ',
                'ん？あーいらっしゃ〜い<br>え？キャラが違うって？<br>..このキャラを維持するのは難しくてね....'
            ],
        },
        process:function(){
            buyerOwnertext = arraySelect(Selections.buyer.serifs.normal);
            buyerOwnertextD.innerHTML = buyerOwnertext;
        }
    }
}