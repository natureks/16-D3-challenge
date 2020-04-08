var chartGroup;

var xScale;
var yScale;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var canvas = {
    screenHeight: 600,
    screenWidth: 1000,
    chartHeight: 0,
    chartWidth: 0
};

function setCanvas() {
    // chart area minus margins
    canvas.chartHeight = canvas.screenHeight - margin.top - margin.bottom;
    canvas.chartWidth = canvas.screenWidth - margin.left - margin.right;

    // create svg container
    var svg = d3.select("#scatter").append("svg")
        .attr("height", canvas.screenHeight)
        .attr("width", canvas.screenWidth);

    // shift everything over by the margins
    chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    console.log("margin:", margin);
    console.log("canvas:", canvas);
}

function setAxis(xAxisData, yAxisData) {
    // scale x to chart width
    xMaxVal = Math.round(d3.max(xAxisData))+1;
    xMinVal = Math.round(d3.min(xAxisData))-1;
    console.log("xScale:", xMinVal, xMaxVal, canvas.chartWidth);
    xScale = d3.scaleLinear()
        .domain([xMinVal, xMaxVal])
        .range([0, canvas.chartWidth]);
    console.log("xScale Test:", 5, xScale(5));
    console.log("xScale Test:", 10, xScale(10));
    console.log("xScale Test:", 25, xScale(25));
    
        // scale y to chart height
    yMaxVal = Math.round(d3.max(yAxisData))+1;
    yMinVal = Math.round(d3.min(yAxisData))-1;
    console.log("yScale:", yMinVal, yMaxVal, canvas.chartHeight);
    yScale = d3.scaleLinear()
        .domain([yMinVal, yMaxVal]) // range of input
        .range([canvas.chartHeight, 0]);
    console.log("yScale Test:", 5, yScale(5));
    console.log("yScale Test:", 10, yScale(10));
    console.log("yScale Test:", 25, yScale(25));

    // create axes
    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);

    // Add X axis label:
    xAxisYAttr = canvas.chartHeight + margin.top - 10; // top down movement
    xAxisXAttr = canvas.chartWidth/2; // left right movement
    console.log("xAxis Title Coordinates:", xAxisXAttr, xAxisYAttr);

    chartGroup.append("text")
        .attr("text-anchor", "end")
        .attr("x", xAxisXAttr)
        .attr("y", xAxisYAttr)
        .text("In Poverty (%)");

    // Y axis label:
    yAxisXAttr = margin.top - canvas.chartHeight/2; // top down movement
    yAxisYAttr = -margin.left + 20;
    console.log("yAxis Title Coordinates:", yAxisXAttr, yAxisYAttr);
    chartGroup.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", yAxisYAttr)
        .attr("x", yAxisXAttr) // top down movement
        .text("Lacks Healthcare (%)");

    // set x to the bottom of the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${canvas.chartHeight})`)
        .call(xAxis);

    // set y to the y axis
    chartGroup.append("g")
        .call(yAxis);

}

function createChart(axisData) {
    // append initial circles

    console.log("createChart called:", axisData);
    radius = 10;

    var circlesGroup = chartGroup.selectAll("circle")
        .data(axisData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", radius)
        .attr("fill", "pink")
        .attr("opacity", ".5")
        .append('text')
        .text(d => d.abbr);
        /*
        .attr('dx',d => xScale(d.x))
        .attr('dy',d => yScale(d.y + radius / 2.5))
        .attr('font-size',radius)
        .attr('class','stateText');
        */
}

/*
 *  Execute code ftom this point
 *
 * 
 */

setCanvas();

d3.csv("data/data.csv").then(function (healthData, err) {
    if (err) throw err;

    var xAxisData = [];
    var yAxisData = [];
    var axisData = [];


    // parse data
    healthData.forEach(function (data, i) {
        if (i === 0) {
            console.log(data)
        }

        // xAxis data
        data.poverty = +data.poverty; // chart 1
        xAxisData.push(data.poverty);
        /*
        data.age = +data.age;
        xAxisData[1].push(data.age);
        data.income = +data.income;
        xAxisData[2].push(data.income);
        */

        // yAxis data
        data.healthcare = +data.healthcare; // chart 1
        yAxisData.push(data.healthcare);
        /*
        data.obesity = +data.obesity;
        yAxisData[1].push(data.obesity);
        data.smokes = +data.smokes;
        yAxisData[2].push(data.smokes);
        */

       var axis = {
            x:data.poverty,
            y:data.healthcare,
            abbr:data.abbr
        }
        axisData.push(axis);
        
    });

    setAxis(xAxisData, yAxisData);
    createChart(axisData);
}).catch(function (error) {
    console.log(error);
});
