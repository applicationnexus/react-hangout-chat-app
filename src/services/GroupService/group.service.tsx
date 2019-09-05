import React from 'react'
import API from '../../api/api'

export default class GroupService extends React.Component {
    /**
     * Get user's group
     * @param {String} userId User's id
     * @returns Promise<any>
     */
    static getGroups = async (userId: string): Promise<any> => {
        const response = await API.get(`/groupChat/retrieve?userId=${userId}`)
        return response.data.data
    }

    /**
     * Create group of the added members
     * @param {Object} group details (members,group name)
     * @returns Promise<any>
     */
    static createGroup = async (group: Object): Promise<any> => {
        const response = await API.post(`/groupChat`, {
            group: group,
        })
        return response.data.data
    }
}
