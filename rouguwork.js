var moment = require('moment');
/*
// 2020-05-08T22:57:42+05:30
console.log(moment().format());

// May 8th 2020, 10:56:31 pm
console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));

// Friday
console.log(moment().format('dddd'));

// May 8th 20
console.log(moment().format("MMM Do YY"));
console.log(moment().format("DD MMMM YYYY"));
console.log(moment().format("DD-MM-YYYY"));

// 2020 escaped 2020
console.log(moment().format('YYYY [escaped] YYYY'));

//
var a = moment();
var b = moment().add(1, 'seconds');
console.log(a.diff(b) )// -1000
console.log(b.diff(a))// 1000
*/
//
var futuredate = moment().add(4, 'M').subtract(1,'d').format('DD-MM-YYYY');
console.log("future date=",futuredate)
fdate=futuredate.split('-')

//
var futuredate2 = moment().add(2, 'M').subtract(1,'d').format('DD-MM-YYYY');
console.log("future date2=",futuredate2)
fdate2=futuredate2.split('-')
//
var currdate=moment().format("DD-MM-YYYY")
console.log("current date=",currdate)
cdate=currdate.split('-')
console.log("futuredate=>","day=",fdate[0],"month=",fdate[1],"year=",fdate[2])
console.log("futuredate2=>","day=",fdate2[0],"month=",fdate2[1],"year=",fdate2[2])
console.log("currdate=>","day=",cdate[0],"month=",cdate[1],"year=",cdate[2])

if(fdate2[2]-fdate[2]>0)
{
    console.log("more months=",fdate2[1]-fdate[1]+(fdate2[2]-fdate[2])*12)

}
else if(fdate2[2]-fdate[2]==0)
{
    if(fdate2[1]-fdate[1]>0)
    {
        console.log("more months=",fdate2[1]-fdate[1])
    }
    else{
        console.log("past months=",fdate[1]-fdate2[1])
    }
}
else
{
    console.log("past months=",fdate[1]-fdate2[1]+(fdate[2]-fdate2[2])*12)
}

/*
const monthDifference =  moment(new Date(futuredate)).diff(new Date(), 'months', true);
//var monthDifference = futuredate.diff(currdate, 'months', true);
console.log("monthDifference",monthDifference,typeof monthDifference)


var dt=new Date().toLocaleDateString('en-US', {
    month: 'numeric',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',//'2-digit',
    minute: 'numeric'
  })
  console.log("date=",dt)
  console.log("date=",dt.split(',')[0])
  console.log("time=",dt.split(',')[1])
  
  //console.log('new date is=',d.setDate(d.getDate()+10))

  var d= new Date();
y=d.getFullYear();//Get the year as a four digit number (yyyy)
m=d.getMonth();//Get the month as a number (0-11)
dte=d.getDate();//Get the day as a number (1-31)
h=d.getHours();//Get the hour (0-23)
mt=d.getMinutes();//Get the minute (0-59)
s=d.getSeconds();//Get the second (0-59)
mils=d.getMilliseconds();//Get the millisecond (0-999)
tim=d.getTime();//Get the time (milliseconds since January 1, 1970)
console.log('year==',y)
console.log('month=',m)
console.log('date=',dte)
console.log('hours=',h)
console.log('minitues=',mt)
console.log('time=',tim)

console.log('new time date=',dte+'-'+m+'-'+y)
 */