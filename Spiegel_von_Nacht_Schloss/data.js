const Cards = {
  'none':{
    id:'none',
    name: 'none',
    nume: '',
    code: 'A',
    rare: 1,
    cool: 1,
    have: [],
    buyable: 0,
    description: '"何もない"。デジタル絵師ならわかるよね？',
    process:async function(c,t){
      let atk = 0;
      atk += eleatk;
    }
  },
  //こっからA
  'slash':{
    id:'slash',
    name: 'スラッシュ',
    nume: 2,
    code: 'A',
    rare: 1,
    cool: 2,
    have: [], //.lengthで所持枚数、中の数字が残りクールダウン
    buyable: 0,
    description: '軽い斬撃。',
    process:async function(c,t){
      let atk = 2;
      atk += eleatk;
      let result = await attack(c,t,atk,num);
      return result;
    }
  },
  'sword':{
    id:'sword',
    name: 'ソード',
    nume: 3,
    code: 'A',
    rare: 1,
    cool: 3,
    have: [],
    buyable: 0,
    description: '使うたびに攻撃力が上昇する。',
    process:async function(c,t){
      let atk = 3;
      atk += ソードeleatk;
      atk += eleatk;
      let result = await attack(c,me,me,target,atk);
      if(nowturn == 'p'){ソードplayereleatk += 1}; 
      if(nowturn == 'e'){ソードenemyeleatk += 1};
      return result;
    }
  },
  'rushsword':{
    id:'rushsword',
    name: 'ラッシュソード',
    nume: '3+',
    code: 'A',
    rare: 3,
    cool: 4,
    have: [],
    buyable: 1,
    description: '基本3ダメージ、次のカードが自分の攻撃カードの場合3回攻撃になる。',
    process:async function(c,t){
      let atk = 3;
      if(nextcard.classList.contains('A') && nextcard.classList.contains('p')){atknum += 2;}else
      if(prevcard.classList.contains('A') && prevcard.classList.contains('p')){atknum += 2;};//3回攻撃に
      atk += eleatk;
      let result = await attack(c,me,me,target,atk);
      return result;
    }
  },
  'soulknife':{
    id:'soulknife',
    name: 'ソウルナイフ',
    nume: 4,
    code: 'A',
    rare: 3,
    cool: 3,
    have: [],
    buyable: 1,
    description: '相手にダメージを与え、与えた分回復する。',
    process:async function(c,t){
      let atk = 4;
      atk += eleatk;
      if(enemyhealth <= atk){let atk = enemyhealth;}
      repair = atk;
      let result = await attack(c,me,me,target,atk);
      return result;
    }
  },
  'leafsword':{
    id:'leafsword',
    name: 'リーフソード',
    nume: '5+',
    code: 'A',
    rare: 3,
    cool: 4,
    have: [],
    buyable: 1,
    description: '基本5ダメージ、クール中カードが5枚以上なら10ダメージ。',
    process:async function(c,t){
      let atk = 5;
      if(document.querySelectorAll('.cooldown').length >= 5){let atk = 10;}
      atk += eleatk;
      let result = await attack(c,me,me,target,atk);
      return result;
    }
  },
  'treesword':{
    id:'treesword',
    name: 'ツリーソード',
    nume: '6+',
    code: 'A',
    rare: 4,
    cool: 5,
    have: [],
    buyable: 1,
    description: '基本7ダメージ、クール中カードが7枚以上なら14ダメージ。',
    process:async function(c,t){
      let atk = 7;
      if(document.querySelectorAll('.cooldown').length >= 7){let atk = 14;}
      atk += eleatk;
      let result = await attack(c,me,me,target,atk);
      return result;
    }
  },
  'forest_anger':{
    id:'forest_anger',
    name: '森の怒り',
    nume: '7+',
    code: 'A',
    rare: 7,
    cool: 7,
    have: [],
    buyable: 1,
    description: '基本6ダメージ、クール中カードが枚以上で、<br>自身の体力が半分以下ならなら18ダメージ、自身の体力を10回復',
    process:async function(c,t){
      let atk = 7;
      if(document.querySelectorAll('.cooldown').length >= 7){let atk = 14;}//こいつ廃止
      atk += eleatk;
    }
  },
  'gamble':{
    id:'gamble',
    name: '博打',
    nume: 8,
    code: 'A',
    rare: 4,
    cool: 5,
    have: [],
    buyable: 1,
    description: '基本3ダメージ、確率で8ダメージ。',
    process:async function(card,c,t){
      let atk = Math.floor(Math.random() * 2) == 0 ? 8 : 3; //3または8 50%
      atk += eleatk;
      let result = await attack(c,me,me,target,atk);
      return result;
    }
  },
  'dualcutter':{
    id:'dualcutter',
    name: 'デュアルカッター',
    nume: '4x2',
    code: 'A',
    rare: 4,
    cool: 4,
    have: [],
    buyable: 1,
    description: '4ダメージで2回攻撃する。',
    process:async function(c,t){
      let atk = 4;
      atk += eleatk;
      atknum = 2;
      let result = await attack(c,me,me,target,atk);
      return result;
    }
  },
  'quadcutter':{
    id:'quadcutter',
    name: 'クアッドカッター',
    nume: '4x4',
    code: 'A',
    rare: 7,
    cool: 7,
    have: [],
    buyable: 1,
    description: '3ダメージで4回攻撃する。',
    process:async function(c,t){
      let atk = 3;//ぶっ壊れになりそう..まあ名前かっこいいからいいよね！！
      atk += eleatk;
      atknum = 4;
      let result = await attack(c,me,me,target,atk);
      return result;
    }
  },
  'demondance':{
    id:'demondance',
    name: '鬼神乱舞',//アークナイツモンハンコラボ、キリンRヤトウの2ndスキルより
    nume: '4x6',//ちょっとやばいか...?ww
    code: 'A',
    rare: 9,
    cool: 8,
    have: [],
    buyable: 1,
    description: '3ダメージで6回攻撃する。',
    serif: '足掻こうが抗おうが無駄だ！',
    process:async function(c,t){
      let atk = 3;
      atk += eleatk;
      atknum = 6//ちょっとやばいかもよ？？ww
      let result = await attack(c,me,me,target,atk);
      return result;
    }
  },//鬼踊....ww
  'fevercutter':{
    id:'fevercutter',
    name: 'フィーバーカッター',
    nume: '7+',
    code: 'A',
    rare: 4,
    cool: 4,
    have: [],
    buyable: 1,
    description: '攻撃力+相手のデバフの持続時間の合計で攻撃する。',
    process:async function(c,t){
      let atk = 4;
      atk += enemydebuff.time;
      let result = await attack(c,me,me,target,atk);
      return result;
    }
  },
  'feverslash':{
    id:'feverslash',
    name: 'フィーバースラッシュ',
    nume: '7+x2',
    code: 'A',
    rare: 7,
    cool: 7,
    have: [],
    buyable: 1,
    description: '攻撃力+相手のデバフの持続時間の合計で2回攻撃する。',
    process:async function(c,t){
      let atk = 4;
      atk += enemydebuff.time;
      atknum = 2;
      let result = await attack(c,me,me,target,atk);
      return result;
    }
  },
  'heartseeker':{
    id:'heartseeker', //ハートを盗むもの...?
    name: 'ハートシーカー',
    nume: 'X',
    code: 'A',
    rare: 6,
    cool: 6,
    have: [],
    buyable: 1,
    description: '自身のバリアを全て消費し、<br>相手に消費前のバリアの1.5倍のダメージを与える。',
    process:async function(c,t){
      let atk = shield;
      let shl = -atk;
      atk += eleatk;
      atk = Math.floor(atk * 1.5);//元ネタはハートの合図です 今思ったけど名前似てる...
      let result = await attack(c,me,me,target,atk);
      return result;
    }
  },//1.5倍に強化とか、強化版武器追加してもいいかも
  'bloodknife':{
    id:'bloodknife',
    name: 'ブラッドナイフ',//これ好き(元:学マス-はじける水しぶき)
    nume: '16',
    code: 'A',
    rare: 4,
    cool: 4,
    have: [],
    buyable: 1,
    description: '自分のHPを7減らした後相手にダメージを与える。<br>自身にバリアがある場合、リカバリを2付与する' //作った本人記憶なくて"何これ?!"ってなったのは内緒のお話
  },


  //こっからM
  'shield':{
    id:'shield',
    name: '盾',
    nume: 4,
    code: 'M',
    rare: 1,
    cool: 2,
    have: [],
    buyable: 1,
    description: '軽く盾を構える。',
    process:async function(c,t){
      let shl = 4;
      shl += eleshl; 
      let result = await shield(c,me,c,me,shl);
    }
  },
  'heal':{
    id:'heal',
    name: '回復',
    nume: 4,
    code: 'M',
    rare: 1,
    cool: 2,
    have: [],
    buyable: 1,
    description: '自身のHPを4回復する。',
    process:async function(c,t){
      let result = await heal(c,me,me,4);
      return result;
    }
  },
  'attackup':{
    id:'attackup',
    name: '攻撃力上昇',
    nume: 1,
    code: 'M',
    rare: 6,
    cool: 6,
    have: [],
    buyable: 1,
    description: '自身の攻撃力を上昇させる。',
    process:async function(c,t){
      eleatk += 1;
      return 'alive';
    }
    
  },
  'greentrain':{
    id:'greentrain',//グリーン車ではないです
    name: 'グリーン・トレイン',
    nume: '',
    code: 'M',
    rare: 3,
    cool: 4,
    have: [],
    buyable: 1,
    description: '使用されたフェーズの配置されたカードを全て無効化する。<br>簡単に言えばスキップである',
    process:async function(c,t){
      //ないっすよ。だってこれ存在するだけで効果だし
      //逆に何を書けないいんですか？？
      return 'alive';
    }
  },
  'yellowtrain':{
    id:'yellowtrain', //黄色のドクターとかありじゃね？ だからあえてのそのまま
    name: 'ドクター・イエロー',
    nume: 'Px2',//p = Phase
    code: 'M',
    rare: 4,
    cool: 5,
    have: [],
    buyable: 1,
    description: '使用されたフェーズの配置されたカードを全て無効化する。<br>ついでに体力を現在のフェーズ数x2回復する。',
    process:async function(c,t){
      let result = await heal(c,me,me,me.phase*2);
      result = await skip(c,t);
      return result;
    }
  },
  'behard':{
    id:'behard', //die hardも作りたいね DBDのやつ
    name: '硬化',
    nume: '',
    code: 'M',
    rare: 3,
    cool: 3,
    have: [],
    buyable: 1,
    description: '4硬化状態を得る',//硬化:攻撃を受けた時バフの持続時間分ダメージを減らす。減らした分バフの持続時間を減少
    process:async function(c,t){
      buffAdd(c,me,'硬化',4);
      return 'alive';
    }
  },
  'dualcore':{
    id:'dualcore',
    name: 'デュアルコアシステム',//ダブルエントリーシステム的なやつができたらシステム消しといて
    nume: '',
    code: 'M',
    rare: 3,
    cool: 3,
    have: [],
    buyable: 1,
    description: '次のターン、相手のカードを後ろに配置する。',
    process:async function(c,t){
      if(c == 'p'){barShape = '0011';}
      if(c == 'e'){barShape = '1100';}
      return 'alive';
    }
  },
  'thiefmask':{
    id:'thiefmask',
    name: 'シーフマスク',
    nume: '',
    code: 'M',
    rare: 5,
    cool: 5,
    have: [],
    buyable: 1,
    description: 'このカードの一つ前のカードを盗む。', //敵が使うと自身のやつがなくなるだけ
    process:async function(c,t){　//今風に適応させといて PREV,NEXT処理部瑞花も
      if(prevcard){//敵が使った時
        if(prevcard.classList.contains('p')&&nowturn == 'e'){
        if(prevcard.classList.contains('A')){
          havecardA.name.splice(havecardA.name.indexOf(prevcard.id),1);
          console.log('多分盗まれたぜ!!Aの方ね')
        }
        if(prevcard.classList.contains('M')){
          havecardM.name.splice(havecardM.name.indexOf(prevcard.id),1);
          console.log('多分盗まれたぜ!!Mの方ね')
        }
        }
      }
      if(prevcard){//自分が使った時
        if(prevcard.classList.contains('e')&&nowturn == 'p'){
        if(prevcard.classList.contains('A')){
          havecardA.name.push(prevcard.id);
          console.log('多分盗んだぜ!Aを')
        }
        if(prevcard.classList.contains('M')){
          havecardM.name.push(prevcard.id);
          console.log('多分盗んだぜ!Mを')
        }
        }
      }
      return 'alive';
      //シーフマスクのエフェクト出しといて(画像がちょっと浮いて消えるだけでいい)
    }
  },
  'overdrive':{
    id:'overdrive',
    name: 'オーバードライブ',
    nume: '',
    code: 'M',
    rare: 8,//初URこれね？ww
    cool: 6,
    have: [],
    buyable: 1,
    description: '自身の体力をクール中カードx2にし、<br>次のターン、相手のカードを無くす。<br>敵が使うことは絶対にない。',//まあ..使えたらかなりきっついからね とはいいつつ一人くらいあってもいいかも
    process:async function(c,me,t,targat){
      playerhealth = document.querySelectorAll('.cooldown').length*2;
      if(c == 'p'){barShape = '0000';}
      if(c == 'e'){barShape = '1111';}
    }
  },
  'backwater_camp':{ //こいつの相手のカード無くし無くして、分離させてもいいかも
    id:'backwater_camp',
    name: '背水の陣',
    nume: '',
    code: 'M',
    rare: 8,
    cool: 6,
    have: [],
    buyable: 1,
    description: '自身の体力を1にし、攻撃力を2増加し、次のターン、相手のカードをなくす。',
    process:async function(c,t){
      if(c == 'p'){barShape = '0011';}
      if(c == 'e'){barShape = '1100';}
      return 'alive';
    }
  }
};

let noticeData = [
  {
    date: '2025/3/21',
    title: 'お知らせ機能、ついに登場〜☆',
    description: "お知らせ機能を追加したよって話\n中身ほぼゼロ\nブブゼラ",
    body: "おちゃめ機能つってね\nガハハ\n笑え"
  },
  {
    date: '2025/3/21',
    title: '更新遅いかもって話',
    description: "一人身だからね、仕方ないのです",
    body: "タイトルの通り..って感じですが\n更新頻度が遅いです！！ってお話を\n私今clicker-of-mugenメインで作ってて\nなのでそっち見てくれよな！！って話でした\nこの話終わり"
  },
]
