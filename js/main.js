var game;
window.onload = function()
{
game = new Phaser.Game(1080, 1920, Phaser.AUTO, 'busters');
game.state.add('MainMenu', MainMenu);
game.state.add('Boot', Boot);
game.state.add('Preloader', Preloader);
game.state.add('Level1', Level1);
game.state.start('Boot');
};
