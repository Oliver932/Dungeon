
class Tile{

    constructor(x, y) {

        this.x = x;
        this.y = y;

        this.centreX = (this.x + 0.5) * width
        this.centreY = (this.y + 0.5) * height

        this.visited = false
        this.links = []
        this.barriers = []

        this.distance = 0
        this.visible = false
        this.seen = false
        this.type = undefined
        this.alight = false
        this.deadEnd = false
        this.cut = false

        this.enemy = false
        this.damage = 0
        this.baseDamage = 0

        this.background = noise(x * noiseScale, y * noiseScale)
        this.floor = Math.floor(random(0, 7))
        this.item = undefined
        this.chest = undefined
        this.chestClosed = true
        this.chestNum = 0

        this.coin = false
        this.potion = undefined
    }

    setup() {

        if (this.deadEnd) {

            if(Math.random() < chestChance) {

                let c = Math.random()

                if (c < enemyProp) {

                    this.chest = 'mimic'

                } else if (c < enemyProp + emptyProp) {

                    this.chest = 'empty'

                } else {

                    this.chest = 'full'
                }
            }

        } else if (this.cut) {

            if(Math.random() < spikeChance) {

                this.spikes = true
                this.damage += spikeDamage
                this.baseDamage += spikeDamage
            }

        } else if (Math.random() < holeChance) {

            this.hole = true
            
            if (Math.random() < goblinChance) {

                this.holeFull = true

            } else {

                this.holeFull = false
            }

        } else if (Math.random() < coinChance) {

            this.coin = true

        } else if (Math.random() < potionChance) {

            let p = Math.random() 
            let i = 0

            for (const type in potionStats.small) {
                if (Object.hasOwnProperty.call(potionStats.small, type)) {

                    const potion = potionStats.small[type];

                    i += potion.prop 

                    if (p < i) {

                        this.potion = type
                        break
                    }
                }
            }

        } else {

            startOptions.push(this)
        }
    }

    activate() {

        if (player && this.chest && this.chestClosed && Math.abs(player.x - this.centreX) <= chestRange * width && Math.abs(player.y - this.centreY) <= chestRange * height) {

            this.chestClosed = false
            this.chestNum ++

            if (this.chest == 'mimic') {

                if (Math.random() < bossChance) {

                    new Enemy('big_demon', this.x, this.y)

                } else {

                    new Enemy('chort', this.x, this.y)
                }
            }
        }

        if (player && this.hole && this.holeFull && Math.abs(player.x - this.centreX) <= holeRange * width && Math.abs(player.y - this.centreY) <= holeRange * height) {

            this.holeFull = false

            if (Math.random() < bossChance) {

                new Enemy('ogre', this.x, this.y)

            } else {

                new Enemy('goblin', this.x, this.y)
            }
    
        }
    }

    entered() {

        if (this.coin) {

            this.coin = false
            player.coins += 1
        }

        if (this.potion) {

            player.health = min(maxHealth, player.health + potionStats.small[this.potion].heal)
            player.damageFactor *= potionStats.small[this.potion].damage
            player.speedFactor *= potionStats.small[this.potion].speed

            this.potion = undefined
        }
    }

    showBackground() {

        map.push()

        map.translate(this.x * width, this.y * height)

        if (true) {

            if (this.background > 0.5) {

                map.noStroke()
                map.fill(color(247, 52, 43))

                map.rect(0, 0, width, height)
            }
        }

        map.pop()

    }

    show() {

        map.push()
        map.imageMode(CENTER)
        map.rectMode(CENTER)

        let colour

        if (this.type == 'Start') {

            colour = color(205, 127, 50)

        } else if (this.type == 'Middle') {

            colour = color(192, 192, 192)

        } else if (this.type == 'End') {

            colour = color(255, 215, 0)

        } else if (!this.visible){

            colour = color(0, 0, 0, 130)

        }

        map.translate(this.x * width, this.y * height)

        if (this.seen) {

            let image

            if (this.spikes) {

                image = images.spikes[Math.floor(time)%4]

            } else {

                image = images['floor'][this.floor]
            
            }

            for (const link of this.links) {

                if (link.seen) {
                
                    let dx = link.x - this.x
                    let dy = link.y - this.y

                    if (dx > 0) {

                        map.image(image, width, height/2, width/2, height/2)

                    } else if (dy > 0) {

                        map.image(image, width/2, height, width/2, height/2)

                    }
                }
            }

            if (this.hole) {

                image = images.hole
            }

            map.image(image, width/2, height/2, width/2, height/2)
        }

        if (this.type) {

            map.noStroke()
            map.fill(colour)
            map.rect(width/2, height/2, width/2, height/2)
        
        }

        if (this.chest) {

            let delay = 20

            if (this.chestClosed) {

                let image = images['chest'][this.chest][0]
                map.image(image, width/2, height/2, width * chestFactor/2, height *chestFactor/2)
                
            } else if (this.chestNum < 3 * delay) {

                let image = images['chest'][this.chest][Math.floor(this.chestNum / delay)]
                map.image(image, width/2, height/2, width * chestFactor/2, height *chestFactor/2)

                // if (time % 4 == 0) {

                //     this.chestNum ++ 
                // }

                this.chestNum ++ 
            }
        }

        if (this.coin) {

            let image = images.coin[Math.floor(time / 2) % 4]
            map.image(image, width/2, height/2, width * coinFactor/2, height * coinFactor/2)

        }

        if (this.potion) {

            let image = images.potion.small[this.potion]
            map.image(image, width/2, height/2, width * potionFactor/2, height * potionFactor/2)

        }

        map.pop()

    }

    shatter() {

        for (const barrier of this.barriers) {
            
            if (barrier[4]) {

                barrier[4].links.push(this)
                this.links.push(barrier[4])
                this.barriers.splice(this.barriers.indexOf(barrier), 1)
            }
        }

        if (this.x < columns - 1) {

            let right = tiles[this.x + 1][this.y]
            
            for (const b of right.barriers) {
                
                if (b[4] && b[4] == this) {

                    right.links.push(this)
                    this.links.push(right)
                    right.barriers.splice(right.barriers.indexOf(b), 1)
                }
            }
        }

        if (this.y < rows - 1) {

            let down = tiles[this.x][this.y + 1]
            
            for (const b of down.barriers) {
                
                if (b[4] && b[4] == this) {

                    down.links.push(this)
                    this.links.push(down)
                    down.barriers.splice(down.barriers.indexOf(b), 1)
                }
            }
        }
    }

    drawBarriers() {

        map.push()

        map.fill(0)
        map.strokeWeight(barrierWidth)

        for (const barrier of this.barriers) {

            if (this.visible || (barrier[4] && barrier[4].visible)) {

                map.stroke(207, 186, 156)
                map.line(barrier[0], barrier[1], barrier[2], barrier[3])

            } else if (this.seen || (barrier[4] && barrier[4].seen)) {

                map.stroke(76, 50, 24)
                map.line(barrier[0], barrier[1], barrier[2], barrier[3])
            }
        }

        // map.textSize(20);
        // map.text(this.distance, (this.x + 0.5) * width, (this.y + 0.5) * height);

        map.pop()
    }

    raycast(player, x, y) {

        this.visible = true

        this.seen = true
        this.activate()

        player.visible.push(this)

        for (const link of this.links) {
            
            if (link.x - this.x == x && link.y - this.y == y) {

                link.raycast(player, x, y)
            }
        }
    }

    getCloser() {

        let next = this

        for (const link of this.links) {
            
            if (link.distance < next.distance) {

                next = link
            }
        }

        return next

    }

    pathFind() {

        let next = this.getCloser()

        if (next != this) {

            next.pathFind()
        }

    }


    getNeigbour(x, y) {

        if (this.x >= 0 - x && x < 0) {

            return tiles[this.x + x][this.y]

        } else if (this.x < columns - x && x > 0) {

            return tiles[this.x + x][this.y]

        } else if (this.y >= 0 - y && y < 0) {

            return tiles[this.x][this.y + y]

        } else if (this.y < rows - y && y > 0) {

            return tiles[this.x][this.y + y]
        }
    }

    getOptions() {

        let options = []

        let left = this.getNeigbour(-1, 0)

        if (left && left.visited == false) {

            options.push(left)
        }

        let right = this.getNeigbour(1, 0)

        if (right && right.visited == false) {

            options.push(right)
        }

        let up = this.getNeigbour(0, -1)

        if (up && up.visited == false) {

            options.push(up)
        }

        let down = this.getNeigbour(0,1)

        if (down && down.visited == false) {

            options.push(down)
        }

        return options
    }

}