import React from 'react'
import commonStyle from '../../styles/common.module.scss'
import User from '../../models/user'
import { IonRow, IonCol, IonIcon, IonAlert } from '@ionic/react'

interface Props {
    user: User
    resetStates: any
}

interface State {
    alertStatus: boolean
}

export default class UserHeader extends React.Component<Props, State> {
    state = {
        alertStatus: false,
    }

    /**
     * Show or hide alert
     */
    showAlert = (status: boolean) => {
        this.setState(() => ({
            alertStatus: status,
        }))
    }

    render() {
        const { user } = this.props
        const { alertStatus } = this.state
        return (
            <div>
                {user.name ? (
                    <IonRow>
                        <IonCol size="1" onClick={() => this.showAlert(true)}>
                            <IonIcon
                                className={commonStyle.customWhiteColor}
                                name="exit"
                            ></IonIcon>
                        </IonCol>
                        <IonCol>
                            <span
                                className={`${commonStyle.customWhiteColor} ion-padding-start`}
                            >
                                {user.name}
                            </span>
                        </IonCol>
                        <IonAlert
                            isOpen={alertStatus}
                            onDidDismiss={() => this.showAlert(false)}
                            header={'Logout'}
                            message={'Are you sure you want to logout?'}
                            buttons={[
                                {
                                    text: 'Cancel',
                                    role: 'cancel',
                                    cssClass: 'secondary',
                                },
                                {
                                    text: 'Okay',
                                    handler: () => {
                                        window.localStorage.clear()
                                        this.props.resetStates()
                                        window.location.reload()
                                    },
                                },
                            ]}
                        />
                    </IonRow>
                ) : (
                    ''
                )}
            </div>
        )
    }
}
