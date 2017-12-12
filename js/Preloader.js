var Preloader = {
	preload: function()
	{
		var preloadBar = this.add.sprite(game.world.centerX,game.world.centerY,'loadbar');
		preloadBar.anchor.setTo(0.5,0.5);
		game.load.setPreloadSprite(preloadBar);

		game.load.image('titlescreen', 'assets/images/background.png');
		game.load.spritesheet('button', 'assets/images/flixel-button.png', 80, 20);
		game.load.image('title', 'assets/images/title.png');
		game.load.image('pause', 'assets/images/pause.png');
		game.load.audio('musGun', 'assets/sfx/mus107.ogg');
		game.load.audio('musBoss', 'assets/sfx/musBoss4A.ogg');
		game.load.audio('sfxMelting', 'assets/sfx/sndMeltingUltraA.ogg');
		//game.load.audio('sfxExplode', 'assets/sfx/explode.ogg');
	},
	create: function()
	{
		game.state.start("Level1");
	}
}
