

var width  = 960;
var height = 500;
var margin = 20;
var pad = margin / 2;
var color = d3.scaleOrdinal(d3.schemeCategory10);
// Generates a tooltip for a SVG circle element based on its ID
function addTooltip(circle) {
    var x = parseFloat(circle.attr("cx"));
    var y = parseFloat(circle.attr("cy"));
    var r = parseFloat(circle.attr("r"));
    var text = circle.attr("name");
    var tooltipid = "tooltip" + circle.attr("fileid")
    var tooltip = d3.select("#plot")
        .append("text")
        .text(text)
        .attr("x", x)
        .attr("y", y)
        .attr("dy", -r * 2)
        .attr("class","tooltip")
        .attr("id", tooltipid);
    var offset = tooltip.node().getBBox().width / 2;
    if ((x - offset) < 0) {
        tooltip.attr("text-anchor", "start");
        tooltip.attr("dx", -r);
    }
    else if ((x + offset) > (width - margin)) {
        tooltip.attr("text-anchor", "end");
        tooltip.attr("dx", r);
    }
    else {
        tooltip.attr("text-anchor", "middle");
        tooltip.attr("dx", 0);
    }
}




function drawGraph(graph) {
    svg = d3.select("#force").append("svg")
        .attr("width", width)
        .attr("height", height);
    // draw plot background
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "#eeeeee");
    // create an area within svg for plotting graph
    var plot = svg.append("g")
        .attr("id", "plot")
        .attr("transform", "translate(" + pad + ", " + pad + ")");
    // https://github.com/mbostock/d3/wiki/Force-Layout#wiki-force


    svg.append("text")
            .attr("x", margin)
            .attr("y", height - margin)
            .attr("class", "legend")
            .attr("id","text1")
            .style("fill", "steelblue")
            .text("wait for the cluster to stabilize, it takes a few seconds. DO NOT change to other algorithm before cluster is stabilized");

    drawNodes(graph.nodes);
    console.log(graph.nodes)



// initialize data. Here we have 3 points and some example pairwise dissimilarities
    var dists = calDists(graph.nodes);




    var simulation = tsneSimulation(graph.nodes,dists)





    // add ability to drag and update layout
    simulation.on("tick", function() {


        d3.selectAll(".documentcircle")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        d3.selectAll(".topic")
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; });

        d3.selectAll(".cluster")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        d3.selectAll(".circle")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        d3.selectAll(".topicname")
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; });

        d3.selectAll(".ring")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });


    });

        simulation.on("end", function() {
        drawCircle(graph.nodes)

        d3.selectAll("#text1").remove()


        svg.append("text")
            .attr("x", margin)
            .attr("y", height - margin)
            .attr("class", "legend")
            .style("fill", "steelblue")
            .on("click", function(){
            // Determine if current line is visible
            var active   = topicName.active ? false : true,
              newOpacity = active ? 0 : 1;
            // Hide or show the elements
            d3.selectAll(".topicname").style("opacity", newOpacity);
            // Update whether or not the elements are active
            topicName.active = active;
        })
            .text("algorithm used: t-SNE; cluster stabilized, click to show topic name ")
            ;
        });










}

function calDists(nodes){
    var dists = []


    d3.selectAll(".document")
        .each(function(d) {
            dists.push(d.topicmatrix)
        })
    return dists
}

function drawDonuts1(circle){
    var radius = 100;
    var g = svg.append("g").attr("transform", "translate(" + 110 + "," + 250 + ")");
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var text = circle.attr("name");

    var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.weight; });

    var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius-50);

    var label = d3.arc()
        .outerRadius(radius - 25)
        .innerRadius(radius - 25);

    var filename = "data" + circle.attr("id") + ".csv"

    d3.csv(filename, function(d) {
      d.weight = +d.weight;
      return d;
    }, function(error, data) {
      if (error) throw error;

      var arc = g.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
          .attr("id", "arc1");

      arc.append("path")
          .attr("d", path)
          .attr("fill", function(d) { return color(d.data.topic); });

      arc.each(function(d){
               if (d.data.weight != 0) {
          d3.select(this)
              .append("text")
              .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
              .attr("dy", "0.35em")
              .text(function(d) {
                  return d.data.topic;
          })}
    })

  var label2 = g.append("text")
      .attr("class", "label");

  label2.append("tspan")
      .attr("id", "label11")
      .style("text-anchor", "middle")
      .attr("x", 0)
      .attr("y", 5)
      .text(text)
      .call(wrap, 100);

});

}

function drawDonuts2(circle){
    var radius = 100;
    var g = svg.append("g").attr("transform", "translate(" + 850 + "," + 250 + ")");
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var text = circle.attr("name");

    var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.weight; });

    var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius-50);

    var label = d3.arc()
        .outerRadius(radius - 25)
        .innerRadius(radius - 25);

    var filename = "data" + circle.attr("id") + ".csv"

    d3.csv(filename, function(d) {
      d.weight = +d.weight;
      return d;
    }, function(error, data) {
      if (error) throw error;

      var arc = g.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
          .attr("id", "arc2");

      arc.append("path")
          .attr("d", path)
          .attr("fill", function(d) {return color(d.data.topic); });

      arc.each(function(d){
               if (d.data.weight != 0) {
          d3.select(this)
              .append("text")
              .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
              .attr("dy", "0.35em")
              .text(function(d) {
                  return d.data.topic;
          })}
    })

  var label2 = g.append("text")
      .attr("class", "label");

  label2.append("tspan")
      .attr("id", "label12")
      .style("text-anchor", "middle")
      .attr("x", 0)
      .attr("y", 5)
      .text(text)
      .call(wrap, 100);



});

}

// Draws nodes on plot
function drawNodes(nodes) {
    // used to assign nodes color by group
    var color = d3.scaleOrdinal(d3.schemeCategory10)
                .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    // https://github.com/mbostock/d3/wiki/Force-Layout#wiki-nodes
    d3.select("#plot").selectAll(".node")
        .data(nodes)
        .enter()
        .append("svg:g")
        .attr("class",  function(d) { return d.type ; })

    var donuts1active = 0
    var donuts2active = 0

    d3.selectAll(".document")
        .append("circle")
        .attr("class", "documentcircle")
        .attr("id", function(d, i) { return d.id; })
        .attr("fileid", function(d, i) { return d.fileid; })
        .attr("name", function(d, i) { return d.name; })
        .attr("cx", function(d, i) { return d.x; })
        .attr("cy", function(d, i) { return d.y; })
        .attr("r",  function(d, i) { return 6; })
        .attr("locker", 0 )
        .attr("fill", function(d) { return color(d.group); })
        .on("mouseover", function(circle, i) {
            d3.selectAll(".documentcircle")
                .each(function(d){
                    if (circle.fileid == d.fileid && d3.select(this).attr("locker") == 0) {
                        d3.select(this)
                                .attr("r", function (d, i) {
                                    return 18;
                                })
                        addTooltip(d3.select(this));
                    }
                    });
        })
        .on("mouseout",  function(circle, i) {
            var tooltipid = "#tooltip" + circle.fileid
            d3.selectAll(".documentcircle")
                .each(function(d){
                    if (circle.fileid == d.fileid && d3.select(this).attr("locker") == 0) {
                        d3.selectAll(tooltipid).remove()
                        d3.select(this)
                                .attr("r", function (d, i) {
                                    return 6;
                                })
                    }
                    })

        })

        .on("click",function(circle){

         if (donuts1active == 0)
         {
             d3.selectAll(".document")
                .each(function(d){
                    if (circle.fileid == d.fileid ) {
                        d3.select(this)
                                .attr("r", function (d, i) {
                                    return 18;
                                })
                        addTooltip(d3.select(this))
                        d3.select(this).attr("locker", 1 )
                        ;
                    }
                    });

             drawDonuts1(d3.select(this))
             donuts1active = 1
         }
         else if (donuts1active == 1 && donuts2active == 0)
            {
                 d3.selectAll(".document")
                .each(function(d){
                    if (circle.fileid == d.fileid ) {
                        d3.select(this)
                                .attr("r", function (d, i) {
                                    return 18;
                                })
                        addTooltip(d3.select(this))
                        d3.select(this).attr("locker", 1 )
                        ;
                    }
                    });

                drawDonuts2(d3.select(this))
                donuts2active = 1
            }
         else {
             d3.selectAll(".tooltip").remove()
             d3.selectAll(".document")
                 .attr("r", function (d, i) {
                     return 6
                 })
                 .attr("locker", 0)
             d3.selectAll("#arc2").remove()
             d3.selectAll("#label12").remove()
             d3.selectAll("#arc1").remove()
             d3.selectAll("#label11").remove()
             donuts1active = 0
             donuts2active = 0;
         }

        })







}

function drawCircle(Nodes) {
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    // https://github.com/mbostock/d3/wiki/Force-Layout#wiki-nodes
    var groupnumber = 0
    console.log(d3.select("#plot").selectAll(".node").size())
    d3.select("#plot").selectAll(".node")
        .data(Nodes)
        .enter()
        .append("svg:g")
        .attr("class", function (d) {
            if (d.group > groupnumber)
                groupnumber = d.group;
            return "group"+d.group;}
            )
    groupnumber = groupnumber + 1
    var n = 0
    while (n < groupnumber){
        var groupid = ".group"+n
        var circle = []
        d3.selectAll(groupid)
        .each(function(d, j) {
            k = {
                x: d.x,
                y: d.y,
                r: 6
            }
            if (d.type == "document"){
            circle.push(k)};
        })
        update();
        n++;
            console.log(d3.select("#plot").selectAll(".node").size())

    }

    function update() {
        var c = enclosingCircle(circle);
        var ring = d3.select("#plot")
            .append("circle")
            .attr("class", "ring")
            .attr("cx", function (d, i) {return c.x ;})
            .attr("cy", function (d, i) {return c.y ;})
            .attr("r", function(d,i) { return c.r + 10; })
            .attr("stroke", function(d) { return color(n); })
            .attr("stroke-width", 2)


        d3.selectAll(".topic")
            .each(function(d) {
            if(d.group == n) {
                d3.select(this)
                    .append("text")
                    .attr("class", "topicname")
                    .attr("id", "topicName")
                    .attr("x", function (d, i) {
                        return c.x;
                    })
                    .attr("y", function (d, i) {
                        return c.y;
                    })

                    .attr("text-anchor", "middle")
                    .text(function (d, i) {
                        return d.name;
                    })
            }
            })
    }

    // Returns a linked list from the specified array in random order.
    function randomizedList(array) {
        var i,
            n = array.length,
            head = null,
            node = head;
    while (n) {
        var next = {id: array.length - n, value: array[n - 1], next: null};
        if (node) node = node.next = next;
        else node = head = next;
        array[i] = array[--n];
    }

    return {head: head, tail: node};
    }

// Returns the smallest circle that contains the specified circles.
    function enclosingCircle(circles) {
        return enclosingCircleIntersectingCircles(randomizedList(circles), []);
    }

// Returns the smallest circle that contains the circles L
// and intersects the circles B.
    function enclosingCircleIntersectingCircles(L, B) {
        var circle,
            l0 = null,
            l1 = L.head,
            l2,
            p1;

        switch (B.length) {
            case 1: circle = B[0]; break;
            case 2: circle = circleIntersectingTwoCircles(B[0], B[1]); break;
            case 3: circle = circleIntersectingThreeCircles(B[0], B[1], B[2]); break;
        }

        while (l1) {
            p1 = l1.value, l2 = l1.next;
            if (!circle || !circleContainsCircle(circle, p1)) {

      // Temporarily truncate L before l1.
            if (l0) L.tail = l0, l0.next = null;
            else L.head = L.tail = null;

            B.push(p1);
            circle = enclosingCircleIntersectingCircles(L, B); // Note: reorders L!
            B.pop();

      // Move l1 to the front of L and reconnect the truncated list L.
            if (L.head) l1.next = L.head, L.head = l1;
            else l1.next = null, L.head = L.tail = l1;
            l0 = L.tail, l0.next = l2;
            }

            else {
            l0 = l1;
            }
            l1 = l2;
            }

        L.tail = l0;
        return circle;
    }

// Returns true if the specified circle1 contains the specified circle2.
    function circleContainsCircle(circle1, circle2) {
        var xc0 = circle1.x - circle2.x,
        yc0 = circle1.y - circle2.y;
        return Math.sqrt(xc0 * xc0 + yc0 * yc0) < circle1.r - circle2.r + 1e-6;
}

// Returns the smallest circle that intersects the two specified circles.
    function circleIntersectingTwoCircles(circle1, circle2) {
        var x1 = circle1.x, y1 = circle1.y, r1 = circle1.r,
        x2 = circle2.x, y2 = circle2.y, r2 = circle2.r,
        x12 = x2 - x1, y12 = y2 - y1, r12 = r2 - r1,
        l = Math.sqrt(x12 * x12 + y12 * y12);
        return {
        x: (x1 + x2 + x12 / l * r12) / 2,
        y: (y1 + y2 + y12 / l * r12) / 2,
        r: (l + r1 + r2) / 2
    };
    }

// Returns the smallest circle that intersects the three specified circles.
    function circleIntersectingThreeCircles(circle1, circle2, circle3) {
        var x1 = circle1.x, y1 = circle1.y, r1 = circle1.r,
            x2 = circle2.x, y2 = circle2.y, r2 = circle2.r,
            x3 = circle3.x, y3 = circle3.y, r3 = circle3.r,
            a2 = 2 * (x1 - x2),
            b2 = 2 * (y1 - y2),
            c2 = 2 * (r2 - r1),
            d2 = x1 * x1 + y1 * y1 - r1 * r1 - x2 * x2 - y2 * y2 + r2 * r2,
            a3 = 2 * (x1 - x3),
            b3 = 2 * (y1 - y3),
            c3 = 2 * (r3 - r1),
            d3 = x1 * x1 + y1 * y1 - r1 * r1 - x3 * x3 - y3 * y3 + r3 * r3,
            ab = a3 * b2 - a2 * b3,
            xa = (b2 * d3 - b3 * d2) / ab - x1,
            xb = (b3 * c2 - b2 * c3) / ab,
            ya = (a3 * d2 - a2 * d3) / ab - y1,
            yb = (a2 * c3 - a3 * c2) / ab,
            A = xb * xb + yb * yb - 1,
            B = 2 * (xa * xb + ya * yb + r1),
            C = xa * xa + ya * ya - r1 * r1,
            r = (-B - Math.sqrt(B * B - 4 * A * C)) / (2 * A);
        return {
            x: xa + xb * r + x1,
            y: ya + yb * r + y1,
            r: r
        };
    }


}





function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y);
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight  + "em").text(word);
      }
    }
  });
}

 function tsneSimulation(nodes,dists) {
  var initialRadius = 10,
    initialAngle = Math.PI * (3 - Math.sqrt(5));

  var simulation,
      iter = 0
      alpha = 1,
      alphaMin = 0.001,
      alphaDecay = 1 - Math.pow(alphaMin, 1 / 300),
      alphaTarget = 0,
      velocityDecay = 0.6,
      forces = d3.map(),
      stepper = d3.timer(step),
      event = d3.dispatch("tick", "end");

  if (nodes == null) nodes = [];
  if (dists == null) dists = [];

  var opt = {}
  opt.epsilon = 10; // epsilon is learning rate (10 = default)
  opt.perplexity = 30; // roughly how many neighbors each point influences (30 = default)
  opt.dim = 2; // dimensionality of the embedding (2 = default)

  var tsne = new tsnejs.tSNE(opt); // create a tSNE instance

  // initialize data. Here we have 3 points and some example pairwise dissimilarities
  tsne.initDataRaw(dists);

  function step() {
    tsne.step(); // every time you call this, solution gets better
    var  Y = tsne.getSolution();
    tick(Y);
    iter = iter + 1;
    event.call("tick", simulation);
    if (iter>300) {
      stepper.stop();
      event.call("end", simulation);
    }
  }

  function tick(Y) {
      var i, node;
      var n = Y.length




    alpha += (alphaTarget - alpha) * alphaDecay;


    for (i = 0; i < n; ++i) {
      node = nodes[i];

      dx = Y[i][0] * 100000000000;
      dy = Y[i][1] * 100000000000;
      node.x = 480+ dx;
      node.y = 250+ dy;

    }
  }



  function initializeNodes() {
    for (var i = 0, n = nodes.length, node; i < n; ++i) {
      node = nodes[i], node.index = i;
      if (isNaN(node.x) || isNaN(node.y)) {
        var radius = initialRadius * Math.sqrt(i), angle = i * initialAngle;
        node.x = radius * Math.cos(angle);
        node.y = radius * Math.sin(angle);
      }
    }
  }


  initializeNodes();

  return simulation = {
    tick: tick,

    restart: function() {
      return stepper.restart(step), simulation;
    },

    stop: function() {
      return stepper.stop(), simulation;
    },

    nodes: function(_) {
      return arguments.length ? (nodes = _, initializeNodes(), forces.each(initializeForce), simulation) : nodes;
    },

    alpha: function(_) {
      return arguments.length ? (alpha = +_, simulation) : alpha;
    },

    alphaMin: function(_) {
      return arguments.length ? (alphaMin = +_, simulation) : alphaMin;
    },

    alphaDecay: function(_) {
      return arguments.length ? (alphaDecay = +_, simulation) : +alphaDecay;
    },

    alphaTarget: function(_) {
      return arguments.length ? (alphaTarget = +_, simulation) : alphaTarget;
    },

    velocityDecay: function(_) {
      return arguments.length ? (velocityDecay = 1 - _, simulation) : 1 - velocityDecay;
    },

    on: function(name, _) {
      return arguments.length > 1 ? (event.on(name, _), simulation) : event.on(name);
    }
  };
}

function drawforceGraph(graph) {
    svg = d3.select("#force").append("svg")
        .attr("width", width)
        .attr("height", height)
    // draw plot background
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "#eeeeee");
    // create an area within svg for plotting graph
    var plot = svg.append("g")
        .attr("id", "plot")
        .attr("transform", "translate(" + pad + ", " + pad + ")")
    // https://github.com/mbostock/d3/wiki/Force-Layout#wiki-force
    var simulation = d3.forceSimulation()
        .force('centerX', d3.forceX(width / 2))
        .force('centerY', d3.forceY(height / 2))
        .force("charge", d3.forceManyBody())
        .force("link", d3.forceLink().distance(function(d) {
            return (d.source.group == d.target.group) ? 50 : 450;
        }))




    simulation.nodes(graph.nodes);

    simulation.force("link").links(graph.links);

    svg.append("text")
            .attr("x", margin)
            .attr("y", height - margin)
            .attr("class", "legend")
            .attr("id","text1")
            .style("fill", "steelblue")
            .text("wait for the cluster to stabilize, it takes a few seconds. DO NOT change to other algorithm before cluster is stabilized.");

    drawLinks(graph.links);
    drawforceNodes(graph.nodes);
    // add ability to drag and update layout

          const dragDrop = d3.drag()
  .on('start', node => {
    node.fx = node.x
    node.fy = node.y
  })
  .on('drag', node => {
    simulation.alphaTarget(0.7).restart()
    node.fx = d3.event.x
    node.fy = d3.event.y
  })
  .on('end', node => {
    if (!d3.event.active) {
      simulation.alphaTarget(0)
      //console.log("1111")
    }
    node.fx = null
    node.fy = null
   // console.log("2222")
  });

  const dragDrop2 = d3.drag()
        .on('drag', function (d) {

            d.x += d3.event.dx;
            d.y += d3.event.dy;

            d3.select(this)
                .attr('transform', 'translate(' + d.x + ',' + d.y + ')');
        });

 
    
    simulation.on("tick", function() {
        d3.selectAll(".innerlink")
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; })
            .call(dragDrop);
        d3.selectAll(".outerlink")
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; })
            .call(dragDrop);
        d3.selectAll(".topiclink")
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; })
            .call(dragDrop);
        d3.selectAll(".outertopiclink")
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; })
            .call(dragDrop);

        d3.selectAll(".document")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .call(dragDrop);

        d3.selectAll(".topic")
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; })
            .call(dragDrop);

        d3.selectAll(".cluster")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .call(dragDrop);

        d3.selectAll(".circle")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .call(dragDrop);


        d3.selectAll(".topicname")
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; })
            .call(dragDrop);

       
        d3.selectAll(".ring")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .call(dragDrop);
    
    });

        simulation.on("end", function() {
          console.log("starting")
        if (d3.selectAll(".ring").size() == 0) { 
          drawCircle(graph.nodes)
        }

        d3.selectAll("#text1").remove()

       /* d3.selectAll(".innerlink").call(dragDrop);
        d3.selectAll(".document").call(dragDrop);
        d3.selectAll(".outerlink").call(dragDrop);
        d3.selectAll(".topiclink").call(dragDrop);
        d3.selectAll(".outertopiclink").call(dragDrop);
        d3.selectAll(".topic").call(dragDrop);
        d3.selectAll(".cluster").call(dragDrop);
        d3.selectAll(".circle").call(dragDrop);
        d3.selectAll(".topicname").call(dragDrop);
        if (d3.selectAll(".ring").size() > 0) {
          console.log("WTF")
          d3.selectAll(".ring").call(dragDrop);
        }*/

        svg.append("text")
            .attr("x", margin)
            .attr("y", height - margin)
            .attr("class", "legend")
            .style("fill", "steelblue")
            .on("click", function(){
            // Determine if current line is visible
            var active   = topicName.active ? false : true,
              newOpacity = active ? 0 : 1;
            // Hide or show the elements
            d3.selectAll(".topicname").style("opacity", newOpacity);
            // Update whether or not the elements are active
            topicName.active = active;
            })
            .text("algorithm used: force directed; cluster stabilize, click to show topic name ")
            ;
        });


}

function drawLinks(links) {


    d3.select("#plot").selectAll(".link")
        .data(links)
        .enter()
        .append("svg:g")
        .attr("class",  function(d) { return d.type; })

    d3.selectAll(".innerlink")
        .append("line")
        .attr("class",  function(d) { return d.type; })
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })



    d3.selectAll(".topiclink")
        .append("line")
        .attr("class",  function(d) { return d.type; })
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })

        d3.selectAll(".outertopiclink")
        .append("line")
        .attr("class",  function(d) { return d.type; })
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })
}

function drawforceNodes(nodes) {
    // used to assign nodes color by group
    var color = d3.scaleOrdinal(d3.schemeCategory10)
                .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    // https://github.com/mbostock/d3/wiki/Force-Layout#wiki-nodes
    d3.select("#plot").selectAll(".node")
        .data(nodes)
        .enter()
        .append("svg:g")
        .attr("class",  function(d) { return d.type ; })

    var donuts1active = 0
    var donuts2active = 0

    d3.selectAll(".document")
        .append("circle")
        .attr("class", "document")
        .attr("id", function(d, i) { return d.id; })
        .attr("fileid", function(d, i) { return d.fileid; })
        .attr("name", function(d, i) { return d.name; })
        .attr("cx", function(d, i) { return d.x; })
        .attr("cy", function(d, i) { return d.y; })
        .attr("r",  function(d, i) { return 6; })
        .attr("locker", 0 )
        .attr("fill", function(d) { return color(d.group); })
        .on("mouseover", function(circle, i) {
            d3.selectAll(".document")
                .each(function(d){
                    if (circle.fileid == d.fileid && d3.select(this).attr("locker") == 0) {
                        d3.select(this)
                                .attr("r", function (d, i) {
                                    return 18;
                                })
                        addTooltip(d3.select(this));
                    }
                    });
        })
        .on("mouseout",  function(circle, i) {
            var tooltipid = "#tooltip" + circle.fileid
            d3.selectAll(".document")
                .each(function(d){
                    if (circle.fileid == d.fileid && d3.select(this).attr("locker") == 0) {
                        d3.selectAll(tooltipid).remove()
                        d3.select(this)
                                .attr("r", function (d, i) {
                                    return 6;
                                })
                    }
                    })

        })

        .on("click",function(circle){

         if (donuts1active == 0)
         {
             d3.selectAll(".document")
                .each(function(d){
                    if (circle.fileid == d.fileid ) {
                        d3.select(this)
                                .attr("r", function (d, i) {
                                    return 18;
                                })
                        addTooltip(d3.select(this))
                        d3.select(this).attr("locker", 1 )
                        ;
                    }
                    });

             drawDonuts1(d3.select(this))
             donuts1active = 1
         }
         else if (donuts1active == 1 && donuts2active == 0)
            {
                 d3.selectAll(".document")
                .each(function(d){
                    if (circle.fileid == d.fileid ) {
                        d3.select(this)
                                .attr("r", function (d, i) {
                                    return 18;
                                })
                        addTooltip(d3.select(this))
                        d3.select(this).attr("locker", 1 )
                        ;
                    }
                    });

                drawDonuts2(d3.select(this))
                donuts2active = 1
            }
         else {
             d3.selectAll(".tooltip").remove()
             d3.selectAll(".document")
                 .attr("r", function (d, i) {
                     return 6
                 })
                 .attr("locker", 0)
             d3.selectAll("#arc2").remove()
             d3.selectAll("#label12").remove()
             d3.selectAll("#arc1").remove()
             d3.selectAll("#label11").remove()
             donuts1active = 0
             donuts2active = 0;
         }

        });

  /* This piece of code automatically adds the names of the documents 
  to the side navigation panel. 
    var nav = d3.select("#mySidenav")
    var set1 = new Set()
        d3.selectAll(".document")
        .each(function(d) {
          set1.add(d.name)
        });
    set1.forEach(function(name) { 
      nav.append("a")
      .text(name)
      .attr("name", function(d, i) { return name; })
      // the pieces of code below add the tooltip to the side panel
      // so that when you hover over names, nodes will be highlighted
      .on("mouseover", function(d) {
        d3.selectAll(".document")
        .each(function(circle,i) {
          if (circle.name == name) {
            d3.select(this)
                .attr("r", function(d, i) {
                  return 18;
                })
            addTooltip(d3.select(this));
          }
        })
      })*/

    /* Attempt to add dropdowns instead of links */

    var nav = d3.select("#mySidenav").select(".dropdown")
    var set1 = new Set()
        d3.selectAll(".document")
        .each(function(d) {
          set1.add(d.name)
        });

    /* 
     * In this next big chunk, we are taking every single
     * unique document name, creating a button out of it 
     * in the sidenav, and then adding the necessary attributes
     * and classes so that they will function as necessary. 
     */
    set1.forEach(function(name) { 
      var bttn = nav.append("button");
        bttn.attr("class", "dropbtn")
        .text(name + " ")
        .attr("name", name)
        .attr("onclick", "onDropDownClick(this)")
        //.on("click", "onDropDownClick(this)")

      // the pieces of code below add the tooltip to the side panel
      // so that when you hover over names, nodes will be highlighted
        .on("mouseover", function(d) {
            d3.selectAll(".document")
            .each(function(circle,i) {
              if (circle.name == name) {
                d3.select(this)
                    .attr("r", function(d, i) {
                      return 18;
                    })
                addTooltip(d3.select(this));
              }
            })
          })

        .on("mouseout", function(d) {
          d3.selectAll(".document")
          .each(function(circle, i) {
            var tooltipid = "#tooltip" + circle.fileid
            if (circle.name == name) {
              d3.selectAll(tooltipid).remove()
              d3.select(this)
                  .attr("r", function(d, i) {
                    return 6;
                  })
            }
          })
        })
        /* 
         * This section of text adds the keywords to the dropdown buttons.
         * First it appends a dropdown button for the file, and then it
         * retrieves the appropriate keywords from the keywords.json file
         * for the corresponding document (the populateKeywords function does 
         * this). Then, it appends each keyword as a paragraph element with
         * its corresponding keyword text. 
         */
        var div = bttn.append("div")
          .attr("class", "dropdown-content")
          .append("a")
        d3.json("keywords.json", function(json){
          var words = populateKeywords(json, name);
          div.append("h3")
            .text("Keywords:")
          words.forEach(function(word) {
            div.append("p")
              .text(word)
          });
          // var docs = json.documents;
          // docs.forEach(function(doc) {
          //   if (doc.name == name) {
          //      div.text(doc.keywords);
          //   }
          // });
        });
                  //console.log(bttn.attr("name"))


    });

  

}
/* Gets keywords from a json file (keywords.json), and
 * if it matches a document name, returns the corresponding
 * keywords for that document. */
function populateKeywords(json, name) {
  var docs = json.documents;
  for (var doc of docs) {
    if (doc.name == name) {
      return doc.keywords;
    }
  }
}

function getSummary(json, name) {
  var docs = json.documents;
  for (var doc of docs) {
    if (doc.name == name) {
      return doc.summaries;
    }
  }
}


/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}

/*  
 * When the user clicks on the button, toggles
 * between hiding and showing the dropdown content, and adds the
 * appropriate summary of a document.  
 *
 */
function onDropDownClick(elem) {

    var btn = elem.getElementsByClassName("dropdown-content")[0]
    // shows dropdown content and highlights document name
    btn.classList.toggle("show");
    elem.classList.toggle("highlight");

    // summary
    d3.json("summaries.json", function(json){
        var name = d3.select(elem).attr("name");
        // gets appropriate summary based off document name
        var summary = getSummary(json, name);
      
        // first removes existing summary (if any), then places
        // summary under graph.
        d3.select("#blurbs").selectAll("*").remove();
        var par = d3.select("#blurbs")
        par.append("h3")
          .text("Summary: " + name)
        par.append("p")
          .append("text")
          .text(summary)
    });

}

// Close the dropdown menu and unhiglights selected document
// if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches(".dropbtn")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var buttons = document.getElementsByClassName("dropbtn")
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      var button = buttons[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
      if (button.classList.contains("highlight")) {
        button.classList.remove("highlight");
      }
    }
  }
}


