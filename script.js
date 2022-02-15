onload = function(){
    var stage = document.getElementById('stage')
    var ctx = stage.getContext('2d')
    ctx.font = '30px Arial'

    document.addEventListener("keydown", keyPush, true)

    //////////////////////////
    var initialTail = 3
    var timeTick = 80 //ms
    /////////////////////////

    setInterval(game, timeTick)

    const canvasSize = { x:stage.width, y:stage.height }

    const vel = 1                    //default vel
    var dir = 'right'                //direction of snake
    var vx = vel                     //x vel
    var vy = 0                       //y vel
    var px = py = 0                  //snake head position
    var sl = 20                      //piece size (px)
    var stgPieces = canvasSize.x/20  //stage size
    var ax = Math.floor(Math.random()*stgPieces)
    var ay = Math.floor(Math.random()*stgPieces)
    var StatGameover = false
    
    infoUpdate()
    var score = 0
    localStorage.setItem('HighScore', 0)

    var trail = []
    var tail = initialTail

    function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
    }

    function generateApple(){
        let placeable = true
        do{
            placeable = true
            ax = Math.floor(Math.random()*stgPieces)
            ay = Math.floor(Math.random()*stgPieces)
            for(let i=0;i<trail.length;i++){
                if(trail[i].x == ax && trail[i].y == ay){
                    placeable = false
                }
            }
        }while(!placeable)
    }

    function infiniteStage(){
        if(px<0){
            px = stgPieces-1
        }
        if(px>stgPieces-1){
            px = 0
        }
        if(py<0){
            py = stgPieces-1
        }
        if(py>stgPieces-1){
            py = 0
        }
    }

    async function gameover(){
        StatGameover = true

        vx = vy = 0

        if (score > getLocalStorage('HighScore')) {
            console.log("New High Score!")
            setLocalStorage('HighScore',score);
            infoUpdate()
        }

        await sleep(5000)

        dir = 'right'
        vx = vel
        vy = 0
        tail = initialTail
        px = py = 0
        score = 0
        StatGameover = false
        trail = []
        generateApple()
    }

    function game(){
        if (StatGameover) return;

        //Movement
        px += vx
        py += vy

        //Infinite stage
        infiniteStage()

        //Render background
        ctx.fillStyle = 'black'
        ctx.fillRect(0,0, stage.width, stage.height)

        //Render apple
        ctx.fillStyle = 'red'
        ctx.fillRect(ax*sl, ay*sl, sl, sl)
        
        //Render snake
        let maincolor = [28, 77, 0] //RGB
        let actualcolor = {r:maincolor[0], g:maincolor[1],  b:maincolor[2]}
        let orderInv = false
        for(let i=0;i<trail.length;i++){
            if(actualcolor.r >= 93 || actualcolor.g>=255) orderInv = true;
            if (actualcolor.r == maincolor[0] || actualcolor.g == maincolor[1])  orderInv = false;

            if (orderInv){
                actualcolor.r -= 3
                actualcolor.g -= 5
            }else{
                actualcolor.r += 3
                actualcolor.g += 5
            }

            ctx.fillStyle = `rgb(${actualcolor.r},${actualcolor.g},${actualcolor.b})`
            ctx.fillRect(trail[i].x*sl, trail[i].y*sl, sl, sl)

            //Game over check
            if(trail[i].x == px && trail[i].y == py){
                //window.alert(`[${i}]${trail[i].x},${trail[i].y} \n px:${px} py:${py}`)
                gameover()
            }
        }
        
        //Tail renovation
        trail.push({ x:px, y:py }) 
        while(trail.length > tail){
            trail.shift()
        }

        //Eat apple
        if(px == ax && py == ay){ 
            tail++
            score++
            generateApple()
        }

        //Score
        if(!StatGameover){
            document.getElementById('scoreNumber').style.color = 'black'
            document.getElementById('div-main').style.backgroundColor = 'rgb(229, 255, 212)' 
            document.getElementById('a-gameover').style.visibility = "hidden"
            document.getElementById('scoreNumber').innerHTML = `<strong>SCORE: ${score}</strong>`
        }else{
            document.getElementById('scoreNumber').style.color = 'rgb(90, 20, 20)'
            document.getElementById('a-gameover').style.color = 'rgb(90, 20, 20)' 
            document.getElementById('div-main').style.backgroundColor = 'rgb(255, 134, 134)' 
            document.getElementById('a-gameover').style.visibility = "visible"
            document.getElementById('scoreNumber').innerHTML = `<strong>SCORE: ${score}</strong>`
        }

        //DEBUG
        //console.clear()
        //console.log(`X:${px} Y:${py}`)
        //console.log("GAMEOVER:"+StatGameover)
        //console.log(trail[trail.length-2].x,trail[trail.length-2].y)
    }

    //Event listener
    function keyPush(event){
        switch(event.keyCode){
            case 37: //LEFT
                if(dir != 'right' && !(trail[trail.length-2].x == px-1 && trail[trail.length-2].y == py)){
                    dir = 'left'  
                    vx = -vel
                    vy = 0                
                }
                break
            case 38: //UP
                if(dir != 'down' && !(trail[trail.length-2].x == px && trail[trail.length-2].y == py-1)){
                    dir = 'up'
                    vx = 0
                    vy = -vel
                }
                break  
            case 39: //RIGHT
                if(dir != 'left' && !(trail[trail.length-2].x == px+1 && trail[trail.length-2].y == py)){
                    dir = 'right'
                    vx = vel
                    vy = 0
                }
                break
            case 40: //DOWN
                if(dir != 'up' && !(trail[trail.length-2].x == px && trail[trail.length-2].y == py+1)){
                    dir = 'down'
                    vx = 0
                    vy = vel
                }
                break
            default:
                break
        }
    }
}

function infoUpdate(){
    document.getElementById('div-records').innerHTML = `<strong id="highscore">⭐Your High Score: ${getLocalStorage('HighScore')}</strong>`
}

function setLocalStorage(key,value){
    localStorage.setItem(key, JSON.stringify(value))
}

function getLocalStorage(key){
    return Number(localStorage.getItem(key))
}