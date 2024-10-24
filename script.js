// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */
var button;
let video;
let poseNet;
let poses = [];
let oneTime = 0;
let yPosL = 0;
let yPosLSav = 0;
let yPosR = 0;
let yPosRSav = 0;
let clownnose;
let sunglasses;
let filterSel = 0;
let buttonclown;
let buttonsunglasses;
let buttonpositionx = 500;
let buttonpositiony = 775
var buttonFXPorklife;
var button;
var clownnosestate = false;
var sunglassesstate = false;
var FXPorklifeState = false;
var FXPorklifeState = 1;
let myVideo;
let allVideos = [];
let vidWidth = 160;
let vidHeight = 120;

let sfilter;

function preload() {
  clownnose = loadImage(
    "https://cdn.glitch.global/0aaba933-6b39-4595-bd6a-263b91e4b137/clown_nose.png?v=1646677023601"
  );
  sunglasses = loadImage(
    "https://cdn.glitch.global/0aaba933-6b39-4595-bd6a-263b91e4b137/sunglasses.png?v=1646677057956"
  );
  poseNet = ml5.bodyPose("MoveNet");

}

let myCanvas;
console.log("hi before setup")

function setup() {
 
  myCanvas = createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  allVideos.push(myCanvas);

  // p5LiveMedia
  console.log('hi');
  console.log(ml5.version);
  let p5l = new p5LiveMedia(this, "CANVAS", myCanvas, "clarissa");
  p5l.on("stream", gotOtherStream);
  p5l.on("disconnect", disconnectOtherStream);

  // Create a new poseNet method with a single detection
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.detectStart(video, function (results) {
    poses = results;
  });

  button = createButton("");
  button = createImg(
    "images/camera.png"
  );
  button.position(600, 790);
  button.size(50, 50);
  button.mousePressed(takePhoto);
  buttonclown = createImg(
    "https://cdn.glitch.global/0aaba933-6b39-4595-bd6a-263b91e4b137/clown_nose.png?v=1646677023601"
  );

  buttonclown.position(440, 780);
  
  buttonclown.size(80, 80);
  buttonclown.mousePressed(function () {
    clownnosestate = !clownnosestate;
  });

  buttonsunglasses = createImg(
    "https://cdn.glitch.global/0aaba933-6b39-4595-bd6a-263b91e4b137/sunglasses.png?v=1646677057956"
  );
  buttonsunglasses.position(750, 790);
  buttonsunglasses.size(80, 50);
  buttonsunglasses.mousePressed(function () {
    sunglassesstate = !sunglassesstate;
  });
  buttonFXPorklife = createImg(
    "images/questionmark.png"
  );
  buttonFXPorklife.position(900, 795);
  buttonFXPorklife.size(42, 40);
  buttonFXPorklife.mousePressed(myFilter);
}
function windowResized() {
  button.position(8*windowWidth/15, 795);
  buttonclown.position(windowWidth/3, 775);
  buttonFXPorklife.position(9* windowWidth/15,  800);
  buttonsunglasses.position(6.2* windowWidth/15, 790)

}



function myFilter() {
  let filters = ["RAT", GRAY, INVERT, OPAQUE];
  sfilter = random(filters);
  console.log(sfilter);
}

function modelReady() {
  //
  // select("#status").html("Model Loaded");
}

function draw() {
  image(video, 0, 0, width, height);

  if (sfilter == "RAT") {
    image(video, 0, 0, width / 2, height);
    translate(width, 0);
    scale(-1, 1);
  } else {
    if (sfilter) {
      filter(sfilter);
    }
  }
  noStroke();
  //console.log(poses);

 
  // drawKeypoints();
  // drawSkeleton();

  if (clownnosestate == true) {
    drawclownnose();
  }

  // if (sunglassesstate == true) {
  //   drawsunglasses();
  // }
  // if (FXPorklifeState == -1) {
  //   filter(BLUR, 5);
  // }
}

const s = (p) => {
  let x = 100;
  let y = 100;

  p.setup = function () {
    p.createCanvas(640, 480);
  };

  p.draw = function () {
    let w = vidWidth;
    let h = vidHeight;
    let col = width / w;
    let row = height / h;
    let totalVideosThatWeCanDisplay = col * row;
    let videoCounter = 0;

    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        if (videoCounter >= allVideos.length) {
          break;
        }
        p.image(allVideos[videoCounter], j * w, i * h, w, h);
        videoCounter++;
      }
    }
  };
};

let photoCollageCanvas = new p5(s); // invoke p5

function drawclownnose() {
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];

    // This code is problematic
    //image(clownnose, pose.nose.x - 400, pose.nose.y - 400);
    //var clownnose= document.getElementById("clownnose");
    //image.style.width = "20px";
    //image.style.height = "auto";

    // Here is what I think you want
    image(clownnose, pose.nose.x - 120, pose.nose.y - 125, 250, 250);
  }
}

function drawsunglasses() {
  console.log("Hi");
  fill(255, 0, 0);
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    image(sunglasses, pose.leftEye.x + 60, pose.leftEye.y + 100, 250, 250);
  }
}

function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i];
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.confidence > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.x, keypoint.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      // stroke(255, 0, 0);
      line(
        partA.position.x,
        partA.position.y,
        partB.position.x,
        partB.position.y
      );
    }
  }
}

function drawsunglasses() {
  console.log("Hi");
  fill(255, 0, 0);
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    image(sunglasses, pose.leftEye.x - 160, pose.leftEye.y - 100, 250, 250);
  }
}

function takePhoto() {
  photoCollageCanvas.saveFrames("selfie", "png", 1, 1);
}
function FXPorklife() {
  FXPorklifeState *= -1;
}
function gotOtherStream(stream, id) {
  // This is just like a video/stream from createCapture(VIDEO)
  otherVideo = stream;
  otherVideo.size(vidWidth, vidHeight);
  allVideos.push(otherVideo);
  otherVideo.hide();
  //otherVideo.id and id are the same and unique identifiers
}

function disconnectOtherStream(id) {
  allVideos = allVideos.filter((vid) => vid.id !== id);
}

// let video;
// let bodyPose;
// let poses = [];
// let oneTime = 0;
// let yPosL = 0;
// let yPosLSav = 0;
// let yPosR = 0;
// let yPosRSav = 0;
// let clownnose;
// let sunglasses;
// let filterSel = 0;
// let buttonclown;
// let buttonsunglasses;
// let buttonpositionx = 500;
// let buttonpositiony = 775;
// let buttonFXPorklife;
// let button;
// let clownnosestate = false;
// let sunglassesstate = false;
// let FXPorklifeState = 1;
// let myVideo;
// let allVideos = [];
// let vidWidth = 160;
// let vidHeight = 120;
// let sfilter;  // Store selected filter

// function preload() {
//   clownnose = loadImage(
//     "https://cdn.glitch.global/0aaba933-6b39-4595-bd6a-263b91e4b137/clown_nose.png?v=1646677023601"
//   );
//   sunglasses = loadImage(
//     "https://cdn.glitch.global/0aaba933-6b39-4595-bd6a-263b91e4b137/sunglasses.png?v=1646677057956"
//   );
// }

// function setup() {
//   myCanvas = createCanvas(640, 480);
//   video = createCapture(VIDEO);
//   video.size(width, height);
//   video.hide();
//   allVideos.push(myCanvas);


//   // bodyPose = ml5.bodyPose(video, modelReady);
//   bodyPose = ml5.bodyPose();
//   bodyPose.detectStart(video, gotPoses);

//   function gotPoses(results) {
//     // Store the model's results in a global variable
//     poses = results;
//   }
//   // bodyPose.on('pose', function (results) {
//   //   poses = results;
//   // });



//   button = createButton("");
//   button = createImg("images/camera.png");
//   button.position(600, 790);
//   button.size(50, 50);
//   button.mousePressed(takePhoto);
  
//   buttonclown = createImg(
//     "https://cdn.glitch.global/0aaba933-6b39-4595-bd6a-263b91e4b137/clown_nose.png?v=1646677023601"
//   );
//   buttonclown.position(440, 780);
//   buttonclown.size(80, 80);
//   buttonclown.mousePressed(function () {
//     clownnosestate = !clownnosestate;
//   });

//   buttonsunglasses = createImg(
//     "https://cdn.glitch.global/0aaba933-6b39-4595-bd6a-263b91e4b137/sunglasses.png?v=1646677057956"
//   );
//   buttonsunglasses.position(750, 790);
//   buttonsunglasses.size(80, 50);
//   buttonsunglasses.mousePressed(function () {
//     sunglassesstate = !sunglassesstate;
//   });

//   buttonFXPorklife = createImg("images/questionmark.png");
//   buttonFXPorklife.position(900, 795);
//   buttonFXPorklife.size(42, 40);
//   buttonFXPorklife.mousePressed(myFilter);
// }

// function windowResized() {
//   button.position(8 * windowWidth / 15, 795);
//   buttonclown.position(windowWidth / 3, 775);
//   buttonFXPorklife.position(9 * windowWidth / 15, 800);
//   buttonsunglasses.position(6.2 * windowWidth / 15, 790);
// }

// function myFilter() {
//   let filters = ["GRAY", INVERT, OPAQUE, BLUR]; 
//   sfilter = random(filters);  
//   console.log(sfilter);
// }


// // function modelReady() {
// //   console.log("BodyPose Model Loaded");
// // }

// function draw() {
//   image(video, 0, 0, width, height);

//   if (sfilter === "RAT") {
//     image(video, 0, 0, width / 2, height);
//     translate(width, 0);
//     scale(-1, 1);
//   } else if (sfilter) {
//     filter(sfilter);
//   }
  
//   noStroke();


//   drawKeypoints();
//   drawSkeleton();

//   if (clownnosestate === true) {
//     drawclownnose();
//   }

//   if (sunglassesstate === true) {
//     drawsunglasses();
//   }

//   if (FXPorklifeState === -1) {
//     filter(BLUR, 5);
//   }
// }
// function drawKeypoints() {
//   for (let i = 0; i < poses.length; i++) {
//     let pose = poses[i];
//     for (let j = 0; j < pose.keypoints.length; j++) {
//       let keypoint = pose.keypoints[j];
//       if (keypoint.confidence > 0.1) {
//         fill(255, 0, 0);
//         noStroke();
//         ellipse(keypoint.x, keypoint.y, 10, 10); 
//       }
//     }
//   }
// }

// // function drawKeypoints() {
// //   for (let i = 0; i < poses.length; i++) {
// //     // let pose = poses[i].pose;
// //     let pose = poses[i];

// //     console.log(pose);

//     // for (let j = 0; j < pose.keypoints.length; j++) {
//     //   let keypoint = pose.keypoints[j];
//     //   if (keypoint.score > 0.2) {
//     //     fill(255, 0, 0);
//     //     noStroke();
//     //     ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
//     //   }
//     // }
// //   }
// // }

// function drawSkeleton() {
//   for (let i = 0; i < poses.length; i++) {
//   //   let skeleton = poses[i].skeleton;
//   //   for (let j = 0; j < skeleton.length; j++) {
//   //     let partA = skeleton[j][0];
//   //     let partB = skeleton[j][1];
//   //     stroke(255, 0, 0);
//   //     line(
//   //       partA.position.x,
//   //       partA.position.y,
//   //       partB.position.x,
//   //       partB.position.y



//   //     );
//   //     console.log(poses);

//   //   }
//   }
// // }
// // function drawSkeleton() {
// //   let connections = ml5.bodyPose.getConnections(); 

// //   for (let i = 0; i < poses.length; i++) {
// //     let pose = poses[i];
// //     for (let j = 0; j < connections.length; j++) {
// //       let pointAIndex = connections[j][0];
// //       let pointBIndex = connections[j][1];

// //       let pointA = pose.keypoints[pointAIndex];
// //       let pointB = pose.keypoints[pointBIndex];

    
// //       if (pointA.confidence > 0.1 && pointB.confidence > 0.1) {
// //         stroke(255, 0, 0);  
// //         strokeWeight(2);
// //         line(pointA.x, pointA.y, pointB.x, pointB.y);  
// //     }
// //   }
// // }


// // function drawclownnose() {
// //   for (let i = 0; i < poses.length; i++) {
// //     let pose = poses[i];
// //     image(clownnose, pose.nose.x - 120, pose.nose.y - 125, 250, 250);
// //   }
// // }

// // function drawsunglasses() {
// //   for (let i = 0; i < poses.length; i++) {
// //     let pose = poses[i];
// //     image(sunglasses, pose.leftEye.x - 160, pose.leftEye.y - 100, 250, 250);
// //   }
// // }
// function drawclownnose() {
//   for (let i = 0; i < poses.length; i++) {
//     let pose = poses[i];
//     image(clownnose, pose.nose.x - 120, pose.nose.y - 125, 250, 250);
//   }
// }

// function drawsunglasses() {
//   for (let i = 0; i < poses.length; i++) {
//     let pose = poses[i];
//     image(sunglasses, pose.leftEye.x - 160, pose.leftEye.y - 100, 250, 250);
//   }
// }


// function takePhoto() {
//   saveFrames("selfie", "png", 1, 1);
// }

// function FXPorklife() {
//   FXPorklifeState *= -1;
// }
// }
