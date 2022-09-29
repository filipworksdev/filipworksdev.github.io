module objects {
    export class Score {
        private _title: objects.GameObject;
        private _scoresText: objects.GameObject[];
        private _scores: number[];

        constructor(center: number) {
            // Title text
            this._title = new objects.GameObject(new objects.Label("P1 vs P2", "18px", "Consolas", "#fff", center, 100));
            this._title.label.textAlign = "center";

            // Scores text
            this._scoresText = [];
            this._scoresText[0] = new objects.GameObject(new objects.Label("0", "30px", "Consolas", "#fff", center - 20, 130));
            this._scoresText[1] = new objects.GameObject(new objects.Label("0", "30px", "Consolas", "#fff", center + 20, 130));

            this._scoresText[0].label.textAlign = "center";
            this._scoresText[1].label.textAlign = "center";

            this._scores = [0, 0];
        }

        get title() : GameObject {
            return this._title;
        }
        get scores() : GameObject[] {
            return this._scoresText;
        }

        get playerOneScore() : number {
            return this._scores[0];
        }
        get playerTwoScore() : number {
            return this._scores[1];
        }
        get winningPlayer() : [boolean, string] {

            if (this.playerOneScore === 10) {
                return [true, "Player 1"];
            }
            else if (this.playerTwoScore === 10) {
                return [true, "Player 2"];
            }

            return [false, ""];
        }

        public incrementScore(who: "Player1" | "Player2") {
            switch (who) {
                case "Player1":
                ++(this._scores[0]);
                this._scoresText[0].label.text = this._scores[0].toString();
                break;
                case "Player2":
                ++(this._scores[1]);
                this._scoresText[1].label.text = this._scores[1].toString();
                break;
            }
        }
    }
}