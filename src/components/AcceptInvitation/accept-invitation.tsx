import React from 'react'
import style from './accept-invitation.module.scss'
import commonStyle from '../../styles/common.module.scss'
import { IonButton, IonRow, IonCol, IonIcon } from '@ionic/react'
import PrivateChatService from '../../services/PrivateChatService/private-chat.service'
import InvitationService from '../../services/InvitationService/invitation.service'
import FriendService from '../../services/FriendService/friend.service'
import User from '../../models/user'
import Invitations from '../../models/invitations'
import WaitingInvitation from './WaitingInvitation/waiting-invitation'
import DeclinedInvitation from './DeclinedInvitation/declined-invitation'

interface Props {
    state: {
        user: User
        ifInvitationExist: boolean
        invitationDetails: Invitations
    }
    actions: {
        setInvitations(invitations: any): void
    }
}

export default class AcceptInvitation extends React.Component<Props, {}> {
    render() {
        const { invitationDetails, ifInvitationExist } = this.props.state

        return (
            <div>
                {ifInvitationExist ? (
                    invitationDetails.to === invitationDetails.from.email ? (
                        <div>
                            {invitationDetails.status === 'pending' ? (
                                <WaitingInvitation></WaitingInvitation>
                            ) : (
                                <DeclinedInvitation></DeclinedInvitation>
                            )}
                        </div>
                    ) : (
                        <IonRow className={style.container}>
                            <IonCol size="1" className={style.imageCol}>
                                <img
                                    className={style.image}
                                    src={invitationDetails.from.picture}
                                    alt="Not found"
                                />
                            </IonCol>
                            <IonCol
                                size="4"
                                className={commonStyle.alignCenter}
                            >
                                {invitationDetails.from.name} has invited you to
                                connect.
                            </IonCol>
                            <IonCol size="3" className={style.btnAcceptCol}>
                                <IonButton
                                    className={style.btnAccept}
                                    onClick={async () => {
                                        await this.acceptInvitation(
                                            invitationDetails,
                                        )
                                    }}
                                >
                                    <IonIcon
                                        className={style.acceptIcon}
                                        name="checkmark"
                                    />
                                    Accept
                                </IonButton>
                            </IonCol>
                            <IonCol size="3">
                                <IonButton
                                    className={style.btnReject}
                                    onClick={async () => {
                                        await this.rejectInvitation(
                                            invitationDetails,
                                        )
                                    }}
                                >
                                    <IonIcon name="close" />
                                    Decline
                                </IonButton>
                            </IonCol>
                        </IonRow>
                    )
                ) : (
                    <span />
                )}
            </div>
        )
    }

    /**
     * Accept invitation, get new invitations and add the accepted invitations in users friend list.
     * @param {Object} invitation
     */
    async acceptInvitation(invitation: any) {
        try {
            const response = await InvitationService.acceptInvitation(
                invitation._id,
            )

            if (response.code === 200) {
                await this.getInvitations()
                await this.addFriends(invitation)
                window.location.reload()
            }
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * Reject invitation and get new invitations
     * @param {Object} invitation
     */
    async rejectInvitation(invitation: any) {
        try {
            const response = await InvitationService.rejectInvitation(
                invitation._id,
            )

            if (response.code === 200) {
                await this.getInvitations()
                window.location.reload()
            }
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * Add user in friends list
     * @param {Object} invitation
     */
    async addFriends(invitation: any) {
        try {
            const { user } = this.props.state
            const requester = {
                id: invitation.from._id,
                friend_id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture,
            }
            const recipient = {
                id: user._id,
                friend_id: invitation.from._id,
                name: invitation.from.name,
                email: invitation.from.email,
                picture: invitation.from.picture,
            }
            FriendService.addFriend({
                requester: requester,
                recipient: recipient,
            })
            this.createChat(user._id, invitation.from._id)
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * Create chat for two friends
     * @param {String} requesterId
     * @param {String} recipientId
     */
    async createChat(requesterId: string, recipientId: string) {
        try {
            await PrivateChatService.createChat({
                requesterId,
                recipientId,
            })
        } catch (e) {
            console.log('TCL: AcceptInvitation -> createChat -> e', e)
        }
    }

    /**
     * Retrieve invitations after accepting/rejecting the invitation
     */
    async getInvitations() {
        const { user } = this.props.state
        const invitations = await InvitationService.getInvitations(user.email)

        this.props.actions.setInvitations({ invitations })
    }
}
