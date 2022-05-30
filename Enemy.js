
class Enemy{

    constructor(name, x , y) {

        enemies.push(this)

        this.name = name;
        this.x = x;
        this.y = y;

        this.timer = 0
        this.tile = tiles[this.x][this.y]
        this.target = this.tile
        this.flames = []
        this.action = 'run';
        this.moving = 'right';
    }

    update() {

        this.timer += 1

        if (this.timer % (enemyStats[this.name].chaseTime) == 1){

            this.target = this.tile.getCloser();
            this.dx = Math.sign(this.target.x - this.x)
            this.dy = Math.sign(this.target.y - this.y)

        } else if (this.timer % (enemyStats[this.name].chaseTime) == 0){

            if (this.target != this.tile) {

                let damage = enemyStats[this.name].damage

                this.tile.enemy = false
                this.tile.damage = Math.max(this.tile.baseDamage, this.tile.damage - damage)

                if (this.target.spikes && enemyStats[this.name].trapVulnerable) {

                    enemies.splice(enemies.indexOf(this), 1)
            
                } else {

                    this.target.enemy = true
                    this.target.damage += damage

                    this.tile = this.target;
                    this.x = this.target.x
                    this.y = this.target.y
                }
            }

        }

        this.show();
    }

    show() {

        let ct = enemyStats[this.name].chaseTime
        let td = enemyStats[this.name].d

        let image = images[this.name][this.action][Math.floor(time)%4]
        let x = (this.x + 0.5 + this.dx * (this.timer % ct)/ct) * width
        let y = (this.y + 0.5 + this.dy * (this.timer % ct)/ct) * height

        map.push()

        map.imageMode(CENTER)

        if (this.moving == 'left') {

            map.push();
            map.translate(x,y);
            map.scale(-1,1);
            map.image(image, 0, 0, td, td)
            map.pop();

        } else {

            map.image(image, x, y, td, td)
        }

        map.pop()
    }
}

