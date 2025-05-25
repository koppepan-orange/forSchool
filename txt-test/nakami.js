let executions = {
    cardDraw,
    cardMelt
}
async function execute(arr){
    let [functionName, ...args] = arr;
    await executions[functionName](...args);
}

const context = {};


async function read(lines) {
    for (let line of lines) {
        line = line.trim();
        if(line.startsWith('変数')) {
            let [, varName, , expression] = line.split(/ +/); // 変数 x = 乱数生成(1,3)
            if(expression.startsWith('乱数生成')) {
                let args = expression.match(/\((.*?)\)/)[1].split(',').map(Number);
                context[varName] = random(...args);
            }else{
                context[varName] = JSON.parse(expression);
            }
        }


   else if(line.startsWith('if')){
            let [, leftSide, operator, rightSide] = line.split(/ +/);
            let left = 0, right = 0;
            function stringOrNumber(moto){
                if(typeof(leftSide) == 'string') left = context[leftSide];
           else if(typeof(leftSide) == 'number') left = JSON.parse(leftSide);         
            }
            // left = context[leftSide]
            // right = JSON.parse(rightSide);
            let condition = false;
            switch(operator){
                case '==': condition = left == right; break;
                case '!=': condition = left != right; break;
                case '<':  condition = left <  right; break;
                case '>':  condition = left >  right; break;
                case '<=': condition = left <= right; break;
                case '>=': condition = left >= right; break;
            }
            if (!condition) continue;
        }

        else if (line.startsWith('wait')) {
            let [, ms] = line.split(/ +/);
            await delay(parseInt(ms));
        }

        else if (line.startsWith('log')) {
            let match = line.match(/log +"(.*)"/);
            console.log(match?.[1] ?? '???');
        }

        // ...必要に応じて他の命令追加
    }
}