import React from 'react'
import { IonRow, IonCol, IonIcon, IonInput } from '@ionic/react'
import style from './invite-user.module.scss'
import commonStyle from '../../styles/common.module.scss'
import InvitationService from '../../services/InvitationService/invitation.service'
import User from '../../models/user'
import Friend from '../../models/friends'
import ToastMessages from '../ToastMessage/toast-message'

interface Props {
    state: {
        user: User
        friends: Array<Friend>
    }
    actions: {
        setCreateGroupStatus(status: boolean): void
        setCreateMessage(status: boolean): void
        showSearchBar(status: boolean): void
        setCurrentFriend(friend: any): void
        setNewConversation(status: boolean): void
    }
    getSendInvitations: any
}

interface State {
    isFocused: boolean
    showToastMessage: boolean
}

export default class InviteUser extends React.Component<Props, State> {
    searchbar = React.createRef<HTMLIonInputElement>()
    state = {
        isFocused: true,
        showToastMessage: false,
    }
    email: string = ''

    /**
     * Set focus to searchbar on component load
     */
    componentDidMount() {
        const searchbar = this.searchbar.current
        searchbar.setFocus()
    }

    /**
     * Toggle focus state (focus/blur)
     */
    toggleFocusState = () => {
        this.setState(prevState => ({ isFocused: !prevState.isFocused }))
    }

    /**
     * Get classnames according to focus or blur state of searchbar
     */
    getClassNames() {
        return this.state.isFocused ? `${style.blur}` : `${style.focus}`
    }

    /**
     * Set the showToastMessage state variable to false after toast dismiss
     */
    onToastMessageDismiss = () => {
        this.setState(() => ({
            showToastMessage: false,
        }))
    }

    render() {
        const { friends } = this.props.state
        const { actions } = this.props
        const { showToastMessage } = this.state

        return (
            <div>
                <ToastMessages
                    message="Please enter email"
                    showToastMessage={showToastMessage}
                    onDismiss={this.onToastMessageDismiss}
                ></ToastMessages>
                <IonRow className={this.getClassNames()}>
                    <IonCol
                        size="1"
                        className={`${style.searchIconCol} ion-text-center`}
                    >
                        <IonIcon name="search" />
                    </IonCol>
                    <IonCol size="9">
                        <IonInput
                            placeholder="Enter email"
                            onIonChange={this.getInputValue}
                            className={style.searchbar}
                            ref={this.searchbar}
                            onIonFocus={this.toggleFocusState}
                            onIonBlur={this.toggleFocusState}
                        />
                    </IonCol>
                    <IonCol
                        onClick={() => {
                            this.sendInviteRequest()
                        }}
                        size="2"
                        className={`${style.checkmarkIcon}  ion-text-center`}
                    >
                        <IonIcon name="checkmark" />
                    </IonCol>
                </IonRow>
                <IonRow
                    className={style.groupRow}
                    onClick={() => {
                        actions.setCreateGroupStatus(true)
                    }}
                >
                    <IonCol size="1" className="ion-text-center ion-no-padding">
                        <IonIcon name="people" className={style.iconPeople} />
                    </IonCol>
                    <IonCol>New Group</IonCol>
                </IonRow>
                {friends.length > 0
                    ? friends.map((friend: any, index: any) => (
                          <IonRow
                              onClick={async () => {
                                  actions.setCreateMessage(true)
                                  actions.showSearchBar(false)
                                  await actions.setCurrentFriend(friend)
                                  actions.setNewConversation(false)
                              }}
                              key={index}
                          >
                              {friend.friend.groupCreatedAt ? (
                                  <IonCol
                                      size="1"
                                      className={`${style.peopleIconCol} ${commonStyle.alignCenter}
                                          ion-text-center ion-no-padding`}
                                  >
                                      <IonIcon
                                          name="ios-people"
                                          className={
                                              style.peopleIcon + ' ion-padding'
                                          }
                                      />
                                  </IonCol>
                              ) : (
                                  <IonCol
                                      size="1"
                                      className={`${commonStyle.alignCenter} ion-text-center ion-no-padding`}
                                  >
                                      {friend.friend.picture ? (
                                          <img
                                              className={style.userImage}
                                              src={friend.friend.picture}
                                              alt="Not found"
                                          />
                                      ) : (
                                          <img
                                              className={style.userImage}
                                              src={require('../../assets/user.png')}
                                              alt="Not found"
                                          />
                                      )}
                                  </IonCol>
                              )}

                              <IonCol
                                  className={`${commonStyle.alignCenter} ion-no-padding`}
                              >
                                  {friend.friend.name}
                              </IonCol>
                          </IonRow>
                      ))
                    : ''}
            </div>
        )
    }

    /**
     * Get input value
     * @param event input field event
     */
    getInputValue = (event: any) => {
        this.email = event.target.value
    }

    /**
     * Send invite request
     */
    sendInviteRequest = async () => {
        try {
            if (this.email === '') {
                this.setState(() => ({
                    showToastMessage: true,
                }))
            } else {
                const { user } = this.props.state
                const { actions } = this.props
                const body = {
                    to: this.email,
                    from: user._id,
                    senderName: user.name,
                }
                await InvitationService.sendInvitation(body)
                actions.showSearchBar(false)
                actions.setNewConversation(false)
                this.props.getSendInvitations(user._id)
            }
        } catch (e) {
            console.log('e', e)
        }
    }
}
