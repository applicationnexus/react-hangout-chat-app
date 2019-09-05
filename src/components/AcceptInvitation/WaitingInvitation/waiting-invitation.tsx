import React from 'react'
import style from './waiting-invitation.module.scss'
import commonStyle from '../../../styles/common.module.scss'
import { IonRow, IonCol } from '@ionic/react'

export default class WaitingInvitation extends React.Component {
    render() {
        return (
            <div className={style.waitingContainer}>
                <IonRow>
                    <IonCol
                        className={`${commonStyle.alignCenter} ion-text-center`}
                    >
                        <img
                            className={style.waitingImg}
                            src={require('../../../assets/ic-waiting.png')}
                            alt="Not found"
                        />
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol
                        className={`${commonStyle.alignCenter}
                                                 ion-text-center ion-no-padding ${style.processingTitle}`}
                    >
                        <h2>Processing...</h2>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol
                        className={`${commonStyle.alignCenter}
                                                 ion-text-center ion-no-padding`}
                    >
                        Waiting for invitation acceptance
                    </IonCol>
                </IonRow>
            </div>
        )
    }
}
