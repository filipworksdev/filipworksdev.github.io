var objects;
(function (objects) {
    class Characters extends objects.GameObject {
        // Constructor
        constructor(assetID, isCentered) {
            super(assetID, isCentered);
            this._ammoCount = 20;
            this._shootTimer = 0;
            this._x = 0;
            this._y = 0;
            this._gravity = 0;
            this._jumpTimer = 0;
            this._isFalling = true;
            this._isJumping = false;
            this._playerHealth = 6;
            this.hasCollisions = true;
            this.tag = "Player";
            this.onCollision = this.onCharacterCollision;
            this._x = 0;
            this._y = 0;
        }
        _UpdateHealthSprites() {
            let health = this._playerHealth;
            // Reset all the sprite
            this._healthSprites[0].gotoAndStop(this.name);
            this._healthSprites[1].gotoAndStop(this.name);
            this._healthSprites[2].gotoAndStop(this.name);
            // Determine which of the 3 hearth we have to change
            switch (true) {
                case health === 5:
                    this._healthSprites[0].advance();
                    break;
                case health === 4:
                    this._healthSprites[0].advance();
                    this._healthSprites[0].advance();
                    break;
                case health === 3:
                    this._healthSprites[0].advance();
                    this._healthSprites[0].advance();
                    this._healthSprites[1].advance();
                    break;
                case health === 2:
                    this._healthSprites[0].advance();
                    this._healthSprites[0].advance();
                    this._healthSprites[1].advance();
                    this._healthSprites[1].advance();
                    break;
                case health === 1:
                    this._healthSprites[0].advance();
                    this._healthSprites[0].advance();
                    this._healthSprites[1].advance();
                    this._healthSprites[1].advance();
                    this._healthSprites[2].advance();
                    break;
                case health === 0:
                    this._healthSprites[0].advance();
                    this._healthSprites[0].advance();
                    this._healthSprites[1].advance();
                    this._healthSprites[1].advance();
                    this._healthSprites[2].advance();
                    this._healthSprites[2].advance();
                    break;
            }
            // Advance the current animation (reduce the health in the hearth)
            //currentSprite.advance();
        }
        SetHealhtSprite(sprites) {
            this._healthSprites = sprites;
        }
        // Public methods
        setGravity(gravity) {
            this._gravity = gravity;
        }
        GetGravity() {
            return this._gravity;
        }
        Shoot() {
            let Bullet = null;
            if (this._shootTimer == 0 && this._ammoCount > 0) {
                // Spawn a bullet object
                Bullet = new objects.Bullet("bullet", this.GetId(), this.graphics.scaleX < 0 ? "left" : "right");
                Bullet.SetPosition(this.graphics.x + (this.graphics.scaleX < 0 ? -40 : 33), this.graphics.y + 24);
                if (Bullet) {
                    this._ammoCount -= 1;
                    this._shootTimer = 5;
                }
            }
            //make sure ammo doesn't go negative
            if (this._ammoCount < 0) {
                this._ammoCount = 0;
            }
            return Bullet;
        }
        Move(direction) {
            if (this.graphics.x < 160 || this.graphics.x > 1760)
                return;
            switch (direction) {
                case "Left":
                    {
                        this._x = -4;
                        if (this.graphics.scaleX > 0)
                            this.SetScale([-this.graphics.scaleX, this.graphics.scaleY]);
                    }
                    break;
                case "Right":
                    {
                        this._x = 4;
                        if (this.graphics.scaleX < 0) {
                            this.SetScale([-this.graphics.scaleX, this.graphics.scaleY]);
                        }
                    }
                    break;
            }
            if (this._isJumping == false) {
                this._isFalling = true;
            }
        }
        Jump() {
            if (this._isFalling == false) {
                this._y = -4;
                this._jumpTimer = 60;
                this._isJumping = true;
            }
        }
        Update() {
            super.Update();
            if (this._shootTimer > 0)
                this._shootTimer -= 1;
            if (this._isFalling) {
                this.Offset(this._x, this._y + (this._gravity * 0.5));
            }
            else {
                if (this.graphics.y > 75) {
                    this.Offset(this._x, this._y);
                }
                else {
                    this._y = 0;
                    this._isJumping = false;
                    this._isFalling = true;
                }
            }
            this._x = 0;
            if (this._jumpTimer > 0) {
                this._jumpTimer -= 1;
            }
            else if (this._isJumping == true) {
                this._y = 0;
                this._isJumping = false;
                this._isFalling = true;
            }
        }
        TakeDamage(amount) {
            if (--this._playerHealth >= 0) {
                this._UpdateHealthSprites();
            }
        }
        Heal(amount) {
            if (this._playerHealth < 6) {
                ++this._playerHealth;
                this._UpdateHealthSprites();
            }
        }
        Reset(x, y) {
            this.SetPosition(x, y);
            this.SetAlpha(1);
            this._jumpTimer = 0;
            this._isFalling = true;
            this._playerHealth = 6;
            this.hasCollisions = true;
            this._ammoCount = 20;
            // Reset the health sprites
            this._healthSprites[0].gotoAndStop(this.name);
            this._healthSprites[1].gotoAndStop(this.name);
            this._healthSprites[2].gotoAndStop(this.name);
        }
        onKilled() {
            objects.Game.currentScene.OnPlayerDeath(this.name);
            // Play an animation when the player dies
            createjs.Tween.get(this.graphics, { onComplete: () => {
                    // Notify the Play scene this player died one all the animation are finished
                    objects.Game.currentScene.ResetPlayers();
                } }).to({ alpha: 1 }, 50).to({ alpha: 0 }, 50).loop = 10;
        }
        onCharacterCollision(other) {
            switch (other.tag) {
                //If we collide with the floor we stop falling
                case "Floor":
                    this._isFalling = false;
                    break;
                // If we collide with a bullet shot by the other player
                case "Bullet":
                    {
                        if (other.getOwner() != this.GetId() && this._playerHealth > 0) {
                            createjs.Sound.play("player_hit");
                            // decrease the player health
                            if (--this._playerHealth <= 0) {
                                // If we reach -1 then we are dead
                                this.onKilled();
                                createjs.Sound.play("defeated");
                            }
                            // Change the health bar
                            this._UpdateHealthSprites();
                        }
                    }
                    break;
            }
        }
        get ammoCount() {
            return this._ammoCount;
        }
        reloadAmmo(value) {
            if ((value + this._ammoCount) <= 20) {
                this._ammoCount += value;
            }
            else {
                this._ammoCount = 20;
            }
        }
    }
    objects.Characters = Characters;
})(objects || (objects = {}));
//# sourceMappingURL=character.js.map