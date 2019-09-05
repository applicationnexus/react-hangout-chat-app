import React from 'react'
import API from '../../api/api'

export default class FriendService extends React.Component {
    /**
     * Get friends of logged in user
     * @param {String} userId User id
     * @returns Promise<any>
     */
    static getFriends = async (userId: String): Promise<any> => {
        const response = await API.get(`/friends/retrieve?userId=${userId}`)

        return response.data.data
    }

    /**
     * Add friend to user's friend list
     * @param {Object} data
     */
    static addFriend = async (data: any) => {
        await API.post(`/friends`, {
            requester: data.requester,
            recipient: data.recipient,
        })
    }
}
