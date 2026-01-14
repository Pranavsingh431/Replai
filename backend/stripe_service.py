import stripe
from config import settings
from typing import Dict, Optional

# Initialize Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY if settings.STRIPE_SECRET_KEY else "sk_test_placeholder"

# Product configurations
PRODUCTS = {
    "20_credits": {
        "name": "20 Reply Credits",
        "credits": 20,
        "amount": 9900,  # ₹99 in paise
        "currency": "inr",
        "description": "20 AI-powered reply generations"
    },
    "100_credits": {
        "name": "100 Reply Credits",
        "credits": 100,
        "amount": 39900,  # ₹399 in paise
        "currency": "inr",
        "description": "100 AI-powered reply generations"
    },
    "unlimited_7d": {
        "name": "Unlimited 7 Days",
        "credits": 1000,  # Give 1000 credits (effectively unlimited for 7 days)
        "amount": 69900,  # ₹699 in paise
        "currency": "inr",
        "description": "Unlimited replies for 7 days"
    }
}

class StripeService:
    """Handle Stripe payment operations"""
    
    @staticmethod
    def create_checkout_session(
        user_id: int,
        user_email: str,
        product_type: str,
        success_url: str,
        cancel_url: str
    ) -> Dict:
        """
        Create a Stripe checkout session for purchasing credits
        """
        if product_type not in PRODUCTS:
            raise ValueError(f"Invalid product type: {product_type}")
        
        product = PRODUCTS[product_type]
        
        try:
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': product['currency'],
                        'unit_amount': product['amount'],
                        'product_data': {
                            'name': product['name'],
                            'description': product['description'],
                        },
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=success_url,
                cancel_url=cancel_url,
                customer_email=user_email,
                client_reference_id=str(user_id),
                metadata={
                    'user_id': str(user_id),
                    'product_type': product_type,
                    'credits': str(product['credits'])
                }
            )
            
            return {
                'session_id': session.id,
                'checkout_url': session.url
            }
        except stripe.error.StripeError as e:
            raise Exception(f"Stripe error: {str(e)}")
    
    @staticmethod
    def construct_webhook_event(payload: bytes, sig_header: str) -> stripe.Event:
        """
        Verify and construct a Stripe webhook event
        """
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
            return event
        except ValueError as e:
            raise ValueError("Invalid payload")
        except stripe.error.SignatureVerificationError as e:
            raise ValueError("Invalid signature")
    
    @staticmethod
    def get_product_info(product_type: str) -> Optional[Dict]:
        """Get product information"""
        return PRODUCTS.get(product_type)
    
    @staticmethod
    def create_customer(email: str, user_id: int) -> str:
        """Create a Stripe customer"""
        try:
            customer = stripe.Customer.create(
                email=email,
                metadata={'user_id': str(user_id)}
            )
            return customer.id
        except stripe.error.StripeError as e:
            raise Exception(f"Failed to create customer: {str(e)}")

stripe_service = StripeService()
