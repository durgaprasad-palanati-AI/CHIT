chitmems=[
    "mem_3",
    "mem_5"
]
membs=["mem_3"]
let difference = chitmems.filter(x => !membs.includes(x))
console.log(difference)