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

function createObject(n){
  return _.zipObject(columnHeader[0], n)
};


let data = _.map(columnData, createObject);


function groupBy(data, key) {
  return _.groupBy(data, function(n) {
    return n[key];
  });
};

let groupedNeighborhood = groupBy(data, 'NEIGHBORHOOD_ID');
let groupedIntersection = groupBy(data, 'INCIDENT_ADDRESS');

function counter (groupedData) {
  let keys = Object.keys(groupedData)
    return _.map(keys, function(key) {
      return { name : key, count : groupedData[key].length };
    });
}

function removeEmpty(countedData) {
  return countedData.filter(function(n){
    return n.name !== '';
  });
}

let countedNeighborhoods = counter(groupedNeighborhood);
let countedIntersections = removeEmpty(counter(groupedIntersection));

function sortData(countedData){
  return _.sortBy(countedData, 'count').reverse();
}


function topFive(sortedData){
  return sortedData.slice(0, 4)
}

let topFiveHoods = topFive(sortData(countedNeighborhoods));
let topFiveIntersections = topFive(sortData(countedIntersections));

console.log(topFiveHoods)
console.log(topFiveIntersections)



console.timeEnd('entire process');

