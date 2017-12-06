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
	},
	create: function()
	{
		game.state.start("MainMenu");
	}
}
