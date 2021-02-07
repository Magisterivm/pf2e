import { LootTransfer, LootTransferData } from '../module/actor/loot';

export type SocketEventCallback = [
    message: {
        request: string;
        data: { [key: string]: any };
    },
    userId: string,
];

export function activateSocketListener() {
    game.socket.on('system.pf2e', async (...[message, userId]: SocketEventCallback) => {
        const sender = game.users.find((user) => user.id === userId);
        switch (message.request) {
            case 'lootTransfer':
                if (game.user.isGM) {
                    console.debug(`PF2e System | Received item transfer request from ${sender.name}`);
                    const data = message.data as LootTransferData;
                    const transfer = new LootTransfer(data.source, data.target, data.quantity, data.containerId);
                    transfer.enact(sender);
                }
                break;
            case 'refreshSceneControls':
                if (!game.user.isGM && message.data.layer === ui.controls.control?.layer) {
                    console.debug('PF2e System | Refreshing Scene Controls');
                    ui.controls.initialize({ layer: message.data.layer });
                }
                break;
            default:
                throw Error(`PF2e System | Received unrecognized socket emission: ${message.request}`);
        }
    });
}
