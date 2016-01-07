'use strict';

const fs = require('fs');
const _ = require('lodash');
const pry = require('pryjs')

console.time('entire process');

let trafficData = fs.readFileSync('./data/traffic-accidents.csv')
                    .toString()
                    .split('\r\n')
                    .map(row => row.split(','));

let columnHeader = trafficData.slice(0,1);
let columnData = trafficData.slice(1);
let data = _.map(columnData, createObject);

function createObject(n){
  return _.zipObject(columnHeader[0], n)
};

let sortedNeighborhood = _.groupBy(data, function(n){
  return n.NEIGHBORHOOD_ID
});




eval(pry.it)

console.timeEnd('entire process');

