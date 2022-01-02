const height= 500;
const width = 500;
let NOofSpots= 100;
const ParticleMass=10;
const pixelsPerMeter=10;
const maxSpeed=3
const NOofPublicPlaces=1;

let input 
let healthyspots=[];
let infectedspots=[];
let allspots=[];
let PublicPlace=[];
let a=0;
let b=0;
let slider
let slider2
let slider3
let slider4
let q=0



function setup() {
  
  createCanvas(5000, 1000);
  
  slider=createSlider(0,200,1);
  slider.position(200,height+40)
  
  createP('')
  slider2=createSlider(1,100,20);
  createP('')
  slider2.position(200,height+80)
  slider3=createSlider(0,100,55);
  slider3.position(200,height+120)

  slider4=createSlider(1,15,5);
  slider4.position(200,height+160)


  for(let i=0; i<NOofSpots;i++){
    allspots[i]= new Spots(0,i,i);
    healthyspots[i]= allspots[i]
  }
  a=allspots.length
  let h=0;
  for(let o=a-1; o< a+12; o++){
    allspots[o]= new Spots(1,o,h);
    infectedspots[h]= allspots[o]
    h=h+1

  }

  for(let y=0; y<NOofPublicPlaces;y++ ){
    PublicPlace[y]= new PublicPlaces();

  }

  

}

class Spots{
 
  constructor(state,index1,index2){
    this.pos= createVector(random(20, width-20),random(20, height-20));
    this.vel= p5.Vector.random2D().setMag(maxSpeed);
    this.acc= createVector(0,0);

    this.infectedState= state;
    this.edgepass=false;

    this.quarantine= createVector(900,700)
    

    if (this.infectedState == 0){
      this.infectedProbability=0;
      this.healthyindex= index2;
    }else if(this.infectedState == 1){
      this.infectedProbability=110;
      this.infectedindex= index2
    }

    this.allindex=index1;
  }
  


  SocialDistancing(x){
    let d=0;
    let force= createVector();
    let v= createVector().setMag(maxSpeed/10);

    for(let j=0;j<allspots.length;j++){
      v= p5.Vector.sub(this.pos,allspots[j].pos)
      d= v.mag()/pixelsPerMeter

      if (this.allindex !== j && d<20 && d*d>0 && v!=0){
        force = force.add(v.normalize().div(d*d*d*d))
      }
  }
  this.acc=force.div(ParticleMass).setMag((x));
 


}

move(){
  this.pos= p5.Vector.add(this.pos,this.vel);
  this.vel= (p5.Vector.add(this.vel,this.acc));
  if (this.vel.magSq() > maxSpeed * maxSpeed) {
    this.vel.setMag(maxSpeed);
  }
 }

edge(){
  if(this.edgepass==false){
  if (this.pos.x < 20 || this.pos.x > width-20) {
    this.vel.x = this.vel.x * (-1.2);
  } else if (this.pos.y < 20 || this.pos.y > height-20) {
    this.vel.y = this.vel.y * (-1.2);
  }}else{
    if (this.pos.x < 20|| this.pos.x >width+200) {
      this.vel.x = this.vel.x * (-1.2);
    } else if (this.pos.y < 20 || this.pos.y > height-20) {
      this.vel.y = this.vel.y * (-1.2);
    }
  }
}

spread(infectedRadius,y){
if (this.infectedState==1){
  for (let k=0;k<healthyspots.length;k++){
    let d= dist(this.pos.x,this.pos.y,healthyspots[k].pos.x,healthyspots[k].pos.y);
    if(d<infectedRadius && healthyspots[k].infectedState==0){
      
      healthyspots[k].infectedProbability= healthyspots[k].infectedProbability + (100/(1+d))*y
    }
  }
}
  
}
isinfected(z){
  if(this.infectedState==0){
    let a= random(z,z+3000)
  if(this.infectedProbability>100){
    this.infectedState=1;
    setTimeout( () => this.infectedState=2, a ) 
    
}}
}

forceremove(b){
  let f=random(b,b+3000)
  setTimeout( () => this.infectedState=2, f ) 
}

Qtine(){
  let count=0
  let counter=0; 

  while(count<=4 && counter<allspots.length){


  if (allspots[counter].infectedState==1 && count<=4){
    count++
    let distanceX = allspots[counter].pos.x-int(random(width+50,width+190))
    let distanceY= allspots[counter].pos.y-int(random(250,450))
    let desiredvel=createVector(distanceX,distanceY).mult(-1)
    allspots[counter].acc=desiredvel.setMag(1000)
    allspots[counter].edgepass=true
    
  }
  counter++
}

}





  show(){
    
    if (this.infectedState== 0){
      stroke(0, 181, 204, 2000);
      strokeWeight(2);
      fill(0, 181, 204, 20000);
      ellipse(this.pos.x,this.pos.y,10,10);
    }else if(this.infectedState== 1){
      stroke(255,0,0);
      strokeWeight(2);
      fill(255,0,0);
      ellipse(this.pos.x,this.pos.y,10,10);

    }else{
      stroke(127,127,127,2000);
      strokeWeight(2);
      fill(127,127,127,2000);
      ellipse(this.pos.x,this.pos.y,10,10);
    }
    
  }
  

}

class PublicPlaces{
  constructor(){
    this.pos= createVector(width/2,height/2);


  }

  attract(){
    let index=int(random(0,allspots.length-30))
    for(let v=index;v<index+30;v++){
      allspots[v].acc=0;
      allspots[v].acc= p5.Vector.sub(this.pos,allspots[v].pos)
    }
  }

  show(){
    stroke(255,255,255)
    fill(255,255,255)
    rect(this.pos.x,this.pos.y,15,15)
    

  }
  
}




function draw() {
  background(0);
  fill(0)
  strokeWeight(5);
  stroke(255,255,255)
  rect(4,4,501,501)

  textSize(15);
  strokeWeight(0);
  textFont("Arial")
  fill(255,192 ,0,10000	);
  strokeWeight(0);
  stroke(255,255,255)
  text("Social Distancing strength",20,height+52)

  textSize(15);
  fill(255,255,255);
  strokeWeight(0);
  stroke(255,255,255)
  text("Infection Radius",20,height+90)

  textSize(15);
  fill(255,255,255);
  strokeWeight(0);
  stroke(255,255,255)
  text(slider.value().toString(),350,height+54)

  textSize(15);
  fill(255,255,255);
  strokeWeight(0);
  stroke(255,255,255)
  text(slider2.value().toString(),350,height+94)

  textSize(15);
  fill(255,255,255);
  strokeWeight(0);
  stroke(255,255,255)
  text("Chance of contraction",20,height+134)
  
  textSize(15);
  fill(255,255,255);
  strokeWeight(0);
  stroke(255,255,255)
  text((slider3.value()/100).toString(),350,height+134)
  
  textSize(15);
  fill(255,255,255);
  strokeWeight(0);
  stroke(255,255,255)
  text("Duration of sickness",20,height+174)

  textSize(15);
  fill(255,255,255);
  strokeWeight(0);
  stroke(255,255,255)
  text((slider4.value()).toString()+" days",350,height+174)



//allspots[0].Qtine()  
 for( let h=0; h<allspots.length;h++){
   allspots[h].edge();
   allspots[h].move();
   allspots[h].SocialDistancing((slider.value())/100);
   //allspots[h].Qtine();
   allspots[h].show();
   //allspots[h].quarantine();
   //allspots[h].isinfected();
 }

 

 
 for(let f=0;f<infectedspots.length;f++){
   infectedspots[f].spread(slider2.value(),slider3.value()/100);
   infectedspots[f].forceremove(slider4.value()*1000 +2000);
 }
 for(let w=0;w<healthyspots.length;w++){
  healthyspots[w].isinfected(slider4.value()*1000);
  healthyspots[w].spread(slider2.value(),slider3.value()/100);
 
}}