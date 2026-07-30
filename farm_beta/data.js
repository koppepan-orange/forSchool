let Style = {
    iPhone:{ //16
        "width": "393px",
    },
    tekiou: function(){
        for(let section in this){
            if(section == 'tekiou') continue;
            for(let key in this[section]){
                document.documentElement.style.setProperty(`--${section}-${key}`, this[section][key]);
            }
        }
    }
}

const Fonts = [
    {src:'comicsans', type:'ttf'},
    {src:'papyrus', type:'ttf'},
    {src:'cube12', type:'ttf'},
];

const Images = {
    systems:['error'],
}

const Sounds = {
    // se:['error'],
    // bgm:[],
}

const Secrates = [
    {
        ind:0,
        name:'koppepan',
        arr:['k','o','p','p','e','p','a','n'],
        limit:3,
        func: async function(){
            nicoText('なんにも起こらない＝ヨーン');
        }
    },
    {
        ind:0,
        name:'re',
        arr:['r','e'],
        limit:1,
        func: async function(){
            let img = document.createElement('img');
            img.id = 'hakaisatsu';
            img.src = 'assets/images/systems/hakai_1.png'
            img.dataset.phase = 1;
            document.querySelector('body').appendChild(img);

            setTimeout(() => {
                img.remove();
                this.ind = 0;
                this.limit = 1;
            }, 3000)

            return 0;
        }
    },
    {
        ind:0,
        name:'rere',
        arr:['r','e','r','e'],
        limit:1,
        func: async function(){
            let img = document.getElementById('hakaisatsu');
            if(!img) return;

            img.src = 'assets/images/systems/hakai_2.png'
            img.dataset.phase = 2;

            setTimeout(() => {
                img.remove();
                this.ind = 0;
                this.limit = 1;
            }, 3000)

            return 0;
        }
    },
    {
        ind:0,
        name:'rerere',
        arr:['r','e','r','e','r','e'],
        limit:1,
        func: async function(){
            let img = document.getElementById('hakaisatsu');
            if(!img) return 1;
            console.log(img.dataset.phase);
            if(img.dataset.phase != '2') return 1;
            location.reload();
        }
    },
    {
        ind:0,
        name:'wawawwa',
        arr:['w','a','w','a','w','w','a'],
        limit:'n',
        func: async function(){
            staF.resetP();
        }
    }
]

const Spaces = [
    { name:'home', rank:2, back:'#f0f8ff', sho:1 },
    { name:'farm', rank:2, back:'#fff8e2', sho:1 },
    { name:'door', rank:2, back:'#ffe4be', sho:1 },
];


/*
畑の様子を見にいく
キッチンに向かう /キッキンチキンに向かう

小麦、にんじん、じゃがいも
*/

const Foods = [
	{
		name:"wheat",
		jpnm:"小麦",
		appe:0.5,
		rimi:1,
		desc:``,
		flav:"",
		/*
		やりたいこと「接頭辞で上手いことやりたい」
		行ったことを文字に接頭辞として記すの。idは大変なことになるんだけど、もし工程順序も全部正しいならば、、生まれるのはそのまま料理名となる。このFoodsのdataにそのバカのid名が全部あって、それら全部jpnmあるから、、まあ、いいよねって話。レシピ本も売店で買わせればいいしな
		問題点は「組み合わせ」をどうするか、って話だけど。サラダ作りたいだけなのに「あぁ、それキャベツを先に入れてにんじんを後にするとキャベツとにんじんのサラダ、逆だとにんじんとキャベツのサラダで？回復量とか違うから気付けてね」とか！！そういうのはやだ！！ユーザー目線的にも！data地獄が見え見えってこと的にも！！
		
		"スイートポテト": baked sweet_potato
　　　　　パン: baked wet grinded wheat
		チョコケーキ: choco_creamed strawberry_rided kiwi_rided sugered milked grinded wheat //←馬鹿 あといちごとキーウィー逆の場合失敗になるのカスすぎる
		*/
	},
	{
		name:"carrot",
		jpnm:"にんじん",
		appe:0.5,
		rimi:1,
		desc:``,
		flav:"",
	},
	{
		name:"potato",
		jpnm:"ばれいしょ",
		appe:1.0,
		rimi:1,
		desc:``,
		flav:"",
	},
	{
		name:"sweet_potato",
		jpnm:"",
		appe:1.0,
		rimi:2,
		desc:``,
		flav:"",
	},
]


const Racers = [
    /*


    #ヨウ素
    ・後隙 任意の行動後の時間のこと。 規定値は2000。%n,{行動}でその行動は後隙がnにできる
    ・ep ExPt（名称変更するかも） maxは固定値100で、行動後に5増加し、他者から"悪い効果"を受けた時にはstat["aga"]/10増加する。100になると、後隙を無視して固有のEXスキルが発動。
    ・P パッシブ。固有だし、ない奴もいる

    #ステータスの制度を設ける？やるなら4つは欲しいし、規定値？基準値？は100にしたい
    ・敏捷 行動後の後隙を値*10分減少させます。
    ・抵抗 他者から"悪い効果"を受けた際に増加するepを値/10にします。

    #対象
    -# 複数いる場合はidが若い人を選択
    me 自分自身 | over 自分以外の全員 | all 自分含む全員
    fir 先頭の人 | las 最後尾の人

    #行動 禁止 行動
    ・前進,歩数 {歩数}分進みます。abs(1)超過ならgap200msで移動 //←言い方カッコヨ スギ
    ・無 今日はなーんにもしません！
    ・集中,値 無の上位互換 自身のepを{値}分上昇させます
    ・効果,人,名称,時間 人に「{名称}」({時間})を付与します。
    ・効果削除,人,名称 人の「{名称}」を解消します。
    */
    {
        name:"ningen",
        jpnm:"人",
        flav:"普遍的なステータス。普通、人間はこうもなれない",
        acts:[ //後隙が終わり次第ランダム選択行動
            "移動,1",
            "移動,1",
            "%1000,無",
        ],
        spd:100, //100*10で1000ms↓↓
        aga:100, //100/10で10↑↑
    },
    {
        name:"a human",
        jpnm:"人間",
        flav:"すみません...",
        acts:[
            "前進,1",
            "前進,1",
            "%1500,前進,1",
            "%750,効果,me,奮起,3",
            "%500,転倒"
        ],
        spd:110,
        aga:50,

        P:"自分が転倒した", //ここ未定〜。{対象}が{行動}をしたなら、か？いや、、いいや。簡易的に...ifでゴリ押そう
        PF:(who) => { //if(typeof PF == "function")
            buffRemove(who, "奮起");
            buffAdd(who, "羞恥", 4);
        }
    }
]

const Buffs = [
    /*
    #type
    ・stack
    　becauseof（減る理由）
    　func（減るよって時の挙動）
    */
    {
        name:"stan",
        jpnm:"スタン",
        type:"time",
        effects:["行動不可"],
        desc:"行動不可",
        flav:"うん。"
    },
    {
        name:"palsy",
        jpnm:"麻痺",
        type:"stack",
        becauseof:"act_pre", //いざ行動！の前
        desc:`行動開始時、30%の確率で行動を"無"に変更します`,
        flav:"難しいこと言ってるけど、つまりは麻痺ったら規定値2000ms動けないってことねぇ〜ん",
        
        func:(who) => {
            // act_pre: res = await data.func(who), if(res) act = res;
            if(hit(30)) return "無";
            return 0;
        }
    },
    {
        name:"inspire",
        jpnm:"奮起",
        type:"stack",
        becauseof:"act_end",
        desc:"後隙を50%カットします", //これもifでやります
        flav:"最近アプデで、野良でも扱いやすくなったスキルです まじ可愛いけど地雷がちとか言われるからあんまり=あんまり"
    },
    {
        name:"shy",
        jpnm:"焦燥",
        type:"stack",
        becauseof:"act_start",
        desc:`後隙が25%カットされる。また行動開始時、50%の確率で行動を"無"に変更します`,
        flav:"うぅ..まじ無理全員去れガチ見ないで見ないで見ないで",
        func:(who, act) => {
            if(hit(50)) are = "無";
            return 0;
        }
    }
]