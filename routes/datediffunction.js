var express = require('express')
/*var moment = require('moment');

var currdate=moment().format("DD-MM-YYYY")
console.log("current date=",currdate)
cdate=currdate.split('-')
console.log("futuredate=>","day=",fdate[0],"month=",fdate[1],"year=",fdate[2])
console.log("futuredate2=>","day=",fdate2[0],"month=",fdate2[1],"year=",fdate2[2])
console.log("currdate=>","day=",cdate[0],"month=",cdate[1],"year=",cdate[2])
 */
class Moretimecal{
moretime(stime,etime)
{
/* console.log("FUNCTION CALL")
console.log(stime,etime)
 */let fdate2=etime.split('-')
let fdate=stime.split('-')
if(fdate2[2]-fdate[2]>0)
{
    return fdate2[1]-fdate[1]+(fdate2[2]-fdate[2])*12
    //return "more months "+fdate2[1]-fdate[1]+(fdate2[2]-fdate[2])*12

}
else if(fdate2[2]-fdate[2]==0)
{
    if(fdate2[1]-fdate[1]>0)
    {
        return fdate2[1]-fdate[1]
        //return "more months "+fdate2[1]-fdate[1]
    }
    else{
        return fdate2[1]-fdate[1]
        //return "past months "+fdate[1]-fdate2[1]
    }
}
else
{
    if(fdate2[1]-fdate[1]>0)
    {
    return fdate2[1]-fdate[1]+(fdate2[2]-fdate[2])*12
    //return "past months "+fdate[1]-fdate2[1]+(fdate[2]-fdate2[2])*12
    }
    else{
        return fdate[1]-fdate2[1]+(fdate2[2]-fdate[2])*12
    }
}
};
}
module.exports = Moretimecal;