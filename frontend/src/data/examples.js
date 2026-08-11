export const EXAMPLE_EMAILS = [
  {
    id: 'promo',
    title: 'Promotional Email',
    type: 'spam',
    badge: 'Marketing',
    content: `CONGRATULATIONS! You have been selected as our exclusive 100th visitor today! 

Claim your FREE $500 Amazon Gift Card immediately. No catch, 100% guaranteed reward.

Click the link below right now to verify your details:
http://bit.ly/claim-free-reward-9921

Act fast! Offer expires in 15 minutes!`
  },
  {
    id: 'suspicious',
    title: 'Suspicious Message',
    type: 'spam',
    badge: 'Phishing Alert',
    content: `URGENT SECURITY NOTICE: Your PayPal Account Has Been Suspended!

Dear Customer,

We detected an unauthorized login attempt on your account from an unknown IP address. To prevent permanent lock, you must immediately confirm your account credentials and SSN.

Please verify your identity here: https://paypal-secure-verify-auth.net/login

Failure to verify within 24 hours will result in permanent account termination.`
  },
  {
    id: 'normal',
    title: 'Normal Email',
    type: 'not_spam',
    badge: 'Legitimate',
    content: `Hi Sarah,

Hope you're having a great week!

Quick reminder that our quarterly project review meeting is scheduled for tomorrow, Thursday at 10:00 AM in Conference Room B. 

I've attached the draft presentation slides for your review. Please let me know if you'd like to adjust any agenda items before the meeting.

Best regards,
Alex Smith
Senior Product Lead`
  }
];
