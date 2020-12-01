import axios from 'axios';
import Noty from 'noty';
import { loadStripe } from '@stripe/stripe-js';

export async function initStripe() {

    const stripe = await loadStripe('pk_test_51HiatODQf8KGCCucnmhDalmETu8Bt1KfmqpAhDCg8AecDLwLxXHLy3AN4nrBwS9CATdv0dcNpr9WBuPGqH7f3Xvd00LrVHipa4');

    let card = null;

    function mountWidget() {
        const elements = stripe.elements();

        let style = {
            base: {
                color: '#32325d',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        };


        card = elements.create('card', { style, hidePostalCode: true });
        card.mount('#card-element');

    }

    const paymentType = document.querySelector('#paymentType');
    if (!paymentType) {
        return;
    }

    paymentType.addEventListener('change', (e) => {
        console.log(e.target.value);
        if (e.target.value === 'card') {
            // Display Widget
            mountWidget()
        } else {
            card.destroy();
        }
    });


    // Ajax Call
    const paymentForm = document.querySelector('#payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let formData = new FormData(paymentForm);
            let formObject = {};

            for (let [key, value] of formData.entries()) {
                formObject[key] = value;
            }


            // if(!card){

            // }
            // Verify Card
            stripe.createToken(card).then((result) => {
                console.log(result);
            }).catch((err) => {
                console.log(err);
            })


            axios.post('/orders', formObject).then((res) => {
                new Noty({
                    type: 'success',
                    timeout: 1000,
                    text: res.data.message,
                    progressBar: false,
                }).show();
                setTimeout(() => {
                    window.location.href = '/customer/orders';
                }, 1000)
            }).catch((err) => {
                new Noty({
                    type: 'success',
                    timeout: 1000,
                    text: err.res.data.message,
                    progressBar: false,
                }).show();
            })
            console.log(formObject);
        })
    }
}