var turf = require('turf');
turf.squareGrid = require('turf-square-grid');
turf.triangleGrid = require('turf-triangle-grid');
var fs = require('fs');
/*
var paths = JSON.parse(fs.readFileSync('./hail-paths.geojson'));

console.log('calculating centroids..');
var hail = turf.featurecollection([]);
hail.features = paths.features.map(function(path, k){
    var cent = turf.centroid(path);
    cent.properties.y = path.properties.YR;
    return cent;
})

fs.writeFileSync('./hail.geojson', JSON.stringify(hail, null, 2))

var bbox = [-126,25,-66,50];
var tribin = turf.triangleGrid(bbox, 100, 'miles');
var hexbin = turf.hex(bbox, 1);
var squarebin = turf.squareGrid(bbox, 100, 'miles');

console.log('aggregating tribin..');
tribin = timeExpand(tribin, hail, 'tribin');
console.log('aggregating hexbin..');
hexbin = timeExpand(hexbin, hail, 'hexbin');
console.log('aggregating squarebin..');
squarebin = timeExpand(squarebin, hail, 'squarebin');

console.log('aggregating pointbin..');
var pointbin = turf.featurecollection([]);
pointbin.features = squarebin.features.map(function(square, k){
    var cent = turf.centroid(square);
    cent.properties = square.properties;
    return cent;
});

*/

//////DELETE BLOCK
var tribin = JSON.parse(fs.readFileSync('./tribin.geojson'));
var hexbin = JSON.parse(fs.readFileSync('./hexbin.geojson'));
var squarebin = JSON.parse(fs.readFileSync('./squarebin.geojson'));
var pointbin = JSON.parse(fs.readFileSync('./pointbin.geojson'));
//////

console.log('quantile tribin..')
tribin = normalize(tribin);
console.log('quantile hexbin..')
hexbin = normalize(hexbin);
console.log('quantile squarebin..')
squarebin = normalize(squarebin);
console.log('quantile pointbin..')
pointbin = normalize(pointbin);
/*
console.log('saving grids..');
fs.writeFileSync('./tribin.geojson', JSON.stringify(tribin));
fs.writeFileSync('./hexbin.geojson', JSON.stringify(hexbin));
fs.writeFileSync('./squarebin.geojson', JSON.stringify(squarebin));
fs.writeFileSync('./pointbin.geojson', JSON.stringify(pointbin));
*/
console.log('..complete');

function timeExpand (grid, hail, name) {
    var expanded = turf.featurecollection([]);
    expanded.features = grid.features.map(function(cell,k) {
        var years = [];
        var year = 1955;
        while(year <= 2013){
            cell.properties[year.toString()] = 0;
            year++;
        }

        for(var i = 0; i < hail.features.length; i++) {
            if(turf.inside(hail.features[i], cell)){
                cell.properties[hail.features[i].properties.y]++;
            }
        }
        return cell;
    });
    return expanded;
}

function normalize (grid) {
    grid.features = grid.features.filter(function(cell){
        var year = 1955;
        while(year <= 2013){
            if (cell.properties[year.toString()] > 0) return true;
            year++;
        }
    });

    var breaks = [];
    var year = 1955;
    while(year <= 2013){
        var filtered = turf.featurecollection([])
        filtered.features = grid.features.filter(function(cell){
            if (cell.properties[year.toString()] > 0) return true;
        });

        var newBreak = {};
        newBreak[year.toString()] = turf.quantile(filtered, year.toString(), [20,40,60,70,80,90,95,99]);
        breaks.push(newBreak);
        year++;
    }
    grid = grid.features.map(function(cell){

    });
}