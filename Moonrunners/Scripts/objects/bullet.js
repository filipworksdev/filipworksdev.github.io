var objects;
(function (objects) {
    class Bullet extends objects.GameObject {
        constructor(assetID, ownerId, direction, isCentered) {
            super(assetID, isCentered);
            this.ownerId = ownerId;
            this.direction = direction;
            if (direction == "left")
                this.SetScale([-this.graphics.scaleX, this.graphics.scaleY]);
            this.hasCollisions = true;
            this.speed = 8;
            this.lifetime = 600;
            this.tag = "Bullet";
            this.name = `bullet_${this.GetId()}`;
            this.onCollision = this.OnBulletCollision;
        }
        setDirection(direction) {
            this.direction = direction;
        }
        getDirection() {
            return this.direction;
        }
        getOwner() {
            return this.ownerId;
        }
        Update() {
            super.Update();
            this.Offset((this.direction === "right" ? 1 : -1) * this.speed, 0);
            if (this.lifetime > 0)
                this.lifetime -= 1;
            else {
                this.Destroy();
            }
        }
        OnBulletCollision(other) {
            if (other.GetId() != this.getOwner() && other.tag != "Bullet") {
                this.Destroy();
            }
        }
    }
    objects.Bullet = Bullet;
})(objects || (objects = {}));
//# sourceMappingURL=bullet.js.map