import React from 'react'
import style from './friends-list.module.scss'
import commonStyle from '../../styles/common.module.scss'
import { IonRow, IonCol, IonIcon } from '@ionic/react'
import User from '../../models/user'
import Friend from '../../models/friends'
import InviteList from './InviteList/invite-list'
import Invitations from '../../models/invitations'

interface Props {
    state: {
        friends?: Array<Friend>
        searchBar?: boolean
        user?: User
        invitations?: Array<Invitations>
        invitationDetails?: Invitations
    }
    actions: {
        setCreateMessage(status: boolean): void
        showSearchBar(status: boolean): void
        setCurrentFriend(friend: any): void
        setNewConversation(status: boolean): void
        showInvitationExist(status: boolean): void
        showInvitationDetails(invitationDetails: Invitations): void
        showSearchBar(searchBar: boolean): void
    }
}

interface State {
    key: any
}

export default class FriendsList extends React.Component<Props, State> {
    state = {
        key: '',
    }

    /**
     * Change classnames to highlight the selected chat window
     */
    changeClassnames = (key: string) => {
        this.setState(() => ({
            key: key,
        }))
    }

    render() {
        const { friends, user } = this.props.state
        const { actions } = this.props
        return (
            <div className={style.container}>
                {friends.length > 0 ? (
                    friends.map((friend: any) => (
                        <IonRow
                            style={{ padding: '5px' }}
                            onClick={async () => {
                                actions.setCreateMessage(true)
                                actions.showSearchBar(false)
                                await actions.setCurrentFriend(friend)
                                actions.setNewConversation(false)
                                this.changeClassnames(friend.friend._id)
                            }}
                            className={
                                this.state.key === friend.friend._id
                                    ? style.highLightedClassName
                                    : style.className
                            }
                            key={friend.friend._id}
                        >
                            <IonCol
                                size="2"
                                className={`${
                                    friend.friend.groupCreatedAt
                                        ? style.peopleIconCol
                                        : ''
                                }
                                         ion-no-padding ion-text-center`}
                            >
                                {friend.friend.groupCreatedAt ? (
                                    <IonIcon
                                        name="people"
                                        className={style.peopleIcon}
                                    />
                                ) : (
                                    <img
                                        className={style.userImage}
                                        src={
                                            friend.friend.picture
                                                ? friend.friend.picture
                                                : require('../../assets/user.png')
                                        }
                                        alt="Not found"
                                    />
                                )}
                            </IonCol>
                            <IonCol
                                className={`${commonStyle.alignCenter} ${style.messageBodyColumn}`}
                            >
                                {friend.friend.name}
                                {friend.messages.map(
                                    (item: any, index: number) =>
                                        friend.messages.length === index + 1 ? (
                                            item.from._id === user._id ? (
                                                <div
                                                    key={index}
                                                    className={style.lastName}
                                                >
                                                    You: {item.message}
                                                </div>
                                            ) : friend.friend.groupCreatedAt ? (
                                                <div
                                                    key={index}
                                                    className={style.lastName}
                                                >
                                                    {item.from.givenName} :
                                                    {item.message}
                                                </div>
                                            ) : (
                                                <div
                                                    key={index}
                                                    className={style.lastName}
                                                >
                                                    {item.message}
                                                </div>
                                            )
                                        ) : (
                                            <span key={index} />
                                        ),
                                )}
                            </IonCol>
                        </IonRow>
                    ))
                ) : (
                    <span />
                )}
                <InviteList
                    state={this.props.state}
                    actions={this.props.actions}
                ></InviteList>
            </div>
        )
    }
}
