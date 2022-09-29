module objects {

    type PowerUpType = "Health" | "Ammo" | "Gun";

    export class PowerUp extends GameObject {

        private _isFalling: boolean;
        private _gravity: number;
        private _type: PowerUpType;

        // Constructor
        constructor(assetId: string | createjs.Sprite, type: PowerUpType) {
            super(assetId);

            this._type = type;
            this._isFalling = true;
            this._gravity = 9.81;
            this.hasCollisions = true;
            this.tag = "PowerUp";
            this.onCollision = this.onCharacterCollision;
        }

        // Update
        public Update() {
            super.Update();

            if (this._isFalling)
                this.Offset(0, this._gravity);
        }

        public onCharacterCollision(other: GameObject) {
            switch (other.tag)
            {
                // If we collide with the floor we stop falling
                case "Floor": 
                    this._isFalling = false;
                break;

                case "Player":
                    let player = (other as Characters)
                    switch (this._type) {
                        case "Ammo":
                        player.reloadAmmo(10);
                        createjs.Sound.play("ammo_pickup");
                        break;
                        case "Gun":
                        break;
                        case "Health":
                        player.Heal();
                        createjs.Sound.play("health_pick_up");
                        break;
                    }
                    Game.currentScene.removeGameObject(this);
                break;
            }
        }
    }
}