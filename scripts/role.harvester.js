var roleHarvester = {
    
    harvState : { NONE : 0, HARVESTING : 1, SUPPLYING : 2, BUILDING : 3, UPGRADING : 4 },
    
    initialize: function(){
        roleHarvester.state = {}
        
        var targets = creep.room.find(FIND_STRUCTURES);
        for( var structure in targets ){
            if( (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN ) && structure.energy < structure.energyCapacity ){
                roleHarvester.state.supplyCapacity +=  structure.energyCapacity - structure.energy;
                
            }
            
        }
        targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    },
    
    run: function(creep) {
        
        // should change role???
        if( !creep.memory.state || creep.memory.state == harvState.NONE || ( creep.memory.state == harvState.HARVESTING && creep.carry.energy < creep.carryCapacity ) || 
                ( creep.memory.state != harvState.HARVESTING && creep.carry.energy == 0 ) ){
            
            delete creep.memory.target;
            
            if( creep.carry.energy == 0 )
                creep.memory.state = harvState.HARVESTING;
            else{
                
            }
            
        }
        
        switch( creep.memory.state ){
            case harvState.HARVESTING:
                if( !creep.memory.target )
                    creep.memory.target = creep.room.find(FIND_SOURCES)[0];
                if(creep.harvest(creep.memory.target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.memory.target, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                break;
            case harvState.SUPPLYING:
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
                });
                if(targets.length > 0) {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                break;
            case harvState.BUILDING:
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if(targets.length) {
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                break;
            case harvState.UPGRADING:
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                break;
            default:
                creep.memory.state = harvState.NONE;
        }
    }
};

module.exports = roleHarvester;