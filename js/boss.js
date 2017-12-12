
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
    	boss.body.velocity.x = +500;
    }
    if (boss.body.x >= game.world.width - 400 && bossBattle == 5){
    	boss.body.stop();
    	prepBoss6();
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
}
function prepBoss6(){
	bossBattle = 6;
	bossTween = game.add.tween(boss).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);
}
function bossShoot(){
	//rng shooty pattern
	if(bossDelay<game.time.now){
		bossPattern = game.rnd.integerInRange(1, 3);
		bossDelay = game.time.now+3000;
	}
	switch(bossPattern){
		case 1: bossBulletSpam(sprite); break;
		case 2: bossLaser(); break;
		default: console.log("Boss sits there menancingly."); break;
	}

}
function bossBulletSpam(target){
	var bullet = enemyBullets.getFirstExists(false)
	if (bullet) {
          bullet.reset(boss.x, boss.y+150);
          console.log("Boss shot");
          bullet.tint = 0xff0000;
       	  bullet.body.velocity.y = 1000;

       	  var offsetx = game.rnd.integerInRange(-70, 70);
	      var offsety = game.rnd.integerInRange(-70, 70);

       	  game.physics.arcade.moveToXY(bullet,target.body.x + offsetx, target.body.y + offsety,200);
       	  firingTime = game.time.now-1;
    }
}
function bossLaser(){
	var laser = bossLasers.getFirstExists(false)
	if (laser) {
		  var offsetx = game.rnd.integerInRange(-10, 10);
	      var offsety = 0*game.rnd.integerInRange(-30, 30);

          laser.reset(boss.x+offsetx, boss.y+offsety+50);
          console.log("Boss lasered");
          laser.tint = 0xff0000;
          laser.scale.setTo(2,5);
       	  laser.body.velocity.y = 1000;

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
    	if(bossBattle >= 5){
	    	shot.kill();
		    bossHealth-=2;
		    bossHPBar.width = game.world.width*(bossHealth/bossMaxHealth);
		    //console.log(bossHPBar.width);
		    if (bossHealth <= 0){
		    	bossDeath();
		    }
    	}
	    
	    }
}