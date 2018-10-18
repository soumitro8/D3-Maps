var width = 500;
var height = 500;

var projection = d3.geo.albersUsa()
				   .translate([width/2, height/2])    
				   .scale([650]);         
        
var path = d3.geo.path()               
		  	 .projection(projection);  

var color = d3.scale.linear()
			  .range(["#2ecc71","#fdcb6e","#e17055","#d63031"]);

var legendText = ["> 15M", "10M - 15M", "5M - 10M", "< 5M"];

var svg = d3.select("#map")
			.append("svg")
			.attr("width", width)
			.attr("height", height);
        
var div = d3.select("body")
		    .append("div")   
    		.attr("class", "tooltip")               
    		.style("opacity", 0);

d3.csv("states.csv", function(data) {
color.domain([0,1,2,3]); 

d3.json("us-states.json", function(json) {

for (var i = 0; i < data.length; i++) 
{
	if(data[i].YEAR == "2015")
	{
		var dataState = data[i].STATE;
		 
		var dataValue = data[i].TOTAL_REVENUE;

		for (var j = 0; j < json.features.length; j++)  
		{
			var jsonState = json.features[j].properties.name;

			if (dataState == jsonState) {

			json.features[j].properties.revenue = dataValue; 

			break;
			}
		}
	}
}
		
svg.selectAll("path")
	.data(json.features)
	.enter()
	.append("path")
	.attr("d", path)
	.style("stroke", "#fff")
	.style("stroke-width", "1")
	.style("fill", function(d) 
	{
		var value = d.properties.revenue;

		if (value < 5000000) 
		{
		return "#d63031";
		} 
		else if (value >= 5000000 && value < 10000000)
		{
			return "#e17055";
		}
		else if (value >= 10000000 && value < 15000000)
		{
			return "#fdcb6e";
		}
		else if (value >= 15000000)
		{
			return "#2ecc71";
		}
	})
	
	.on("mouseover", function(d) 
	{      
		var activeState = d.properties.name;
		var activeRevenue = d.properties.revenue;
    	div.transition()        
      	   .duration(200)      
           .style("opacity", .9);      
           div.text(d.properties.name +"\n Total Revenue: \n"+ d.properties.revenue)
           .style("left", (d3.event.pageX) + "px")     
           .style("top", (d3.event.pageY - 28) + "px");  
		svg1.selectAll(".dot").style("fill", function(d)
		{
			if(d.STATE == activeState)
			{
				if (activeRevenue < 5000000) 
					return "#d63031";
				else if (activeRevenue >= 5000000 && activeRevenue < 10000000)
					return "#e17055";
				else if (activeRevenue >= 10000000 && activeRevenue < 15000000)
					return "#fdcb6e";
				else if (activeRevenue >= 15000000)
					return "#2ecc71";
			}
		});
	})   
               
    .on("mouseout", function(d) 
	{
		div.transition()        
           .duration(500)      
           .style("opacity", 0);  
		//svg1.selectAll(".dot").style("fill", "#2e86de");
    });
        
var legend = d3.select("body").append("svg")
      			.attr("class", "legend")
     			.attr("width", 140)
    			.attr("height", 200)
   				.selectAll("g")
   				.data(color.domain())
   				.enter()
   				.append("g")
     			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  	legend.append("rect")
   		  .attr("width", 18)
   		  .attr("height", 18)
   		  .style("fill", color);

  	legend.append("text")
  		  .data(legendText)
      	  .attr("x", 24)
      	  .attr("y", 9)
      	  .attr("dy", ".35em")
      	  .text(function(d) { return d; });
	});

});