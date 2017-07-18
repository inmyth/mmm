'use strict'

function chunk(chunkSize, array) {
   var R = [];
    for (var i = 0; i < array.length; i += chunkSize)
        R.push(array.slice(i, i + chunkSize));
    return R;
}



module.exports = {
  chunk                : chunk,
}
