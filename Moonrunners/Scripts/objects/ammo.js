var objects;
(function (objects) {
    class Ammo {
        // Constructor
        constructor() {
            // Load ammo image
            this._ammoImage = [];
            this._ammoImage[0] = new objects.GameObject("ammo_box");
            this._ammoImage[0].graphics.x = 180;
            this._ammoImage[0].graphics.y = 132;
            this._ammoImage[1] = new objects.GameObject("ammo_box");
            this._ammoImage[1].graphics.x = 1920 - 220;
            this._ammoImage[1].graphics.y = 132;
            // Load ammo count text
            this._ammoCountText = [];
            this._ammoCountText[0] = new objects.GameObject(new objects.Label("100", "30px", "Consolas", "#fff", 0, 0));
            this._ammoCountText[0].label.x = 227;
            this._ammoCountText[0].label.y = 136;
            this._ammoCountText[0].label.textAlign = "left";
            this._ammoCountText[1] = new objects.GameObject(new objects.Label("100", "30px", "Consolas", "#fff", 0, 0));
            this._ammoCountText[1].label.x = 1920 - 227;
            this._ammoCountText[1].label.y = 136;
            this._ammoCountText[1].label.textAlign = "right";
        }
        get ammoImages() {
            return this._ammoImage;
        }
        get ammoText() {
            return this._ammoCountText;
        }
        setAmmoText(who, count) {
            let text = who === "Player1" ? this._ammoCountText[0] : this._ammoCountText[1];
            text.label.text = count.toString();
        }
    }
    objects.Ammo = Ammo;
})(objects || (objects = {}));
//# sourceMappingURL=ammo.js.map