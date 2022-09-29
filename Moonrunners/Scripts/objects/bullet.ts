module objects {
    export class Bullet extends GameObject {
        private ownerId: number;
        private direction: "left" | "right";
        private speed: number;
        private lifetime: number;

        constructor(assetID: string, ownerId: number, direction: "left" | "right", isCentered?: boolean)
        {
            super(assetID, isCentered);
            this.ownerId = ownerId;
            this.direction = direction;
            if (direction == "left") this.SetScale([-this.graphics.scaleX, this.graphics.scaleY]);
            this.hasCollisions = true;
            this.speed = 8;
            this.lifetime = 600;
            this.tag = "Bullet";
            this.name = `bullet_${this.GetId()}`;
            this.onCollision = this.OnBulletCollision;
        }

        public setDirection(direction: "left" | "right") {
            this.direction = direction;
        }

        public getDirection() : string {
            return this.direction;
        }

        public getOwner() : number {
            return this.ownerId;
        }

        public Update() : void {
            super.Update();

            this.Offset((this.direction === "right" ? 1 : -1) * this.speed, 0);

            if (this.lifetime > 0)  this.lifetime -= 1;
            else {
                this.Destroy();
            }     
        }

        public OnBulletCollision(other: GameObject) {
            if (other.GetId() != this.getOwner() && other.tag != "Bullet") {
                this.Destroy();
            }
        }
    }
}