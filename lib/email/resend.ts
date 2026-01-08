import { Resend } from 'resend';

// Lazy-initialize Resend client to avoid build-time errors
let resend: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

// Admin notification email
const ADMIN_EMAIL = 'smaartreading@gmail.com';
const FROM_EMAIL = 'Clearr Vision <noreply@send.smaartreading.com>'; // Verified domain

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity?: string | null;
  customerArea?: string | null;
  deliveryLocation?: string | null;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    variant?: { color?: string; power?: string };
  }>;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: string;
  createdAt: string;
}

function formatCurrency(amount: number): string {
  return `৳${amount.toLocaleString('en-BD')}`;
}

function generateOrderEmailHtml(data: OrderEmailData): string {
  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <strong>${item.name}</strong>
          ${item.variant?.color ? `<br><small>Color: ${item.variant.color}</small>` : ''}
          ${item.variant?.power ? `<br><small>Power: ${item.variant.power}</small>` : ''}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.price * item.quantity)}</td>
      </tr>
    `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order - ${data.orderNumber}</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: #fff; margin: 0; font-size: 24px;">🛒 New Order Received!</h1>
    <p style="color: #a0aec0; margin: 10px 0 0 0;">Clearr Vision</p>
  </div>

  <div style="background: #fff; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    <div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 25px; border-radius: 0 8px 8px 0;">
      <h2 style="margin: 0 0 5px 0; color: #1e40af; font-size: 18px;">Order #${data.orderNumber}</h2>
      <p style="margin: 0; color: #64748b; font-size: 14px;">${new Date(data.createdAt).toLocaleString('en-BD', { dateStyle: 'full', timeStyle: 'short' })}</p>
    </div>

    <h3 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 25px;">👤 Customer Information</h3>
    <table style="width: 100%; margin-bottom: 20px;">
      <tr>
        <td style="padding: 8px 0; color: #64748b; width: 120px;">Name:</td>
        <td style="padding: 8px 0; font-weight: 600;">${data.customerName}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b;">Phone:</td>
        <td style="padding: 8px 0;"><a href="tel:${data.customerPhone}" style="color: #3b82f6; text-decoration: none; font-weight: 600;">${data.customerPhone}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; vertical-align: top;">Address:</td>
        <td style="padding: 8px 0;">
          ${data.customerAddress}
          ${data.customerArea ? `<br>${data.customerArea}` : ''}
          ${data.customerCity ? `<br>${data.customerCity}` : ''}
        </td>
      </tr>
      ${data.deliveryLocation ? `
      <tr>
        <td style="padding: 8px 0; color: #64748b;">Delivery Zone:</td>
        <td style="padding: 8px 0;">${data.deliveryLocation === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}</td>
      </tr>
      ` : ''}
    </table>

    <h3 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 25px;">📦 Order Items</h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <thead>
        <tr style="background: #f8fafc;">
          <th style="padding: 12px; text-align: left; color: #64748b; font-weight: 600;">Item</th>
          <th style="padding: 12px; text-align: center; color: #64748b; font-weight: 600;">Qty</th>
          <th style="padding: 12px; text-align: right; color: #64748b; font-weight: 600;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 20px;">
      <table style="width: 100%;">
        <tr>
          <td style="padding: 5px 0; color: #64748b;">Subtotal:</td>
          <td style="padding: 5px 0; text-align: right;">${formatCurrency(data.subtotal)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #64748b;">Delivery Charge:</td>
          <td style="padding: 5px 0; text-align: right;">${formatCurrency(data.deliveryCharge)}</td>
        </tr>
        <tr style="font-size: 18px; font-weight: bold;">
          <td style="padding: 15px 0 5px 0; color: #1e293b; border-top: 2px solid #e2e8f0;">Total:</td>
          <td style="padding: 15px 0 5px 0; text-align: right; color: #16a34a; border-top: 2px solid #e2e8f0;">${formatCurrency(data.total)}</td>
        </tr>
      </table>
    </div>

    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-top: 25px; border-radius: 0 8px 8px 0;">
      <p style="margin: 0; color: #92400e; font-weight: 600;">💳 Payment Method: ${data.paymentMethod.toUpperCase()}</p>
    </div>

    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
      <p style="color: #64748b; font-size: 14px; margin: 0;">This is an automated notification from Clearr Vision</p>
    </div>
  </div>
</body>
</html>
  `;
}

export async function sendOrderNotificationEmail(orderData: OrderEmailData): Promise<{ success: boolean; error?: string }> {
  // Get the Resend client (lazily initialized)
  const client = getResendClient();

  if (!client) {
    console.error('[Email] RESEND_API_KEY not configured. Cannot send email notification.');
    console.error('[Email] Please add RESEND_API_KEY to your environment variables.');
    return { success: false, error: 'Email service not configured - missing RESEND_API_KEY' };
  }

  console.log('[Email] Attempting to send order notification email...');
  console.log('[Email] From:', FROM_EMAIL);
  console.log('[Email] To:', ADMIN_EMAIL);
  console.log('[Email] Order:', orderData.orderNumber);

  try {
    const { data, error } = await client.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject: `🛒 New Order #${orderData.orderNumber} - ${orderData.customerName}`,
      html: generateOrderEmailHtml(orderData),
    });

    if (error) {
      console.error('[Email] Resend API error:', JSON.stringify(error, null, 2));
      return { success: false, error: error.message };
    }

    console.log('[Email] Email sent successfully! ID:', data?.id);
    return { success: true };
  } catch (error) {
    console.error('[Email] Exception while sending email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
