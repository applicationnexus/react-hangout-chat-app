import API from '../../api/api'
import React from 'react'

export default class UserService extends React.Component {
    /**
     * User's google login
     * @param {Object} userObj user details
     * @returns Promise<any>
     */
    static googleLogin = async (userObj: Object): Promise<any> => {
        const user = await API.post(`/users`, userObj)
        return user.data.data
    }
}
