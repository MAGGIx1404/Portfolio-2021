// import { Curtains, Plane } from "curtainsjs";

function webglPlane() {
  // track the mouse positions to send it to the shaders
  var mousePosition = {
    x: 0,
    y: 0,
  };

  // our canvas container
  var canvasContainer = document.getElementById("canvas");

  // set up our WebGL context and append the canvas to our wrapper
  var webGLCurtain = new Curtains({
    container: canvasContainer,
  });

  // get our plane element
  var planeElement = document.getElementsByClassName("curtain");

  // could be useful to get pixel ratio
  var pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;

  // listen our mouse/touch events on the whole document
  // we will pass the plane as second argument of our function
  // we could be handling multiple planes that way
  //   document.body.addEventListener("mouseover", function (e) {
  //     handleMovement(e);
  //   });

  document.body.addEventListener("mousemove", function (e) {
    handleMovement(e);
  });

  // set our initial parameters (basic uniforms)
  var params = {
    widthSegments: 20,
    heightSegments: 20, // we now have 20*20*6 = 2400 vertices !
    uniforms: {
      time: {
        name: "uTime", // uniform name that will be passed to our shaders
        type: "1f", // this means our uniform is a float
        value: 0,
      },
      mousePosition: {
        // our mouse position
        name: "uMousePosition",
        type: "2f", // notice this is a length 2 array of floats
        value: [mousePosition.x, mousePosition.y],
      },
      mouseStrength: {
        // the strength of the effect (we will attenuate it if the mouse stops moving)
        name: "uMouseStrength", // uniform name that will be passed to our shaders
        type: "1f", // this means our uniform is a float
        value: 0,
      },
    },
  };

  // create our plane
  var planes = [];

  for (var i = 0; i < planeElement.length; i++) {
    planes.push(webGLCurtain.addPlane(planeElement[i], params));

    handlePlanes(i);
  }

  function handlePlanes(index) {
    var plane = planes[index];

    plane
      .onReady(function () {
        // set a field of view of 35 to exagerate perspective
        // we could have done  it directly in the initial params
        plane.setPerspective(35);
      })
      .onRender(function () {
        plane.uniforms.time.value++;

        // continually decrease mouse strength
        plane.uniforms.mouseStrength.value = Math.max(
          0,
          plane.uniforms.mouseStrength.value
        );
      });
  }

  // handle the mouse move event
  function handleMovement(e, plane) {
    // touch event
    if (e.targetTouches) {
      mousePosition.x = e.targetTouches[0].clientX;
      mousePosition.y = e.targetTouches[0].clientY;
    }
    // mouse event
    else {
      mousePosition.x = e.clientX;
      mousePosition.y = e.clientY;
    }

    for (var i = 0; i < planes.length; i++) {
      var plane = planes[i];

      // convert our mouse/touch position to coordinates relative to the vertices of the plane
      var mouseCoords = plane.mouseToPlaneCoords(
        mousePosition.x,
        mousePosition.y
      );
      // update our mouse position uniform
      plane.uniforms.mousePosition.value = [mouseCoords.x, mouseCoords.y];

      // reassign mouse strength (you can try with different distanceFactor values)
      const distanceFactor = 0.5;
      plane.uniforms.mouseStrength.value =
        1 -
        Math.sqrt(Math.pow(mouseCoords.x, 2) + Math.pow(mouseCoords.y, 2)) *
          distanceFactor;
    }
  }
}

export default webglPlane;
