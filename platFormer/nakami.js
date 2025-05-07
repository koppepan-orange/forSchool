const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const keys = {};
document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

const player = {
    x: 50,
    y: 300,
    width: 40,
    height: 40,
    color: '#f0f8ff',
    dx: 0,
    dy: 0,
    speed: 3,
    jumpPower: -10,
    gravity: 0.5,
    grounded: false,
};

const ground = {
    x: 0,
    y: 360,
    width: canvas.width,
    height: 40,
    color: '#000'
};

const obstacles = [
    {x: 200, y: 320, width: 60, height: 40, color: '#add8e6', attribute:[]},
    {x: 400, y: 280, width: 60, height: 80, color: '#add8e6', attribute:[]},
];

function update() {
    player.dx = 0;

    if (keys['a']) player.dx = -player.speed;
    if (keys['d']) player.dx = player.speed;
    if (keys['w'] && player.grounded) {
    player.dy = player.jumpPower;
    player.grounded = false;
    }
    if (keys['s'] && !player.grounded) player.dy += 1; // 急降下

    player.dy += player.gravity;
    player.x += player.dx;
    player.y += player.dy;

    // 地面との衝突
    if (player.y + player.height > ground.y) {
    player.y = ground.y - player.height;
    player.dy = 0;
    player.grounded = true;
    }

    // 障害物との衝突
    obstacles.forEach(obs => {
    if (player.x < obs.x + obs.width &&
        player.x + player.width > obs.x &&
        player.y < obs.y + obs.height &&
        player.y + player.height > obs.y) {

        if (player.dy > 0 && player.y + player.height - player.dy <= obs.y) {
        player.y = obs.y - player.height;
        player.dy = 0;
        player.grounded = true;
        } else if (player.dy < 0 && player.y >= obs.y + obs.height - player.dy) {
        player.y = obs.y + obs.height;
        player.dy = 0;
        } else if (player.dx > 0  && !obs.attribute.includes("pane")) {
        player.x = obs.x - player.width;
        } else if (player.dx < 0 && !obs.attribute.includes("pane")) {
        player.x = obs.x + obs.width;
        }
    }
    });
}

function draw() {
    ctx.fillStyle = '#888';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = ground.color;
    ctx.fillRect(ground.x, ground.y, ground.width, ground.height);

    obstacles.forEach(obs => {
    ctx.fillStyle = obs.color;
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });

    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

document.addEventListener("keydown", (e) => {
    if (e.key == " ") {
        let newAshiba = {
            x: (player.x - 10),
            y: (player.y + 40), 
            width: 60,
            height: 5,
            color: '#add8e6',
            attribute:["pane"]
        };
        obstacles.push(newAshiba);

        setTimeout(() => {
            // newAshibaをobstaclesから削除
            const index = obstacles.indexOf(newAshiba);
            if (index > -1) {
                obstacles.splice(index, 1);
            }
        }, 3000);
    }
});

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();