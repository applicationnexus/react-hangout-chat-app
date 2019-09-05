import React from 'react'
import style from './start-conversation.module.scss'
import commonStyle from '../../styles/common.module.scss'
import { IonCol, IonRow, IonIcon } from '@ionic/react'

interface Props {
    state: {
        searchBar: boolean
    }
    actions: {
        joinRoom(room: any): void
        showSearchBar(searchBar: boolean): void
        setNewConversation(newConversation: boolean): void
        setCreateGroupStatus(createGroup: boolean): void
    }
}

export default class StartConversation extends React.Component<Props, {}> {
    render() {
        const { state, actions } = this.props
        return (
            <IonRow
                className={style.conversation}
                onClick={async () => {
                    actions.joinRoom({})
                    if (state.searchBar) {
                        actions.showSearchBar(false)
                        actions.setNewConversation(false)
                        actions.setCreateGroupStatus(false)
                    } else {
                        actions.showSearchBar(true)
                        actions.setNewConversation(true)
                    }
                }}
            >
                <IonCol size="2" className="ion-no-padding">
                    <IonIcon name="add-circle" className={style.circleIcon} />
                </IonCol>
                <IonCol className={`${commonStyle.alignCenter} ion-no-padding`}>
                    New Conversion
                </IonCol>
            </IonRow>
        )
    }
}
