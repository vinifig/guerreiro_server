'use strict'

module.exports = {
  propertyInArray: function(array,property, value){
    for(let i in array)
      if(array[i][property] == value)
        return i;
    return -1;
  }
}
