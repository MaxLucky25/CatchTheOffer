class Api {
    constructor(ws) {
        this.ws = ws;
        this.resolvers = {};
        this.ws.addEventListener('message', (event) => {
            const resultAction = JSON.parse(event.data);
            if (
                this.resolvers[resultAction.procedure] &&
                this.resolvers[resultAction.procedure].length > 0
            ) {
                this.resolvers[resultAction.procedure].shift()(
                    resultAction.result
                );
            }
        });
    }
    send(procedure, ...args) {
        return new Promise((res) => {
            this.ws.send(
                JSON.stringify({
                    procedure,
                    args,
                })
            );
            if (!this.resolvers[procedure]) {
                this.resolvers[procedure] = [];
            }
            this.resolvers[procedure].push(res);
        });
    }
}

export class GameRemoteProxy {
    ws = null;
    api = null;
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
    }
    async start() {
        this.ws = new WebSocket('ws://localhost:3001');
        this.api = new Api(this.ws);
        return new Promise((res) => {
            this.ws.onopen = res;
        });
    }
    async stop() {
        return this.api.send('stop');
    }
    async finishGame() {
        return this.api.send('finishGame');
    }
    setSettings(settings) {
        return this.api.send('setSettings', settings);
    }
    movePlayer1Right() {
        return this.api.send('movePlayer1Right');
    }
    movePlayer1Left() {
        return this.api.send('movePlayer1Left');
    }
    movePlayer1Up() {
        return this.api.send('movePlayer1Up');
    }
    movePlayer1Down() {
        return this.api.send('movePlayer1Down');
    }
    movePlayer2Right() {
        return this.api.send('movePlayer2Right');
    }
    movePlayer2Left() {
        return this.api.send('movePlayer2Left');
    }
    movePlayer2Up() {
        return this.api.send('movePlayer2Up');
    }
    movePlayer2Down() {
        return this.api.send('movePlayer2Down');
    }
    async getSettings() {
        return this.api.send('getSettings');
    }
    async getStatus() {
        return this.api.send('getStatus');
    }
    async getPlayer1() {
        return this.api.send('getPlayer1');
    }
    async getPlayer2() {
        return this.api.send('getPlayer2');
    }
    async getGoogle() {
        return this.api.send('getGoogle');
    }
    async getScore() {
        return this.api.send('getScore');
    }
}
