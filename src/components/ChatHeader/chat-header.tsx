import React from 'react'
import style from './chat-header.module.scss'
import { IonRow, IonCol, IonIcon } from '@ionic/react'
import Friend from '../../models/friends'

interface Props {
    friends: Friend
    newConversation: boolean
    actions: {
        showSearchBar(status: boolean): void
        setNewConversation(status: boolean): void
        showInvitationExist(status: boolean): void
    }
}

export default class ChatHeader extends React.Component<Props, {}> {
    render() {
        const { friends, newConversation, actions } = this.props
        return (
            <div>
                {newConversation ? (
                    <IonRow>
                        <IonCol size="10" className={style.text}>
                            New Conversation
                        </IonCol>
                        <IonCol
                            size="2"
                            className={`${style.secondCol} ion-text-center`}
                        >
                            <IonIcon
                                name="close"
                                className={style.closeIcon}
                                onClick={() => {
                                    actions.showSearchBar(false)
                                    actions.setNewConversation(false)
                                }}
                            />
                        </IonCol>
                    </IonRow>
                ) : (
                    <div
                        className={friends.friend ? style.name : 'ion-padding'}
                        onClick={() => {
                            actions.showInvitationExist(false)
                        }}
                    >
                        {friends.friend ? friends.friend.name : ''}
                    </div>
                )}
            </div>
        )
    }
}
