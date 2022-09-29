var objects;
(function (objects) {
    class GameObject extends createjs.DisplayObject {
        // Constructor
        constructor(assetID, isCentered) {
            super();
            this.isActive = false;
            //super(objects.Game.assetManager.getResult(assetID));
            if (assetID instanceof createjs.Sprite || assetID instanceof objects.Label) {
                this._graphics = assetID;
            }
            else {
                this._graphics = new createjs.Bitmap(objects.Game.assetManager.getResult(assetID));
            }
            this._isCentered = isCentered;
            this.hasCollisions = false;
            this.tag = "GameObject";
            this.onCollision = this.OnCollision;
            this.isColliding = false;
            this._initialize();
            this._Id = ++GameObject._IdCounter;
            this.name = `asset-${this._Id}`;
        }
        // Getters
        get graphics() {
            return this._graphics;
        }
        get bitmap() {
            return this._graphics;
        }
        get sprite() {
            return this._graphics;
        }
        get label() {
            return this._graphics;
        }
        // Private Methods
        _initialize() {
            this._updateBounds();
            if (this._isCentered == true) {
                this._graphics.regX = this.halfWidth;
                this._graphics.regY = this.halfHeight;
            }
        }
        _updateBounds() {
            let graphicsBound = this._graphics.getBounds();
            this.width = graphicsBound.width * this._graphics.scaleX;
            this.height = graphicsBound.height * this._graphics.scaleY;
            this.halfWidth = this.width * 0.5;
            this.halfHeight = this.height * 0.5;
            this.setBounds(graphicsBound.x, graphicsBound.y, graphicsBound.width, graphicsBound.height);
        }
        // Public Methods
        GetId() {
            return this._Id;
        }
        Fade(opacity, duration, fade) {
            return createjs.Tween.get(this._graphics).to({ alpha: opacity }, duration, fade);
        }
        Animate(props, duration, fade) {
            return createjs.Tween.get(this._graphics).to(props, duration, fade);
        }
        SetAlpha(alpha) {
            this._graphics.alpha = alpha;
        }
        SetPosition(x, y) {
            this._graphics.x = x;
            this._graphics.y = y;
        }
        SetScale(Scale) {
            if (typeof Scale === "number") {
                this._graphics.scaleX = Scale;
                this._graphics.scaleY = Scale;
            }
            else {
                this._graphics.scaleX = Scale[0];
                this._graphics.scaleY = Scale[1];
            }
            this._updateBounds();
        }
        Offset(x, y) {
            this._graphics.x += x;
            this._graphics.y += y;
        }
        Start() {
        }
        IsColliding(other) {
            return this._graphics.getTransformedBounds().intersects(other._graphics.getTransformedBounds());
        }
        Update() {
            // if the object leave the screen destroys it
            if (this._graphics.x < 0 || this._graphics.x > objects.Game.currentScene.width || this._graphics.y < 0 || this._graphics.y > objects.Game.currentScene.height) {
                this.Destroy();
            }
        }
        Destroy() {
            objects.Game.currentScene.removeGameObject(this);
        }
        OnCollision(other) { }
        On(type, listener, scope, once, data, useCapture) {
            return this._graphics.on(type, listener, scope, once, data, useCapture);
        }
        Off(type, listener, useCapture) {
            this._graphics.off(type, listener, useCapture);
        }
    }
    GameObject._IdCounter = 0;
    objects.GameObject = GameObject;
})(objects || (objects = {}));
//# sourceMappingURL=gameobject.js.map