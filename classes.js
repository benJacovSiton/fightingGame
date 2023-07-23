class Sprite {
    constructor({ position , imgSrc , scale = 1 , frameMax = 1 , offset = {x: 0 , y: 0}}) {
        this.position = position;
        this.height = 150;
        this.width = 50;
        this.image = new Image();
        this.image.src = imgSrc;
        this.scale = scale;
        this.frameMax = frameMax;
        this.frameCurrent = 0;
        this.frameElapsed = 0;
        this.frameHold = 5;
        this.offset = offset;
    }

    draw() {
        
        c.drawImage(
            this.image ,
            this.frameCurrent * (this.image.width / this.frameMax),
            0,
            this.image.width / this.frameMax,
            this.image.height,
            this.position.x - this.offset.x ,
            this.position.y - this.offset.y , 
            (this.image.width / this.frameMax) * this.scale ,
            this.image.height * this.scale,
            );
    }

    animateFrames(){
        this.frameElapsed ++;
        if(this.frameElapsed % this.frameHold == 0){

            if(this.frameCurrent < this.frameMax -1)
                this.frameCurrent++;
            else
                this.frameCurrent = 0;
        }
    }

    update() {
        this.draw();
        this.animateFrames()
    }
}

class Fighter extends Sprite {
    constructor({ position, speed, color , imgSrc , scale = 1 , frameMax = 1 ,  offset = {x: 0 , y: 0} , sprites , attackBox = {offset : {} , width: undefined , height: undefined}}) {
        super({position , imgSrc , scale , frameMax , offset});
        this.speed = speed;
        this.height = 150;
        this.width = 50;
        this.attackBox = {
            position: {
                x : this.position.x ,
                y: this.position.y 
            },
            offset : attackBox.offset,
            width: attackBox.width ,
            height: attackBox.height ,    
        }
        this.color = color;
        this.isAttacking;
        this.health = 100
        this.frameCurrent = 0;
        this.frameElapsed = 0;
        this.frameHold = 5;
        this.sprites = sprites;
        this.dead = false;

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = this.sprites[sprite].imgSrc;
        }
    }
    update() {
        this.draw();
        if(!this.dead)this.animateFrames();
      
        // attack boxes
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
        
        // draw the attack box
        //c.fillStyle = 'black';
        //c.fillStyle = this.color;  
        //c.fillRect(this.attackBox.position.x , this.attackBox.position.y , this.attackBox.width , this.attackBox.height);

        this.position.x += this.speed.x;
        this.position.y += this.speed.y;

        // gravity function
        if (this.position.y + this.height + this.speed.y >= canvas.height - 96){
            this.speed.y = 0;
            this.position.y = 330;
        }    
        else{
            this.speed.y +=  gravity;
        }

    }
           
    attack() {
        this.switchSprite('attack1');
        this.isAttacking = true;
    }
    
    takeHit(){

        if(this.health <= 0) this.switchSprite('death');
           
        this.switchSprite('takeHit');
        this.health -= 20;
        
    }


    switchSprite(sprite){
        // no action allow when the one of the sprites died
        if(this.image == this.sprites.death.image){
            if(this.frameCurrent == this.sprites.death.frameMax - 1)
                this.dead = true;
            return 
        }
         // overriding all other animtions with the attack animtion
        if(this.image == this.sprites.attack1.image && this.frameCurrent < this.sprites.attack1.frameMax -1 ) return;

          // overriding when fighter gets hit
        if(this.image == this.sprites.takeHit.image && this.frameCurrent < this.sprites.takeHit.frameMax -1 ) return;

        switch(sprite){

            case 'idle':
                if(this.image != this.sprites.idle.image){
                    this.image = this.sprites.idle.image;
                    this.frameMax = this.sprites.idle.frameMax;
                    this.frameCurrent = 0;
                }
                   
                break;

            case 'run':
                if(this.image != this.sprites.run.image){
                    this.image = this.sprites.run.image;
                    this.frameMax = this.sprites.run.frameMax;
                    this.frameCurrent = 0;
                }
                break;

            case 'jump':
                if(this.image != this.sprites.jump.image){
                    this.image = this.sprites.jump.image;
                    this.frameMax = this.sprites.jump.frameMax;
                    this.frameCurrent = 0;
                }
                break;

            case 'fall':
                if(this.image != this.sprites.fall.image){
                    this.image = this.sprites.fall.image;
                    this.frameMax = this.sprites.fall.frameMax;
                    this.frameCurrent = 0;
                }
                break;

            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image;
                    this.frameMax = this.sprites.attack1.frameMax;
                    this.frameCurrent = 0;
                }
                break;
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image;
                    this.frameMax = this.sprites.takeHit.frameMax;
                    this.frameCurrent = 0;
                }
                break;
            case 'death':
                if (this.image !== this.sprites.death.image) {
                        this.image = this.sprites.death.image;
                        this.frameMax = this.sprites.death.frameMax;
                        this.frameCurrent = 0;
                }
                break;
        }
    }
}

   /*
         c.drawImage() 
         משמשת כדי לצייר מסגרת ספציפית של תמונת דמות מה שמאפשר הנפשה ואפקטי קנה מידה המבוססים על המאפיינים :
          frameCurrent, frameMax ו-scale 
          של המחלקה Sprite.
          מאפייני המיקום וההסטה משמשים לשליטה במיקום הדמות על הבד.
    */ 
    //   this.image אובייקט התמונה המכיל את הדמות שיש לצייר על הקאנבס. כלומר כל הפריים
    //   this.frameCurrent * (this.image.width / this.frameMax) בדרך זו, הוא בוחר את החלק המתאים של תמונת הדמות המתאים למסגרת האנימציה הנוכחית בציר האיקס
    // 0 מייג את מיקום הדמות בציר הווי מכיוון שזאת דמות בשורה אחת הוא יהיה מוגדר כאפס
    //  this.image.width / this.frameMax, זהו הרוחב של פריים בודד בתמונת הדמות. זה מאפשר להתאים רוחב המסגרת הנכון מתמונת הדמות
    // this.image.height גובה תמונת הדמות. מכיוון שתמונת הדמות נשארת זהה עבור כל הפריימים, נעשה שימוש בכל גובה התמונה.
    // this.position.x - this.offset.x ממקם בהתאם לקאנבס את הדמויות על ציר האיקס
    //  this.position.y - this.offset.y ממקם בהתאם לקאנבס את הדמויות על ציר הווי
    // (this.image.width / this.frameMax) * this.scale // זה מאפשר לשנות את גודל הדמות על הבד.

    /*
        animateFrames()
        מטרת הפונקציה היא להשהות את קצב ההנפשה של הפריים הקיים נגיד קפיצה שתהווה יותר זמן באוויר וכדומה
    */
    //     this.frameHold זהו מספר הפריימים שצריך לעבור לפני עדכון ההדמות למסגרת הבאה בהנפשה. 
    //     this.frameElapsed זהו מונה שגדל עם כל עדכון מסגרת שהפונקציה אפדייט נקראת כלומר הוא עוקב אחר מספר הפריימים שעברו מאז שינוי הפריים האחרון בהנפשה
    //     if(this.frameElapsed % this.frameHold == 0){ // כל עוד הערכים במשתנים אינם זהים כלומר שארית החלוקה היא אפס 
    //         if(this.frameCurrent < this.frameMax -1) // וכל עוד הפריים בטווח 
    //             this.frameCurrent++; // נעבור לפריים הבא
    //         else
    //             this.frameCurrent = 0; // נגמרו הפריימים של ההנפשה נאחתל את הפריים הנוכחי להתחלה בשביל הבא
    //     }
    // }