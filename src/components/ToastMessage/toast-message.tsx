import React from 'react'
import { IonToast } from '@ionic/react'

interface Props {
    message: string
    showToastMessage: boolean
    onDismiss(): void
}

export default class ToastMessages extends React.Component<Props> {
    //Call dismiss function after toast message dismiss
    setShowToast1 = () => {
        this.props.onDismiss()
    }

    render() {
        return (
            <IonToast
                isOpen={this.props.showToastMessage}
                onDidDismiss={() => this.setShowToast1()}
                message={this.props.message}
                duration={500}
                animated={true}
            ></IonToast>
        )
    }
}
