'use server'

import prismaClient from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type RFQState = {
  success?: boolean;
  message?: string;
  errors?: {
    [key: string]: string[];
  };
};

export async function submitRFQ(prevState: RFQState, formData: FormData): Promise<RFQState> {
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const productId = formData.get('productId') as string;
  const buyerName = formData.get('buyerName') as string;
  const buyerEmail = formData.get('buyerEmail') as string;
  const buyerCompany = formData.get('buyerCompany') as string;
  const buyerCountry = formData.get('buyerCountry') as string;
  const quantity = formData.get('quantity') as string;
  const message = formData.get('message') as string;

  // Basic Validation
  if (!buyerName || !buyerEmail || !message || !productId) {
    return {
      success: false,
      message: 'Please fill in all required fields.',
    };
  }
  
  try {
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
              status: 'PENDING'
          }
      });
      
      // 2. Simulate Email Sending
      console.log(`[EMAIL SIMULATION] Sending RFQ Notification to Seller for Product ID: ${productId}`);
      console.log(`[EMAIL SIMULATION] From: ${buyerName} (${buyerEmail})`);
      console.log(`[EMAIL SIMULATION] Message: ${message}`);
      
      return {
          success: true,
          message: 'Your enquiry has been sent successfully! The seller will contact you shortly.'
      };
      
  } catch (error) {
      console.error('RFQ Error:', error);
      return {
          success: false,
          message: 'Something went wrong. Please try again later.'
      };
  }
}
