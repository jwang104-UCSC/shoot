var sounds = document.getElementsByTagName('audio');
for(i=0; i<sounds.length; i++) sounds[i].pause();

var Level1 = 
{
	
	//Main Functions
	
	preload: function()
	{
		//Level1 assets
		game.load.image('background', 'assets/images/Level1.png');
		game.load.image('triangle', 'assets/images/triangle.png');
		game.load.image('bullet', 'assets/images/bullet.png');
		game.load.image('enemy', 'assets/images/enemy.png');
		game.load.image('boss', 'assets/images/boss.png');
		game.load.spritesheet('explode', 'assets/images/explode.png', 128, 128);
		game.load.image('drop', 'assets/images/doritos.png');
 	},
	create: function()
	{	
		music = game.add.audio('musGun');
		musBoss = game.add.audio('musBoss');
		sfxBossDeath = game.add.audio('sfxMelting')
		//sfxExplode = game.add.audio('sfxExplode');
		music.play('', 0, 0.3, true, true);

		//Setup gameplay numbers here
		shootRateMultiplier = 1;
		shotSpeedMultiplier = 1;
		moveSpeedMultiplier = 1;
		shotSpread = 1;
		iFrames = 0.5;
		lives =5;
		spawnTime = 0;
		bulletTime = 0;
		firingTime = 0;
		hurtTime = 0;
		bossBattle = 0;
		bossDelay = 0;
		bossMaxHealth = 1000;
		bossKilled = false;
		debug = false;
		//gameplay-related numbers end

		stateVar = "START";
		score = 0;
		test = 0;
		background = game.add.sprite(0, 0, 'background');

		//makes drops
		drops = game.add.group();
		drops.enableBody = true;
		drops.physicsBodyType = Phaser.Physics.ARCADE;

	    for (var i = 0; i < 100; i++)
	    { 
	        var d = drops.create(0, 0, 'drop');
	        d.name = 'drop' + i;
	        d.exists = false;
	        d.visible = false;
	        d.checkWorldBounds = true;
	        d.events.onOutOfBounds.add(this.resetFunct, this);
	        d.body.maxVelocity.setTo(0, 600);
	    }

		//makes bullets
	 	bullets = game.add.group();
	    bullets.enableBody = true;
	    bullets.physicsBodyType = Phaser.Physics.ARCADE;

	    for (var i = 0; i < 1000; i++)
	    { 
	        var b = bullets.create(0, 0, 'bullet');
	        b.name = 'bullet' + i;
	        b.exists = false;
	        b.visible = false;
	        b.checkWorldBounds = true;
	        b.events.onOutOfBounds.add(this.resetFunct, this);
	    }

	    //makes the player
		sprite = game.add.sprite(game.world.centerX, game.world.centerY * 1.8, 'triangle');
		sprite.anchor.setTo(0.5, 0.5);
		sprite.scale.setTo(0.1,0.1);
		game.physics.enable(sprite, Phaser.Physics.ARCADE);
		sprite.body.collideWorldBounds = true;

		//makes enemies
		enemies = game.add.group();
		enemies.enableBody = true;
		enemies.physicsBodyType = Phaser.Physics.ARCADE;

	    for (var i = 0; i < 40; i++)
	    { 
	        var e = enemies.create(0, 0, 'enemy');
	        e.name = 'enemy' + i;
    		e.scale.setTo(0.2,0.2);
			e.anchor.setTo(0.5, 0.5);
	        e.exists = false;
	        e.visible = false;
	    }

	    //makes boss
	    boss = game.add.sprite(0, 0, 'boss');
	    boss.anchor.setTo(0.5, 0.5);
	    boss.angle = 180;
	    boss.exists = false;
	    boss.visible = false;	
	    boss.scale.x = 0.6;
	    boss.scale.y = 0.6;
	    game.physics.enable(boss, Phaser.Physics.ARCADE);
		bossHPBar = game.add.sprite(-game.world.width, game.world.height-100, "loadbar");
		game.physics.enable(bossHPBar, Phaser.Physics.ARCADE);

		//makes ENEMY bullets
	 	enemyBullets = game.add.group();
	    enemyBullets.enableBody = true;
	    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;

	    for (var i = 0; i < 1000; i++)
	    { 
	        var b = enemyBullets.create(0, 0, 'bullet');
	        b.name = 'evilBullet' + i;
	        b.exists = false;
	        b.visible = false;
	        b.checkWorldBounds = true;
	        b.events.onOutOfBounds.add(this.resetFunct, this);
	    }
	    //make explosions
	    explosions = game.add.group();
	    explosions.createMultiple(200, 'explode');
	    explosions.forEach(this.setupBoom);

		//make a bar on the bottom of the screen to despawn offscreen enemies
		screenBottomBar = game.add.sprite(0, game.world.height+100, "loadbar");
		screenBottomBar.width = game.world.width;
		game.physics.enable(screenBottomBar, Phaser.Physics.ARCADE);
		
		//lives
	    lifeCounter = game.add.text(70, game.world.height - 75, 'X ' + lives, { font: '60px Arial', fill: '#fff', align: "right"});
		lifeCount = game.add.sprite(0, game.world.height-70, 'triangle');
	    lifeCount.scale.setTo(0.08,0.08);

	    //inputs
		cursors = game.input.keyboard.createCursorKeys();
		game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);		
		game.input.keyboard.addCallbacks(this, null, null, this.pressFunct);

		this.createButton("Pause",game.world.centerX*1.65, 100, 300, 100, this.pauseMenu);
		this.createButton("Dev Mode",game.world.centerX*1.65, 225, 300, 100, this.devMenu);

		//UI
		scoreString = 'Score: ';
		scoreText = game.add.text(10,10, scoreString + score, {font: '40px Arial', fill:'#fff'});
	},
	update: function()
	{	
		//enemies stuff
		if (game.time.now > spawnTime && !bossBattle && !debug) this.makeEnemy();
		if (game.time.now > firingTime && !debug) this.enemyShoot();
		if (game.time.now > firingTime && bossBattle == 6 &&!debug) bossShoot();

		//UI stuff
		scoreText.text = scoreString + score;
		lifeCounter.text = "X " + lives;

		//player stuff
		sprite.body.stop();
		if (game.time.now > hurtTime) sprite.tint = 0xffffff;
	    speed = 600 * moveSpeedMultiplier;
	    if (cursors.left.isDown) sprite.body.velocity.x = -speed;
	    if (cursors.right.isDown) sprite.body.velocity.x = speed;
	    if (cursors.up.isDown) sprite.body.velocity.y = -speed;
	    if (cursors.down.isDown) sprite.body.velocity.y = speed;
	    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) this.fireBullet();

	    //BOSS FIGHT
		bossFight();


	    //collision tests
	    game.physics.arcade.overlap(bullets, enemies, this.bulletHit, null, this);
	    game.physics.arcade.overlap(sprite, enemyBullets, this.enemyHitsPlayer, null, this);
	    game.physics.arcade.overlap(bullets, boss, bossHurt, null, this);
	    game.physics.arcade.overlap(drops, sprite, this.dropCollected, null, this);
	    game.physics.arcade.overlap(sprite, enemies, this.shipCollision, null, this);
	    game.physics.arcade.overlap(sprite, boss, this.killFunct, null, this);
	    game.physics.arcade.overlap(screenBottomBar, enemies, this.enemyOffScreen, null, this);
	},
	//Additional Functions
	makeEnemy: function() {
		var x = game.rnd.integerInRange(0, game.world.width);
		var xspeed = game.rnd.integerInRange(-100, 100);
		var yspeed = game.rnd.integerInRange(600, 1200);
		this.spawnEnemy(x, -10, xspeed, yspeed);
	},
	spawnEnemy: function(x, y, xspeed, yspeed) {
        enemy = enemies.getFirstExists(false);
        if (enemy)
        {
            enemy.reset(x, y);
            enemy.body.velocity.x = xspeed;
            enemy.body.velocity.y = yspeed;
            spawnTime = game.time.now +200;
        }
	},
	enemyShoot: function() {
        var enemyBullet = enemyBullets.getFirstExists(false);

		if (enemyBullet)
	    {
	        // randomly select one of the enemies on screen
	        var shooter=enemies.getRandomExists();
	        //if shoooter is killed before bullet was shot, nothing happens
	        if(shooter){ 
		        enemyBullet.reset(shooter.body.x, shooter.body.y);
		        enemyBullet.tint = 0xff0000;
		        //rng aim offset
		        var offsetx = game.rnd.integerInRange(-50, 50);
		        var offsety = game.rnd.integerInRange(-50, 50);
		        
		        game.physics.arcade.moveToXY(enemyBullet,sprite.body.x + offsetx, sprite.body.y + offsety,120);
		        firingTime = game.time.now + 400;
	        }
	    }
	},
	//BOSS FIGHT
	
	setupBoom: function(boom) 
	{
		boom.anchor.x = 0.3;
		boom.anchor.y = 0.3;
		boom.animations.add('explode');
	},
	enemyHitsPlayer: function(player, shot) {
		if ((shot.x > player.x + player.width / 5 && shot.y < player.y) ||
		    (shot.x < player.x - player.width / 5 && shot.y < player.y)) return false;
		else { 
	    shot.kill();
	    this.killFunct();
		}
	},
	bulletHit: function(shot, victim) {
		//kill both sprites
	    shot.kill();
	    victim.kill();

	    //Increase the score
	    score += 200;
	    scoreText.text = scoreString + score;

	    //explode
	    explodeFunct(victim.body.x+50, victim.body.y+50);

	    //RNG to see if victim drops something
	    var i = game.rnd.integerInRange(0, 100);
	    if (i>80) this.enemyDrops(victim.body.x+50, victim.body.y+50);
	},
	dropCollected: function(player, drop) {
		var dropType = 10* drop.tint/0xffffff;
		//console.log("type was: "+dropType);
	    drop.kill();

	    //Increase the score
	    scoreText.text = scoreString + score;

	    //applies buff
	    //if you come up with more buff ideas, simply add another case and make the range bigger in enemyDrops()
	    switch(dropType){
	    	case 1: 	if(moveSpeedMultiplier <3)moveSpeedMultiplier+=0.5; console.log("MOVE UP: " + moveSpeedMultiplier); break;
	    	case 2: 	if(shotSpeedMultiplier <3)shotSpeedMultiplier+=0.5; console.log("SHOT SPEED UP: " + shotSpeedMultiplier); break;
	    	case 3: 	if(shootRateMultiplier <4)shootRateMultiplier+=0.5; console.log("RATE UP: " + shootRateMultiplier); break;
	    	case 4: 	score+=1000; console.log("SCORE UP: " + score); break;
	    	case 5: 	lives+=1;	console.log("1-up! " + lives); break;
	    	case 6: 	if(shotSpread <7)shotSpread+=2;	console.log("SPREAD UP " + shotSpread); break;
	    	case 7: 	if(iFrames <10)iFrames+=1;	console.log("I-FRAMES UP "+ iFrames); break;
	    	
	    	default: 	console.log("I don't know what you just picked up"); break;
	    }
	},
	enemyDrops: function(x, y){
		drop = drops.getFirstExists(false);
       	if (drop)
	        {
	            drop.reset(x-30, y);
	            drop.body.velocity.y = -200;
	            drop.body.gravity.y = 300;
	           	//if you have a new buff idea, make the range here bigger
	            var i = game.rnd.integerInRange(1, 7)/10;
	            //console.log("i = "+ i);
	            drop.tint = i*0xffffff;
	        }
	},
	//ship collision test
	shipCollision: function(player, enemy) {
    	this.killFunct();
    	enemy.kill();
	},
	enemyOffScreen: function(bar, enemy){
		//console.log("reset "+ enemy.name);
		enemy.kill();
	},
	killFunct: function(){
		if(game.time.now > hurtTime){
		    if (lives>-1)
		    {
			    explodeFunct(sprite.body.x+15, sprite.body.y+15);
			    lives--;
			    hurtTime = game.time.now + iFrames*100;
			    sprite.tint = 0x0099ff;
		    }
		    if (lives < 0){
			    this.gameOver();
			    sprite.visible = false;
		    }	
		}
	},
	fireBullet: function() {
    	if (game.time.now > bulletTime) {
    		shootDelay = 150 / shootRateMultiplier;
            for (var i = 0; i < shotSpread; i++) {
                var bullet = bullets.getFirstExists(false);
                if (bullet) {
                    bullet.reset(sprite.x-4, sprite.y-60);
                    var spreadAngle = 90/shotSpread;
                    //decide how many bullets to shoot on each side
                    var k = Math.floor(shotSpread/2); 
                    var angle = k*spreadAngle - i*spreadAngle;
                    game.physics.arcade.velocityFromAngle(angle-90, 300+40*shotSpread, bullet.body.velocity);
                    bullet.body.velocity.y = -800 * shotSpeedMultiplier;
                }
            }
        	bulletTime = game.time.now + shootDelay;
        }
	},
	resetFunct: function(object){
		//console.log(object.name+" just reset");
		object.kill();
	},
	testEnemies: function(){
		for(var i = 0; i<6; i++){
			for(var k = -3; k<4; k++){
				this.spawnEnemy(game.world.centerX+150*k, game.world.centerY- 150*i);
			}
		}
	},

	cheatFunct: function(){
		stateVar = "CHEAT";
		//if game's paused, clean up menu and resume
		if(game.paused){
			this.removeButton(resumeBtn);
			this.removeButton(lifeBtn);
			this.removeButton(dieBtn);
			this.removeButton(speedBtn);
			this.removeButton(slowBtn);
			this.removeButton(iframeBtn);
			this.removeButton(lessiFrameBtn);
			this.removeButton(shootFastBtn);
			this.removeButton(ShootSlowBtn);
			this.removeButton(spreadBtn);
			this.removeButton(lessSpreadBtn);
			this.removeButton(scoreBtn);
			this.removeButton(endGameBtn);
			this.pauseFunct();
		}//if not paused, pause and make menu
		else{
		//For X, use centerX, X+360, X-360
		//for Y, Add 150 between each button.
		this.pauseFunct("Cheats", 250);
		resumeBtn = this.createButton("Resume",game.world.centerX,game.world.centerY+900,
						 300, 100, this.cheatFunct);

		lifeBtn = this.createButton("More lives",game.world.centerX+360,game.world.centerY+30,
						 300, 100, function(){lives+=5; console.log("lives UP: "+ lives);});
		dieBtn = this.createButton("Lose lives",game.world.centerX+360,game.world.centerY+180, 
						300, 100, function(){lives-=5; console.log("lives DOWN: "+ lives);});
		endGameBtn = this.createButton("Set lives to 0",game.world.centerX+360,game.world.centerY+330, 
						300, 100, function(){lives=0; console.log("lives =: "+ lives);});
		scoreBtn = this.createButton("Increase score",game.world.centerX+360,game.world.centerY+480, 
						300, 100, function(){score+= 25000; console.log("score UP: "+ score);});
		speedBtn = this.createButton("Go faster",game.world.centerX-360,game.world.centerY+30, 
						300, 100, function(){moveSpeedMultiplier += 1; console.log("moveSpeed UP: "+ moveSpeedMultiplier);});
		slowBtn = this.createButton("Go slower",game.world.centerX-360,game.world.centerY+180, 
						300, 100, function(){moveSpeedMultiplier -= 1; console.log("moveSpeed DOWN: "+ moveSpeedMultiplier);});
		iframeBtn = this.createButton("More i-frames",game.world.centerX-360,game.world.centerY+330, 
						300, 100, function(){iFrames += 5; console.log("iFrames UP: "+ iFrames);});
		lessiFrameBtn = this.createButton("Less i-frames",game.world.centerX-360,game.world.centerY+480, 
						300, 100, function(){iFrames -= 5; console.log("iFrames DOWN: "+ iFrames);});
		shootFastBtn = this.createButton("Shoot faster",game.world.centerX,game.world.centerY+30, 
						300, 100, function(){shootRateMultiplier += 0.5; console.log("shootRate UP: "+ shootRateMultiplier);});
		ShootSlowBtn = this.createButton("Shoot slower",game.world.centerX,game.world.centerY+180, 
						300, 100, function(){shootRateMultiplier -= 0.25; console.log("shootRate DOWN: "+ shootRateMultiplier);});
		spreadBtn = this.createButton("shotSpread++",game.world.centerX,game.world.centerY+330, 
						300, 100, function(){shotSpread += 2; console.log("shotSpread UP: "+ shotSpread);});
		lessSpreadBtn = this.createButton("shotSpread--",game.world.centerX,game.world.centerY+480, 
						300, 100, function(){shotSpread -= 2; console.log("shotSpread DOWN: "+ shotSpread);});
		}
	},
	devMenu: function(){
		stateVar = "DEV";
		//if game's paused, clean up menu and resume
		if(game.paused){
			this.removeButton(resumeBtn);
			this.removeButton(spawnBtn);
			this.removeButton(toggleBtn);
			this.removeButton(spawnBossBtn);
			this.removeButton(killAllBtn);
			this.removeButton(gameOverBtn);
			this.removeButton(restartBtn);
			this.removeButton(killBossBtn);
			this.removeButton(godModeBtn);
			this.pauseFunct();
		}//if not paused, pause and make menu
		else{
		//For X, use centerX, X+360, X-360
		//for Y, Add 150 between each button.
		this.pauseFunct("Dev Mode", 200);
		resumeBtn = this.createButton("Resume",game.world.centerX,game.world.centerY+900,
						 300, 100, this.devMenu);
		toggleBtn = this.createButton("Toggle debug",game.world.centerX,game.world.centerY-150,
						 300, 100, function(){this.debugToggle(); console.log("debug = "+ debug);});


		spawnBtn = this.createButton("Spawn enemies",game.world.centerX-360,game.world.centerY+30,
						 300, 100, function(){this.testEnemies(); console.log("Enemies spawned");});
		spawnBossBtn = this.createButton("Spawn boss",game.world.centerX-360,game.world.centerY+180,
						 300, 100, function(){prepBoss(); console.log("BOSS TIME");});
		gameOverBtn = this.createButton("Game Over",game.world.centerX,game.world.centerY+30,
						 300, 100, function(){this.devMenu(); this.gameOver(); console.log("Game over");});
		restartBtn = this.createButton("Restart",game.world.centerX,game.world.centerY+180,
						 300, 100, function(){restart(); game.paused = false;});
		killAllBtn = this.createButton("Kill enemies",game.world.centerX+360,game.world.centerY+30,
						 300, 100, function(){this.debugKillAll(); console.log("Enemies killed");});
		killBossBtn = this.createButton("Kill boss",game.world.centerX+360,game.world.centerY+180,
						 300, 100, function(){bossDeath(); console.log("Boss killed");});
		godModeBtn = this.createButton("God mode",game.world.centerX,game.world.centerY+330,
						 300, 100, function(){iFrames = 100; lives = 1337; console.log("iFrames = 100\n lives = 1337");});
		}
	},
	debugToggle: function(){
		debug = !debug;
		enemies.killAll();
		enemyBullets.killAll();

	},
	debugKillAll: function(){
		while(victim =  enemies.getFirstExists(true)){
				explodeFunct(victim.x, victim.y);
				victim.kill();
		}
	},
	//if game's already paused/over, don't unpause it cause you lost
	gameOver: function(){
		stateVar = "END";
		if(game.paused){
			console.log("Game over");
		}//if not paused, pause and make menu
		else{
		this.pauseFunct(" Game\n Over", 250, null, game.world.centerY-900);
		var string = "Score:" + score;
		scoreText = game.add.text(game.world.centerX-this.scaleX(string, 35), game.world.centerY-200,
						 string, {font:"120px Verdana", fill: "#FFF",align:"center"})

		restartBtn = this.createButton("Restart",game.world.centerX,game.world.centerY+292,
						 300, 100, function(){restart(); game.paused = false;});
		menuBtn = this.createButton("Menu",game.world.centerX,game.world.centerY+132, 300,
						 100, function(){game.state.start('MainMenu'); game.paused = false;});
		}
	},

	//if paused, remove buttons and pause screen
	pauseMenu: function(){
		stateVar = "PAUSE";
		if(game.paused){
			this.removeButton(resumeBtn)
			this.removeButton(menuBtn)
			this.removeButton(restartBtn)
			this.pauseFunct();
		}//if not paused, pause and make menu
		else{
		this.pauseFunct("Paused!", 250);
		resumeBtn = this.createButton("Resume",game.world.centerX+275,game.world.centerY+32,
						 300, 100, this.pauseMenu);
		restartBtn = this.createButton("Restart",game.world.centerX+275,game.world.centerY+192,
						 300, 100, function(){restart(); game.paused = false;});
		menuBtn = this.createButton("Menu",game.world.centerX-275,game.world.centerY+32,
						 300, 100, function(){game.state.start('MainMenu'); game.paused = false;});
		}
	},
	//if paused, unpause and remove pause screen
	pauseFunct: function(string, fontsize, x, y){
		if(game.paused){
			pauseScreen.kill();
			pauseText.kill();
			stateVar = "RUNNING";
			game.paused = false;
		}//if not paused, pause and make menu
		else{
		console.log(string ,": ", test);
		game.paused = true;

		if (x == undefined)textX = game.world.centerX-475;
			else textX = x;
		if (y == undefined)textY = game.world.centerY-600;
			else textY = y;

		pauseScreen = game.add.sprite(0, 0, 'pause');
		pauseText = game.add.text(textX	,textY,
			string,{font:fontsize+"px Verdana", fill: "#FFF",align:"center"});
		}
	},
	createButton:function(string,x,y,w,h,callback)
	{
		var button1 = game.add.button(x,y,'button',callback,this,2,1,0);
		button1.anchor.setTo(0.5,0.5);
		button1.width = w;
		button1.height = h;
		var txt = game.add.text(button1.x,button1.y,string,{font:"40px Arial", fill: "#f",align:"center"});
		txt.anchor.setTo(0.5,0.5);
		return {"0":button1,"1":txt};
	},
	removeButton:function(object)
	{
		object[0].kill();
		object[1].kill();
	},
	//handles button presses
	pressFunct: function(char)
	{
		if(char == 'p' && stateVar != "CHEAT" && stateVar != "END"){
			this.pauseMenu();
		}
		if(char == 'r' && game.paused){
			restart();
			game.paused = false;
		}
		if(char == 'c' && game.paused && stateVar!= "END"){
			if (stateVar == "PAUSE")this.pauseMenu();
			if (stateVar == "DEV")this.devMenu();
			this.cheatFunct();
		}
		//debug kill
		if(char == 'k'){
			this.killFunct();
		}
		//cheat: live + 5
		if(char == 'l'){
			lives+=5;
		}		
		/*It also captures the entire keyboard if you want to do something with that input
		 *NOTE: Don't use this for game stuff like movement and actions, etc!
		 *This will fire even if the game is paused.
		 *console.log("You pressed: ", char);
		 */
	},
	scaleX:function(string, fontsize)
	{
		x = string.length * fontsize;
		return x;
	}
};
//REFACTORING BEGINS WOOOOO
function explodeFunct(x, y){
	var explosion = explosions.getFirstExists(false);
    explosion.reset(x, y);
    explosion.scale.setTo(1.4, 1.4);
    explosion.alpha = 0.5;
    explosion.play('explode', 30, false, true);
    //explodeSFX.play('', 0, 0.5, false, true);
}
function restart(){
	music.stop();
	musBoss.stop();
	game.state.restart();
}