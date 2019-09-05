import React from 'react'
import style from './invite-list.module.scss'
import commonStyle from '../../../styles/common.module.scss'
import { IonRow, IonCol } from '@ionic/react'
import Invitations from '../../../models/invitations'

interface Props {
    state: {
        invitations?: Array<Invitations>
        searchBar?: boolean
        invitationDetails?: Invitations
    }
    actions: {
        showInvitationExist(status: boolean): void
        showInvitationDetails(invitationDetails: Invitations): void
        showSearchBar(searchBar: boolean): void
    }
}

export default class InviteList extends React.Component<Props, {}> {
    render() {
        const { invitations, searchBar } = this.props.state
        const { actions } = this.props
        return (
            <div>
                {invitations.length > 0 ? (
                    invitations.map((invite: any, index: number) => (
                        <IonRow
                            onClick={() => {
                                searchBar
                                    ? actions.showSearchBar(!searchBar)
                                    : actions.showSearchBar(searchBar)
                                actions.showInvitationExist(true)
                                actions.showInvitationDetails(invite)
                            }}
                            className={style.userRow}
                            key={index}
                        >
                            <IonCol size="2" className="ion-no-padding">
                                <img
                                    className={style.userImage}
                                    src={invite.from.picture}
                                    alt="Not found"
                                />
                            </IonCol>
                            <IonCol className={commonStyle.alignCenter}>
                                {invite.from.name}
                            </IonCol>
                        </IonRow>
                    ))
                ) : (
                    <span />
                )}
            </div>
        )
    }
}
