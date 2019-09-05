import React from 'react'
import style from './main.module.scss'
import Modal from 'react-responsive-modal'
import GoogleLogin from 'react-google-login'
import { Config, InitialStates } from '../../config/config'

import '../../../node_modules/@ionic/core/css/text-alignment.css'
import '../../../node_modules/@ionic/core/css/padding.css'
import '../../styles/index.scss'

import commonStyle from '../../styles/common.module.scss'

import UserHeader from '../../components/UserHeader/user-header'
import StartConversation from '../../components/StartConversation/start-conversation'
import InviteUser from '../../components/InviteUser/invite-user'
import BackgroundScreen from '../../components/BackgroundScreen/background-screen'
import ChatHeader from '../../components/ChatHeader/chat-header'
import AcceptInvitation from '../../components/AcceptInvitation/accept-invitation'
import FriendsList from '../../components/FriendsList/friends-list'
import MessageList from '../../components/MessageList/message-list'
import CreateGroup from '../../components/CreateGroup/create-group'
import UserService from '../../services/UserService/user.service'
import InvitationService from '../../services/InvitationService/invitation.service'
import GroupService from '../../services/GroupService/group.service'
import FriendService from '../../services/FriendService/friend.service'
import SocketService from '../../services/SocketService/socket-service'

import { IonApp, IonHeader, IonRow, IonCol, IonContent } from '@ionic/react'
import ToastMessages from '../../components/ToastMessage/toast-message'

// --------------------------------------
// Application
// --------------------------------------
class Main extends React.Component {
    state = InitialStates

    actions = {
        showSearchBar: (searchBar: boolean) => this.setState({ searchBar }),

        setInvitations: (invitations: any) => this.setState({ invitations }),

        showInvitationExist: (ifInvitationExist: boolean) =>
            this.setState({ ifInvitationExist }),

        showInvitationDetails: (invitationDetails: any) =>
            this.setState({ invitationDetails }),

        setFriends: (friends: any) => this.setState({ friends }),

        setCreateMessage: (createMessage: any) =>
            this.setState({ createMessage }),

        joinRoom: (rooms: any) => {
            this.setState({ rooms })
        },

        setCurrentFriend: (currentFriend: any) => {
            this.setState({ currentFriend })
        },

        setNewConversation: (newConversation: boolean) => {
            this.setState({ newConversation })
        },

        setCreateGroupStatus: (createGroup: boolean) => {
            this.setState({ createGroup })
        },
    }

    /**
     * Reset state variables after logout
     */
    resetStates = () => {
        this.setState(InitialStates)
    }
    /**
     * Initialize user's socket connection, get user's friends/groups and messages
     */
    componentDidMount() {
        const user = JSON.parse(window.localStorage.getItem('user'))
        //Check if user has already logged in or not, if not render login modal or else render main page
        if (user === null) {
            this.setState(() => ({
                userLogin: false,
            }))
        } else {
            //initiate socket connection
            SocketService.connect(user._id)
            this.setState({ user })
            this.setState(() => ({
                userLogin: true,
            }))
            this.getInvitations(user.email)
            this.getSendInvitations(user._id)
            this.getFriends(user._id)
            this.getPrivateMessages()
            this.getGroupMessages()
        }
    }

    /**
     * Get user's send invitations which are still pending
     * @param userId user's id
     */
    getSendInvitations = async (userId: string) => {
        const response = await InvitationService.getSendInvitations(userId)

        const { invitations } = this.state
        response.map((item: any) => invitations.push(item))
        this.setState({ invitations })
    }

    /**
     * Subscribe the group messages of user and set the state
     */
    getGroupMessages() {
        const observable = SocketService.onGroupMessage()
        observable.subscribe((m: any) => {
            this.setGroupChatMessages(m.to, m.messages)
        })
    }

    /**
     * Subscribe the private messages of user and set the state
     */
    getPrivateMessages() {
        const observable = SocketService.onPrivateMessage()
        observable.subscribe((m: any) => {
            this.setPrivateChatMessages(m.messages)
        })
    }

    /**
     * Filter the private chat for which the message has received and set the state accordingly
     * @param message
     */
    setPrivateChatMessages = (messages: { from: any; messages: any }) => {
        console.log('setPrivateChatMessages')
        const user = JSON.parse(window.localStorage.getItem('user'))
        this.state.friends.map(item => {
            if (!item.friend.groupCreatedAt) {
                if (
                    item.members.includes(user._id) &&
                    item.members.includes(messages.from._id)
                ) {
                    item.messages.push(messages)
                }
            }
            return null
        })

        const friends = this.state.friends

        this.setState({ friends })
    }

    /**
     * Filter the group chat for which the message has received and set the state accordingly
     * @param groupId
     * @param messages
     */
    setGroupChatMessages = (
        groupId: string,
        messages: { from: Object; message: string },
    ) => {
        this.state.friends.map(item => {
            if (groupId === item.friend._id) {
                item.messages.push(messages)
            }
            return null
        })
        const friends = this.state.friends
        this.setState({ friends })
    }

    /**
     * Get invitations of logged in user
     * @param email
     */
    getInvitations = async (email: string) => {
        const response = await InvitationService.getInvitations(email)
        const { invitations } = this.state
        response.map((item: any) => invitations.push(item))
        this.setState({ invitations })
    }

    /**
     * Get friends of logged in user
     * @param userId
     */
    getFriends = async (userId: any) => {
        const friends = await FriendService.getFriends(userId)
        this.getGroups(userId, friends)
    }

    /**
     * Get user's group
     */
    getGroups = async (userId: any, friends: any) => {
        const groups = await GroupService.getGroups(userId)

        if (groups.length > 0) {
            groups.map((item: any) => {
                friends.push(item)
                SocketService.connectGroupChat(item.friend._id)
                return null
            })
        }

        this.setState({ friends })
    }

    render() {
        const {
            user,
            searchBar,
            ifInvitationExist,
            createMessage,
            newConversation,
            createGroup,
            userLogin,
            showToastMessage,
            toastMessage,
        } = this.state

        const classNames = {
            overlay: style.loginOverlay,
            modal: style.loginModal,
            closeButton: style.loginCloseButton,
            closeIcon: style.loginCloseIcon,
        }
        return (
            <IonApp>
                <IonHeader className={style.header}>
                    <IonRow className={style.userHeader}>
                        <IonCol size="2">
                            <UserHeader
                                user={user}
                                resetStates={this.resetStates}
                            />
                        </IonCol>
                        <IonCol
                            className={`${commonStyle.alignCenter} ion-no-padding`}
                            onClick={() => {
                                this.actions.setCreateMessage(false)
                                this.actions.setCurrentFriend({})
                            }}
                        >
                            <ChatHeader
                                friends={this.state.currentFriend}
                                newConversation={newConversation}
                                actions={this.actions}
                            />
                        </IonCol>
                    </IonRow>
                </IonHeader>
                <IonContent>
                    <IonRow className={commonStyle.height}>
                        <IonCol
                            size="2"
                            className={`${style.roomList} ion-no-padding`}
                        >
                            <StartConversation
                                state={this.state}
                                actions={this.actions}
                            />
                            <FriendsList
                                state={this.state}
                                actions={this.actions}
                            />
                        </IonCol>
                        <IonCol
                            className={`ion-no-padding ${commonStyle.height}`}
                        >
                            {searchBar ? (
                                createGroup ? (
                                    <CreateGroup
                                        state={this.state}
                                        actions={this.actions}
                                    />
                                ) : (
                                    <InviteUser
                                        state={this.state}
                                        actions={this.actions}
                                        getSendInvitations={
                                            this.getSendInvitations
                                        }
                                    />
                                )
                            ) : ifInvitationExist ? (
                                <AcceptInvitation
                                    state={this.state}
                                    actions={this.actions}
                                />
                            ) : (
                                <div className={commonStyle.height}>
                                    {createMessage ? (
                                        <div className={commonStyle.height}>
                                            <MessageList
                                                state={this.state}
                                                setPrivateChatMessages={
                                                    this.setPrivateChatMessages
                                                }
                                            />
                                        </div>
                                    ) : (
                                        <BackgroundScreen />
                                    )}
                                </div>
                            )}
                        </IonCol>
                    </IonRow>
                </IonContent>
                <Modal
                    classNames={classNames}
                    open={!userLogin}
                    onClose={() => {}}
                    center
                >
                    <GoogleLogin
                        clientId={Config.googleClientId}
                        buttonText="Sign in with Google"
                        onSuccess={this.googleLoginResponse}
                        onFailure={this.googleLoginFailure}
                    />
                </Modal>
                <ToastMessages
                    message={toastMessage}
                    showToastMessage={showToastMessage}
                    onDismiss={this.onToastMessageDismiss}
                ></ToastMessages>
            </IonApp>
        )
    }

    /**
     * Set the showToastMessage and toastMessage state variables after toast dismiss
     */
    onToastMessageDismiss() {
        this.setState(() => ({
            showToastMessage: false,
            toastMessage: '',
        }))
    }

    /**
     * Handle google login response, add user to database via API call and also to local storage
     * @param {Object} response
     */
    googleLoginResponse = async (response: any) => {
        try {
            const user = await UserService.googleLogin(response.profileObj)
            window.localStorage.setItem('user', JSON.stringify(user))
            window.location.href = `${Config.appUrl}`
        } catch (e) {
            console.log('e', e)
        }
    }

    /**
     * Handle google login failure
     */
    googleLoginFailure = (error: any) => {
        console.log('TCL: googleLoginFailure -> error', error)
        this.setState(() => ({
            showToastMessage: true,
            toastMessage: 'Something went wrong please try again.',
        }))
    }
}

export default Main
