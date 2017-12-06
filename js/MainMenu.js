var MainMenu =
{
	preload: function()
	{

 	},
	create:function()
	{
		console.log("menu");
		background = game.add.sprite(0, 0, 'titlescreen');
		title = game.add.sprite(game.world.centerX-300,game.world.centerY-500, 'title')
		this.createButton("Start Game",game.world.centerX,game.world.centerY+32, 300, 100, function(){game.state.start('Level1')});
		//this.createButton("About",game.world.centerX,game.world.centerY+192, 300, 100, function(){console.log("about")});
	},
	update:function()
	{
		
	},
	createButton:function(string,x,y,w,h,callback)
	{
		var button1 = game.add.button(x,y,'button',callback,this,2,1,0);
		button1.anchor.setTo(0.5,0.5);
		button1.width = w;
		button1.height = h;
		var txt = game.add.text(button1.x,button1.y,string,{font:"40px Arial", fill: "#f",align:"center"});
		txt.anchor.setTo(0.5,0.5);
	}
};
