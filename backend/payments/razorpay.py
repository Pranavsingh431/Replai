"""
Clean, isolated Razorpay payment integration.
No database, no auth, no Supabase - pure payment logic only.
"""
import razorpay
import time
from typing import Dict

# Import settings to get Razorpay credentials
try:
    from config import settings
    RAZORPAY_KEY_ID = settings.RAZORPAY_KEY_ID
    RAZORPAY_KEY_SECRET = settings.RAZORPAY_KEY_SECRET
except ImportError:
    import os
    RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "")
    RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")

if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
    print("Warning: Razorpay credentials not configured")
    razorpay_client = None
else:
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
    print(f"✅ Razorpay client initialized with key: {RAZORPAY_KEY_ID[:10]}...")

# Pricing plans (amounts in paise)
PLANS = {
    "small": {
        "amount": 9900,  # ₹99
        "credits": 20,
        "name": "Small Pack"
    },
    "medium": {
        "amount": 19900,  # ₹199
        "credits": 50,
        "name": "Medium Pack"
    },
    "large": {
        "amount": 39900,  # ₹399
        "credits": 100,
        "name": "Large Pack"
    }
}


def create_order(plan: str) -> Dict:
    """
    Create a Razorpay order.
    
    Args:
        plan: Plan ID (small, medium, large)
        
    Returns:
        dict with order_id, amount, currency, key_id
        
    Raises:
        ValueError: If plan is invalid or Razorpay fails
    """
    if not razorpay_client:
        raise ValueError("Razorpay not configured")
    
    if plan not in PLANS:
        raise ValueError(f"Invalid plan: {plan}. Must be one of: {', '.join(PLANS.keys())}")
    
    plan_data = PLANS[plan]
    amount = plan_data["amount"]
    
    # Generate short receipt (max 40 chars)
    receipt = f"replai_{int(time.time())}"
    
    order_data = {
        "amount": amount,
        "currency": "INR",
        "receipt": receipt,
        "payment_capture": 1
    }
    
    try:
        order = razorpay_client.order.create(order_data)
        
        return {
            "order_id": order["id"],
            "amount": amount,
            "currency": "INR",
            "razorpay_key_id": RAZORPAY_KEY_ID,
            "plan": plan,
            "credits": plan_data["credits"],
            "name": plan_data["name"]
        }
    except Exception as e:
        raise ValueError(f"Razorpay order creation failed: {str(e)}")


def verify_payment_signature(order_id: str, payment_id: str, signature: str) -> bool:
    """
    Verify Razorpay payment signature.
    
    Args:
        order_id: Razorpay order ID
        payment_id: Razorpay payment ID
        signature: Payment signature from Razorpay
        
    Returns:
        True if signature is valid, False otherwise
    """
    if not razorpay_client:
        return False
    
    try:
        params_dict = {
            'razorpay_order_id': order_id,
            'razorpay_payment_id': payment_id,
            'razorpay_signature': signature
        }
        razorpay_client.utility.verify_payment_signature(params_dict)
        return True
    except:
        return False
