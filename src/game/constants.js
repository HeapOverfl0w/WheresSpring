export const TILE_WIDTH = 63;
export const TILE_HEIGHT = 38;
export const TILE_HEIGHT_OFFSET = 8;
export const TILE_HEIGHT_OFFSET_RATIO = 8 / TILE_HEIGHT;

export function hexToRgbOffset(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if(result){
        var r= parseInt(result[1], 16);
        var g= parseInt(result[2], 16);
        var b= parseInt(result[3], 16);
        return {r : r, g : g, b : b};
    } 
    return {r: 0, g: 0, b: 0};
  };