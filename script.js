onload = function(){
    var stage = document.getElementById('stage')
    var ctx = stage.getContext('2d')
    ctx.font = '30px Arial'

    document.addEventListener("keydown", keyPush, true)

    setInterval(game, 80)

    const canvasSize = { x:stage.width, y:stage.height }

    const vel = 1      //default vel
    var dir = 'right'
    var vx = vel        //x vel
    var vy = 0          //y vel
    var px = py = 0     //snake head position
    var sl = 20         //piece size (px)
    var stgPieces = canvasSize.x/20  //stage size
    var ax = Math.floor(Math.random()*stgPieces)
    var ay = Math.floor(Math.random()*stgPieces)
    var StatGameover = false

    var trail = []
    var tail = 5

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

        await sleep(5000)

        dir = 'right'
        vx = vel
        vy = 0
        tail = 5
        px = py = 0
        StatGameover = false
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
        for(let i=0;i<trail.length;i++){
            i%2==0 ? ctx.fillStyle = 'green' : ctx.fillStyle = 'yellowGreen'
            if(i == trail.length-1) ctx.fillStyle = 'DarkGreen';
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
            generateApple()
        }

        //Score
        if(!StatGameover){
            document.getElementById('score').style.color = 'black'
            document.getElementById('score').innerHTML = `<strong>SCORE: ${tail-5}</strong>`
        }else{
            document.getElementById('score').style.color = 'red'
            document.getElementById('score').innerHTML = `<strong>SCORE: ${tail-5}</strong><strong>GAME OVER</strong>`
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
                if(dir != 'right' && !(trail[trail.length-2].x-1 == px && trail[trail.length-2].y == py)){
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