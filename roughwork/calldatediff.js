var express = require('express')
const ddiff = require("./datediffunction");
const ddif = new ddiff();
var moment = require('moment');
var futuredate = moment().add(17, 'M').subtract(1,'d').format('DD-MM-YYYY');
//
var futuredate2 = moment().add(15, 'M').subtract(1,'d').format('DD-MM-YYYY');
//

let mtime=ddif.moretime(futuredate,futuredate2)
console.log(mtime)