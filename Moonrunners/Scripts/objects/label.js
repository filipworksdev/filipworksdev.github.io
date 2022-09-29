var objects;
(function (objects) {
    class Label extends createjs.Text {
        constructor(caption, fontSize, fontFamily, fontColour, x = 0, y = 0) {
            // Call the super constructor
            super(caption, fontSize + " " + fontFamily, fontColour);
            // Set the position
            this.x = x;
            this.y = y;
        }
        setScale(Scale) {
            this.scaleX = Scale;
            this.scaleY = Scale;
        }
    }
    objects.Label = Label;
})(objects || (objects = {}));
//# sourceMappingURL=label.js.map