import API from '../../api/api'

export default class PrivateChatService {
    /**
     * Create chat for private communication.
     * @param {Object} data (members)
     */
    static async createChat(data: any) {
        try {
            await API.post(
                `/chats?requesterId=${data.requesterId}&recipientId=${data.recipientId}`,
            )
        } catch (e) {
            console.log('TCL: AcceptInvitation -> createChat -> e', e)
        }
    }
}
