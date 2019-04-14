// var d3 = require("d3");
// import d3 from "d3";

// const projectName = 'bar-chart';
// localStorage.setItem('example_project', 'D3: Bar Chart');
// coded by @Christian-Paul 


var yMargin = 40,
    width = 800,
    height = 400,
    barWidth = width/275;

var tooltip = d3.select(".visHolder").append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

var overlay = d3.select('.visHolder').append('div')
  .attr('class', 'overlay')
  .style('opacity', 0);

var svgContainer =  d3.select('.visHolder')
    .append('svg')
    .attr('width', width + 100)
    .attr('height', height + 60);

// accessing data from API
d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', function(err, data) {
  
  // text at the left - created here
  svgContainer.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -200)
    .attr('y', 80)
    .text('Gross Domestic Product');
  
  // text at the bottom - created here
  svgContainer.append('text')
    .attr('x', width/2 + 120)
    .attr('y', height + 50)
    .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
    .attr('class', 'info');
  
  // mapping years from API json. First 'data' refers to line 28 definition of all json file as 'data'. second 'data' refers to a 'key' by name 'data' in the json file.
  var years = data.data.map(item => {
    var quarter;

    // temporary variable to 'slice' some part of json API data
    var temp = item[0].substring(5, 7);
    
    if(temp === '01') {
      quarter = 'Q1';
    }
    else if (temp === '04'){
      quarter = 'Q2';
    }
    else if(temp === '07') {
      quarter = 'Q3';
    }
    else if(temp ==='10') {
      quarter = 'Q4';
    }

    // second part of mapping function which results in 'var years'
    return item[0].substring(0, 4) + ' ' + quarter
  });
  

  // mapping years from API json. First 'data' refers to line 28 definition of all json file as 'data'. second 'data' refers to a 'key' by name 'data' in the json file.
  var yearsDate = data.data.map(function(item) {
   
   // a way to return a 'Date()' with specified date - taken from the array inside 'data', which looks like this - so we grap a 'year-month-date'
  // "data": [
  //   [
  //     "1947-01-01",
  //     243.1
  //   ],
    return new Date(item[0]);
  });

  // calling a 'max()' in-built function of d3, to find the MAX year&quarter from 'yearsDate'. First saving it in 'Date()' format. and then in a 'var xMax' - for setting maximum for 'x axis'.
  var xMax = new Date(d3.max(yearsDate));
  
  // javascript in-built methods 'setMonth' and 'getMonth'. First we 'getMonth' from 'var xMax' and add 3 months to it. Then we use this value to 'setMonth()' for xMax... ? - basically just adding 3 months to 'xMax'?
  xMax.setMonth(xMax.getMonth() + 3);

  // 'scaleTime' is a d3 function. Basically we use minimum year and maximum year to set domain. and then map it to the range, and 'width' was set to '800' up in the code
  var xScale = d3.scaleTime()
    .domain([d3.min(yearsDate), xMax])
    .range([0, width]);
  
  // creating 'x Axis' with 'axisBottom()' method of d3
  var xAxis = d3.axisBottom()
    .scale(xScale);
  
    // creating horizontal line with 'g'
  var xAxisGroup = svgContainer.append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    // moving it 60px right on x axis, and 400px down on y axis
    .attr('transform', 'translate(60, 400)');
  
  var GDP = data.data.map(function(item) {
    return item[1]
  });
  
  var scaledGDP = [];
  
  var gdpMin = d3.min(GDP);
  var gdpMax = d3.max(GDP);
  
  var linearScale = d3.scaleLinear()
    .domain([0, gdpMax])
    .range([0, height]);
  
  scaledGDP = GDP.map(function(item) {
    return linearScale(item);
  });
  
  var yAxisScale = d3.scaleLinear()
    .domain([0, gdpMax])
    .range([height, 0]);
  
  var yAxis = d3.axisLeft(yAxisScale)
    
  var yAxisGroup = svgContainer.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', 'translate(60, 0)');
    
  d3.select('svg').selectAll('rect')
    .data(scaledGDP)
    .enter()
    .append('rect')
    .attr('data-date', function(d, i) {
      return data.data[i][0]
    })
    .attr('data-gdp', function(d, i) {
      return data.data[i][1]
    })
    .attr('class', 'bar')
    .attr('x', function(d, i) {
      return xScale(yearsDate[i]);
    })
    .attr('y', function(d, i) {
      return height - d;
    })
    .attr('width', barWidth)
    .attr('height', function(d) {
      return d;
    })
    .style('fill', '#33adff')
    .attr('transform', 'translate(60, 0)')
    .on('mouseover', function(d, i) {
      overlay.transition()
        .duration(0)
        .style('height', d + 'px')
        .style('width', barWidth + 'px')
        .style('opacity', .9)
        .style('left', (i * barWidth) + 0 + 'px')
        .style('top', height - d + 'px')
        .style('transform', 'translateX(60px)');
      tooltip.transition()
        .duration(200)
        .style('opacity', .9);
      tooltip.html(years[i] + '<br>' + '$' + GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' Billion')
        .attr('data-date', data.data[i][0])
        .style('left', (i * barWidth) + 30 + 'px')
        .style('top', height - 100 + 'px')
        .style('transform', 'translateX(60px)');
    })
    .on('mouseout', function(d) {
      tooltip.transition()
        .duration(200)
        .style('opacity', 0);
      overlay.transition()
        .duration(200)
        .style('opacity', 0);
    });

});