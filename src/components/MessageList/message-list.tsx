import React from 'react'
import style from './message-list.module.scss'
import { IonRow, IonCol } from '@ionic/react'
import ScrollToBottom from 'react-scroll-to-bottom'
import User from '../../models/user'
import Friend from '../../models/friends'
import CreateMessageForm from './CreateMessageForm/create-message-form'

const emptyList = (
    <div className={`${style.emptyList} ion-text-center`}>
        <span role="img" aria-label="post">
            📝
        </span>
        <h2>No Messages Yet</h2>
        <p>Be the first to post the message</p>
    </div>
)

const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
]

interface Props {
    state: {
        user: User
        currentFriend: Friend
    }
    setPrivateChatMessages: any
}

export default class MessageList extends React.Component<Props, {}> {
    render() {
        const { user, currentFriend } = this.props.state
        const { messages } = currentFriend

        return (
            <div className={style.messagesContainer}>
                {messages.length > 0 ? (
                    <ScrollToBottom mode="bottom" className={style.height}>
                        {messages.map((message: any, index: any) => (
                            <IonRow key={index}>
                                {user._id === message.from._id ? (
                                    ''
                                ) : (
                                    <IonCol
                                        size="1"
                                        className={`${style.imgCol} ion-text-center`}
                                    >
                                        <img
                                            className={style.friendImage}
                                            src={
                                                currentFriend.friend.picture ||
                                                message.from.picture
                                            }
                                            alt="Not found"
                                        />
                                    </IonCol>
                                )}
                                <IonCol
                                    className={
                                        user._id === message.from._id
                                            ? style.rightColumn
                                            : style.leftColumn
                                    }
                                >
                                    <div className={style.messageBody}>
                                        <pre>{message.message}</pre>
                                    </div>

                                    <div className={style.messageTime}>
                                        {this.formatDate(
                                            message.createdAt,
                                            user._id === message.from._id
                                                ? 'right'
                                                : 'left',
                                            user._id === message.from._id
                                                ? ''
                                                : message.from.givenName,
                                        )}
                                    </div>
                                </IonCol>
                            </IonRow>
                        ))}
                    </ScrollToBottom>
                ) : (
                    emptyList
                )}
                <CreateMessageForm
                    state={this.props.state}
                    setPrivateChatMessages={this.props.setPrivateChatMessages}
                ></CreateMessageForm>
            </div>
        )
    }

    /**
     * Format date to show with message
     * @param {String} date Date of the message
     * @param {String} direction Right/Left for sender and receiver of message
     * @param {String} friendName Sender name
     */
    formatDate = (date: string, direction: string, friendName?: string) => {
        let today: Date
        date ? (today = new Date(date)) : (today = new Date())
        let hours = today.getHours()
        let minutes: any = today.getMinutes()
        const month = today.getMonth()
        const todayDate = today.getDate()
        const ampm = hours >= 12 ? 'pm' : 'am'
        hours = hours % 12
        hours = hours ? hours : 12 // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes
        if (direction === 'left') {
            return friendName !== ''
                ? `${friendName}. ${
                      months[month + 1]
                  } ${todayDate}, ${hours}:${minutes} ${ampm}`
                : `${
                      months[month + 1]
                  } ${todayDate}, ${hours}:${minutes} ${ampm}`
        } else {
            return `${hours}:${minutes} ${ampm}`
        }
    }
}
