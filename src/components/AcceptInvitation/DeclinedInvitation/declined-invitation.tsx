import React from 'react'
import commonStyle from '../../../styles/common.module.scss'
import style from './/declined-invitation.module.scss'

import { IonRow, IonCol } from '@ionic/react'

export default class DeclinedInvitation extends React.Component {
    render() {
        return (
            <div className={style.declinedContainer}>
                <IonRow>
                    <IonCol
                        className={`${commonStyle.alignCenter} ion-text-center`}
                    >
                        <img
                            className={style.declinedImg}
                            src={require('../../../assets/ic-declined.png')}
                            alt="Not found"
                        />
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol
                        className={`${commonStyle.alignCenter}
                                          ion-text-center ion-no-padding ${style.sorryTitle}`}
                    >
                        <h2>Sorry!</h2>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol
                        className={`${commonStyle.alignCenter}
                                          ion-text-center ion-no-padding`}
                    >
                        Looks like the user has declined your <br />
                        invitation request.
                    </IonCol>
                </IonRow>
            </div>
        )
    }
}
