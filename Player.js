
class Player{

    constructor() {

        this.x = (startTile.x + 0.5) * width
        this.y = (startTile.y + 0.5) * width

        this.name = 'knight_f'
        this.action = 'run'
        this.moving = 'right'
        this.facing = 'right'
        
        this.tile = undefined
        this.visible = []
        this.dead = false
        this.health = maxHealth
        this.coins = 0

        this.damageFactor = 1
        this.speedFactor = 1
        this.attackFactor = 1

        this.getDirections()
        this.getVisible()


    }

    getVisible() {

        for (const tile of this.visible) {
            tile.visible = false
        }

        this.visible = []

        this.tile.visible = true
        this.tile.seen = true

        this.visible.push(this.tile)

        for (const link of this.tile.links) {

            link.raycast(this, link.x - this.tile.x, link.y - this.tile.y)
            
        }

    }

    getDirections(){

        let prev = this.tile
        this.tile = tiles[Math.floor(this.x / width)][Math.floor(this.y / height)]

        if (this.tile != prev) {

            flowFill(this.tile.x, this.tile.y)
            this.tile.entered()
            // this.tile.activate();
        }

        this.right = false
        this.left = false
        this.up = false
        this.down = false

        for (const link of this.tile.links) {

            if(height / 2 - Math.abs(this.y - (this.tile.y + 0.5) * height) >= d / 2) {

                if (link.x - this.tile.x == 1) {

                    this.right = true

                } else if (link.x - this.tile.x == -1) {

                    this.left = true
                    
                }
            }

            if(width / 2 - Math.abs(this.x - (this.tile.x + 0.5) * width) >= d / 2) {

                if (link.y - this.tile.y == 1) {

                    this.down = true

                } else if (link.y - this.tile.y == -1) {

                    this.up = true
                    
                }
            }
        }
    }

    move(x, y) {

        this.action = 'run'

        if (x > 0) {

            this.moving = 'right'

            if(this.right) {

                this.x += x

            } else {

                this.x = min(this.x + x, (this.tile.x + 1) * width - d * 1.0001 / 2)
            }

        } else if (x < 0) {

            this.moving = 'left'

            if(this.left) {

                this.x += x

            } else {

                this.x = max(this.x + x, (this.tile.x) * width + d * 1.0001 / 2)
            }
        }

        if (y > 0) {

            if(this.down) {

                this.y += y

            } else {

                this.y = min(this.y + y, (this.tile.y + 1) * height - d * 1.0001 / 2)
            }

        } else if (y < 0) {

            if(this.up) {

                this.y += y

            } else {

                this.y = max(this.y + y, (this.tile.y) * height + d * 1.0001 / 2)
            }
        }



        this.getDirections();
        this.getVisible();
    }

    update() {

        this.health -= this.tile.damage * this.damageFactor
        this.damageFactor = Math.min(1, this.damageFactor * damageDecay)
        this.speedFactor = Math.max(1, this.speedFactor * speedDecay)

        if (this.health <= 0){

            this.dead = true
            alert('You died.')

        } else {

            this.show()
            this.action = 'idle'

        }


    }

    show() {

        let image = images[this.name][this.action][Math.floor(time)%4]

        map.push()

        map.imageMode(CENTER)

        if (this.moving == 'left') {

            map.push();
            map.translate(this.x,this.y);
            map.scale(-1,1);
            map.image(image, 0, 0, d, d)
            map.pop();

        } else {

            map.image(image, this.x, this.y, d, d)
        }

        map.pop()

        mask.push()

        mask.imageMode(CORNER)
        mask.translate(innerWidth/2 - (heartWidth * maxHealth/4), 3 * innerHeight/4)

        for (let i = 0; i < Math.floor(maxHealth / 2); i++) {
            
            let image
            if (i < Math.floor(this.health) / 2){

                image = images['heart']['full']

            } else if (i == Math.floor(this.health) / 2) {

                image = images['heart']['half']

            } else {

                image = images['heart']['empty']
            }

            mask.image(image, i * heartWidth, 0, heartWidth, heartWidth)
        }

        let textSize = 40

        mask.translate((heartWidth * maxHealth/4), heartWidth + textSize)

        mask.textSize(textSize)
        mask.textAlign(CENTER)

        mask.fill(215, 30, 30)
        mask.stroke(215, 30, 30)

        mask.text(round(this.speedFactor, 1).toString(), -textSize * 2, 0)

        mask.fill(0, 0, 255)
        mask.stroke(0, 0, 255)

        mask.text(round(this.damageFactor, 1).toString(), 0, 0)

        mask.fill(250, 253, 15)
        mask.stroke(250, 253, 15)

        mask.text(round(this.attackFactor, 1).toString(), textSize * 2, 0)

        mask.imageMode(CORNER)
        mask.translate( - coinWidth, -innerHeight/2 - heartWidth - textSize)  

        image = images.coin[Math.floor(time / 2) % 4]
        mask.image(image, 0, 0, coinWidth, coinWidth)

        mask.fill(255, 215, 0)
        mask.stroke(255, 215, 0)
        mask.textSize(coinWidth)
        mask.textAlign(LEFT, TOP)
        mask.text(this.coins.toString(), coinWidth, 0)

        mask.pop()


    }
}