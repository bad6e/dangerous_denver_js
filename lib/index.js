'use strict';

const fs = require('fs');
const _ = require('lodash');
const pry = require('pryjs')

console.time('entire process');

let trafficData = fs.readFileSync('./data/traffic-accidents.csv')
                    .toString()
                    .split('\r\n')
                    .map(row => row.split(','));

let crimeData = fs.readFileSync('./data/crime.csv')
                    .toString()
                    .split('\r\n')
                    .map(row => row.split(','));

let columnHeaderTraffic = trafficData.slice(0,1);
let columnDataTraffic = trafficData.slice(1);

let columnHeaderCrime = crimeData.slice(0,1);
let columnDataCrime = crimeData.slice(1);

function createObjectFromHeaders(columnHeaders) {
  return function(n) {
    return _.zipObject(columnHeaders[0], n)
  }
};

let trafficObjects = _.map(columnDataTraffic, createObjectFromHeaders(columnHeaderTraffic));
let crimeObjects = _.map(columnDataCrime, createObjectFromHeaders(columnHeaderCrime));

function groupBy(data, key) {
  return _.groupBy(data, function(n) {
    return n[key];
  });
};

let groupedNeighborhood = groupBy(trafficObjects, 'NEIGHBORHOOD_ID');
let groupedIntersection = groupBy(trafficObjects, 'INCIDENT_ADDRESS');
let groupedCrimeHood = groupBy(crimeObjects, 'NEIGHBORHOOD_ID');

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
let countedCrimeHood = counter(groupedCrimeHood);

function sortData(countedData){
  return _.sortBy(countedData, 'count').reverse();
}


function topFive(sortedData){
  return sortedData.slice(0, 5)
}

let topFiveHoods = topFive(sortData(countedNeighborhoods));
let topFiveIntersections = topFive(sortData(countedIntersections));
let topFiveCrimeHoods = topFive(sortData(countedCrimeHood));

console.log(topFiveHoods)
console.log(topFiveIntersections)
console.log(topFiveCrimeHoods)



console.timeEnd('entire process');

