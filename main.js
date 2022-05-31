
let canvas
let map
let mask

let player
let enemies = []

let time = 0

let tiles = []
let images = {}

let startTile 
let middleTile
let endTile

let startOptions = []

let maxDist = 0;
let maxTile = undefined;

let finished = false

function flowFill(x, y) {

    maxDist = 0;
    maxTile = undefined;

    for (const column of tiles) {
        
        for (const tile of column) {

            tile.visited = false;
        }
    }


    let tileList = [tiles[x][y]]
    tileList[0].distance = 0
    tileList[0].visited = true

    for (const tile of tileList) {

        // tile.visited = true

        for (const link of tile.links) {

            if (!link.visited) {
            
                link.distance = tile.distance + 1

                if (link.distance >= maxDist) {

                    maxDist = link.distance
                    maxTile = link
                }

                link.visited = true
                tileList.push(link)
            }
        }

    }
}

function preload() {

    for (const name of characterImages) {

        images[name] = {}

        for (const action of ['idle', 'run']) {

            images[name][action] = []
            
            for (let i = 0; i < 4; i++) {

                images[name][action].push(loadImage('/Tileset/frames/' + name + '_' + action + '_anim_f' + i.toString() + '.png'))
                
            }
        }
    }

    images['floor'] = []

    for (let i = 1; i < 9; i++) {
        
        images['floor'].push(loadImage('/Tileset/frames/floor_' + i.toString() + '.png'))
    }

    images['chest'] = {}

    let chests = ['full', 'mimic', 'empty']

    for (const chest of chests) {

        images['chest'][chest] = []

        for (let i = 0; i < 3; i++) {
            
            images['chest'][chest].push(loadImage('/Tileset/frames/chest_' + chest + '_open_anim_f' + i.toString() + '.png'))
        }
    }

    images['heart'] = {}

    let hearts = ['full', 'half', 'empty']

    for (const heart of hearts) {

        images['heart'][heart] = loadImage('/Tileset/frames/ui_heart_' + heart + '.png')
    }

    images['spikes'] = []

    for (let i = 0; i < 4; i++) {
        
        images['spikes'].push(loadImage('/Tileset/frames/floor_spikes_anim_f' + i.toString() + '.png'))
        
    }

    images['hole'] = loadImage('/Tileset/frames/floor_ladder.png')

    images['coin'] = []

    for (let i = 0; i < 4; i++) {
        
        images.coin.push(loadImage('/Tileset/frames/coin_anim_f' + i.toString() + '.png'))
    }

    images['potion'] = {'small':[],'big':[]}

    for (const type of Object.keys(potionStats)) {

        images.potion.small[type] = loadImage('/Tileset/frames/flask_' + type + '.png')
        images.potion.big[type] = loadImage('/Tileset/frames/flask_big_' + type + '.png')
    }

    console.log(images)
}



function setup() {

    // initialisation

    canvas = createCanvas(innerWidth, innerHeight);
    map = createGraphics(screenwidth, screenheight);
    mask = createGraphics(innerWidth, innerHeight);

    // mask creation 

    // mask.push()
    // mask.background(30)
    // mask.erase()
    // mask.circle(innerWidth/2, innerHeight/2, innerHeight)
    // mask.pop()

    // tile creation

    for (let x = 0; x < columns; x++) {
        
        tiles.push([]);

        for (let y = 0; y < rows; y++) {

            tiles[x].push(new Tile(x, y))
        }
    }

    // maze creation

    let tile = tiles[Math.floor(random(0, columns))][Math.floor(random(rows))]
    let history = [tile]

    // startTile = tile
    // tile.type = 'Start'

    while (true) {

        tile.visited = true

        let options = tile.getOptions()


        if (options.length > 0) {

            let next = random(options)

            if (Math.random() < cutChance && options.length > 1) {

                tile.cut = true

                options.splice(options.indexOf(next), 1)
                let cut = random(options)

                tile.links.push(cut)
                cut.links.push(tile)
            
            }

            tile.links.push(next)
            next.links.push(tile)
            history.push(tile);
            tile = next;



        } else {

            if (tile.links.length == 1 && tile != startTile) {

                tile.deadEnd = true

            }

            history.splice(history.length - 1, 1)

            if (history.length == 0) {

                break;
            
            } else {

                tile = history[history.length - 1]
            }
        }
    }

    //barrier creation

    for (const column of tiles) {
        
        for (const tile of column) {

            if (tile.x == 0) {

                tile.barriers.push([barrierWidth / 2, tile.y * height - barrierWidth / 2, barrierWidth / 2, (tile.y + 1) * height - barrierWidth / 2, undefined])

            } else if (tile.x == columns - 1) {

                tile.barriers.push([screenwidth - barrierWidth / 2, tile.y * height - barrierWidth / 2, screenwidth - barrierWidth / 2, (tile.y + 1) * height - barrierWidth / 2, undefined])
            }

            if (tile.y == 0) {

                tile.barriers.push([tile.x * width - barrierWidth / 2,  barrierWidth / 2, (tile.x + 1) * width - barrierWidth / 2, barrierWidth / 2, undefined])

            } else if (tile.y == rows - 1) {

                tile.barriers.push([tile.x * width - barrierWidth / 2, screenheight - barrierWidth / 2, (tile.x + 1) * width - barrierWidth / 2, screenheight - barrierWidth / 2, undefined])
            }

            tile.visited = false;

            let left = tile.getNeigbour(-1, 0)
            
            if (left && !tile.links.includes(left)) {

                tile.barriers.push([tile.x * width - barrierWidth / 2, tile.y * height - barrierWidth / 2, tile.x * width - barrierWidth / 2, (tile.y + 1) * height - barrierWidth/2, left])
            }

            let up = tile.getNeigbour(0, -1)
            
            if (up && !tile.links.includes(up)) {

                tile.barriers.push([tile.x * width - barrierWidth / 2, tile.y * height - barrierWidth / 2, (tile.x + 1) * width - barrierWidth / 2, tile.y * height - barrierWidth / 2, up])
            }
        }
    }

    for (const column of tiles) {
            
        for (const tile of column) {

            tile.setup()
        }
    }

    startTile = random(startOptions)
    startTile.type = 'Start'

    // player creation

    player = new Player()

    //enemy creation

    endTile = maxTile
    endTile.type = 'End'

    new Enemy('necromancer', endTile.x, endTile.y)

    // alert('Escape the dungeon')
}


function draw() {

    if (!player.dead){

        if (keyIsDown(LEFT_ARROW)) {

            player.move(-speed * player.speedFactor, 0)

        } else if (keyIsDown(RIGHT_ARROW)) {

            player.move(speed * player.speedFactor, 0)
            
        }
        
        if (keyIsDown(UP_ARROW)) {

            player.move(0, -speed * player.speedFactor)
            
        } else if (keyIsDown(DOWN_ARROW)) {

            player.move(0, speed * player.speedFactor)
            
        }

        push()
        mask.background(30)
        mask.erase()
        mask.circle(innerWidth/2, innerHeight/2, innerHeight)
        pop()

        push()

        background(0)
        map.background(0)

        for (const column of tiles) {
            
            for (const tile of column) {

                if (Math.abs(tile.x * width - player.x) - width <= viewRadius && Math.abs(tile.y * width - player.y) - height <= viewRadius) {

                    tile.showBackground()
                }
            }
        }
        
        for (const column of tiles) {
            
            for (const tile of column) {

                if (Math.abs(tile.x * width - player.x) - width <= viewRadius && Math.abs(tile.y * width - player.y) - height <= viewRadius) {

                    tile.show()
                }
            }
        }

        // for (const column of tiles) {
            
        //     for (const tile of column) {

        //         if (Math.abs(tile.x * width - player.x) <= viewRadius && Math.abs(tile.y * width - player.y) <= viewRadius) {

        //             tile.drawBarriers();
        //         }

        //         // tile.drawBarriers();
        //     }
        // }


        pop()

        for (const enemy of enemies) {
            
            enemy.update()
        }

        player.update()

        push()
        imageMode(CORNER)
        image(map, (innerWidth / 2 - player.x), (innerHeight / 2 - player.y), screenwidth, screenheight);
        pop()
        // imageMode(CORNER)
        // image(map, 0, 0, innerWidth, innerHeight);

        imageMode(CORNER)
        image(mask, 0, 0, innerWidth, innerHeight);

        time += timeIncrement

    } else if (!finished) {

        finished = true

        for (const column of tiles) {
            
            for (const tile of column) {

                tile.seen = true
                tile.visible = true
                tile.showBackground()
            }
        }

        for (const column of tiles) {
            
            for (const tile of column) {

                tile.seen = true
                tile.visible = true
                tile.show()
            }
        }

        for (const enemy of enemies) {
            
            enemy.show()
        }
        
    } else {

        push()
        imageMode(CORNER)
        image(map, 0, 0, innerWidth, innerHeight);
        pop()
    }

}