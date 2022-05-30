let gridNum = 6000
let crossTime = 30
let chaseFactor = 0.6
let attackFactor = 6
// let cutChance = 0.017
let cutChance = 0.1
let spikeChance = 0.35
let viewFactor = 15
let barrierFactor = 0.1
let burnTime = 30
let delayTime = 8
let attackRange = 7
let timeIncrement = 0.2
let noiseScale = 0.2
let chestChance = 0.8;
let emptyProp = 0.2
let enemyProp = 0.2
let scaleFactor = 0.5
let chestFactor = 0.8
let chestRange = 2
let holeRange = 1
let maxHealth = 10
let heartWidth = 40
let width = 70
let spikeDamage = 0.04
let holeChance = 0.06
let goblinChance = 0.6
let coinChance = 0.17
let coinFactor = 0.5
let coinWidth = 40
let potionChance = 0.1
let potionFactor = 1.1

let speedDecay = 0.995
let damageDecay = 1.01

let enemyStats = {

    'big_demon':{

        'chaseTime': Math.floor(crossTime / 0.45),
        'd': 1 * width,
        'trapVulnerable':false,
        'damage':0.4
    },

    'chort':{

        'chaseTime': Math.floor(crossTime / 0.65),
        'd':0.45 * width,
        'trapVulnerable':true,
        'damage':0.08
    },

    'goblin':{

        'chaseTime': Math.floor(crossTime / 0.75),
        'd':0.45 * width,
        'trapVulnerable':true,
        'damage':0.04
    },
}

let potionStats = {

    'small':{

        'blue':{
            
            'prop': 0.25,
            'heal':1,
            'damage':0.25,
            'speed':1.5
        
        },


        'green':{
            
            'prop': 0.25,
            'heal':2,
            'damage':0.5,
            'speed':1.25
        
        },

        'yellow':{
            
            'prop': 0.25,
            'heal':0.5,
            'damage':0.5,
            'speed':1.75
        
        },

        'red':{
            
            'prop': 0.25,
            'heal':0.25,
            'damage':0.75,
            'speed':2
        
        },
    }
}

const height = width


let characterImages = ['knight_f', 'big_demon', 'chort', 'goblin']

const r = innerWidth / innerHeight

const rows = Math.floor(Math.sqrt(gridNum / r))
const columns = Math.floor(Math.sqrt(gridNum * r))

const screenwidth = width * columns
const screenheight = height * rows

// const width = innerWidth / columns
// const height = innerHeight / rows

const d = width * scaleFactor
const viewRange = d * viewFactor
const viewRadius = innerHeight / 2
// const scaleFactor = innerHeight/viewRange
const barrierWidth = width * barrierFactor


const speed = Math.min(width, height) / crossTime
const chaseTime = Math.floor(crossTime / chaseFactor)
const attackTime = chaseTime * attackFactor