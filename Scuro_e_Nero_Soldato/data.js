let Cards = {
    //normal
    'A':{
        name:'A',
        val:'A',
        suits:['♡','♤','♢','♧'],
        kind:'normal',
        rare:'N',
        buyable:1,
    },
    '2':{
        name:'2',
        val:2,
        suits:['♡','♤','♢','♧'],
        kind:'normal',
        rare:'N',
        buyable:1,
    },
    '3':{
        name:'3',
        val:3,
        suits:['♡','♤','♢','♧'],
        kind:'normal',
        rare:'N',
        buyable:1,
    },
    '4':{
        name:'4',
        val:4,
        suits:['♡','♤','♢','♧'],
        kind:'normal',
        rare:'N',
        buyable:1,
    },
    '5':{
        name:'5',
        val:5,
        suits:['♡','♤','♢','♧'],
        kind:'normal',
        rare:'N',
        buyable:1,
    },
    '6':{
        name:'6',
        val:6,
        suits:['♡','♤','♢','♧'],
        kind:'normal',
        rare:'N',
        buyable:1,
    },
    '7':{
        name:'7',
        val:7,
        suits:['♡','♤','♢','♧'],
        kind:'normal',
        rare:'N',
        buyable:1,
    },
    '8':{
        name:'8',
        val:8,
        suits:['♡','♤','♢','♧'],
        kind:'normal',
        rare:'N',
        buyable:1,
    },
    '9':{
        name:'9',
        val:9,
        suits:['♡','♤','♢','♧'],
        kind:'normal',
        rare:'N',
        buyable:1,
    },
    '10':{
        name:'10',
        val:10,
        suits:['♡','♤','♢','♧'],
        kind:'normal',
        rare:'N',
        buyable:1,
    },
    'J':{
        name:'J',
        val:10,
        suits:['♡','♤','♢','♧'],
        kind:'normal',
        rare:'N',
        buyable:1,
    },
    'Q':{
        name:'Q',
        val:10,
        suits:['♡','♤','♢','♧'],
        kind:'normal',
        rare:'N',
        buyable:1,
    },
    'K':{
        name:'K',
        val:10,
        suits:['♡','♤','♢','♧'],
        kind:'normal',
        rare:'N',
        buyable:1,
    },
    'strength':{
        name:'strength',
        id:'strength',
        val:0,
        suits:'Ⅷ',
        kind:'tarot',
        rare:'UR',
        buyable:1,
        description:'このカードが自分の場にあるならば、<br>一回バーストしそうになってもそのカードを♡のAに変えてくれます。<br>力でねじ伏せる..ってイメージ'
    },
    'wheel of fourtune':{
        name:'wheel of fourtune',
        id:'wheel_of_fourtune',
        val:0,
        suits:'Ⅹ',
        kind:'tarot',
        rare:'UR',
        buyable:1
    }
}

let Dealers = {
    'ギルガメッシュ':{
        name: 'ギルガメッシュ',
        opening: 'その身をもって、我の力を思い知るがいい',
        win: '楽しませてもらったぞ、雑種',
        lose: '認めよう、今はお前が強い..！'
    },
    'ティーヌ':{
        name: 'ティーヌ',
        opening: 'おにーさんが相手？なーんか弱そうだね？キャハッ！',
        win:'ざーこ♡ さいていへんよわよわごみ♡',
        lose:'ふぇっ!?な、なし！今のノーカン！！'
    },
    // 'カフカ':{ //スタレの方じゃなく、アークナイツの方です
    //     name: 'カフカ',
    //     opening: '頭使うのめんどくさいな...やっぱり、ドクターの指示に従うよ',
    //     win: '敵ってば弱っちぃな、こーなるってわかってたらテキトーに相手してやったのに',
    //     lose: '...結局、あいつらの意図を読めなかったって事か。'
    // },
    'コッペ':{
        name: 'コッペ',
        opening: 'あ、やほやほ〜！あそんでく〜？',
        win: 'あいーーwwありがとね〜ん(ウインク)',
        lose: 'っ...は、は？！こ、この私が負けるなんて.......!!!!!!'
    }
}