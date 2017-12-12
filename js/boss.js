
function bossFight(){
	if(!bossBattle && score > 0 && !bossKilled) prepBoss();
    if (bossBattle == 1 && enemies.getFirstExists()) prepBoss2();
    if (bossBattle == 2) prepBoss3();
    if (boss.body.y >= game.world.centerY - 600 && bossBattle == 3){
    	//bossDelay = game.time.now + 700;
    	bossDelay = game.time.now + 0;
    	boss.body.stop();
    	bossBattle = 3.5;
    }
    if (bossBattle == 3.5) prepBoss4();
    if (bossHPBar.body.x >= 0 && bossBattle == 4){
	 		bossDelay = game.time.now + 800;
    	bossHPBar.body.stop();
    	bossBattle = 4.5;
    }
    if (bossBattle == 4.5) prepBoss5();
    if (bossBattle == 5) {
    	bossHPBar.body.velocity.x = -400;
    	boss.body.velocity.x = +500;
    }
    if (boss.body.x >= game.world.width - 400 && bossBattle == 5){
    	boss.body.stop();
    	prepBoss6();
    }
    if (bossBattle == 6){
    	bossHPBar.body.velocity.x = -400;
    }
    if (bossBattle == "BOSS IS KILL") bossExplode();
	if (bossBattle == "BOSS IS KILL" && bossExplodeCount >10) bossEnd();
}
function prepBoss(){
	music.fadeOut(1500);
	bossBattle = 1;
	bossHealth = bossMaxHealth;
	firingTime+=5000;
	bulletTime+=99999999;
	bullets.killAll();
	enemyBullets.killAll();
	drops.killAll();
    enemies.forEachAlive(function(enemy){enemy.body.stop();});
	explodeDelay = 0;
}
function prepBoss2(){
	if(victim = enemies.getRandomExists()){
		if(game.time.now > explodeDelay){
			explodeFunct(victim.x, victim.y);
			victim.kill();
			explodeDelay = game.time.now +150;
		}
	}
	if(!enemies.getFirstExists()) bossBattle = 2;
}
function prepBoss3(){
	bossBattle = 3;
    boss.reset(game.world.centerX, -boss.height);
    boss.body.velocity.y = 1000;
}
function prepBoss4(){
	if(game.time.now > bossDelay){
		redBar = game.add.sprite(-game.world.width-1100, game.world.height-100, "loadbar");
		bossHPBar.width = game.world.width;
		redBar.width = game.world.width*1.5;
		redBar.tint = 0xff0000
		bossHPBar.anchor.setTo(0,0);
		game.physics.enable(redBar, Phaser.Physics.ARCADE);
		bossHPBar.body.velocity.x = 1400;
		redBar.body.velocity.x = 1400;
		bossBattle = 4;
	}
}
function prepBoss5(){
	if(game.time.now > bossDelay){
    	bossBattle = 5;
    	redBar.kill();
    	bossHPBar.tint = 0xff0000;
    	bossHPBar.body.collideWorldBounds = true;
    	bulletTime = game.time.now;
    	musBoss.play('', 0, 0.3, true, true);
	}
	//var tween = game.add.tween(boss).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
}
function prepBoss6(){
	bossBattle = 6;
	game.add.tween(boss).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
}
function bossShoot(){
	var bullet = enemyBullets.getFirstExists(false)
	if (bullet) {
          bullet.reset(boss.x, boss.y+150);
          bullet.tint = 0xff0000;
       	  bullet.body.velocity.y = 1000;

       	  var offsetx = game.rnd.integerInRange(-70, 70);
	      var offsety = game.rnd.integerInRange(-70, 70);

       	  game.physics.arcade.moveToXY(bullet,sprite.body.x + offsetx, sprite.body.y + offsety,200);
       	  firingTime = game.time.now-1;
    }
}
function bossDeath(){
	bossHPBar.kill();
	score+=9001;
	bossBattle = "BOSS IS KILL";
	bossKilled = true;
	bossExplodeCount = 0;
	musBoss.stop();
}
function bossExplode(){
	if(game.time.now > bossDelay){
		var xoffset = game.rnd.integerInRange(-250, 250);
		var yoffset = game.rnd.integerInRange(-250, 250);
		sfxBossDeath.play('',0,0.2,false,true);
		explodeFunct(boss.body.x+xoffset, boss.body.y+yoffset);
		bossDelay = game.time.now + 100;
		bossExplodeCount++;
	}
}
function bossEnd(){
	boss.kill();
	music.play('',0,0.3,true,false);
	bossBattle= 0;
}
function bossHurt(boss, shot){
    if ((shot.x > boss.x + boss.width / 5 && shot.y > boss.y) ||
        (shot.x < boss.x - boss.width / 5 && shot.y > boss.y)) return false;
    else {
    	if(bossBattle == 6){
	    	shot.kill();
		    bossHealth-=2;
		    //console.log("ratio = " + bossHealth/maxBossHealth + "\n width = " + bossHPBar.width);
		    //bossHPBar.width = game.world.width-game.world.width*(1-bossHealth/maxBossHealth);
		    bossHPBar.width = game.world.width*(bossHealth/bossMaxHealth);
		    //console.log(bossHPBar.width);
		    if (bossHealth <= 0){
		    	bossDeath();
		    }
    	}
	    
	    }
}