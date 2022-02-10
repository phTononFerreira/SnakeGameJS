onload = function(){
    var stage = document.getElementById('stage')
    var ctx = stage.getContext('2d')
    ctx.font = '30px Arial'

    document.addEventListener("keydown",keyPush,20, true)

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
    }

    function game(){
        if (StatGameover) return;
        px += vx
        py += vy

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
            if(trail[i].x == px && trail[i].y == py){
                gameover()
            }
        }

        trail.push({ x:px, y:py }) 

        while(trail.length > tail){
            trail.shift()
        }

        if(px == ax && py == ay){ //EAT APPLE
            tail++
            generateApple()
        }
        if(!StatGameover){
            document.getElementById('score').style.color = 'black'
            document.getElementById('score').innerHTML = `<strong>SCORE: ${tail-5}</strong>`
        }else{
            document.getElementById('score').style.color = 'red'
            document.getElementById('score').innerHTML = `<strong>SCORE: ${tail-5}</strong><strong>GAME OVER</strong>`
        }
    }

    //Event listener
    function keyPush(event){
        console.log('entrou')
        switch(event.keyCode){
            case 37: //LEFT
                if(dir != 'right'){
                    dir = 'left'
                    vx = -vel
                    vy = 0
                }
                break
            case 38: //UP
                if(dir != 'down'){
                    dir = 'up'
                    vx = 0
                    vy = -vel
                }
                break  
            case 39: //RIGHT
                if(dir != 'left'){
                    dir = 'right'
                    vx = vel
                    vy = 0
                }
                break
            case 40: //DOWN
                if(dir != 'up'){
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