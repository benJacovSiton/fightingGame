const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.7;

const background = new Sprite({
    position : {
        x: 0 ,
        y: 0 
    },
    imgSrc: './img/background.png'
})

const shop = new Sprite({
    position : {
        x: 600 ,
        y: 128 ,
       
    },
    imgSrc: './img/shop.png', 
    scale: 2.75 , 
    frameMax: 6 ,
})

const player = new Fighter({
    
    position: {
        x: 0,
        y: 0,
    },

    speed: {
        x: 0,
        y: 0,
    },

    imgSrc: './img/samuraiMack/Idle.png',

    frameMax: 8 , 

    scale : 2.5 , 

    offset : {
        x: 215 ,
        y: 157
    },

    sprites : {

        idle : {
            imgSrc: './img/samuraiMack/Idle.png',
            frameMax: 8
        },
        run : {
            imgSrc: './img/samuraiMack/Run.png',
            frameMax: 8 ,
        },
        jump : {
            imgSrc: './img/samuraiMack/Jump.png',
            frameMax: 2 ,
        },
        fall : {
            imgSrc: './img/samuraiMack/Fall.png',
            frameMax: 2 ,
        },
        attack1 : {
            imgSrc: './img/samuraiMack/Attack1.png',
            frameMax: 6 ,
        },
        takeHit: {
            imgSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            frameMax: 4 ,
        },
        death:{
            imgSrc: './img/samuraiMack/Death.png',
            frameMax: 6 ,
        },  
      
    },
    attackBox : {
        offset: {
            x : 70 ,
            y : 50,
        },
        width: 170 ,
        height : 50,
    }, 

});

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100,
    },
    speed: {
        x: 0,
        y: 0,
    },
    offset : {
        x: -50,
        y: 0,
    },
    
    imgSrc: './img/kenji/Idle.png',

    frameMax: 4 , 

    scale : 2.5 , 

    offset : {
        x: 215 ,
        y: 167
    },

    sprites : {

        idle : {
            imgSrc: './img/kenji/Idle.png',
            frameMax: 4
        },
        run : {
            imgSrc: './img/kenji/Run.png',
            frameMax: 8 ,
        },
        jump : {
            imgSrc: './img/kenji/Jump.png',
            frameMax: 2 ,
        },
        fall : {
            imgSrc: './img/kenji/Fall.png',
            frameMax: 2 ,
        },
        attack1 : {
            imgSrc: './img/kenji/Attack1.png',
            frameMax: 4 ,
        },
        takeHit: {
            imgSrc: './img/kenji/Take hit.png',
            frameMax: 3 ,
        },
        death:{
            imgSrc: './img/kenji/Death.png',
            frameMax: 7 ,
        },  
    },
    attackBox : {
        offset: {
            x : -170 ,
            y : 50,
        },
        width: 100 ,
        height : 50,
    },
   
});

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w:{
        pressed: false
    },
    ArrowRight :{
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    }
};

decreaseTimer();  

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    player.update();
    enemy.update();

    player.speed.x = 0; 
    enemy.speed.x = 0; 

    // player movement
  
    if (keys.a.pressed && player.lastKey == 'a' ){
        player.speed.x = -5;
        player.switchSprite('run');
    }
      
    else if (keys.d.pressed && player.lastKey == 'd' ){
        player.speed.x = 5;
        player.switchSprite('run');
    }

    else{
        player.switchSprite('idle');
    }

    // jumping
    if(player.speed.y < 0){
        player.switchSprite('jump');
    }
    else if(player.speed.y > 0) {
        player.switchSprite('fall');
    }
        
    // enemy movement
    if (keys.ArrowLeft.pressed){
        enemy.speed.x = -5;
        enemy.switchSprite('run');
    }
        
    else if (keys.ArrowRight.pressed){
        enemy.speed.x = 5;
        enemy.switchSprite('run');
    }

    else{
        enemy.switchSprite('idle');
    }

      // jumping
    if(enemy.speed.y < 0){
        enemy.switchSprite('jump');
    }
    else if(enemy.speed.y > 0) {
        enemy.switchSprite('fall');
    }
  
    // detect for collision and enemy gets hit
    if (reactangularCollsion({ rectangle1: player, rectangle2: enemy }) && player.isAttacking && player.frameCurrent == 4 ) {
        enemy.takeHit();
        player.isAttacking = false;
       
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
        console.log("Player frameCurrent:", player.frameCurrent);
        console.log("Player isAttacking:", player.isAttacking);
        //console.log("Enemy frameCurrent:", enemy.frameCurrent);
        //console.log("Enemy isAttacking:", enemy.isAttacking);
    }
    if (reactangularCollsion({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking && enemy.frameCurrent == 2) {
        player.takeHit();
        enemy.isAttacking = false;

        document.querySelector('#playerHealth').style.width = player.health + '%';
        console.log("Player frameCurrent:", player.frameCurrent);
        console.log("Player isAttacking:", player.isAttacking);
        //console.log("Enemy frameCurrent:", enemy.frameCurrent);
        //console.log("Enemy isAttacking:", enemy.isAttacking);
    } 

    // if player misses
    if(player.isAttacking && player.frameCurrent == 4){
        player.isAttacking = false;
    }

    // if enemy misses
    if(enemy.isAttacking && enemy.frameCurrent == 2){
        enemy.isAttacking = false;
    }

       // end game based on health
       if(player.health <= 0 || enemy.health <= 0 ){
        determineWinnwer({player , enemy});
    }
    

}


animate();

window.addEventListener('keydown', (event) => {
    if(!player.dead){
        switch (event.key) {
            case 'd':
                keys.d.pressed = true;
                player.lastKey = 'd';
                break;
            case 'a':
                keys.a.pressed = true;
                player.lastKey = 'a';
                break;
            case 'w':
                player.speed.y = -20;
                break;
            case ' ':
                player.attack();
                player.isAttacking = true;
                break;
        }
     }
     if(!enemy.dead){
           switch(event.key){
             // enemy
             case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastKey = "ArrowRight";
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = "ArrowLeft";
                break;
            case 'ArrowUp':
                enemy.speed.y = -20;
                break;
            case 'ArrowDown':
                enemy.attack();
                    break;
            }
            console.log(event.key);
        }
    }
);

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'w':
            keys.w.pressed = false;
            break;

        // enemy keys
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        // case 'ArrowDown':
        //  keys.ArrowDown.pressed = false;
        //  break;
    }
});

// מקבל אובייקט שהוא בעצמו מורכב מאובייקטים כמו מיקום ותיקון שמיכלים מאפיינים של צירי האיקס והווי
// position מייצג נקודת מוצא - תחילת הספירה
// offset מייצג את התיקון לנקודת המוצא בכך שהוא מתקן את מיקום הדמויות וגם מאפשר מרחב תנועה בעת ציור כמו בעת תקיפה
// speed מייצג את המהירות בה נעה הדמות בציר האיקס והווי 
//frameMax סה"כ הפרימים הקיימים לאותה התנועה - בתמונה שב 
        // imgSrc - הכתובת של התמונת פריימים 
// scale מיצג את גדול האלמנט שבתמונה בהצגתו בקאנבס
// sprites אובייקט המכיל תכונות של הדמות המוצגת על בקאנבס כלומר לוחם
// כל אובייקט מטיפוס זה מכוון לפריים כלומר הפריים מתורגם לאובייקט של כתובת התמונה להצגה ומקסימום פריימים בה
// כך שניתנת היכולת להציג הפריימים תחת חיבור של הקוד לפריים
// attackBox אווביקט נוסף תפקידו לתחם את איזור שבו נחשב שהדמות מתקיפה כלומר באה במגע עם החרב
// בתוך האובייקט הזה יש אינו אובייקט מתקן שיש לו ערכי ציר אורך וגובה כמו כל השאר כמובן


