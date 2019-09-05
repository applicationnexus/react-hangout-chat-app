import React from 'react'
import API from '../../api/api'

export default class InvitationService extends React.Component {
    /**
     * Get invitation list of logged in user
     * @param {String} email
     * @returns Promise<any>
     */
    static getInvitations = async (email: string): Promise<any> => {
        const response = await API.get(`/invite/retrieve?email=${email}`)
        return response.data.data
    }

    /**
     * Accept invitation
     * @param {String} invitationId Invitation id
     * @returns Promise<any>
     */
    static acceptInvitation = async (invitationId: string): Promise<any> => {
        const response = await API.post(`/invite/accept`, {
            requestId: invitationId,
        })

        return response.data
    }

    /**
     * Reject invitation
     * @param {String} invitationId Invitation id
     * @returns Promise<any>
     */
    static rejectInvitation = async (invitationId: string): Promise<any> => {
        const response = await API.post(`/invite/reject`, {
            requestId: invitationId,
        })

        return response.data
    }

    /**
     * Send invitation
     * @param {Object} body (invitation email, sender id)
     * @returns Promise<any>
     */
    static sendInvitation = async (body: Object): Promise<any> => {
        return await API.post('/invite', body)
    }

    /**
     * Get user's send invitations which are still pending or rejected.
     * @param {String} userId User's id
     * @return Promise<any>
     */
    static getSendInvitations = async (userId: string): Promise<any> => {
        const response = await API.get(
            `/invite/get-send-invitations?userId=${userId}`,
        )
        return response.data.data
    }
}
