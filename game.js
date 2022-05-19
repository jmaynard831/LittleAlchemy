//0 is dead, 1 is alive. 

const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')
const cells = [];
const cellCount = 64;
let playFlag = false;
let playInterval = 0;

const startCells = [[2,1], [2,3], [3,2], [3,3], [2,4]]
const eraseCells = () =>{
  initCells([])
}

const randomCells = () =>{
  eraseCells();
  cells.forEach(function(cell,i){
    Math.random()>.75 ? cells[i] = 1 : cells[0] = 0; 
  })
  drawAllCells();
}

const playOn = () =>{
  
  playFlag = !playFlag;

  if(playFlag){
    //change to stop
    document.getElementById("playBTN").innerText = "Stop";
    playInterval = setInterval(gameProcessor,900);
  }
  else{
    //make it play again
    document.getElementById("playBTN").innerText = "Play";
    //also clear interval
    clearInterval(playInterval);
  }

  animate();
}

const initCells = (liveCells) =>{
  //init all cells to 0;  
  for(x = 0; x< cellCount; x++){
      cells[x] = 0;
    }

    //liveCells is an array of cells we want to be 1
    liveCells.forEach(cell => {
       let a,b;
       [a,b] = cell;
       cells[a*8+b] = 1;
    });

    drawAllCells();
}

const drawAllCells = () =>{
  for(x = 0; x< 8; x++){
    for(y=0; y<8; y++){
      if(cells[CTI(x,y)]===1)
      {drawCell(x,y,true)} 
      else{drawCell(x,y,false)};
    }
  }
  drawGrid()
}

const drawGrid = () =>{
  for(let x =1; x<8;x++){
    ctx.beginPath();
    ctx.moveTo(x*100,0);
    ctx.lineTo(x*100,800);
    ctx.stroke();
  }
  for(let y =1; y<8;y++){
    ctx.beginPath();
    ctx.moveTo(0,y*100);
    ctx.lineTo(800,y*100);
    ctx.stroke();
  }
}

const resetGame = () =>{
  initCells(startCells);
}
  
const drawCell= (x,y, alive)=>{
  
  if(alive){
    ctx.fillStyle = "#000000";
    ctx.fillRect(x*100,y*100,100,100);
  }
  else{
    ctx.fillStyle = "#FFFfff";
    ctx.fillRect(x*100,y*100,100,100);
  }
 
}

const CTI=(x,y)=>{
  return x*8+y;
}

const checkLivingNeighbors=(x,y)=>{

  let livingCount = 0;

    if(x>0){
      if(cells[CTI(x-1,y-1)]===1){
        livingCount++;
      }
      if(cells[CTI(x-1,y)]===1){
        livingCount++;
      }
      if(cells[CTI(x-1,y+1)]===1){
        livingCount++;
      }
    }

    if(x<7){
      if(cells[CTI(x+1,y-1)]===1){
        livingCount++;
      }
      if(cells[CTI(x+1,y)]===1){
        livingCount++;
      }
      if(cells[CTI(x+1,y+1)]===1){
        livingCount++;
      }
    }

    if(y>0){
      if(cells[CTI(x,y-1)]===1){
        livingCount++;
      }
    }

    if(y<7){
      if(cells[CTI(x,y+1)]===1){
        livingCount++;
      }
    }

  return livingCount;

}

const gameProcessor = () =>{
  //run neighbor check
  let cellChanges = []; 

  for(x = 0; x < 8; x++){
    for(y = 0; y < 8; y++){
      let livingNeighbors = checkLivingNeighbors(x,y);
      if(cells[CTI(x,y)]===1){
        if(livingNeighbors > 3 || livingNeighbors < 2){
          
          cellChanges.push([CTI(x,y), 0]);
        }
      }
      else {
        if(livingNeighbors===3){
          cellChanges.push([CTI(x,y), 1]);
        }
      }
    }
  }

  //take the cellChanges and do all of them at once
  cellChanges.forEach(change=>{
    cells[change[0]]=change[1];
  })

  drawAllCells();

}

function animate(){
  if(playFlag){
    drawAllCells();
    requestAnimationFrame(animate);
  }
  
}


//Init the cells (8x8)
initCells(startCells);



const printMosPos = (e)=>{
  let rect = e.target.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  clickedSquare(x,y)
}

const clickedSquare=(x,y)=>{
  //take coords, convert to a cells number
  x = Math.floor(x/100);
  y = Math.floor(y/100);
  //shoulda used bools christ
  cells[CTI(x,y)]===1? cells[CTI(x,y)]=0 : cells[CTI(x,y)]=1;
  drawAllCells();
}


document.getElementById("stepBTN").addEventListener('click',gameProcessor)


document.getElementById("gameCanvas").addEventListener("click", printMosPos)

document.getElementById("eraseBTN").addEventListener("click", eraseCells)

document.getElementById("randomBTN").addEventListener("click", randomCells)

document.getElementById("playBTN").addEventListener("click", playOn)

