# -*- coding: utf-8 -*-
"""
Clean Razorpay payment integration.
No database calls, no auth logic, no legacy dependencies.
Payment creation ONLY.
"""

import razorpay
import time
import os
from typing import Dict, Any


# Pricing plans in paise (1 INR = 100 paise)
PLANS = {
    "small": {
        "amount": 9900,  # Rs 99
        "credits": 20,
        "name": "Small Pack",
        "description": "20 AI replies"
    },
    "medium": {
        "amount": 19900,  # Rs 199
        "credits": 100,
        "name": "Medium Pack",
        "description": "100 AI replies"
    },
    "large": {
        "amount": 39900,  # Rs 399
        "credits": 700,
        "name": "Large Pack",
        "description": "Unlimited credits for 7 days"
    }
}


class RazorpayClient:
    """Isolated Razorpay client for order creation."""
    
    def __init__(self):
        """Initialize Razorpay client with API credentials from environment."""
        key_id = os.getenv("RAZORPAY_KEY_ID")
        key_secret = os.getenv("RAZORPAY_KEY_SECRET")
        
        if not key_id or not key_secret:
            raise ValueError("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in environment")
        
        self.client = razorpay.Client(auth=(key_id, key_secret))
        self.key_id = key_id
    
    def create_order(self, plan: str) -> Dict[str, Any]:
        """
        Create a Razorpay order for the given plan.
        
        Args:
            plan: Plan type ("small", "medium", or "large")
        
        Returns:
            Dictionary with order_id, amount, currency, and razorpay_key_id
        
        Raises:
            ValueError: If plan is invalid or order creation fails
        """
        # Validate plan
        if plan not in PLANS:
            raise ValueError(f"Invalid plan: {plan}. Must be one of: {list(PLANS.keys())}")
        
        plan_data = PLANS[plan]
        
        # Generate short receipt (max 40 chars)
        receipt = f"replai_{int(time.time())}"
        
        # Prepare order data
        order_data = {
            "amount": plan_data["amount"],
            "currency": "INR",
            "receipt": receipt,
            "payment_capture": 1  # Auto-capture payment
        }
        
        try:
            # Create order with Razorpay
            order = self.client.order.create(data=order_data)
            
            return {
                "order_id": order["id"],
                "amount": plan_data["amount"],
                "currency": "INR",
                "razorpay_key_id": self.key_id,
                "name": plan_data["name"],
                "description": plan_data["description"]
            }
        
        except razorpay.errors.BadRequestError as e:
            raise ValueError(f"Invalid request to Razorpay: {str(e)}")
        except razorpay.errors.GatewayError as e:
            raise ValueError(f"Razorpay gateway error: {str(e)}")
        except razorpay.errors.ServerError as e:
            raise ValueError(f"Razorpay server error: {str(e)}")
        except Exception as e:
            raise ValueError(f"Failed to create Razorpay order: {str(e)}")


# Global instance
_razorpay_client = None


def get_razorpay_client() -> RazorpayClient:
    """Get or create Razorpay client instance."""
    global _razorpay_client
    if _razorpay_client is None:
        _razorpay_client = RazorpayClient()
    return _razorpay_client
