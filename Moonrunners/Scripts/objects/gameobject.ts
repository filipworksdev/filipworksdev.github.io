module objects {

    type CollisionEvent = (other: GameObject) => void;
    type Tuple<A, B> = [A, B];
    type Image = createjs.Bitmap | createjs.Sprite | Label;
    type ObjectTag = "GameObject" | "Player" | "Floor" | "Bullet" | "PowerUp";

    export class GameObject extends createjs.DisplayObject {
        // private properties
        private _Id: number;
        private static _IdCounter = 0;
        private _graphics: Image;

        // Instance properties
        protected _dX: number;
        protected _dY: number;
        protected _isCentered: boolean;

        // Public properties
        public width: number;
        public height: number;
        public halfWidth: number;
        public halfHeight: number;
        public hasCollisions: boolean;
        public onCollision: CollisionEvent;
        public isColliding: boolean;
        public tag: ObjectTag;
        public isActive = false;

        // Constructor
        constructor(assetID: string | createjs.Sprite | Label, isCentered?: boolean)
        {
            super();            
            //super(objects.Game.assetManager.getResult(assetID));
            if (assetID instanceof createjs.Sprite || assetID instanceof Label) {
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
        get graphics() : Image {
            return this._graphics;
        }
        get bitmap() : createjs.Bitmap {
            return this._graphics as createjs.Bitmap;
        }
        get sprite() : createjs.Sprite {
            return this._graphics as createjs.Sprite;
        }
        get label() : Label {
            return this._graphics as Label;
        }

        // Private Methods
        private _initialize() : void {
            
            this._updateBounds();
            if (this._isCentered == true)
            {
                this._graphics.regX = this.halfWidth;
                this._graphics.regY = this.halfHeight;
            }
            
        }
        private _updateBounds() {
            let graphicsBound = this._graphics.getBounds();
            this.width = graphicsBound.width * this._graphics.scaleX;
            this.height = graphicsBound.height * this._graphics.scaleY;
            this.halfWidth = this.width * 0.5;
            this.halfHeight = this.height * 0.5;
            this.setBounds(graphicsBound.x, graphicsBound.y, graphicsBound.width, graphicsBound.height);
        }

        // Public Methods
        public GetId() : number {
            return this._Id;
        }
        public Fade(opacity: number, duration: number, fade: Function) : createjs.Tween {
            return createjs.Tween.get(this._graphics).to({alpha: opacity}, duration, fade);
        }
        public Animate(props: any, duration: number, fade: Function) : createjs.Tween {
            return createjs.Tween.get(this._graphics).to(props, duration, fade);
        }
        public SetAlpha(alpha: number) {
            this._graphics.alpha = alpha;
        }
        public SetPosition(x: number, y: number) {
            this._graphics.x = x;
            this._graphics.y = y;
        }
        public SetScale(Scale: number | Tuple<number, number>) {
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
        public Offset(x: number, y: number) {
            this._graphics.x += x;
            this._graphics.y += y;
        }
        public Start() : void {

        }
        public IsColliding(other: GameObject) : boolean {
            return this._graphics.getTransformedBounds().intersects(other._graphics.getTransformedBounds());
        }

        public Update() : void {
            // if the object leave the screen destroys it
            if (this._graphics.x < 0 || this._graphics.x > Game.currentScene.width || this._graphics.y < 0 || this._graphics.y > Game.currentScene.height)
            {
                this.Destroy();   
            }
        }

        public Destroy() : void {
            objects.Game.currentScene.removeGameObject(this);
        }

        public OnCollision(other: GameObject) {}
        public On(type: string, listener: (eventObj: Object) => void, scope?: Object, once?: boolean, data?: any, useCapture?: boolean): Function {
            return this._graphics.on(type, listener, scope, once, data, useCapture);
        }
        public Off(type: string, listener: (eventObj: Object) => void, useCapture?: boolean) {
            this._graphics.off(type, listener, useCapture);
        }
    }
}