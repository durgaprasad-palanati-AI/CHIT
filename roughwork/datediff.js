var moment = require('moment');

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