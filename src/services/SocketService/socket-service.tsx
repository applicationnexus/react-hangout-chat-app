import io from 'socket.io-client'
import { fromEvent, Observable } from 'rxjs'
import { Config } from '../../config/config'

export default class SocketService {
    static socket: SocketIOClient.Socket = {} as SocketIOClient.Socket

    /**
     * Initialize socket connection and emit the connected user
     * @param {String} userId
     * @returns void
     */
    static connect(userId: string): void {
        SocketService.socket = io(Config.serverUrl)
        SocketService.socket.emit('userConnected', userId)
    }

    /**
     * Emit the group chat
     * @param {String} groupId
     * @returns void
     */
    static connectGroupChat(groupId: string): void {
        SocketService.socket.emit('groupConnected', groupId)
    }

    /**
     * send a message for the server to broadcast
     * @param {String} eventName
     * @param {Object} data
     * @returns void
     */
    static send(eventName: string, data: Object): void {
        SocketService.socket.emit(eventName, data)
    }

    /**
     * link private message event to rxjs data source
     * @returns Observable
     */
    static onPrivateMessage(): Observable<any> {
        return fromEvent(SocketService.socket, 'private-message')
    }

    /**
     * link group message event to rxjs data source
     * @returns Observable
     */
    static onGroupMessage(): Observable<any> {
        return fromEvent(SocketService.socket, 'group-message')
    }

    /**
     * Disconnect socket connection and emit the disconnected user
     * @param userId
     * @returns void
     */
    static disconnect(userId: string): void {
        SocketService.socket.emit('userDisconnected', userId)
        SocketService.socket.disconnect()
    }
}
