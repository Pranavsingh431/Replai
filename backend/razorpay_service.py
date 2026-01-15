import razorpay
import hmac
import hashlib
import time
from config import settings

class RazorpayService:
    def __init__(self):
        self.client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        
        # Pricing in paise (1 INR = 100 paise)
        self.PRICING = {
            "small": {
                "amount": 9900,  # ₹99
                "credits": 20,
                "name": "Small Pack",
                "description": "20 AI replies"
            },
            "medium": {
                "amount": 39900,  # ₹399
                "credits": 100,
                "name": "Medium Pack",
                "description": "100 AI replies"
            },
            "weekly": {
                "amount": 69900,  # ₹699
                "credits": -1,  # Unlimited
                "name": "Weekly Unlimited",
                "description": "Unlimited replies for 7 days"
            }
        }
    
    def create_order(self, plan: str, user_id: int):
        """Create a Razorpay order"""
        if plan not in self.PRICING:
            raise ValueError(f"Invalid plan: {plan}")
        
        pricing = self.PRICING[plan]
        
        # Generate short receipt (max 40 chars - Razorpay requirement)
        # Format: replai_<timestamp> (e.g., replai_1736611234)
        receipt = f"replai_{int(time.time())}"
        
        order_data = {
            "amount": pricing["amount"],
            "currency": "INR",
            "receipt": receipt,
            "payment_capture": 1,  # Auto-capture payment
            "notes": {
                "user_id": str(user_id),
                "plan": plan,
                "credits": str(pricing["credits"])
            }
        }
        
        try:
            order = self.client.order.create(data=order_data)
            return {
                "order_id": order["id"],
                "amount": pricing["amount"],
                "currency": "INR",
                "name": pricing["name"],
                "description": pricing["description"],
                "credits": pricing["credits"]
            }
        except Exception as e:
            # Raise a clear error if Razorpay order creation fails
            raise ValueError(f"Failed to create Razorpay order: {str(e)}")
    
    def verify_payment_signature(self, order_id: str, payment_id: str, signature: str) -> bool:
        """Verify Razorpay payment signature"""
        try:
            # Generate expected signature
            message = f"{order_id}|{payment_id}"
            expected_signature = hmac.new(
                settings.RAZORPAY_KEY_SECRET.encode(),
                message.encode(),
                hashlib.sha256
            ).hexdigest()
            
            return hmac.compare_digest(expected_signature, signature)
        except Exception as e:
            print(f"Signature verification failed: {e}")
            return False
    
    def verify_webhook_signature(self, payload: bytes, signature: str) -> bool:
        """Verify Razorpay webhook signature"""
        if not settings.RAZORPAY_WEBHOOK_SECRET:
            print("Warning: RAZORPAY_WEBHOOK_SECRET not set")
            return False
        
        try:
            expected_signature = hmac.new(
                settings.RAZORPAY_WEBHOOK_SECRET.encode(),
                payload,
                hashlib.sha256
            ).hexdigest()
            
            return hmac.compare_digest(expected_signature, signature)
        except Exception as e:
            print(f"Webhook signature verification failed: {e}")
            return False
    
    def get_pricing(self):
        """Get all pricing plans"""
        return {
            plan: {
                "amount": data["amount"],
                "amount_inr": data["amount"] / 100,  # Convert paise to rupees
                "credits": data["credits"],
                "name": data["name"],
                "description": data["description"]
            }
            for plan, data in self.PRICING.items()
        }

razorpay_service = RazorpayService()
