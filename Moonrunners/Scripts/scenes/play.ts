module scenes {
    export class PlayScene extends objects.Scene {
        // Instance variables
        private _gameBackground : objects.GameObject;
        private _gameBackground2 : objects.GameObject;
        private _playerOne: objects.Characters;
        private _playerTwo: objects.Characters;
        private _playersHealth: createjs.SpriteSheet;
        private _playerOneHealth: createjs.Sprite[];
        private _playerTwoHealth: createjs.Sprite[];
        private _score: objects.Score;
        private _ammo: objects.Ammo;
        private _level: objects.Level;
        private _groundTileset: createjs.SpriteSheet;
        private _timer: number;
        private _powerUp: objects.PowerUp | undefined;

        public pressedKeys = [];

        // Public properties

        // Constructor
        constructor(width: number, height: number) {
            super(width, height);

            this.Start();
        }

        // Public Methods
        public Start() : void {
            // cache the center of the screen position
            let screenCenter = this.GetCenter();

            // Set the properities of the background 
            this._gameBackground = new objects.GameObject(`background_${objects.Game.currentLevel}`);
            this._gameBackground2 = new objects.GameObject(`background_${objects.Game.currentLevel}_alternate`);
            this._gameBackground2.SetAlpha(0);

            // Load the ground tilset
            this._groundTileset = new createjs.SpriteSheet({
                images: [objects.Game.assetManager.getResult("tileset")],
                frames: {width:40, height:40, count:2, spacing: 1},
                animations: {Empty: [0], Ground: [1]}
            });

            // Load the level
            this._level = new objects.Level();
            this._level.LoadMap("", this._groundTileset);

            // Set the properities of the playerOne 
            this._playerOne = new objects.Characters("player1");
            this._playerOne.SetPosition(this.width / 2 - 470, this.height / 2 + 100);
            this._playerOne.SetAlpha(0);
            this._playerOne.name = "Player1";

            // Set the properities of the playerTwo 
            this._playerTwo = new objects.Characters("player2");
            this._playerTwo.SetPosition(this.width / 2 + 470, this.height / 2 + 100);
            this._playerTwo.SetAlpha(0);
            this._playerTwo.name = "Player2";

            // Load the health tileset
            this._playersHealth = new createjs.SpriteSheet({
                images: [objects.Game.assetManager.getResult("health")],
                frames: {width:80, height:80, count:6, regX: 40, regY:40, spacing:0, margin:0},
                animations: {Player1: [0, 2], Player2: [3, 5]}
            });

            // Player 1 health
            this._playerOneHealth = new Array<createjs.Sprite>(new createjs.Sprite(this._playersHealth, "Player1"), new createjs.Sprite(this._playersHealth, "Player1"), new createjs.Sprite(this._playersHealth, "Player1"));
            this._playerOneHealth.forEach((sprite, index) => {
                sprite.stop();
                sprite.x = 200 + (40 * index);
                sprite.y = 200;
                sprite.scaleX = 0.5;
                sprite.scaleY = 0.5;
            });
            this._playerOne.SetHealhtSprite(this._playerOneHealth);
            
            // Player 2 health
            this._playerTwoHealth = new Array<createjs.Sprite>(new createjs.Sprite(this._playersHealth, "Player2"), new createjs.Sprite(this._playersHealth, "Player2"), new createjs.Sprite(this._playersHealth, "Player2"));
            this._playerTwoHealth.forEach((sprite, index) => {
                sprite.stop();
                sprite.x = this.GetSize().x - 200 - (40 * index);
                sprite.y = 200;
                sprite.scaleX = 0.5;
                sprite.scaleY = 0.5;
            });
            this._playerTwo.SetHealhtSprite(this._playerTwoHealth);

            // The score label
            this._score = new objects.Score(screenCenter.x);

            // The ammo label
            this._ammo = new objects.Ammo();

            // fill the gameObject vector
            this.addGameObject(this._gameBackground);
            this.addGameObject(this._gameBackground2);
            this.addGameObject(...this._level.tiles);
            this.addGameObject(this._playerOne);
            this.addGameObject(this._playerTwo);
            this.addGameObject(...this._score.scores);
            this.addGameObject(this._score.title);
            this.addGameObject(...this._ammo.ammoImages);
            this.addGameObject(...this._ammo.ammoText);

            // Deactivate the players
            this._playerOne.isActive = false;
            this._playerTwo.isActive = false;

            // Add the sprites
            this._playerOneHealth.forEach(sprite => this.addChild(sprite));
            this._playerTwoHealth.forEach(sprite => this.addChild(sprite));

            this.Main();
        }

        public HandleEvents() : void {
           if (!this._playerOne.isActive || !this._playerTwo.isActive)
                return;

            if (this.pressedKeys[65] == true) this._playerOne.Move("Left");
            else if (this.pressedKeys[68] == true)  this._playerOne.Move("Right");

             //JUMP
            if (this.pressedKeys[87] == true && this._playerOne._isJumping == false && this._playerOne._isFalling == false) {
                this._playerOne.Jump(); 
                createjs.Sound.play("jump");
            }
            

            if (this.pressedKeys[32] == true) { //SHOOT
                let bullet = this._playerOne.Shoot();
                if (bullet) {
                    createjs.Sound.play("weapon_fire");
                    this.addGameObject(bullet);
                }
            }

            if (this.pressedKeys[37] == true) this._playerTwo.Move("Left");
            else if (this.pressedKeys[39] == true)  this._playerTwo.Move("Right");

            //JUMP
            if (this.pressedKeys[38] == true  && this._playerTwo._isJumping == false && this._playerTwo._isFalling == false){
                this._playerTwo.Jump(); 
                createjs.Sound.play("jump");
            }

            if (this.pressedKeys[96] == true || this.pressedKeys[45] == true) { //SHOOT
                let bullet = this._playerTwo.Shoot();
                if (bullet) {
                    createjs.Sound.play("weapon_fire");
                    this.addGameObject(bullet);
                } 
            }
        }

        public ResetPlayers() {
            let isGameEnded = this._score.winningPlayer;
                if (isGameEnded[0]) {
                    objects.Game.currentSceneNumber = config.Scene.OVER;
                    objects.Game.winningPlayer = isGameEnded[1];
                }

            this._playerOne.Reset(this.width / 2 - 470, this.height / 2 + 100);
            this._playerTwo.Reset(this.width / 2 + 470, this.height / 2 + 100);
        }

        public OnPlayerDeath(who: string) {
            if (who == "Player1")
            {
                this._score.incrementScore("Player2");
            }
            else if (who == "Player2")
            {
                this._score.incrementScore("Player1");
            }
        }

        public Update() : void {
            this.HandleEvents();
            
            super.Update();

            this._ammo.setAmmoText("Player1", this._playerOne.ammoCount);
            this._ammo.setAmmoText("Player2", this._playerTwo.ammoCount);
        }

        public Main() : void {
            this.Zoom(1.15, 1500);
            
            this._gameBackground2.Fade(1, 1500, createjs.Ease.getPowOut(1));
            this._playerOne.Fade(1, 1500, createjs.Ease.getPowOut(1)).call(() => {
                this._playerOne.setGravity(9.81);
                this._playerOne.isActive = true;
            });
            this._playerTwo.Fade(1, 1500, createjs.Ease.getPowOut(1)).call(() => {
                this._playerTwo.setGravity(9.81);
                this._playerTwo.isActive = true;
            });

            this._timer = setInterval(() => this.SpawnPowerUp(), 10000);
            this._timer = setInterval(() => this.SlowAmmoReload(), 1000);
        }

        public SlowAmmoReload() : void {
            if (this._playerOne.ammoCount < 20)
                    this._playerOne.reloadAmmo(1);

                if (this._playerTwo.ammoCount < 20)
                    this._playerTwo.reloadAmmo(1);
        }

        public SpawnPowerUp() : void {
            if (this._powerUp)
                this.removeGameObject(this._powerUp);

            if (Math.random() > 0.5) {
                this._powerUp = new objects.PowerUp("powerup_health", "Health");
            }
            else {
                this._powerUp = new objects.PowerUp("powerup", "Ammo");
            }            
            this._powerUp.graphics.x = Math.random() * 1420 + 500;
            this._powerUp.graphics.y = 0;

            this.addGameObject(this._powerUp);
        }
    }
}