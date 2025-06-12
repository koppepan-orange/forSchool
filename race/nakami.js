//#region komagome
function delay(ms){return new Promise(resolve=>setTimeout(resolve,ms));}
async function NicoNicoText(mes){
    const newDiv = document.createElement('div');
    newDiv.textContent = mes;
    newDiv.style = `
    position: absolute;
    top: ${Math.random()*100}vh;
    right: 0;
    background-color: rgba(228, 249, 255, 0.563);
    color: #000000;
    font-size: 50px;
    `
    document.querySelector('body').appendChild(newDiv);
    //let speed = (Math.random()*100+1)*0.1;
    //let speed = mes.toString().length*2 
    speed = 2;
    for(let i = 0; window.innerWidth > i*speed; i++){
        let val = i*speed;
        newDiv.style.right = `${val}px`
        await delay(5);
    }
    newDiv.remove();
};
function arraySelect(array){
    let select = Math.floor(Math.random()*array.length);
    return array[select];
};
function arrayShuffle(array) {
    for(let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
function arrayGacha(array,probability){
    if(array.length !== probability.length){throw new Error("長さがあってないっす！先輩、ちゃんとチェックした方がいいっすよ〜？");}
    const total = probability.reduce((sum, p) => sum + p, 0);
    let random = Math.random() * total;
    for (let i = 0; i < array.length; i++) {
        if(random < probability[i]){
        return array[i];
        }
        random -= probability[i];
    }
};
function copy(obj){
    if (obj === null || typeof obj !== 'object') {
        return obj; // 基本型はそのまま返す
    }
    if (Array.isArray(obj)) {
        return obj.map(copy); // 配列の各要素を再帰コピー
    }
    const result = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            result[key] = copy(obj[key]); // オブジェクトのプロパティを再帰コピー
        }
    }
    return result;
};
function probability(num){
    return Math.random()*100 <= num;
    //例:num == 20 → randomが20以内ならtrue,elseならfalseを返す
};
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
//#endregion
const scene = new THREE.Scene(); //scene、まあ受け皿みたいなもんを生成
const renderer = new THREE.WebGLRenderer(); //レンダラーを生成
renderer.setClearColor('#f0f8ff');
renderer.setSize(window.innerWidth, window.innerHeight); //レンダラーのサイズを
document.body.appendChild(renderer.domElement); //レンダラーをcanvasの代わり

//環境光 new THREE.AmbientLight(色, 光の強さ)
const zentaiLight = new THREE.AmbientLight(0xffffff, 0.25);
scene.add(zentaiLight);

//平行光 new THREE.DirectionalLight(色, 光の強さ)
const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(5, 5, 5);
scene.add(sunLight);

//点光源 new THREE.PointLight(色, 光の強さ, 距離, 光の減衰率)
const pointLight = new THREE.PointLight(0xFFFFFF, 2, 50, 1.0);
scene.add(pointLight);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 100, 0);

let direction = new THREE.Vector3(); //direction == 向いてる角度

document.body.addEventListener("click", () => {
    document.body.requestPointerLock();
});

//#region cameraの回転について
let moveX = 0, moveY = 0;
let yawBase = 0; // カメラの基準向き（移動の向き）
let leftHaze = document.getElementById('left'), rightHaze = document.getElementById('right');
let upperHaze = document.getElementById('upper'), lowerHaze = document.getElementById('lower');
document.addEventListener("mousemove", (event) => {
    if (document.pointerLockElement !== document.body) return;

    moveX -= event.movementX * 0.002;
     moveX = Math.max(-Math.PI / 1.5, Math.min(Math.PI / 1.5, moveX));
     //解説, Math.PI == 180である故、 -120 ~ 120の範囲、ってことね
     if(moveX == Math.abs(Math.PI / 1.5)){
        leftHaze.style.display = 'block';
     }else{
        leftHaze.style.display = 'none';
     }
     if(moveX == -Math.abs(Math.PI / 1.5)){
        rightHaze.style.display = 'block';
     }else{
        rightHaze.style.display = 'none';
     }
    moveY -= event.movementY * 0.002;
     moveY = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, moveY));
     //解説, Math.PI == 180である故、 -90 ~ 90の範囲、ってことね
     if(moveY == Math.abs(Math.PI / 2.5)){
        upperHaze.style.display = 'block';
     }else{
        upperHaze.style.display = 'none';
     }
     if(moveY == -Math.abs(Math.PI / 2.5)){
        lowerHaze.style.display = 'block';
     }else{
        lowerHaze.style.display = 'none';
     }



    // 四元数を使った回転
    // 見た目の方向は yawBase + moveX
    const quaternion = new THREE.Quaternion();
    quaternion.setFromEuler(new THREE.Euler(moveY, yawBase + moveX, 0, "YXZ"));
    camera.quaternion.copy(quaternion);
    //YXZっていう変な順番の理由は、XYZにするとX→Y→Zの順で回転される故、なんか不自然な形で回るらしいからである

});
//#endregion

let velocity = new THREE.Vector3();
let acceleration = new THREE.Vector3();
let speed = 1;
let jumpPower = 2; // ジャンプの強さ
const keys = {w:false, s:false, a:false, d:false, space:false, q:false, e:false};

//キー入力を保存するやつ
document.addEventListener("keydown", e => {
    const key = e.key === " " ? "space" : e.key.toLowerCase();
    keys[key] = true;
});
document.addEventListener("keyup", e => {
    const key = e.key === " " ? "space" : e.key.toLowerCase();
    keys[key] = false;
});

//#region debug
let info = document.querySelector('#debug-info');
let isCreative = false
let tpSelect = document.querySelector('#tpSelect');
let tpSelectXD = 1;
let tpSelectable = 0;
document.addEventListener('keydown', event => {
    if(event.key == "r" && !tpSelectable){
        tpSelect.style.display = "flex";
        tpSelectable = 1;
    }
});
document.addEventListener('keyup', (event) => {
    switch(event.key){
        case 'g':
            if(info.style.display == 'none'){
                info.style.display = 'block';
            }else{
                info.style.display = 'none';
            }
            break;
        case 'i':
            speed += 0.5;
            break;
        case 'o':
            speed -= 0.5;
            break;
        case 'j':
            jumpPower += 0.5;
            break;
        case 'k':
            if(gravity == -0.1){
                isCreative = true;
                gravity = 0;
                velocity.set(0, 0, 0); //速度リセット
                acceleration.set(0, 0, 0); //加速度も
            }else{
                isCreative = false;
                gravity = -0.1;
            }
            break;
        case 'l':
            jumpPower -= 0.2;
            break;
        case 'b':
            placeObject({
                name: 'deer',
                x: camera.position.x,
                y: camera.position.y-7,
                z: camera.position.z,
                scale: 3,
                touchable: 0
            })
            break;
    };
    
    if(tpSelectable){
        switch(event.key){
            case 'ArrowRight':
                tpSelectXD += 1;
                if(4 < tpSelectXD) tpSelectXD = 4;
                tpSeltekiou()
                break;
            case 'ArrowLeft':
                tpSelectXD -= 1;
                if(tpSelectXD < 1) tpSelectXD = 1;
                tpSeltekiou()
                break;
            case 'r':
                tpSelectable = 0;
                let posiD = tpPositions[tpSelectXD];
                camera.position.set(posiD.x, posiD.y, posiD.z);
                velocity.set(0, 0, 0); //速度リセット
                acceleration.set(0, 0, 0); //加速度も
                tpSelect.style.display = 'none'
        };

        function tpSeltekiou(){
            let items = document.querySelectorAll('#tpSelect .item');
            console.log(items, tpSelectXD)
            items.forEach(a => {
                if(a.classList.contains('selected')) a.classList.remove('selected')
            })
            items[tpSelectXD-1].classList.add('selected')
        }
        
        // [1,2,3,4]

        //えーーーと～～～～～～～～～～＾＾＾
        //クラス selectedをつけてね～～～～～～～～～～～～
    }
})


//#endregion


const raycaster = new THREE.Raycaster();
const downVector = new THREE.Vector3(0, -1, 0); // 真下を向いたベクトル


let objects = [];
const touchableObjects = [];

const loader = new THREE.OBJLoader();
const mtlLoader = new THREE.MTLLoader();

let backGrounds = [];

presetObjects.forEach((back) => {
    placeObject(back)
});


let existOb = 0;
function placeObject(object){
    mtlLoader.load(`assets/objects/${object.name}.mtl`, (materials) => {
        materials.preload();
        loader.setMaterials(materials);

        loader.load(`assets/objects/${object.name}.obj`, (obj) => {
            obj.traverse((child) => {
                if (child.isMesh) {
                    // userDataにbackのプロパティを全部突っ込む
                    child.userData = {
                        id: existOb,
                        name: object.name,
                        touchable: object.touchable ? 1 : 0,
                        dethable: object.dethable ? 1 : 0,
                        accelable: object.accelable ? 1 : 0
                    };

                    child.geometry.computeBoundingBox();
                    objects.push(child);
                    existOb += 1;
                }
            });

            obj.position.set(object.x, object.y, object.z);
            obj.scale.set(object.scale, object.scale, object.scale);
            scene.add(obj);
            return obj;
        });
    });
}


// 床の作成
let floorAtumii = 2; //あつみぃ じゃねえんだよまじww
let floorWandH = 100;
const floorGeometry = new THREE.BoxGeometry(floorWandH, floorAtumii, floorWandH);
const floorMaterial = new THREE.MeshBasicMaterial({color: 0xabced8});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);

// グリッドの作成
const gridSize = floorWandH; // グリッドのサイズ
const gridStep = 5; // グリッドの間隔
const gridGeometry = new THREE.BufferGeometry();
const vertices = [];
// 縦の線を追加
for (let i = -gridSize / 2; i <= gridSize / 2; i += gridStep) {
    vertices.push(i, 0, -gridSize / 2); // 開始点
    vertices.push(i, 0, gridSize / 2); // 終了点
};
// 横の線を追加
for (let i = -gridSize / 2; i <= gridSize / 2; i += gridStep) {
    vertices.push(-gridSize / 2, 0, i); // 開始点
    vertices.push(gridSize / 2, 0, i); // 終了点
};
// バッファジオメトリに頂点を追加
gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
// グリッドのマテリアル
const grid = new THREE.GridHelper(floorWandH, floorWandH / gridStep, 0x000000, 0x000000);
grid.material.opacity = 0.5;
grid.material.transparent = true;
grid.position.y = -1;
scene.add(grid);

// 床を水平方向に配置
floor.rotation.x = 0;
floor.position.y = -floorAtumii;
floor.userData.touchable = true;
objects.push(floor);
scene.add(floor);

let geometry = new THREE.BoxGeometry(10, 5, 10); // 幅, 高さ, 奥行き
let material = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // 赤色のマテリアル
let accelelele = new THREE.Mesh(geometry, material); // 実体を作る
accelelele.position.set(0, -5, 0);
accelelele.userData.touchable = true;
accelelele.userData.accelPad = true;
scene.add(accelelele);

let block = new THREE.Mesh(geometry, material); // 実体を作る
block.position.set(10, 0, 0);
block.userData.touchable = true;
block.userData.accelPad = true;
objects.push(block);
scene.add(block);

let gravity = -0.1; // 重力加速度
let isGrounded = false; // 地面についているか
let isOnAccelPad = false;
function checkGround() {
    let rayLength = Math.abs(velocity.y) + 10;
    raycaster.set(camera.position, new THREE.Vector3(0, -1, 0));
    const intersects = raycaster.intersectObjects(objects, false);

    // 距離2に近くて、touchable === true のオブジェクトがあるかどうか
    const groundedHit = intersects.find(ob =>
        ob.object.userData.touchable &&
        ob.distance <= rayLength
    );

    let accelPadHit = intersects.find(ob =>
        ob.object.userData.touchable &&
        ob.object.userData.accelPad &&
        ob.distance <= rayLength
    );

    if(accelPadHit){
        isOnAccelPad = true;
    }else{
        isOnAccelPad = false;
    }

    if (groundedHit && !isCreative) {
        isGrounded = true;
        velocity.y = 0;
    } else {
        isGrounded = false;
    }
}
function checkWallCollision() {
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0; // 水平方向のみ判定
    direction.normalize();

    raycaster.set(camera.position, direction);
    const intersects = raycaster.intersectObjects(objects, false);

    const wallHit = intersects.find(ob =>
        ob.object.userData.touchable &&
        Math.abs(ob.distance - 2) < 1
    );

    if(wallHit && wallHit.length > 0 && wallHit[0].distance < 0.5) {
        return true; // 壁に当たった
    }
    return false;
}


let distance = 2;
let dragRate = 0.1;
let accelRate = 0.005;
let accelPadRate = 2;
function updateCameraMovement() {
    let direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();
    
    if (keys.q && keys.e){
        acceleration.z = accelRate*10;
    }else if (keys.w && !checkWallCollision()) {
        if (!isCreative) {
            // camera.position.addScaledVector(direction, speed);
            acceleration.z = accelRate;
        } else {
            camera.position.addScaledVector(direction.clone(), distance);
        }
    } else if (keys.s) {
        if (!isCreative) {
            // camera.position.addScaledVector(direction, -speed);
            acceleration.z = -accelRate;
        } else {
            camera.position.addScaledVector(direction.clone(), -distance);
        }
    } else {
        acceleration.z = -velocity.z * dragRate;
    }

    if(isOnAccelPad){
        acceleration.z = accelPadRate;
    }

    velocity.z += acceleration.z;
    camera.position.addScaledVector(direction, velocity.z);

    let right = new THREE.Vector3().crossVectors(camera.up, direction).normalize();
    if (keys.a) {
        camera.position.addScaledVector(right, speed);
    }
    if (keys.d) {
        camera.position.addScaledVector(right.clone(), -speed);
    }

    if (keys.space && isGrounded) {
        velocity.y = jumpPower;
        isGrounded = false;
    } else if (keys.space && !isGrounded && isCreative) {
        velocity.y = jumpPower;  // 上昇力を加える
    } else if (!keys.space && !isGrounded && isCreative) {
        velocity.y = 0;
    }
    
    
    if (!isGrounded) velocity.y += gravity;
    camera.position.y += velocity.y;

    checkGround('player');

    if (keys.w || keys.s || keys.a || keys.d) {
        yawBase += moveX;
        moveX = 0;
    }


    info.querySelector('.position').textContent = `position: x:${camera.position.x.toFixed(2)}, y:${camera.position.y.toFixed(2)}, z:${camera.position.z.toFixed(2)}`;
    info.querySelector('.rotation').textContent = `rotation: x:${camera.rotation.x.toFixed(2)}, y:${camera.rotation.y.toFixed(2)}, z:${camera.rotation.z.toFixed(2)}`;
    info.querySelector('.velocity').textContent = `velocity: x:${velocity.x.toFixed(2)}, y:${velocity.y.toFixed(2)}, z:${velocity.z.toFixed(2)}`;
    info.querySelector('.acceleration').textContent = `acceleration: x:${acceleration.x.toFixed(2)}, y:${acceleration.y.toFixed(2)}, z:${acceleration.z.toFixed(2)}`;
    //direction
    info.querySelector('.speed').textContent = `speed:${speed}`;
    info.querySelector('.jumpPower').textContent = `jumpPower:${jumpPower}`;
    info.querySelector('.isGrounded').textContent = `isGrounded:${isGrounded}`;
    info.querySelector('.isOnAccelPad').textContent = `isOnAccelPad:${isOnAccelPad}`;
}

function animate() {
    requestAnimationFrame(animate);
    updateCameraMovement();
    renderer.render(scene, camera);
}
animate();