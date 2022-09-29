module objects {
    export class Label extends createjs.Text {
        constructor(caption: string, fontSize: string, fontFamily: string, fontColour: string, x: number = 0, y: number = 0) {
            // Call the super constructor
            super(caption, fontSize + " " + fontFamily, fontColour);

            // Set the position
            this.x = x;
            this.y = y;
        }

        setScale(Scale: number) {
            this.scaleX = Scale;
            this.scaleY = Scale;
        }
    }
}