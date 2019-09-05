import React from 'react'
import { IonRow, IonCol, IonIcon, IonInput } from '@ionic/react'
import style from './create-group.module.scss'
import commonStyle from '../../styles/common.module.scss'
import Select from 'react-select'
import GroupService from '../../services/GroupService/group.service'
import SocketService from '../../services/SocketService/socket-service'
import User from '../../models/user'
import Friend from '../../models/friends'
import ToastMessage from '../ToastMessage/toast-message'

interface State {
    isEmailFocused: boolean
    isGroupNameFocused: boolean
    selectedOption: null
    friends: any
    showToastMessage: boolean
}

interface Props {
    state: {
        user: User
        friends: Array<Friend>
    }
    actions: {
        showSearchBar(searchBar: boolean): void
        setNewConversation(newConversation: boolean): void
        setCreateGroupStatus(createGroup: boolean): void
        setFriends(friends: any): void
    }
}

export default class CreateGroup extends React.Component<Props, State> {
    state = {
        isEmailFocused: true,
        isGroupNameFocused: false,
        selectedOption: null,
        friends: [],
        showToastMessage: false,
    }
    groupName: string = ''

    componentDidMount() {
        const { friends } = this.props.state
        const filterFriends = []
        friends.map((item: any) => {
            if (!item.friend.groupCreatedAt) {
                filterFriends.push({
                    value: item.friend.id,
                    label: item.friend.name,
                })
            }
            return null
        })

        this.setState(() => ({
            friends: filterFriends,
        }))
    }

    /**
     * Handle change event of selecting members for adding in group chat
     */
    selectMembers = (selectedOption: any) => {
        this.setState({ selectedOption })
    }

    /**
     * Set the email field input to focus state and group name field input to blur
     */
    toggleEmailFocusState = () => {
        this.setState(() => ({
            isEmailFocused: true,
        }))
        this.setState(() => ({
            isGroupNameFocused: false,
        }))
    }

    /**
     * Set the group name field input to focus state and email field input to blur
     */
    toggleGroupNameFocusState = () => {
        this.setState(() => ({
            isEmailFocused: false,
        }))
        this.setState(() => ({
            isGroupNameFocused: true,
        }))
    }

    /**
     * Set the group name field input to blur state
     */
    toggleGroupNameBlurState = () => {
        this.setState(() => ({
            isGroupNameFocused: false,
        }))
    }

    /**
     * Set the email field input to blur state
     */
    toggleEmailBlurState = () => {
        this.setState(() => ({
            isEmailFocused: false,
        }))
    }

    /**
     * Set classes for group name input or email field input according to its focus state(focus/blur)
     * @param type group/email
     */
    getClassNames(type: string) {
        if (type === 'group') {
            return this.state.isGroupNameFocused ? style.focus : style.blur
        } else {
            return this.state.isEmailFocused ? style.focus : style.blur
        }
    }

    /**
     * Set group name
     */
    setGroupName = (event: any) => {
        this.groupName = event.target.value
    }

    /**
     * Create group by making an API call
     */
    createGroup = async () => {
        if (this.groupName !== '') {
            const { user, friends } = this.props.state
            const members = [user._id]
            this.state.selectedOption.map(
                (item: { label: string; value: string }) =>
                    members.push(item.value),
            )
            const group = {
                members: members,
                name: this.groupName,
            }

            const response = await GroupService.createGroup(group)

            const data = {
                friend: {
                    _id: response._id,
                    name: response.name,
                    groupCreatedAt: response.groupCreatedAt,
                },
                members: response.members,
                messages: response.messages,
            }

            this.props.actions.showSearchBar(false)
            this.props.actions.setNewConversation(false)
            this.props.actions.setCreateGroupStatus(false)
            friends.push(data)
            this.props.actions.setFriends(friends)
            SocketService.connectGroupChat(response._id)
        } else {
            //If group name is not added then set the showToastMessage state variable to true to show the toast message.
            this.setState(() => ({
                showToastMessage: true,
            }))
        }
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
        const { selectedOption, showToastMessage } = this.state

        return (
            <div>
                <ToastMessage
                    message="Please enter group name"
                    showToastMessage={showToastMessage}
                    onDismiss={this.onToastMessageDismiss}
                ></ToastMessage>
                <IonRow className={this.getClassNames('group')}>
                    <IonCol
                        sizeLg="1"
                        className={`${commonStyle.alignCenter} ion-text-center`}
                    >
                        <IonIcon name="people" className={style.peopleIcon} />
                    </IonCol>
                    <IonCol>
                        <IonInput
                            onIonFocus={this.toggleGroupNameFocusState}
                            onIonBlur={this.toggleGroupNameBlurState}
                            placeholder="Name your group"
                            onIonChange={this.setGroupName}
                        />
                    </IonCol>
                </IonRow>
                <IonRow className={this.getClassNames('email')}>
                    <IonCol
                        sizeLg="1"
                        className={`${commonStyle.alignCenter} ion-text-center`}
                    >
                        <IonIcon name="search" className={style.searchIcon} />
                    </IonCol>
                    <IonCol>
                        <Select
                            value={selectedOption}
                            onChange={this.selectMembers}
                            options={this.state.friends}
                            classNamePrefix={style.options}
                            isMulti={true}
                            autoFocus={true}
                            onBlur={this.toggleEmailBlurState}
                            onFocus={this.toggleEmailFocusState}
                            placeholder="Enter name"
                            closeMenuOnSelect={false}
                            blurInputOnSelect={false}
                            defaultMenuIsOpen={true}
                            isSearchable={true}
                        />
                    </IonCol>
                    {selectedOption !== null ? (
                        <IonCol
                            size="1"
                            className={`${style.checkmarkIcon} ion-no-padding ion-text-center`}
                            onClick={this.createGroup}
                        >
                            <IonIcon name="checkmark" />
                        </IonCol>
                    ) : (
                        <span />
                    )}
                </IonRow>
            </div>
        )
    }
}
