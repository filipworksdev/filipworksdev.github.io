module scenes {
    export class StartScene extends objects.Scene {
        // Instance variables
        private _gameBackground : objects.GameObject;
        private _titleLabel : objects.GameObject;
        private _continueLabel : objects.GameObject;
        private _instructions : objects.GameObject;

        // Public properties

        // Constructor
        constructor(width: number, height: number) {
            super(width, height);

            this.Start();
        }

        // Private Methods
        private showClickToContinueLabel() : void {
            this._continueLabel.Fade(1, 1500, createjs.Ease.getPowOut(1));
            this._instructions.Fade(1, 1500, createjs.Ease.getPowOut(1));
            this._gameBackground.On("click", this.startGame, this);
        }
    
        private startGame() : void {
            this._gameBackground.Off("click", this.startGame);
            this._continueLabel.Fade(0, 500, createjs.Ease.getPowOut(1));
            this._instructions.Fade(0, 500, createjs.Ease.getPowOut(1));
            this._titleLabel.Fade(0, 500, createjs.Ease.getPowOut(1)).call( () => {
                objects.Game.currentSceneNumber = config.Scene.PLAY;
            });
        }

        // Public Methods
        public Start() : void {
            // Set the properities of the background Title label
            this._gameBackground = new objects.GameObject(`background_${objects.Game.currentLevel}`);
            this.addGameObject(this._gameBackground);

            // cache the center of the screen position
            let screenCenter = this.GetCenter();

            // Set the properities of the animated Title label
            this._titleLabel = new objects.GameObject("logo", true);
            this._titleLabel.SetAlpha(0);
            this._titleLabel.SetScale(0.15);
            this._titleLabel.SetPosition(screenCenter.x, screenCenter.y - 50);
            this.addGameObject(this._titleLabel);
            
            // Set the properities of the animated Title label
            this._continueLabel = new objects.GameObject(new objects.Label("Click anywhere to continue", "20px", "Consolas", "#fff", screenCenter.x, screenCenter.y + 50));
            this._continueLabel.SetAlpha(0);
            this._continueLabel.label.textAlign = "center";
            this.addGameObject(this._continueLabel);

            // Set the properities of the animated Title label
            this._instructions = new objects.GameObject(new objects.Label("Player1: 'a'/'d' to move, 'w' to jump, 'space' to shoot\n\nPlayer2: 'left'/'right' to move, 'up' to jump, 'num0' to shoot", "18px", "Consolas", "#fff", screenCenter.x, screenCenter.y + 100));
            this._instructions.SetAlpha(0);
            this._instructions.label.textAlign = "center";
            this.addGameObject(this._instructions);

            this.Main();
        }

        public Update() : void {
        }

        public Main() : void {
            this._titleLabel.Animate({alpha:1, scaleX: 0.25, scaleY: 0.25}, 2000, createjs.Ease.getPowOut(1)).call(this.showClickToContinueLabel, null, this);
        }
    }
}