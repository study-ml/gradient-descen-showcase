var gd1d = (function(){
  function f(x) {
    if (document.getElementById("fn1").checked) {
      return Math.pow(x, 2) + 5 * x + 25;
    } else {
      return 8 * (x - 10) * Math.sin(0.5 * x - 5) + 200;
    }
  }

  function df(x) {
    if (document.getElementById("fn1").checked) {
      return 2 * x + 5;
    } else {
      return 4 * (x - 10) * Math.cos(0.5 * x - 5) + 8 * Math.sin(0.5 * x - 5);
    }
  }

  function compute () {
    const lr = parseFloat(document.getElementById("lr").value);
    
    const gd = df(xDot);
    xDot = xDot - gd * lr;
    yDot = f(xDot);
    
    // Because we want to keep all dots on the UI, use `push`
    // fnData[1].x = [xDot];
    // fnData[1].y = [yDot];
    fnData[1].x.push(xDot);
    fnData[1].y.push(yDot);
    fnData[1].marker.color.push("red");
    fnData[1].line.color.push("red");

    gData[0].x.push(it);
    gData[0].y.push(gd);

    document.getElementById("currIter").innerText = `iteration: ${it}`;
    document.getElementById("gradient").innerText = `gradient: ${gd}`;
    document.getElementById("currX").innerText = `x: ${xDot}`;
    document.getElementById("currY").innerText = `y: ${yDot}`;
  }

  function update() {
    compute();

    Plotly.redraw('gLineChart');

    // `redraw` also works, but we want animation
    // Plotly.redraw('fnChart');

    Plotly.animate('fnChart', {
        data: fnData
      }, {
        transition: {
          duration: 500
        },
        frame: {
          duration: 500,
          redraw: false
        }
      }
    );
  }

  function generateDataFromScratch() {
    myX = [];
    myY = [];
    for (var x = -30.0; x <= 30.0; x+=0.25) {
      myX.push(x)
      myY.push(f(x));
    }
  }

  const xStarting = 25;
  var xDot = xStarting;
  var it = 0;
  var myX = [];
  var myY = [];

  generateDataFromScratch();

  var fnData = [{
      x: myX,
      y: myY,
      type: 'scatter',
      name: 'f(x)',
    }, {
      x: [xDot],
      y: [f(xDot)],
      mode: 'markers+lines',
      name: 'Current Position',
      marker: {
        color: ["red"],
        size: 15
      },
      line: {
        width: 2,
        color: ["red"]
      }
    }
  ];

  var fnLayout = {
    autosize: false,
    width: 700,
    height: 600,
    xaxis: {
      title: 'x',
    },
    yaxis: {
      title: 'f(x)',
    }
  };

  var gData = [{
      x: [0.0],
      y: [0.0],
      mode: 'markers+lines',
      marker: {
        color: "black",
        size: 3
      },
      line: {
        width: 2,
        color: "black"
      }
    }
  ];

  var gLayout = {
    height: 200,
    xaxis: {
      title: 'iteration',
    },
    yaxis: {
      title: 'gradient',
    },
    margin: {
      l: 50,
      r: 0,
      b: 50,
      t: 20
    }
  };

  let publicScope = {};
  publicScope.handleChange = function() {
    generateDataFromScratch();

    fnData[0].x = myX;
    fnData[0].y = myY;
    fnData[1].x = [xDot];
    fnData[1].y = [f(xDot)];
    Plotly.redraw('fnChart');
  }

  publicScope.run = async function() {
    document.getElementById("fn1").disabled = true;
    document.getElementById("fn2").disabled = true;
    document.getElementById("lr").disabled = true;
    document.getElementById("iter").disabled = true;
    document.getElementById("btnStart").disabled = true;
    const iter = parseInt(document.getElementById("iter").value);
  
    Plotly.newPlot('gLineChart', gData, gLayout, {displayModeBar: false});
    for (var i = 0; i < iter; i++) {
      it = i + 1;
      requestAnimationFrame(update);
      await sleep(500);
    }
  }

  publicScope.init = function() {
    Plotly.newPlot('fnChart', fnData, fnLayout, {displayModeBar: false});
  }

  return publicScope;
})();
