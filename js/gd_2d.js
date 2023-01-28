var gd2d = (function(){
  function f(x, y) {
    if (document.getElementById("fn1").checked) {
      return -1.0 * Math.sin(0.5*x**2-0.25*y**2+3) * Math.cos(2*x+1-Math.exp(y));
    } else {
      return Math.pow(1.0-x, 2) + 100 * Math.pow((y-Math.pow(x,2)),2);
    }
  }

  function dfx(x, y) {
    if (document.getElementById("fn1").checked) {
      return 2 * Math.sin(2 * x - Math.exp(y) + 1) * Math.sin(0.5 * x**2 - 0.25 * y**2 + 3) - x * Math.cos(2 * x - Math.exp(y) + 1) * Math.cos(0.5 * x**2 - 0.25 * y**2 + 3);
    } else {
      return -2 * x + 100 * Math.pow(y-x**2, 2);
    }
  }

  function dfy(x, y) {
    if (document.getElementById("fn1").checked) {
      return -1 * Math.exp(y) * Math.sin(2 * x - Math.exp(y) + 1) * Math.sin(0.5 * x**2 - 0.25 * y**2 + 3) + 0.5 * y * Math.cos(2 * x - Math.exp(y) + 1) * Math.cos(0.5 * x**2 - 0.25 * y**2 + 3);
    } else {
      return 100 * Math.pow(y-x**2, 2);
    }
  }

  function compute () {
    const lr = parseFloat(document.getElementById("lr").value);
    
    const xGd = dfx(xDot, yDot);
    xDot = xDot - xGd * lr;
    const yGd = dfy(xDot, yDot);
    yDot = yDot - yGd * lr;

    fnData[1].x.push(xDot);
    fnData[1].y.push(yDot);

    xGdData[0].x.push(it);
    xGdData[0].y.push(xGd);

    yGdData[0].x.push(it);
    yGdData[0].y.push(yGd);

    document.getElementById("currIter").innerText = `iteration: ${it}`;
    document.getElementById("currZ").innerText = `z: ${f(xDot, yDot)}`;
    document.getElementById("currX").innerText = `x: ${xDot}`;
    document.getElementById("currY").innerText = `y: ${yDot}`;
    document.getElementById("gradientX").innerText = `gradient x: ${xGd}`;
    document.getElementById("gradientY").innerText = `gradient y: ${yGd}`;
  }

  function update() {
    compute();

    Plotly.redraw('xGdLineChart');
    Plotly.redraw('yGdLineChart');
    Plotly.redraw('fnChart');

    // NOTE: animation does not work for contour chart...
    // Plotly.animate('fnChart', {
    //     data: fnData
    //   }, {
    //     transition: {
    //       duration: 500
    //     },
    //     frame: {
    //       duration: 500,
    //       redraw: false
    //     }
    //   }
    // );
  }
  
  function linearScale(ostart, ostop, istart, istop, value) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
  }

  function generateDataFromScratch() {
    arrZ = [];
    const start = -1.0;
    const stop = 1.0;
    for (var y=start; y<stop; y+=0.1) {
      var tmp = [];
      for (var x=start; x<stop; x+=0.1) {
        const curr = f(x, y);
        tmp.push(curr);
      }
      arrZ.push(tmp);
    }

    arrX = [];
    arrY = [];
    for (var i=start; i<stop; i+=0.1) {
      arrX.push(i);
      arrY.push(i);
    }
  }

  const xStarting = -0.3;
  const yStarting = 0.4;
  var xDot = xStarting;
  var yDot = yStarting;
  var it = 0;
  var arrX = [];
  var arrY = [];
  var arrZ = [];

  generateDataFromScratch();

  var fnData = [{
      x: arrX,
      y: arrY,
      z: arrZ,
      type: 'contour',
      colorscale: 'YlOrRd',
      contours: {
        showlabels: true,
        labelfont: {
          family: 'Raleway',
          size: 14,
          color: 'black',
        }
      }
    }, {
      x: [xDot],
      y: [yDot],
      mode: 'markers+lines',
      name: 'Current Position',
      marker: {
        color: 'black',
        size: 10
      },
      line: {
        width: 2,
        color: 'black'
      }
    }
  ];

  var fnLayout = {
    autosize: false,
    width: 700,
    height: 700,
    xaxis: {
      title: 'x',
    },
    yaxis: {
      title: 'y',
    }
  };

  var xGdData = [{
      x: [0.0],
      y: [0.0],
      mode: 'markers+lines',
      marker: {
        color: 'black',
        size: 3
      },
      line: {
        width: 2,
        color: 'black'
      }
    }
  ];

  var yGdData = [{
      x: [0.0],
      y: [0.0],
      mode: 'markers+lines',
      marker: {
        color: 'black',
        size: 3
      },
      line: {
        width: 2,
        color: 'black'
      }
    }
  ];

  let publicScope = {};
  publicScope.handleChange = function() {
    generateDataFromScratch();

    fnData[0].x = arrX;
    fnData[0].y = arrY;
    fnData[0].z = arrZ;
    fnData[1].x = [xDot];
    fnData[1].y = [yDot];
    Plotly.redraw('fnChart');
  }

  publicScope.run = async function() {
    document.getElementById("fn1").disabled = true;
    // document.getElementById("fn2").disabled = true;
    document.getElementById("lr").disabled = true;
    document.getElementById("iter").disabled = true;
    document.getElementById("btnStart").disabled = true;
    const iter = parseInt(document.getElementById("iter").value);
    
    Plotly.newPlot('yGdLineChart', yGdData, {
      height: 200,
      xaxis: { title: 'iteration' },
      yaxis: { title: 'gradient Y' },
      margin: { l: 50, r: 0, b: 50, t: 20 }
    }, {displayModeBar: false});
    
    Plotly.newPlot('xGdLineChart', xGdData, {
      height: 200,
      xaxis: { title: 'iteration' },
      yaxis: { title: 'gradient X' },
      margin: { l: 50, r: 0, b: 50, t: 20 }
    }, {displayModeBar: false});

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
