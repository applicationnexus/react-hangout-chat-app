import React from 'react'
import style from './create-message-form.module.scss'
import { IonRow, IonCol, IonInput } from '@ionic/react'
import SocketService from '../../../services/SocketService/socket-service'
import User from '../../../models/user'
import Friend from '../../../models/friends'

interface Props {
    state: {
        user: User
        currentFriend: Friend
    }
    setPrivateChatMessages: any
}

export default class CreateMessageForm extends React.Component<Props, {}> {
    inputField = React.createRef<HTMLIonInputElement>()

    render() {
        return (
            <IonRow className={style.messageContainer}>
                <IonCol>
                    <IonInput
                        placeholder="Send a message.."
                        onKeyPress={this.sendMessages}
                        ref={this.inputField}
                    />
                </IonCol>
            </IonRow>
        )
    }

    /**
     * Send messages to respective user/group and add messages to local state variables
     * @param event input field event after enter key press
     */
    sendMessages = (event: any) => {
        if (event.target.value !== '') {
            if (event.key === 'Enter' && event.shiftKey) {
            } else if (event.key === 'Enter') {
                this.inputField.current.value = ''
                const { user, currentFriend } = this.props.state
                const message = event.target.value
                const data = {
                    to: currentFriend.friend.id || currentFriend.friend._id,
                    from: user._id,
                    members: currentFriend.members,
                    messages: {
                        from: { _id: user._id },
                        message: message,
                    },
                }
                //Send message to group
                if (currentFriend.friend.groupCreatedAt) {
                    SocketService.send('group-message', data)
                } else {
                    //Send message to private chat and add message to local state variable
                    this.props.setPrivateChatMessages(data.messages, false)
                    SocketService.send('private-message', data)
                }
            }
        }
    }
}
