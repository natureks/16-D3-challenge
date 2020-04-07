// data
var dataArray = [1, 2, 3];
var dataCategories = ["one", "two", "three"];

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

    console.log("xAxisData", xAxisData);
    console.log("yAxisData", yAxisData);

    // scale y to chart height
    yScale = d3.scaleLinear()
        .domain([0, d3.max(yAxisData)])
        .range([canvas.chartHeight, 0]);

    // scale x to chart width
    xScale = d3.scaleBand()
        .domain(xAxisData)
        .range([0, canvas.chartWidth])
        .padding(0.1);

    // create axes
    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);

    // Add X axis label:
    xAxisYAttr = canvas.chartHeight + margin.top - 10; // top down movement
    console.log("xAxisYAttr:", xAxisYAttr);
    xAxisXAttr = canvas.chartWidth/2; // left right movement
    console.log("xAxisXAttr:", xAxisXAttr);

    chartGroup.append("text")
        .attr("text-anchor", "end")
        .attr("x", xAxisXAttr)
        .attr("y", xAxisYAttr)
        .text("In Poverty (%)");

    // Y axis label:
    yAxisXAttr = margin.top - canvas.chartHeight/2; // top down movement
    console.log("yAxisXAttr:", yAxisXAttr);
    chartGroup.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", yAxisXAttr) // top down movement
        .text("Lacks Healthcare (%)")

    // set x to the bottom of the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${canvas.chartHeight})`)
        .call(xAxis);

    // set y to the y axis
    chartGroup.append("g")
        .call(yAxis);

}

function createChart(healthData) {
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", healthData.poverty)
        .attr("cy", healthData.healthcare)
        .attr("r", 20)
        .attr("fill", "pink")
        .attr("opacity", ".5");
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
        
    });

    setAxis(xAxisData, yAxisData);
    createChart(healthData);
}).catch(function (error) {
    console.log(error);
});
