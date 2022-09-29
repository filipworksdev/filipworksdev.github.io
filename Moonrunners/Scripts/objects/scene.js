var objects;
(function (objects) {
    class Scene extends createjs.Container {
        // Consstructors
        constructor(width, height) {
            super();
            this.width = width;
            this.height = height;
            this.setBounds(0, 0, width, height);
            this.x = this.GetCenter().x;
            this.y = this.GetCenter().y;
            this.regX = this.width / 2;
            this.regY = this.height / 2;
            this.assetManager = objects.Game.assetManager;
            this._gameObjects = new Array();
        }
        // Private methods
        _DetectCollisions() {
            this._gameObjects.forEach(gameObject => gameObject[1].isColliding = false);
            let size = this._gameObjects.length;
            for (let LI = 0; LI < size; ++LI) {
                if (this._gameObjects[LI] === undefined) {
                    continue;
                }
                let Elem1 = this._gameObjects[LI][1];
                if (Elem1.hasCollisions) {
                    for (let RI = 0; RI < size; ++RI) {
                        if (this._gameObjects[RI] === undefined) {
                            continue;
                        }
                        let Elem2 = this._gameObjects[RI][1];
                        if (Elem1 != Elem2 && Elem2.hasCollisions && Elem1.IsColliding(Elem2)) {
                            Elem1.isColliding = true;
                            Elem2.isColliding = true;
                            Elem1.onCollision(Elem2);
                        }
                    }
                }
            }
        }
        // Public methods
        Start() { }
        Update() {
            // Does collisions
            this._DetectCollisions();
            // Update every single entity
            this._gameObjects.forEach(gameObject => {
                gameObject[1].Update();
            });
        }
        Main() { }
        GetSize() {
            return new objects.Vector2(this.width, this.height);
        }
        GetCenter() {
            return new objects.Vector2(this.width / 2, this.height / 2);
        }
        addGameObject(...entities) {
            entities.forEach(entity => {
                this.addChild(entity.graphics);
                entity.isActive = true;
                this._gameObjects.push([entity.GetId(), entity]);
            });
        }
        removeGameObject(entity) {
            this.removeChild(entity.graphics);
            this._gameObjects = this._gameObjects.filter(value => value[0] != entity.GetId());
        }
        Zoom(amount, duration, ease) {
            if (duration == null) {
                this.scaleX = amount;
                this.scaleY = amount;
            }
            else {
                createjs.Tween.get(this).to({ scale: amount }, duration, ease ? ease : createjs.Ease.getPowOut(1));
            }
        }
    }
    objects.Scene = Scene;
})(objects || (objects = {}));
//# sourceMappingURL=scene.js.map