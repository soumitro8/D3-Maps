var w = 600;
var h = 400;
var m = {top: 40, right: 10, bottom: 20, left: 50};

var xValue = function(d) { return d.TOTAL_REVENUE;}, 
    xScale = d3.scale.linear().range([0, w]), 
    xMap = function(d) { return xScale(xValue(d));},
    xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(10);

var yValue = function(d) { return d.AVG_SCORE;},
    yScale = d3.scale.linear().range([h, 0]), 
    yMap = function(d) { return yScale(yValue(d));}, 
    yAxis = d3.svg.axis().scale(yScale).orient("left");

var svg1 = d3.select("#scatterplot").append("svg")
    .attr("width", w + m.left + m.right)
    .attr("height", h + m.top + m.bottom)
  .append("g")
    .attr("transform", "translate(" + m.left + "," + m.top + ")");

var tooltip1 = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.csv("states.csv", function(error, data) {

  data.forEach(function(d) {
    d.AVG_SCORE = +d.AVG_SCORE;
	d.TOTAL_REVENUE = +d.TOTAL_REVENUE;
 console.log(d);
  });

  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  svg1.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + h + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", w)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Total Revenue");

  svg1.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("x", -20)
	  .attr("y", -50)
      .attr("dy", ".75em")
      .style("text-anchor", "end")
      .text("Average Score");

  svg1.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .on("mouseover", function(d) {
          tooltip1.transition()
               .duration(200)
               .style("opacity", 1);
          tooltip1.html(d["STATE"] + "<br/> Average Score " + yValue(d))
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip1.transition()
               .duration(500)
               .style("opacity", 0);
      });

});