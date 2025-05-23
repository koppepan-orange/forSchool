let Cards = {
    //normal
    'A':{
        name:'A',
        val:'A',
        kind:'normal',
        prop:[],
        attend:[],
        melted:[],
        elseed:[],
        description:'エース。<br>1もしくは11になる(自動)',
        rare:'N',
        buyable:1,
    },
    '2':{
        name:'2',
        val:2,
        suits:['♡','♤','♢','♧'],
        kind:'normal',
        prop:[],
        attend:[],
        melted:[],
        elseed:[],
        description:'にゃんにゃんする〜のやつです',
        rare:'N',
        buyable:1,
    },
    '3':{
        name:'3',
        val:3,
        suits:['♡','♤','♢','♧'],
        kind:'normal',
        prop:[],
        attend:[],
        melted:[],
        elseed:[],
        description:'サァン(伝統芸能)',
        rare:'N',
        buyable:1,
    },
    '4':{
        name:'4',
        val:4,
        suits:['♡','♤','♢','♧'],
        kind:'normal',
        prop:[],
        attend:[],
        melted:[],
        elseed:[],
        description:'（Aが眼鏡を外す）<br>G（目が3になるのかな..）<br>G「4？？？？？」',
        rare:'N',
        buyable:1,
    },
    '5':{
        name:'5',
        val:5,
        suits:['♡','♤','♢','♧'],
        kind:'normal',
        prop:[],
        attend:[],
        melted:[],
        elseed:[],
        description:'555555（タイ語）',
        rare:'N',
        buyable:1,
    },
    '6':{
        name:'6',
        val:6,
        suits:['♡','♤','♢','♧'],
        kind:'normal',
        prop:[],
        attend:[],
        melted:[],
        elseed:[],
        description:'ロォク(伝統芸能)<br>2枚連続で出ると..?', //悪魔がデッキに追加、とか面白そう
        rare:'N',
        buyable:1,
    },
    '7':{
        name:'7',
        val:7,
        suits:['♡','♤','♢','♧'],
        kind:'normal',
        prop:[],
        attend:[],
        melted:[],
        elseed:[],
        description:'3枚連続で出るとダメージ3倍...<br>とかあったら面白いよね<br>7のみ構成が流行りそう',
        rare:'N',
        buyable:1,
    },
    '8':{
        name:'8',
        val:8,
        suits:['♡','♤','♢','♧'],
        kind:'normal',
        prop:[],
        attend:[],
        melted:[],
        elseed:[],
        description:'ちょっと待ってちょっと待って？<br>この8を横向きにすると...∞<br>ってことで負け〜〜〜〜(大嘘)',
        rare:'N',
        buyable:1,
    },
    '9':{
        name:'9',
        val:9,
        suits:['♡','♤','♢','♧'],
        kind:'normal',
        prop:[],
        attend:[],
        melted:[],
        elseed:[],
        description:'キュ〜(伝統芸能)<br>計算しやすい..ランキング..1位',
        rare:'N',
        buyable:1,
    },
    '10':{
        name:'10',
        val:10,
        suits:['♡','♤','♢','♧'],
        kind:'normal',
        prop:[],
        attend:[],
        melted:[],
        elseed:[],
        description:'コマじゅうろう懐かし....',
        rare:'N',
        buyable:1,
    },
    'J':{
        name:'J',
        val:10,
        suits:['♡','♤','♢','♧'],
        kind:'normal',
        prop:[],
        attend:[],
        melted:[],
        elseed:[],
        description:'10として扱う。<br>Jokerじゃないよ<br>ジェームズだよ',
        rare:'N',
        buyable:1,
    },
    'Q':{
        name:'Q',
        val:10,
        suits:['♡','♤','♢','♧'],
        kind:'normal',
        prop:[],
        attend:[],
        melted:[],
        elseed:[],
        description:'10として扱う。<br>QとKが自分の場に同時にあると..?',//何かあったらいいよね ..けど変な雰囲気なりそうだから無しにゃ
        rare:'N',
        buyable:1,
    },
    'K':{
        name:'K',
        val:10,
        suits:['♡','♤','♢','♧'],
        kind:'normal',
        prop:[],
        attend:[],
        melted:[],
        elseed:[],
        description:'10として扱う。<br>タロットの皇帝と仲良いとか面白そう',
        rare:'N',
        buyable:1,
    },
    'strength':{
        name:'strength',
        id:'strength',
        val:0,
        suits:['♡','♤','♢','♧'],
        kind:'tarot',
        prop:[],
        attend:[],
        melted:[],
        elseed:[],
        description:'このカードが自分の場にあるならば、<br>一回バーストしそうになっても<br>　そのカードを♡のAに変えてくれる<br>力でねじ伏せる..ってイメージ<br>絵が酷いね',
        rare:'UR',
        buyable:1,
    },
    'wheel of fourtune':{
        name:'wheel of fourtune',
        id:'wheel_of_fourtune',
        val:0,
        suits:['♡','♤','♢','♧'],
        kind:'tarot',
        prop:[],
        attend:[],
        melted:[],
        elseed:[],
        description:'相手と自分の手札を全交換します<br>吉と出るか凶と出るか...<br>右の犬の顔好き まじかわいい',
        rare:'UR',
        buyable:1
    }
}

let Dealers = {
    'ギルガメッシュ':{
        name: 'ギルガメッシュ',
        stage: 1,
        opening: 'その身をもって、我の力を思い知るがいい',
        win: '楽しませてもらったぞ、雑種',
        lose: '認めよう、今はお前が強い..！',
        maxhp: 20,
        deckKind: 'normal'
    },
    'コッペ':{
        name: 'コッペ',
        stage: 1,
        opening: 'あ、やほやほ〜！あそんでく〜？',
        win: 'あいーーwwありがとね〜ん(ウインク)',
        lose: 'っ...は、は？！こ、この私が負けるなんて.......!!!!!!',
        maxhp: 23,
        deckKind: 'normal'
    },
    'クロワ':{
        name:'クロワ',
        stage: 1,
        opening:'運も実力のうち..って言うけど、実際そんなことないと思わない？',
        win:'ふっ..所詮は敗北者、ね', //「出直してくるといいわ」
        lose:'おめでとう、あなたの運の勝利よ', //実は最初に保険かけてたっていうね？？まじ俺だな
        maxhp: 32,
        deckKind: 'normal'
    },
    'ティーヌ':{
        name: 'ティーヌ',
        stage: 1,
        opening: 'おにーさんが相手？なーんか弱そうだね？キャハッ！',
        win:'ざーこ♡ さいていへんよわよわごみ$#♡',
        lose:'ふぇっ!?なし！今のノーカン！！',
        maxhp: 18,
        deckKind: 'normal'
    },
    'シーナ':{
        name:'シーナ',
        stage: 1,
        opening:'はじめまして、私はシーナよ よろしくね〜♡',
        win:'よしよし..頑張ったね....♡ でも君のま〜け♡',
        lose:'わ...君はつよいね〜..♡ ご褒美に撫でてあげる...♡',
        maxhp: 22,
        deckKind: 'normal'
    },
    'ストルテ':{
        name:'ストルテ',
        stage: 1,
        opening:'おw兄さんが相手？あてぃしはストルテ、よろしくね〜♪',
        win:'は〜いあてぃしの勝ち〜 また遊ぼうね〜ん♪',
        lose:'え〜まじぃ〜？ 次はぜってー負けねぇかんナ〜', //ちょっと藤田ことね味入っちゃったかも まあいいか
        maxhp: 30,
        deckKind: 'normal'
    }, //ストルテはアフレコが楽しいね
    'デピス':{
        name:'デピス', //デピスは友達にも頼もうか
        stage: 1,
        // opening:'null',
        // win:'null',
        // lose:'null',

        //自分で考えてみたver
        opening:'俺..私はデピスだ、よろしく頼む',
        win:'ひひっ..ありがと',
        lose:'な..ふふ...いや、ありがと',
        maxhp: 24,
        deckKind: 'normal'
    },
    // 'メロンパ':{
    //     name:'メロンパ',
    //     stage: 1,

    //     //配信者スタンスで行くなら..って思ったけど何も思いつかねぇ....
    //     //挨拶とか先決めんときついかも
    //     opening:'ネットのおまいらのために、インターネットエンジェル、ただいま降臨！！',
    //     win:'',
    //     lose:'',
    //     maxhp: 19,
    //     deckKind: 'normal'
    // },
    '小安見ニーク':{
        name: '小安見ニーク', //このゲームのスピンオフ元であるclicker of mugenってゲームのキャラです 多分すごい小鳥遊ホシノに影響されてる
        stage: 1,
        opening: 'やぁやぁ、よろしくね〜',
        win: 'んぇ？あ勝ったの？やったぁ....zz',
        lose: '..?ゎ..君は強いんだね..?すごいよぉ....zz',
        maxhp: 21,
        deckKind: 'normal'
    }
}

let deckKinds = {
    'normal':{
        name: 'normal',
        deck: [['A','♡'],['2','♡'],['3','♡'],['4','♡'],['5','♡'],['6','♡'],['7','♡'],['8','♡'],['9','♡'],['10','♡'],['J','♡'],['Q','♡'],['K','♡'],
               ['A','♤'],['2','♤'],['3','♤'],['4','♤'],['5','♤'],['6','♤'],['7','♤'],['8','♤'],['9','♤'],['10','♤'],['J','♤'],['Q','♤'],['K','♤'],
               ['A','♢'],['2','♢'],['3','♢'],['4','♢'],['5','♢'],['6','♢'],['7','♢'],['8','♢'],['9','♢'],['10','♢'],['J','♢'],['Q','♢'],['K','♢'],
               ['A','♧'],['2','♧'],['3','♧'],['4','♧'],['5','♧'],['6','♧'],['7','♧'],['8','♧'],['9','♧'],['10','♧'],['J','♧'],['Q','♧'],['K','♧'],]
    }
}