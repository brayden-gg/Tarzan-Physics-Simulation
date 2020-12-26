/*
Tarzan (m = 75 kg) is swinging over the rescue
Jane.There is an
wind blowing applying a force of
50 N against him.If he starts 3 meters below Jane,
how fast must he run in the beginning to get across
to reach her
*/
//const SCALE = +(new URLSearchParams(window.location.search).get('s')) || 0.6;

let tarzan;
let bottomGround;
let topGround;
let rope;
let theta;
let running;
let done;
const STEPS = 50;
let controlDiv;
let divElements = {};
let g = 10;
let path;
let paused = false;
let stepping = 0;

let picture;
let sprites = {};

function preload() {
    picture = loadImage('https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTngNCMuDgJ6Vgt2XuUQN-J4loZU6LwZYoSPz0JgzUp9CqFgZyy&usqp=CAU');
}

function setup() {
    path = [];
    frameCount = 0;
    let oldOps = {};
    if (controlDiv) {
        oldOps.velInput = divElements.velInput.value();
        oldOps.forceBox = divElements.forceBox.checked();
        oldOps.mvntBox = divElements.mvntBox.checked();
        oldOps.autoJump = divElements.autoJump.checked();
        oldOps.energyBox = divElements.energyBox.checked();
        oldOps.gBox = divElements.gBox.checked();
        controlDiv.remove();
    }


    createCanvas(1200, 600);


    image(picture, 0, 0);
    sprites.tarzan = get(45, 116, 16, 36);
    sprites.jane = get(173, 94, 19, 33);
    sprites.aligator1 = get(74, 166, 23, 12);

    controlDiv = createDiv()
        .style("display", "flex")
        .style("flex-wrap", "wrap")
        .style("width", "450px")
        .style("justify-content", "space-around")
        .style("margin-left", "400px")
        .style('font-family', 'Helvetica')


    divElements.velText = createP()
        .html("Initial Velocity: " + oldOps.velInput + " m/s&nbsp;")
    // .style("width", "100%")

    divElements.velInput = createSlider(0, 20, oldOps.velInput == undefined ? 7 : oldOps.velInput, 0.01)
        .size(300)

    divElements.pause = createButton(paused ? "▶️" : "⏸")
        .mouseClicked(() => {
            paused = !paused;
            divElements.pause.html(paused ? "▶️" : "⏸")
        })
        .attribute("title", "pause/play")


    divElements.step = createButton("⏭")
        .mouseClicked(() => {
            paused = true;
            divElements.pause.html("▶️")
            stepping = STEPS / 2;
        })
        .attribute("title", "advance one frame")

    divElements.submit = createButton("🔄")
        .mouseClicked(setup)
        .attribute("title", "reset")

    divElements.forceBox = createCheckbox("Show Force Vectors")
        .checked(oldOps.forceBox)
        .changed(() => divElements.mvntBox.checked(false));

    divElements.mvntBox = createCheckbox("Show Motion Vectors")
        .checked(oldOps.mvntBox)
        .changed(() => divElements.forceBox.checked(false))

    divElements.energyBox = createCheckbox("Show Energy")
        .checked(oldOps.energyBox != undefined ? oldOps.energyBox : true);

    divElements.autoJump = createCheckbox("Jump Automatically")
        .checked(oldOps.autoJump != undefined ? oldOps.autoJump : true);

    divElements.gBox = createCheckbox("Use more accurate value of g")
        .checked(oldOps.gBox != undefined ? oldOps.gBox : false);


    for (let element in divElements) {
        divElements[element].parent(controlDiv);
    }



    running = true;
    done = false;

    bottomGround = new Body({
        x: 0,
        y: height,
        width: 600,
        height: 2000,
        mass: Infinity,
        color: "#F5E1AC"
    })

    topGround = new Body({
        x: bottomGround.width + 2000,
        y: height - 300,
        width: 2000,
        height: 2000,
        mass: Infinity,
        color: "#F5E1AC"
    })

    rope = new Rope({
        //coords come from intersection of circles with radius 25 with points at (0,0) and (2000, 300)
        x: 600 + 660.8384421146933, //(1000 - 150 * Math.sqrt(2091 / 409))
        y: height - 2411.0770525687117, //(150 + 1000*Math.sqrt(2091/409))
        width: 5,
        height: 2500 - 170 / 2,
        mass: Infinity,
        color: "#E8BAA3"
    })

    theta = -asin((rope.x - bottomGround.width) / 2500);

    tarzan = new Person({
        x: 10, //(rope.height) * sin(theta) + rope.x, //10,
        y: height - 170 / 2, //(rope.height) * cos(theta) + rope.y, //height - 170 / 2,
        velX: divElements.velInput.value() / 0.6,
        velY: 0,
        width: 30,
        height: 170,
        mass: 75,
        color: "#3471C6",
        img: sprites.tarzan,

        accX: 0,
        accY: 0,
    });
    background(255);
}



function draw() {
    g = divElements.gBox.checked() ? 9.80665 : 10;

    divElements.velText.html("Initial Velocity: " + divElements.velInput.value() + " m/s&nbsp; ")

    // if (!paused) {

    for (let i = 0; i < STEPS; i++) {
        tarzan.clear();

        let gravity = createVector(0, g * tarzan.mass / 36); //100 / 60 / 60
        let wind = createVector(-50 / 36, 0);
        let tension = createVector();
        let normal = p5.Vector.mult(gravity, -1);


        tarzan.addForce(gravity, "red", "Gravity")
            .addForce(wind, "blue", "Wind")



        if (running) { //before the jump
            if (tarzan.x > bottomGround.width) { //just hit the rope
                running = false;
                tarzan.vel.y = -divElements.velInput.value() / 0.6 * sin(theta);
                tarzan.vel.x = divElements.velInput.value() / 0.6 * cos(theta);

            }

            tarzan.addForce(normal, "orange", "Normal");
        } else {

            if (!done) { //In the air
                //∑F_c = F_T - F_Gc - F_wc= ma_c = mv^2/r
                tension = p5.Vector.fromAngle(-theta - PI / 2);
                tension.setMag(max(gravity.mag() * cos(theta) + (tarzan.mass * tarzan.vel.magSq() / rope.height) - wind.mag() * sin(theta), 0));

                tarzan.addForce(tension, "green", "Tension")


                theta = asin((tarzan.x - rope.x) / p5.Vector.dist(tarzan.pos, rope.pos));
            }
            if (divElements.autoJump.checked() && theta > asin((topGround.x - rope.x) / 2500)) {
                done = true;
                //noLoop();
            }

            tarzan.applyForces();

            if (done && (tarzan.x > topGround.x - tarzan.width / 2 && tarzan.y + tarzan.height / 2 * sin(theta) > topGround.y) || (tarzan.x < bottomGround.width && tarzan.y + tarzan.height / 2 > bottomGround.y)) { //landed
                tarzan.addForce(normal, "orange", "Normal");
            }

        }

        if (!paused || stepping > 0) {
            tarzan.move();
            stepping--;
        }

    }

    push();

    background(255);
    scale(0.3);
    translate(0, height)



    makeWater();
    blendMode(MULTIPLY);
    image(sprites.jane, topGround.x + 100, topGround.y - 160, sprites.jane.width * 160 / sprites.jane.height, 160);
    tarzan.show();



    blendMode(BLEND);

    bottomGround.show();
    topGround.show();
    rope.show();

    if (divElements.forceBox.checked()) {
        tarzan.showVectors(tarzan.forces, tarzan.forces.map(() => "N"), null, tarzan.forces.map(() => 36))
    }

    if (divElements.mvntBox.checked()) {
        tarzan.acc.color = "red";
        tarzan.showVectors([tarzan.vel, tarzan.acc], ["m/s", "m/s²"], ["Velocity", "Acceleration"], [0.6, 36]);
    }

    if (divElements.energyBox.checked()) {
        let KE = 0.5 * tarzan.mass * (tarzan.vel.magSq() * 0.36);
        let PE = tarzan.mass * g * (height - (tarzan.y + tarzan.height / 2 * cos(tarzan.rot))) / 100;
        let work = max((tarzan.x - bottomGround.width) * 50 / 100, 0);
        let total = KE + work + PE;
        tarzan.showVectors([KE, PE, work, total], ["J", "J", "J", "J"], ["KE", "PE", "Work", "Total"], [1, 1, 1, 1])
    }
    // if (frameCount % 5 == 0 && !paused) {
    //     path.push(tarzan.pos.copy())
    //     path = path.slice(path.length - 200)
    // }

    // stroke("red")
    // noFill()
    // strokeWeight(5);
    // beginShape();
    // for (let p of path) {
    //     vertex(p.x, p.y)
    // }
    // endShape();


    pop();

}


function keyPressed() {

    if (keyCode == 32) {
        done = true;
    }
    if (keyCode == ENTER) {
        setup()
    }
    if (keyCode == (UP_ARROW)) {
        divElements.velInput.value(divElements.velInput.value() + 0.01)
    }

    if (keyCode == (DOWN_ARROW)) {
        divElements.velInput.value(divElements.velInput.value() - 0.01)
    }



}

function makeWater() {
    noStroke();
    fill("#AAD4CA")
    rect(0, height + 100, 3000, 2000)

    fill(255);
    for (let i = 0; i < 26; i++) {
        circle((frameCount * 3 + 100 * i) % 2600 + 200, height + 25, 200)
    }

}