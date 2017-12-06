var Boot = 
{
	preload: function()
	{
		game.load.image('loadbar', 'assets/images/loadbar.png');
	},
	create: function()
	{
		console.log("boot");
		game.state.start('Preloader');
	},
	update: function()
	{

	}
};