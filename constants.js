let gridNum = 700
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
let bossChance = 0.15

let speedDecay = 0.996
let damageDecay = 0.996
let Bfactor = 0.1

let enemyStats = {

    'big_demon':{

        'chaseTime': Math.floor(crossTime / 0.35),
        'd': 1 * width,
        'trapVulnerable':false,
        'damage':0.15
    }, 
    
    'ogre':{

        'chaseTime': Math.floor(crossTime / 0.45),
        'd': 1 * width,
        'trapVulnerable':false,
        'damage':0.12
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

    'necromancer':{

        'chaseTime': Math.floor(crossTime / 0.85),
        'd':0.5 * width,
        'trapVulnerable':false,
        'damage':0.05
    },
}

let potionStats = {

    'blue':{
        
        'prop': 0.25,
        'heal':1,
        'damage':2,
        'speed':1.25
    
    },


    'green':{
        
        'prop': 0.25,
        'heal':2,
        'damage':1.75,
        'speed':1.25
    
    },

    'yellow':{
        
        'prop': 0.25,
        'heal':0.5,
        'damage':1.5,
        'speed':1.5
    
    },

    'red':{
        
        'prop': 0.25,
        'heal':0.25,
        'damage':1.25,
        'speed':2
    
    },
}

const height = width


let characterImages = ['knight_f', 'big_demon', 'chort', 'goblin', 'necromancer', 'ogre']

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