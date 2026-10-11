const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const environmentSelect = document.getElementById("environmentSelect");


let data = null;



// Canvas Size
canvas.width = 1200;
canvas.height = 650;

// Physics Variables
let objects = [];
let initialObjects = [];

let gravity = 0;
let slowMotion = 1;

let isRunning = false;
let elapsedTime = 0;
let lastTime = performance.now();
let frameCount = 0;
let trailEnabled = true;
let selectedBall = null;
let isDragging = false;
let selectedObject = null;
// =============================
// Load JSON
// =============================
async function loadSimulation()
{
    const response = await fetch("output.json?t=" + Date.now());
    data = await response.json();

    const activeEnv =
    data.environments[data.activeEnvironment];

    document.getElementById("env").textContent =
        activeEnv.type;

    document.getElementById("gravity").textContent =
        activeEnv.gravity;

    gravity = activeEnv.gravity;
    slowMotion = data.settings.slow_motion;
    trailEnabled = data.settings.trail;

    objects = JSON.parse(JSON.stringify(data.objects));
    document.getElementById("objects").textContent = objects.length;
    initialObjects = JSON.parse(JSON.stringify(data.objects));

    console.log("Active Environment:", activeEnv);
    console.log("Gravity:", gravity);
    console.log(data);
}

environmentSelect.addEventListener("change", function()
{
    const selectedIndex = Number(this.value);

    data.activeEnvironment = selectedIndex;

    const selectedEnvironment =
        data.environments[selectedIndex];

    gravity = selectedEnvironment.gravity;

    document.getElementById("env").textContent =
        selectedEnvironment.type;

    document.getElementById("gravity").textContent =
        selectedEnvironment.gravity;
});

// =============================
// Physics
// =============================
function updatePhysics()
{
    if(!isRunning)
        return;

    elapsedTime += 0.016 * slowMotion;

    document.getElementById("time").textContent =
        elapsedTime.toFixed(1) + " s";

    for(const obj of objects)
    {
        const halfWidth = obj.shape === "rectangle" ? obj.width / 2 : obj.radius;
        const halfHeight = obj.shape === "rectangle" ? obj.height / 2 : obj.radius;
        // Gravity
        obj.velocity.y += gravity * 0.05 * slowMotion;

        // Position
        obj.position.x += obj.velocity.x * slowMotion;
        obj.position.y += obj.velocity.y * slowMotion;

        // Floor Collision
        if(obj.position.y + halfHeight >= canvas.height)
        {
            obj.position.y = canvas.height - halfHeight;

            obj.velocity.y =
                -obj.velocity.y * obj.elasticity;
            
            if(Math.abs(obj.velocity.y) < 0.2)
            {
                obj.velocity.y = 0;
            }
        }

        // Ceiling
       if(obj.position.y - halfHeight <= 0)
        {
            obj.position.y = halfHeight;

            obj.velocity.y =
                -obj.velocity.y * obj.elasticity;
        }

        // Left Wall
        if(obj.position.x - halfWidth <= 0)
        {
            obj.position.x = halfWidth;

            obj.velocity.x =
                -obj.velocity.x * obj.elasticity;
        }

        // Right Wall
        if(obj.position.x + halfWidth >= canvas.width)
        {
            obj.position.x = canvas.width - halfWidth;

            obj.velocity.x =
                -obj.velocity.x * obj.elasticity;
        }
    }
    // Ball to Ball Collision
   
for(let i = 0; i < objects.length; i++)
{
    for(let j = i + 1; j < objects.length; j++)
    {
        const a = objects[i];
        const b = objects[j];

        if(a.shape !== "circle" || b.shape !== "circle")
            continue;

        const dx = b.position.x - a.position.x;
        const dy = b.position.y - a.position.y;

        const distance = Math.sqrt(dx*dx + dy*dy);

        if(distance <= a.radius + b.radius)
{
    const overlap = (a.radius + b.radius) - distance;

    if(overlap > 0 && distance > 0)
    {
        const nx = dx / distance;
        const ny = dy / distance;

        a.position.x -= nx * overlap / 2;
        a.position.y -= ny * overlap / 2;

        b.position.x += nx * overlap / 2;
        b.position.y += ny * overlap / 2;
    }

    const tempX = a.velocity.x;
    const tempY = a.velocity.y;

    a.velocity.x = b.velocity.x;
    a.velocity.y = b.velocity.y;

    b.velocity.x = tempX;
    b.velocity.y = tempY;
}
    }
}

   // =========================
// Ball ↔ Rectangle Collision
// =========================

for (const ball of objects)
{
    if(ball.shape !== "circle")
        continue;

    for(const box of objects)
    {
        if(box.shape !== "rectangle")
            continue;

        const left   = box.position.x - box.width / 2;
        const right  = box.position.x + box.width / 2;
        const top    = box.position.y - box.height / 2;
        const bottom = box.position.y + box.height / 2;

        const nearestX = Math.max(left,
                          Math.min(ball.position.x, right));

        const nearestY = Math.max(top,
                          Math.min(ball.position.y, bottom));

        const dx = ball.position.x - nearestX;
        const dy = ball.position.y - nearestY;

        if(dx * dx + dy * dy <= ball.radius * ball.radius)
        {

            ball.position.x -= ball.velocity.x;
            ball.position.y -= ball.velocity.y;
            if(Math.abs(dx) > Math.abs(dy))
            {
                if(dx > 0)
                    ball.position.x = right + ball.radius;
                else
                    ball.position.x = left - ball.radius;

                ball.velocity.x *= -ball.elasticity;
            }
            else
            {
                if(dy > 0)
                    ball.position.y = bottom + ball.radius;
                else
                    ball.position.y = top - ball.radius;

                ball.velocity.y *= -ball.elasticity;
            }
        }
    }
}
}

// =============================
// Draw
// =============================
function drawObjects()
{
    // Background
    if(trailEnabled)
    {
        ctx.fillStyle = "rgba(17,24,39,0.25)";
    }
    else
    {
        ctx.fillStyle = "#111827";
    }

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ground
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 2);
    ctx.lineTo(canvas.width, canvas.height - 2);
    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Objects
for (const obj of objects)
{
    ctx.fillStyle = obj.color;

    // =========================
    // Circle
    // =========================
    if (obj.shape === "circle")
    {
        ctx.beginPath();

        ctx.arc(
            obj.position.x,
            obj.position.y,
            obj.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();
        ctx.closePath();

        // Object Name
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText(
            obj.name,
            obj.position.x - 20,
            obj.position.y - obj.radius - 10
        );
    }

    // =========================
    // Rectangle
    // =========================
    else if (obj.shape === "rectangle")
    {
        ctx.fillRect(
            obj.position.x - obj.width / 2,
            obj.position.y - obj.height / 2,
            obj.width,
            obj.height
        );

        // Object Name
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText(
            obj.name,
            obj.position.x - 25,
            obj.position.y - obj.height / 2 - 10
        );
    }
}
}

// =============================
// Render Loop
// =============================
function render()
{
   updatePhysics();

   drawObjects();

    updateObjectInfo();
    // FPS Counter
    frameCount++;

    const now = performance.now();

    if(now - lastTime >= 1000)
    {
        document.getElementById("fps").textContent = frameCount;

        frameCount = 0;
        lastTime = now;
    }

    requestAnimationFrame(render);
}

// =============================
// Buttons
// =============================
document.getElementById("playBtn").onclick = () =>
{
    isRunning = true;

    document.getElementById("status").textContent = "Running";
};

document.getElementById("pauseBtn").onclick = () =>
{
    isRunning = false;

    document.getElementById("status").textContent = "Paused";
};

document.getElementById("resetBtn").onclick = () =>
{
    isRunning = false;

    elapsedTime = 0;

    document.getElementById("status").textContent = "Paused";
    document.getElementById("time").textContent = "0.0 s";

    objects = JSON.parse(JSON.stringify(initialObjects));
};

// =============================
// Start
// =============================
loadSimulation().then(() =>
{
    render();
});

canvas.addEventListener("mousedown", (e) =>
{
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    selectedBall = null;

    for(let i = objects.length - 1; i >= 0; i--)
    {
        const obj = objects[i];

        if(obj.shape === "circle")
        {
            const dx = mouseX - obj.position.x;
            const dy = mouseY - obj.position.y;

            if(dx * dx + dy * dy <= obj.radius * obj.radius)
            {
                selectedBall = obj;
                isDragging = true;
                updateObjectInfo();
                return;
            }
        }

        if(obj.shape === "rectangle")
        {
            if(
                mouseX >= obj.position.x - obj.width/2 &&
                mouseX <= obj.position.x + obj.width/2 &&
                mouseY >= obj.position.y - obj.height/2 &&
                mouseY <= obj.position.y + obj.height/2
            )
            {
                selectedBall = obj;
                isDragging = true;
                updateObjectInfo();
                return;
            }
        }
    }
    updateObjectInfo();
});

canvas.addEventListener("mousemove", (e) =>
{
    if(!isDragging || !selectedBall)
        return;

    const rect = canvas.getBoundingClientRect();

    selectedBall.position.x = e.clientX - rect.left;
    selectedBall.position.y = e.clientY - rect.top;

    isRunning = false;

    selectedBall.velocity.x = 0;
    selectedBall.velocity.y = 0;
});

// =============================
// Object Information Panel
// =============================
function updateObjectInfo()

{
    console.log(selectedBall);

    if(!selectedBall)
    {
        document.getElementById("objName").textContent = "None";
        document.getElementById("objShape").textContent = "-";
        document.getElementById("objMass").textContent = "-";
        document.getElementById("objPosition").textContent = "-";
        document.getElementById("objVelocity").textContent = "-";
        document.getElementById("objElasticity").textContent = "-";
        return;
    }

    document.getElementById("objName").textContent =
        selectedBall.name;

    document.getElementById("objShape").textContent =
        selectedBall.shape;

    document.getElementById("objMass").textContent =
        selectedBall.mass;

    document.getElementById("objPosition").textContent =
        "(" +
        selectedBall.position.x.toFixed(1) +
        ", " +
        selectedBall.position.y.toFixed(1) +
        ")";

    document.getElementById("objVelocity").textContent =
        "(" +
        selectedBall.velocity.x.toFixed(1) +
        ", " +
        selectedBall.velocity.y.toFixed(1) +
        ")";

    document.getElementById("objElasticity").textContent =
        selectedBall.elasticity;
}
window.addEventListener("mouseup", () =>
{
    isDragging = false;
    
});