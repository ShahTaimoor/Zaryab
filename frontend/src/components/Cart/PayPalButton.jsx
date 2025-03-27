import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'

const PayPalButton = ({ onSuccess, amount, onError }) => {
    return (
        <div>
            <PayPalScriptProvider options={{ 'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID }} >

                <PayPalButtons style={{ layout: 'vertical' }}>
                    createOrder = {(data, action) => {
                        return action.order.create({
                            purchase_units: [{ amount: { value: amount } }]
                        })
                    }}
                    onApprove = {(data, actions) => {
                        return actions.order.capture().then(onSuccess)
                    }}
                    onError={onError}
                </PayPalButtons>
            </PayPalScriptProvider>

        </div>
    )
}

export default PayPalButton