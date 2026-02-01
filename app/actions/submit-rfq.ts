'use server';

import prismaClient from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

export type RFQState = {
  success?: boolean;
  message?: string;
  errors?: {
    [key: string]: string[];
  };
};

export async function submitRFQ(prevState: RFQState, formData: FormData): Promise<RFQState> {
  // Honeypot field check (add this field hidden in the form)
  const honeypot = formData.get('website') as string;
  if (honeypot) {
    // Bot filled the honeypot field
    console.log('[SPAM BLOCKED] Honeypot triggered');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      success: false,
      message: 'Please try again.',
    };
  }

  // Simulate delay (helps against rapid submissions)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const productId = formData.get('productId') as string;
  const buyerName = formData.get('buyerName') as string;
  const buyerEmail = formData.get('buyerEmail') as string;
  const buyerCompany = formData.get('buyerCompany') as string;
  const buyerCountry = formData.get('buyerCountry') as string;
  const quantity = formData.get('quantity') as string;
  const message = formData.get('message') as string;

  // Server-side validation (additional security layer)
  if (!buyerName || !buyerEmail || !message || !productId) {
    return {
      success: false,
      message: 'Please fill in all required fields.',
    };
  }

  try {
    // Rate limiting: Check for duplicate submissions (same product, same email within 5 minutes)
    const recentRFQ = await prismaClient.rFQ.findFirst({
      where: {
        buyerEmail,
        productId,
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes
        },
      },
    });

    if (recentRFQ) {
      return {
        success: false,
        message:
          'You have already submitted an enquiry for this product recently. Please wait 5 minutes before submitting again.',
      };
    }

    // 1. Store in DB
    const rfq = await prismaClient.rFQ.create({
      data: {
        productId,
        buyerName,
        buyerEmail,
        buyerCompany,
        buyerCountry,
        quantity,
        message,
        status: 'PENDING',
      },
    });

    // 2. Simulate Email Sending
    console.log(
      `[EMAIL SIMULATION] Sending RFQ Notification to Seller for Product ID: ${productId}`
    );
    console.log(`[EMAIL SIMULATION] From: ${buyerName} (${buyerEmail})`);
    console.log(`[EMAIL SIMULATION] Message: ${message}`);

    return {
      success: true,
      message: 'Your enquiry has been sent successfully! The seller will contact you shortly.',
    };
  } catch (error) {
    console.error('RFQ Error:', error);
    return {
      success: false,
      message: 'Something went wrong. Please try again later.',
    };
  }
}
