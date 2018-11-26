;!function(){
	//1.背景运动
	let planebox=document.querySelector('.planebox');
	let oStrong=document.querySelector('strong');
	let zscore=0;
	let bgposition=0;
	let bgtimer=setInterval(function(){
		bgposition+=2;
		planebox.style.backgroundPosition='0 '+bgposition+'px';
	},30);
	
	//2.新建一个我方飞机类
	class myplane{
		constructor(w,h,x,y,imgurl,boomurl){
			this.w=w;
			this.h=h;
			this.x=x;
			this.y=y;
			this.imgurl=imgurl;
			this.boomurl=boomurl;
		}
		
		createmyplane(){
			this.myplaneimg=document.createElement('img');
			this.myplaneimg.src=this.imgurl;
			this.myplaneimg.style.cssText=`width:${this.w}px;height:${this.h}px;position:absolute;left:${this.x}px;top:${this.y}px;`;
			planebox.appendChild(this.myplaneimg);	
			this.myplanemove();
			this.myplaneshoot();
		}
		
		myplanemove(){
			var _this=this;
			document.addEventListener('keydown',planemove,false);
			var uptimer=null,downtimer=null,lefttimer=null,righttimer=null;
			function planemove(ev){
				var ev=ev||window.event;
				switch(ev.keyCode){//a:65 d:68 w:87 s:83 k:75
					case 87: moveup();break;
					case 83: movedown();break;
					case 65: moveleft();break;
					case 68: moveright();break;
				}
				
				function moveup(){
					clearInterval(downtimer);
					clearInterval(uptimer);
					uptimer=setInterval(function(){
						_this.y-=4;
						if(_this.y<=0){
							_this.y=0;
						}
						_this.myplaneimg.style.top=_this.y+'px';
					},30)
				}
				
				function movedown(){
					clearInterval(uptimer);
					clearInterval(downtimer);
					downtimer=setInterval(function(){
						_this.y+=4;
						if(_this.y>=planebox.offsetHeight-80){
							_this.y=planebox.offsetHeight-80;
						}
						_this.myplaneimg.style.top=_this.y+'px';
					},30)
				}
				
				function moveleft(){
					clearInterval(righttimer);
					clearInterval(lefttimer);
					lefttimer=setInterval(function(){
						_this.x-=4;
						if(_this.x<=0){
							_this.x=0;
						}
						_this.myplaneimg.style.left=_this.x+'px';
					},30)
				}
				
				function moveright(){
					clearInterval(lefttimer);
					clearInterval(righttimer);
					righttimer=setInterval(function(){
						_this.x+=4;
						if(_this.x>=planebox.offsetWidth-66){
							_this.x=planebox.offsetWidth-66;
						}
						_this.myplaneimg.style.left=_this.x+'px';
					},30)
				}
				
			}
			document.addEventListener('keyup',function(ev){
				var ev=ev||window.event;
				if(ev.keyCode==87){
					clearInterval(uptimer);
				}
				if(ev.keyCode==83){
					clearInterval(downtimer);
				}
				if(ev.keyCode==65){
					clearInterval(lefttimer);
				}
				if(ev.keyCode==68){
					clearInterval(righttimer);
				}
			},false);
			
		}
		
		
		myplaneshoot(){
			var _this=this;
			var shoottimer=null;
			var shootlock=true;
			document.addEventListener('keydown',shootbullet,false);
			function shootbullet(ev){
				var ev=ev||window.event;
				if(ev.keyCode==75){
					if(shootlock){
						shootlock=false;
						function shoot(){
							new bullet(6,14,_this.x+_this.w/2-3,_this.y-14,'img/bullet.png');
						}
						shoottimer=setInterval(shoot,200);
						shoot();
					}
					
				}
			}
			
			document.addEventListener('keyup',function(ev){
				var ev=ev||window.event;
				if(ev.keyCode==75){
					clearInterval(shoottimer);
					shootlock=true;
				}
			},false);
		}
	}
	
	//子弹类
	class bullet{
		constructor(w,h,x,y,imgurl){
			this.w=w;
			this.h=h;
			this.x=x;
			this.y=y;
			this.imgurl=imgurl;
			this.createbullet();
		}
		
		createbullet(){
			this.bulletimg=document.createElement('img');
			this.bulletimg.src=this.imgurl;
			this.bulletimg.style.cssText=`width:${this.w}px;height:${this.h}px;position:absolute;left:${this.x}px;top:${this.y}px;`;
			planebox.appendChild(this.bulletimg);	
			this.bulletmove();
		}
		
		bulletmove(){
			var _this=this;
			this.timer=setInterval(function(){
				_this.y-=4;
				if(_this.y<=-_this.h){
					planebox.removeChild(_this.bulletimg);
					clearInterval(_this.timer);
				}
				_this.bulletimg.style.top=_this.y+'px';
				_this.bullethit();
			},30);
		}
		
		bullethit(){
			var enemys=document.querySelectorAll('.enemy');
			for(var i=0;i<enemys.length;i++){
				if(this.x+this.w>=enemys[i].offsetLeft && this.x<=enemys[i].offsetLeft+enemys[i].offsetWidth && this.y+this.h>=enemys[i].offsetTop && this.y<=enemys[i].offsetTop+enemys[i].offsetHeight){
					clearInterval(this.timer);
					try{//容掉子弹同时碰撞多架敌机问题。
						planebox.removeChild(this.bulletimg);
					}catch(e){
						
					}
					
					enemys[i].blood--;
					enemys[i].checkblood();
				}
			}
		}
		
	}
	
	//敌机类
	class enemy{
		constructor(w,h,x,y,imgurl,boomurl,blood,speed,score){
			this.w=w;
			this.h=h;
			this.x=x;
			this.y=y;
			this.imgurl=imgurl;
			this.boomurl=boomurl;
			this.blood=blood;
			this.speed=speed;
			this.score=score;
			this.createenemy();
		}
		createenemy(){
			var _this=this;
			this.enemyimg=document.createElement('img');
			this.enemyimg.src=this.imgurl;
			this.enemyimg.style.cssText=`width:${this.w}px;height:${this.h}px;position:absolute;left:${this.x}px;top:${this.y}px;`;
			planebox.appendChild(this.enemyimg);	
			this.enemymove();
			this.enemyimg.className='enemy';
			this.enemyimg.blood=this.blood;
			this.enemyimg.speed=this.speed;
			this.enemyimg.score=this.score;
			this.enemyimg.checkblood=function(){
				//this:当前的敌机。
				if(this.blood==0){
					this.className='';
					this.src=_this.boomurl;
					clearInterval(this.timer);
					setTimeout(function(){
						planebox.removeChild(_this.enemyimg);
					},400);
					zscore+=this.score;
					oStrong.innerHTML=zscore;
					
				}
			}
		}
		enemymove(){
			var _this=this;
			this.enemyimg.timer=setInterval(function(){
				_this.y+=_this.speed;
				if(_this.y>=planebox.offsetHeight){
					planebox.removeChild(_this.enemyimg);
					clearInterval(_this.enemyimg.timer);
				}
				_this.enemyimg.style.top=_this.y+'px';
				_this.enemyhit();
			},30);
		}
		
		enemyhit(){
			if(this.x+this.w>=ourplane.x && this.x<=ourplane.x+ourplane.w && this.y+this.h>=ourplane.y && this.y<=ourplane.y+ourplane.h){
				var enemys=document.querySelectorAll('.enemy');
				for(var i=0;i<enemys.length;i++){
					clearInterval(enemys[i].timer);
				}
				clearInterval(enemytimer);
				clearInterval(bgtimer);
				ourplane.myplaneimg.src=ourplane.boomurl;
				setTimeout(function(){
					alert('game over!!!');
					location.reload(true);
				},300);
			}
		}
	}
	
	var enemytimer=setInterval(function(){
		for(var i=1;i<=rannum(1,3);i++){
			var num=rannum(1,20);
			if(num>=1 && num<15){
				new enemy(34,24,rannum(0,planebox.offsetWidth-34),-24,'img/smallplane.png','img/smallplaneboom.gif',1,rannum(2,4),1);
			}else if(num>=15 && num<20){
				new enemy(46,60,rannum(0,planebox.offsetWidth-46),-60,'img/midplane.png','img/midplaneboom.gif',3,rannum(1,3),5);
			}else if(num==20){
				new enemy(110,164,rannum(0,planebox.offsetWidth-110),-164,'img/bigplane.png','img/bigplaneboom.gif',10,1,10);
			}
		}
	},1000);
	
	
	
	
	
	
	
	
	
	function rannum(max,min){
		return Math.round(Math.random()*(max-min))+min;
	}
	
	let ourplane=new myplane(66,80,(planebox.offsetWidth-66)/2,planebox.offsetHeight-80,'img/myplane.gif','img/myplaneBoom.gif');
	ourplane.createmyplane();
}();
