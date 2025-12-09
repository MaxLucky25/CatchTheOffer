import { WebSocketServer } from 'ws';
import { Game } from '../js/game.js';
import { EventEmitter } from '../js/utility/EventEmitter.js';

const eventEmitter = new EventEmitter();
const game = new Game(
    new (class {
        getRandomIntInclusive(a, b) {
            return Math.floor(Math.random() * (b - a + 1)) + a;
        }
    })()
);
game.start();

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', async function message(data) {
        let action;
        try {
            action = JSON.parse(data);
        } catch (e) {
            ws.send(JSON.stringify({ error: 'Invalid JSON' }));
            return;
        }
        let result;
        if (typeof action.procedure === 'string') {
            try {
                if (typeof game[action.procedure] === 'function') {
                    result = await game[action.procedure](
                        ...(action.args || [])
                    );
                } else if (typeof game[action.procedure] !== 'undefined') {
                    result = game[action.procedure];
                } else {
                    result = null;
                }
            } catch (e) {
                result = { error: e.message };
            }
            ws.send(
                JSON.stringify({
                    procedure: action.procedure,
                    result,
                    type: 'response',
                })
            );
        }
    });

    // Можно отправлять события клиенту по game.eventEmitter.subscribe
});
