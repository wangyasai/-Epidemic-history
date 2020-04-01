


var UA = {};
UA.isMobile = /iPad|iPod|iPhone|Android/.test(navigator.userAgent);
UA.isWx = /MicroMessenger/.test(navigator.userAgent);

var rectWidth = 20;
var height = 700;
var padding = { top: 80, right: 10, bottom: 50, left: 10 };


if (UA.isMobile) {
    width = $(window).width()
} else {
    width = 800
}



let linear = d3.scaleLinear().domain([0, 100]).range([0, 1]);
let compute = d3.interpolate('red', 'blue');



//////////////////////////////////////////////////////////////////////
///                                                                ///
///                           chart1 bubble                        ///
///                                                                ///
//////////////////////////////////////////////////////////////////////

var plauges = ["鼠疫", "霍乱", "流感", "天花", "其他"]
var legendName = ["只在一个国家流行", "在多个国家流行", "在全球流行"]
var svgH1 = padding.top * 15.6;
var circleSacle = 80;
var svg1 = d3.select(".chart1")
    .append("svg")
    .attr("width", width)
    .attr("height", svgH1)

// padding.left =10;
var g1 = svg1.append("g")


var div = d3.select("body").append("div")
    .attr("class", "tooltip1")
    .style("opacity", 0);


var sqrt = d3.scaleSqrt()
    .domain([0, 25000000])
    .range([0, 5000]);

d3.csv("./data/plauge.csv").then(function (data) {
    /////   xScale   /////   
    var xScale = d3.scaleBand()
        .domain(plauges)  //array
        .range([padding.left, width - padding.left - padding.right])
    g1.append("g")
        .call(d3.axisBottom(xScale)
            .tickSize(0)
        )
        .call(g => g.select(".domain").remove())
        .attr("transform", "translate(" + 0 + "," + padding.top * 2 + ")")
        .selectAll("text")
        .style("font-size", "18px")
        .style("font-weight", "500")
        .style("fill", "#000000")


    /////   xAxis  /////  
    g1.append("g")
        .call(d3.axisBottom(xScale)
            .tickSize(padding.top * 13)
        )
        .attr("transform", "translate(" + 0 + "," + padding.top * 2.2 + ")")
        .call(g => g.select(".domain").remove())
        .selectAll("text")
        .style("font-size", "18px")
        .style("font-weight", "500")
        .style("fill", "#000000");

    /////   yScale   ///// 
    var yScale1 = (d3.scaleLinear())
        .domain([0, 1500])
        .range([padding.top * 2.5, padding.top * 3.5])

    var yScale2 = d3.scaleLinear()
        .domain([1501, 2000])
        .range([padding.top * 3.5, padding.top * 13.5])

    var yScale3 = d3.scaleLinear()
        .domain([2000.1, 2020])
        .range([padding.top * 13.5, padding.top * 15])


    /////   yAxis   ///// 
    g1.append("g")
        .call((d3.axisRight(yScale1)
            .tickSize(width - padding.left - padding.right)
            .ticks(3)
            .tickFormat(function (d) { return d.toString() })
        ))
        .call(g => g.select(".domain").remove())
        .style("font-size", "12px")
        .style("fill", "#666666")

    g1.append("g")
        .call((d3.axisRight(yScale2)
            .tickSize(width - padding.left - padding.right)
            .ticks(20)
            .tickFormat(function (d) { return d.toString() })
        ))
        .call(g => g.select(".domain").remove())
        .style("font-size", "12px")
        .style("fill", "#666666")


    g1.append("g")
        .call((d3.axisRight(yScale3)
            .tickSize(width - padding.left - padding.right)
            .ticks(4)
            .tickFormat(function (d) { return d.toString() })
        ))
        .call(g => g.select(".domain").remove())
        .style("font-size", "12px")
        .style("fill", "#666666")

    g1.selectAll(".tick line")
        .attr("stroke-opacity", 0.5)
        .attr("stroke-dasharray", "2,2")



    var bColor = ["#323232", "#3263C6", "#FA4C3D"]
    g1.selectAll("bubble")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", function (d, i) {
            return "bubbles " + i
        })
        .attr("cx", function (d) {
            return xScale(d.plauge) + (width - padding.left - padding.right) / 10.6
        })
        .attr("cy", function (d) {
            if (d.start <= 1500) {
                return yScale1(d.start)
            } else if (d.start > 1500 && d.start < 2000) {
                return yScale2(d.start)
            } else if (d.start >= 2000) {
                return yScale3(d.start)
            }

        })
        .attr("r", function (d) {
            return sqrt(d.death) / circleSacle
        })
        .attr("opacity", 0.8)
        .attr("fill", function (d, i) {
            if (d.place == 1) {
                return bColor[0]
            } else if (d.place == 2) {
                return bColor[1]
            } else {
                return bColor[2]
            }
        })


        //Our new hover effects
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '1')
            div.transition()
                .duration(100)
                .style("opacity", 1);
            div.html(d.event + "<br>死亡人数: " + d.death / 10000 + "万人" + "<br>开始时间: " + (d.start) + "年" + "<br>持续时间: " + (d.end - d.start) + "年" + "<br>" + d.info)
                .style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY - 15) + "px")
        })
        .on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '.75')
            div.transition()
                .duration('200')
                .style("opacity", 0);
        })


    g1.selectAll(".BigBubble")
        .data(data)
        .enter()
        .append("text")
        .attr("class", ".BigBubble")
        .attr("x", function (d) {
            return xScale(d.plauge) + (width - padding.left - padding.right) / 10.6
        })
        .attr("y", function (d) {
            if (d.start <= 1500) {
                return yScale1(d.start)
            } else if (d.start > 1500 && d.start < 2000) {
                return yScale2(d.start)
            } else if (d.start >= 2000) {
                return yScale3(d.start)
            }
        })
        .style("font-size", function (d) {
            if (d.death > 1000000) {
                return "14px"
            } else {
                return "12px"
            }
        })
        .style("fill", "#111111")
        .text(function (d) {
            if (d.death > 500000) {
                return (d.event)
            }
        })
        .attr("text-anchor", "middle")


    //title
    svg1.append("text")
        // .attr("transform", "translate(100,0)")
        .attr("x", width / 2)
        .attr("y", 30)
        .attr("font-size", "22px")
        .attr("font-weight", "600")
        .attr("text-anchor", "middle")
        .text("人类历史上流行过哪些传染病")

    //legend
    var legendColor1 = ["#3263C6", "#666666", "#FA4C3D"]
    function legend() {
        for (var i = 0; i < 3; i++) {
            svg1.append("circle")
                .attr("cx", width / 2 - 180)
                .attr("cy", padding.top + i * 25)
                .attr("r", "6px")
                .attr("fill", bColor[i])
                .attr("opacity", 0.8);

            svg1.append("text")
                .attr("x", width / 2 - 170)
                .attr("y", padding.top + 7 + 24 * i)
                .attr("font-size", "14px")
                .attr("fill", "#666666")
                .text(legendName[i]);
        }
    }

    legend();

    svg1.append("text")
        .attr("x", width / 2 +20)
        .attr("y", padding.top + 7.5)
        .attr("font-size", "14px")
        .attr("fill", "#666666")
        .text("死亡人数")
        .attr("text-anchor", "left")

    svg1.append("circle")
        .attr("cx", width / 2 + 20)
        .attr("cy", padding.top + 25)
        .attr("r", sqrt(Math.pow(10, 5)) / circleSacle)
        .attr("fill", "none")
        .attr("stroke", "#000000")
        .attr("stroke-width", 1);

    svg1.append("circle")
        .attr("cx", width / 2 + 60)
        .attr("cy", padding.top + 25)
        .attr("r", sqrt(Math.pow(10, 6)) / circleSacle)
        .attr("fill", "none")
        .attr("stroke", "#000000")
        .attr("stroke-width", 1);


    svg1.append("circle")
        .attr("cx", width / 2 + 140)
        .attr("cy", padding.top + 25)
        .attr("r", sqrt(Math.pow(10, 7)) / circleSacle)
        .attr("fill", "none")
        .attr("stroke", "#000000")
        .attr("stroke-width", 1);

    svg1.append("text")
        .attr("x", width / 2 + 20)
        .attr("y", padding.top + 57)
        .attr("font-size", "12px")
        .attr("fill", "#666666")
        .text("10万人")
        .attr("text-anchor", "middle")

    svg1.append("text")
        .attr("x", width / 2 + 70)
        .attr("y", padding.top + 57)
        .attr("font-size", "12px")
        .attr("fill", "#666666")
        .text("100万人")
        .attr("text-anchor", "middle")

    svg1.append("text")
        .attr("x", width / 2 + 140)
        .attr("y", padding.top + 30)
        .attr("font-size", "12px")
        .attr("fill", "#666666")
        .text("1000万人")
        .attr("text-anchor", "middle")

})


//////////////////////////////////////////////////////////////////////
///                                                                ///
///                         chart2 lineChart                       ///
///                                                                ///
//////////////////////////////////////////////////////////////////////

var svgH2 = 300;
var svg2_1 = d3.select(".chart2")
    .append("svg")
    .attr("width", width)
    .attr("height", svgH2)

var g2_1 = svg2_1.append("g");
padding.right = 10;

d3.csv("./data/australia.csv").then(function (data) {
    var xScale = d3.scaleLinear()
        .domain([1907, 2017])
        .range([padding.left + 30, width - padding.right - padding.left])
    var posY = svgH2 - padding.bottom;
    g2_1.append("g")
        .call(d3.axisBottom(xScale))
        .attr("transform", "translate(" + 0 + "," + posY + ")");

    //yScale
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return Number(d.Noninfectious)
        })])
        .range([svgH2 - padding.bottom, padding.top * 2])

    //yAxis
    g2_1.append("g")
        .call(d3.axisLeft(yScale))
        .attr("transform", "translate(" + (padding.left + 30) + ",0)")

    var lineIn = d3.line()
        .x(function (d, i) { return xScale(d.Year); }) // set the x values for the line generator
        .y(function (d) { return yScale(d.Infectious); }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX) // apply smoothing to the line

    var lineNon = d3.line()
        .x(function (d, i) { return xScale(d.Year); }) // set the x values for the line generator
        .y(function (d) { return yScale(d.Noninfectious); }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX) // apply smoothing to the line


    svg2_1.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", lineIn)
        .attr("fill", "none")
        .attr("stroke", "#fa4c3d")
        .attr("stroke-width", "3px")
        //Our new hover effects
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr("r", 10)
            div.transition()
                .duration(100)
                .style("opacity", 1);
            div.html(d3.format(".2f")(data.Year) + "<br>" + d3.format(".2f")(d.Infectious))
                .style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY - 15) + "px")
        })
        .on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('50')
            div.transition()
                .duration('200')
        })

    svg2_1.append("path")
        .datum(data) // 10. Binds data to the line 
        .attr("class", "line") // Assign a class for styling 
        .attr("d", lineNon)// 11. Calls the line generator 
        .attr("fill", "none")
        .attr("stroke", "#3263c6")
        .attr("stroke-width", "3px")

    //title
    svg2_1.append("text")
        .attr("x", width / 2)
        .attr("y", 50)
        .attr("font-size", "22px")
        .attr("font-weight", "600")
        .attr("text-anchor", "middle")
        .text("人类在20世纪大幅降低了传染病的死亡率")

})



//////////////////////////////////////////////////////////////////////
///                                                                ///
///                           chart3 rect                          ///
///                                                                ///
//////////////////////////////////////////////////////////////////////

var svg3H = height * 2;
padding.right = 20;

var svg3 = d3.select(".chart3")
    .append("svg")
    .attr("width", width)
    .attr("height", svg3H);

padding.left = 40;

var g3 = svg3.append("g")


d3.csv("./data/vaccines.csv").then(function (data) {
    // add country array
    var country_name_temp = [];
    data.forEach(function (d, i) {
        return country_name_temp.push(data[i].country)
    })

    let rectW = (width - padding.left - padding.right) / (data.length - 5);
    let rectH = (svg3H - padding.top - padding.bottom) / (country_name_temp.length + 10);

    //xScale
    var xScale = d3.scaleLinear()
        .domain([1925, 1979])
        .range([padding.left * 2, width - padding.right])

    g3.append("g")
        .call(d3.axisTop(xScale).ticks(null, "d"))
        .attr("transform", "translate(" + rectW / 2 + "," + (padding.top * 2) + ")")
        .call(g => g.select(".domain").remove())
        .selectAll("text")
        .style("text-anchor", "middle")
        .style("font-size", 14)
        .style("fill", "#666666")

    //yScale
    var yScale = d3.scaleBand()
        .domain(country_name_temp)  //array
        .range([padding.top * 2, svg3H])

    g3.append("g")
        .call(d3.axisLeft(yScale).tickSize(0))
        .attr("transform", "translate(" + padding.left * 2 + ",0)")
        .call(g => g.select(".domain").remove())
        .selectAll("text")
        .style("text-anchor", "end")
        .style("font-size", 14)
        .style("fill", "#666666")




    const row = svg3.append("g")
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", (d, i) => `translate(0,${yScale(country_name_temp[i])})`)
        .attr("class", function (d, i) {
            return "rect_g rect_g_" + i
        })


    var div = d3.select("body").append("div")
        .attr("class", "tooltip3")
        .style("opacity", 0);


    var new_data = data.filter(function (d, i) {
        return i != 70
    });


    for (var i = 0; i < new_data.length; i++) {
        for (var j = 1925; j <= 1977; j++) {
            d3.select(".rect_g_" + i)
                .append("rect")
                .attr("class", "rect_" + j)
                .attr("width", rectW)
                .attr("height", rectH)
                .attr("x", xScale(j))
                .attr("year", j)
                .attr("value", data[i][j])
                .attr("country", data[i].country)
                .attr("fill", function () {
                    if (data[i][j] < 0) {
                        return "#C6B8A7"
                    } else if (data[i][j] >= 1 && data[i][j] <= 10) {
                        return "#fff8d2"
                    } else if (data[i][j] > 10 && data[i][j] <= 50) {
                        return "#fedbb9"
                    } else if (data[i][j] > 50 && data[i][j] <= 100) {
                        return "#fdbfa0"
                    } else if (data[i][j] > 100 && data[i][j] <= 1000) {
                        return "#fda288"
                    } else if (data[i][j] > 1000 && data[i][j] <= 10000) {
                        return "#fc856f"
                    } else if (data[i][j] > 10000 && data[i][j] <= 50000) {
                        return "#fb6956"
                    } else if (data[i][j] > 50000) {
                        return "#fa4c3d"
                    } else if (data[i][j] == 0) {
                        return "#ede6d9"
                    }
                })

                .on('mouseover', function () {
                    if (($(this).attr("value")) == -1) {
                        d3.select(this).transition()
                            .duration('50')
                            .attr('opacity', '1')
                            .attr('stroke', 'black')
                            .attr("stroke-width", "2")
                        div.transition()
                            .duration(100)
                            .style("opacity", 1);
                        div.html($(this).attr("year") + '年  ' + $(this).attr("country") + "<br>报告病例: " + "数据空缺")  //data[i].country+":" + d3.format(".2f")(data[i][j])
                            .style("left", (d3.event.pageX + 15) + "px")
                            .style("top", (d3.event.pageY - 15) + "px")
                    } else if (($(this).attr("value")) > 0) {
                        d3.select(this).transition()
                            .duration('50')
                            .attr('opacity', '1')
                            .attr('stroke', 'black')
                            .attr("stroke-width", "2")
                        div.transition()
                            .duration(100)
                            .style("opacity", 1);
                        div.html($(this).attr("year") + '年  ' + $(this).attr("country") + "<br>报告病例: " + $(this).attr("value") + "例")  //data[i].country+":" + d3.format(".2f")(data[i][j])
                            .style("left", (d3.event.pageX + 15) + "px")
                            .style("top", (d3.event.pageY - 15) + "px")
                    }
                })

                .on('mouseout', function (d, i) {
                    d3.select(this).transition()
                        .duration('50')
                        .attr('opacity', '.75')
                        .attr('stroke', 'none')
                    div.transition()
                        .duration('200')
                        .style("opacity", 0);

                })
        }

    }
    //title
    svg3.append("text")
        .attr("x", width / 2)
        .attr("y", 30)
        .attr("font-size", "22px")
        .attr("font-weight", "600")
        .attr("text-anchor", "middle")
        .text("天花是被人类消灭的第一种传染病")

    var ordinal = d3.scaleOrdinal()
        .domain(["数据空缺", "10", "50", "100", "1000", "10000", "100000", "500000"])
        .range(["#C6B8A7", "#fff8d2", "#fedbb9", "#fdbfa0", "#fda288", "#fc856f", "#fb6956", "#fa4c3d", "#ede6d9"]);

    svg3.append("g")
        .attr("class", "legendSequential")
        .attr("transform", "translate(" + (width / 2 - 60 * 4) + ",60)");

    svg3.append("text")
        .text("报告病例")
        .attr("font-size",12)
        .attr("x",width / 2 - 60 * 5) 
        .attr("y",70)

    var legendSequential = d3.legendColor()
        .shapeWidth(60)
        .shapeHeight(10)
        .cells(7)
        .orient("horizontal")
        .scale(ordinal)


    svg3.select(".legendSequential")
        .call(legendSequential)
        .attr("font-size", "12px")


    svg3.append("line")
        .style("stroke", "black")
        .style("storke-width", 1)
        .attr("x1", padding.left * 2 + rectW * 29.5)
        .attr("y1", padding.top * 2)
        .attr("x2", padding.left * 2 + rectW * 29.5)
        .attr("y2", svg3H)

    svg3.append("line")
        .style("stroke", "black")
        .style("storke-width", 1)
        .attr("x1", width - padding.right)
        .attr("y1", padding.top * 2)
        .attr("x2", width - padding.right)
        .attr("y2", svg3H)


        
    var text1 = svg3.append("text")
        .attr("x",  770)
        .attr("y", svg3H - 150)
        .attr("font-size", "18px")
        .attr("text-anchor", "end")
    text1.append("tspan")
        .attr("x", 770)
        .attr("text-anchor","end")
        .text("1979年10月26日")
    text1.append("tspan")      
        .attr("x", 770)
        .attr("dy", "1.2em")
        .attr("text-anchor","end")
        .text("世界卫生组织在肯尼亚首都")
    text1.append("tspan")
        .attr("x",  770)
        .attr("dy", "1.2em")
        .attr("text-anchor","end")
        .text("内罗毕宣布全世界已经消灭了天花")


    var text2 = svg3.append("text")
        .attr("x",  padding.left * 2 + rectW * 30)
        .attr("y", svg3H/2+ 360)
        .attr("font-size", "18px")
        .attr("text-anchor", "left")
    text2.append("tspan")
        .attr("x", padding.left * 2 + rectW * 30)
        .attr("text-anchor", "left")
        .text("50年代：热稳定疫苗的出现，")
    text2.append("tspan")      
        .attr("x", padding.left * 2 + rectW * 30)
        .attr("dy", "1.2em")
        .attr("text-anchor", "left")
        .text("让热带地区的人也能打到天花疫苗。")
    text2.append("tspan")
        .attr("x",  padding.left * 2 + rectW * 30)
        .attr("dy", "1.2em")
        .attr("text-anchor", "left")
        .text("内罗毕宣布全世界已经消灭了天花")
})




//////////////////////////////////////////////////////////////////////
////                                                             /////
////                       chart5 Calendar                       /////
////                                                             /////
//////////////////////////////////////////////////////////////////////

// https://bl.ocks.org/danbjoseph/13d9365450c27ed3bf5a568721296dcc


var div = d3.select("body").append("div")
    .attr("class", "tooltip5")
    .style("opacity", 0);

d3.csv("./data/sars.csv").then(function (data) {
    var weeksInMonth = function (month) {
        var m = d3.timeMonth.floor(month)
        return d3.timeWeeks(d3.timeWeek.floor(m), d3.timeMonth.offset(m, 1)).length;
    }
    console.log(data)

    var minDate = d3.min(data, function (d) { return new Date(d.date) });
    var maxDate = d3.max(data, function (d) { return new Date(d.date) });

    var cellMargin = 2,
        cellSize = width * 0.8 / 40;

    var day = d3.timeFormat("%w"),
        week = d3.timeFormat("%U"),
        format = d3.timeFormat("%Y-%m-%d"),
        titleFormat = d3.utcFormat("%a, %d-%b"),
        monthName = d3.timeFormat("%B"),
        monthName2 = d3.timeFormat("%m"),
        year = d3.timeFormat("%Y"),
        months = d3.timeMonth.range(d3.timeMonth.floor(minDate), maxDate);


    var svg5 = d3.select(".chart5-sars").selectAll("svg")
        .data(months)
        .enter()
        .append("svg")
        .attr("class", "month")
        .attr("height", ((cellSize * 7 + cellMargin * 8) + 20))
        .attr("width", function (d) {
            var columns = weeksInMonth(d);
            return ((cellSize * columns) + (cellMargin * (columns + 1)));
        })
        .append("g")


    svg5.append("text") 
        .attr("class", "month-name")
        .attr("y", (cellSize * 7) + (cellMargin * 8) + 15)
        .attr("x", function (d) {
            var columns = weeksInMonth(d);
            return (((cellSize * columns) + (cellMargin * (columns + 1))) / 2);
        })
        .attr("text-anchor", "middle")
        .text(function (d) { return year(d)+monthName2(d)})



    var rect = svg5.selectAll("rect.day")
        .data(function (d, i) { 
            return d3.timeDays(d, new Date(d.getFullYear(), d.getMonth() + 1, 1)); 
        })
        .enter()
   
        .append("rect")
        .attr("class", "day")
        .attr("data",function(d,i){ 
            return data.name;
            console.log(data.name);
        })
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("fill", '#D6C9B9') // default
        .attr("y", function (d) { return (day(d) * cellSize) + (day(d) * cellMargin) + cellMargin; })
        .attr("x", function (d) { return ((week(d) - week(new Date(d.getFullYear(), d.getMonth(), 1))) * cellSize) + ((week(d) - week(new Date(d.getFullYear(), d.getMonth(), 1))) * cellMargin) + cellMargin; })
       
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr("r", 10)
                .attr('stroke', 'black')
                .attr("stroke-width", "2")
            div.transition()
                .duration(100)
                .style("opacity", 1);
            div.html(function(){
                var filter_name = data.filter(function(dd){
                    return dd.date == d;
                })
                if(filter_name.length != 0){
                    return "时间：" + d + "<br>首例确诊国家："+filter_name[0].name;
                }else{
                    return "时间：" + d +""
                }
            })
                .style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY - 15) + "px")
        })
        .on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('stroke', 'none')
            div.transition()
                .duration('200')
        })

        .datum(format);

    rect.append("title")
        .text(function (d) { return "d.date"; });

    var lookup = d3.nest()
        .key(function (d) { return d.date; })
        .rollup(function (leaves) {
            return d3.sum(leaves, function (d) { return parseInt(d.sum); });
        })
        .object(data);

    var scale = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return parseInt(d.sum); }))
        .range([0.4, 1]); // the interpolate used for color expects a number in the range [0,1] but i don't want the lightest part of the color scheme

    rect.filter(function (d) { return d in lookup; })
        .style("fill", function (d) {
            return d3.interpolateReds(scale(lookup[d]));
        })
        .select("title")
        .text(function (d) { return titleFormat(new Date(d)) + ":  " + lookup[d]; });
})




var div = d3.select("body").append("div")
    .attr("class", "tooltip5")
    .style("opacity", 0);

d3.csv("./data/covid.csv").then(function (data) {
    var weeksInMonth = function (month) {
        var m = d3.timeMonth.floor(month)
        return d3.timeWeeks(d3.timeWeek.floor(m), d3.timeMonth.offset(m, 1)).length;
    }

    var minDate = d3.min(data, function (d) { return new Date(d.date) });
    var maxDate = d3.max(data, function (d) { return new Date(d.date) });

    var cellMargin = 2,
        cellSize = width * 0.8 / 40;

    var day = d3.timeFormat("%w"),
        week = d3.timeFormat("%U"),
        format = d3.timeFormat("%Y-%m-%d"),
        titleFormat = d3.utcFormat("%a, %d-%b"),
        monthName = d3.timeFormat("%B"),
        monthName2 = d3.timeFormat("%m"),
        year = d3.timeFormat("%Y"),
        months = d3.timeMonth.range(d3.timeMonth.floor(minDate), maxDate);

    var svg5 = d3.select(".chart5-covid").selectAll("svg")
        .data(months)
        .enter()
        .append("svg")
        .attr("class", "month")
        .attr("height", ((cellSize * 7 + cellMargin * 8) + 20))
        .attr("width", function (d) {
            var columns = weeksInMonth(d);
            return ((cellSize * columns) + (cellMargin * (columns + 1)));
        })
        .append("g")


    svg5.append("text")
        .attr("class", "month-name")
        .attr("y", (cellSize * 7) + (cellMargin * 8) + 15)
        .attr("x", function (d) {
            var columns = weeksInMonth(d);
            return (((cellSize * columns) + (cellMargin * (columns + 1))) / 2);
        })
        .attr("text-anchor", "middle")
        .attr("font-size",16)
        .text(function (d) { return year(d)+monthName2(d)})


    var rect = svg5.selectAll("rect.day")
        .data(function (d, i) { return d3.timeDays(d, new Date(d.getFullYear(), d.getMonth() + 1, 1)); })
        .enter()
        .append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("rx", 0)
        .attr("ry", 0) // rounded corners
        .attr("fill", '#D6C9B9') // default light grey fill
        .attr("y", function (d) { return (day(d) * cellSize) + (day(d) * cellMargin) + cellMargin; })
        .attr("x", function (d) { return ((week(d) - week(new Date(d.getFullYear(), d.getMonth(), 1))) * cellSize) + ((week(d) - week(new Date(d.getFullYear(), d.getMonth(), 1))) * cellMargin) + cellMargin; })
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr("r", 10)
                .attr('stroke', 'black')
                .attr("stroke-width", "2")
            div.transition()
                .duration(100)
                .style("opacity", 1);
            div.html(function(){
                    var filter_name = data.filter(function(dd){
                        return dd.date == d;
                    })
                    if(filter_name.length != 0){
                        return "时间：" + d + "<br>首例确诊国家："+filter_name[0].name;
                    }else{
                        return "时间：" + d +""
                    }
                })
                    .style("left", (d3.event.pageX + 15) + "px")
                    .style("top", (d3.event.pageY - 15) + "px")
        })
        .on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('stroke', 'none')
            div.transition()
                .duration('200')
        })

        .datum(format);


    rect.append("title")
        .text(function (d) { return "d.date"; });

    var lookup = d3.nest()
        .key(function (d) { return d.date; })
        .rollup(function (leaves) {
            return d3.sum(leaves, function (d) { return parseInt(d.sum); });
        })
        .object(data);

    var scale = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return parseInt(d.sum); }))
        .range([0.4, 1]); // the interpolate used for color expects a number in the range [0,1] but i don't want the lightest part of the color scheme

    rect.filter(function (d) { return d in lookup; })
        .style("fill", function (d) {
            return d3.interpolateReds(scale(lookup[d]));
        })
        .select("title")
        .text(function (d) { return titleFormat(new Date(d)) + ":  " + lookup[d]; });
})





//////////////////////////////////////////////////////////////////////
//                                                                  //
//                          chart6 dot                              //
//                                                                  //
//////////////////////////////////////////////////////////////////////

var svg6H = 500;
var svg6 = d3.select(".chart6")
    .append("svg")
    .attr("width", width)
    .attr("height", svg6H)

var g6 = svg6.append("g")

var div = d3.select("body").append("div")
    .attr("class", "tooltip6")
    .style("opacity", 0);

d3.csv("./data/deathRate-R0.csv").then(function (data) {
    //xScale
    var xScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return Number(d.x)
        })])
        .range([padding.left*2, width - padding.left])
      

    //xAxis
    var posY = svg6H - padding.bottom;
    g6.append("g")
        .call(d3.axisBottom(xScale))
        .attr("transform", "translate(" + 0 + "," + posY + ")")
        .selectAll("text")
        .style("text-anchor", "middle")
        .style("font-size", 12)
        .style("fill", "#666666")

    //yScale
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return Number(d.y)
        })])
        .range([svg6H - padding.bottom, padding.top])

    //yAxis
    g6.append("g")
        .call(d3.axisLeft(yScale)  
            .ticks(10, "%")
        )
        .attr("transform", "translate(" + padding.left*2 + ",0)")
        .selectAll("text")
        .style("text-anchor", "end")
        .style("font-size", 12)
        .style("fill", "#666666")
 
    

    g6.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("width", function (d, i) {
            return xScale(Number(d.x))
        })
        .attr("height", rectWidth)
        .attr("cx", function (d) { return xScale(d.x) })
        .attr("cy", function (d) { return yScale(d.y) })
        .attr("r", 5)
        .attr("fill", function (d, i) {
            if (d.x == 3.77) {
                return "#fa4c3d"
            } else {
                return "#3263c6"
            }
        })
        .attr('opacity', '.75')


        //Our new hover effects
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '1')
                .attr("r", 8)
            div.transition()
                .duration(100)
                .style("opacity", 1);
            div.html(d.name + "<br>致死率: " + d3.format(".1f")(d.y) + "%" + "<br>传播等级: " + d3.format(".2f")(d.x))
                .style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY - 15) + "px")
        })
        .on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '.75')
                .attr("r", 5)
            div.transition()
                .duration('200')
                .style("opacity", 0);
        })


    //dot name
    g6.selectAll(".dotName")
        .data(data)
        .enter()
        .append("text")
        .attr("class", ".dotName")
        .attr("font-weight",function(d,i){
            if (d.x == 3.77) {
                return 500
            } else {
                return 200
            }
        })
        .attr("text-anchor", function (d) {
            if (d.legend == "r") {
                return "right"
            } else if (d.legend == "t") {
                return "center"
            }
        })
        .attr("x", function (d) {
            if (d.legend == "r") {
                return xScale(d.x) + 8
            } else if (d.legend == "t") {
                return xScale(d.x) - d.name.length * 6
            }
        })
        .attr("y", function (d) {
            if (d.legend == "r") {
                return yScale(d.y) + 4
            } else if (d.legend == "t") {
                return yScale(d.y) - 10
            }
        })
        .style("font-size", 12)
        .style("fill", "#888888")
        .text(function (d) {
            if (d.legend == "r" || d.legend == "t") {
                return (d.name)
            }
        })
        .attr("font-size", "12px")


    //title
    svg6.append("text")
        .attr("x", width / 2)
        .attr("y", 30)
        .attr("font-size", "22px")
        .attr("font-weight", "600")
        .attr("text-anchor", "middle")
        .text("传染病越强的疾病，往往致死率不高")


    svg6.append("text")
        .attr("x",width/2)
        .attr("y",svg6H -15)
        .attr("font-size", "14px")
        .attr("text-anchor", "middle")
        .attr("fill", "#666666")
        .text("基本传染数R0")
    
                
    var text1 = svg6.append("text")
    .attr("x",  padding.left)
    .attr("y", svg6H/2)
    .attr("font-size", "14px")
    .attr("fill", "#666666")
    .attr("text-anchor", "end")
text1.append("tspan")
    .attr("x", padding.left)
    .attr("text-anchor","end")
    .text("致")
text1.append("tspan")      
    .attr("x", padding.left)
    .attr("dy", "1.2em")
    .attr("text-anchor","end")
    .text("死")
text1.append("tspan")
.attr("x", padding.left)
.attr("dy", "1.2em")
.attr("text-anchor","end")
.text("率")



})

