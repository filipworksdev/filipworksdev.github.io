var objects;
(function (objects) {
    class PowerUp extends objects.GameObject {
        // Constructor
        constructor(assetId, type) {
            super(assetId);
            this._type = type;
            this._isFalling = true;
            this._gravity = 9.81;
            this.hasCollisions = true;
            this.tag = "PowerUp";
            this.onCollision = this.onCharacterCollision;
        }
        // Update
        Update() {
            super.Update();
            if (this._isFalling)
                this.Offset(0, this._gravity);
        }
        onCharacterCollision(other) {
            switch (other.tag) {
                // If we collide with the floor we stop falling
                case "Floor":
                    this._isFalling = false;
                    break;
                case "Player":
                    let player = other;
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
                    objects.Game.currentScene.removeGameObject(this);
                    break;
            }
        }
    }
    objects.PowerUp = PowerUp;
})(objects || (objects = {}));
//# sourceMappingURL=powerup.js.map