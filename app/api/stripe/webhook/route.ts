import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { createBooking } from "@/lib/services/bookings.service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const metadata = paymentIntent.metadata;

      try {
        // Create confirmed booking
        await createBooking({
          userId: metadata.userId,
          type: metadata.type as "hotel" | "car",
          itemId: metadata.itemId,
          roomTypeId: metadata.roomTypeId || undefined,
          hotelId: metadata.hotelId || undefined,
          carId: metadata.carId || undefined,
          startDate: metadata.startDate,
          endDate: metadata.endDate,
          guests: metadata.guests ? Number(metadata.guests) : 1,
          totalPrice: paymentIntent.amount / 100,
          promoCode: metadata.promoCode || undefined,
          discountAmount: metadata.discountAmount
            ? Number(metadata.discountAmount)
            : undefined,
          stripePaymentIntentId: paymentIntent.id,
        });

        console.log(`[WEBHOOK] Booking confirmed for PI: ${paymentIntent.id}`);
      } catch (err) {
        console.error("[WEBHOOK] Failed to create booking:", err);
        return NextResponse.json(
          { error: "Booking creation failed" },
          { status: 500 },
        );
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`[WEBHOOK] Payment failed for PI: ${paymentIntent.id}`);
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      const paymentIntentId = charge.payment_intent as string;

      // Update booking payment status
      if (paymentIntentId) {
        await supabase
          .from("bookings")
          .update({
            payment_status: "refunded",
            status: "cancelled",
          })
          .eq("stripe_payment_intent_id", paymentIntentId);
      }
      break;
    }

    default:
      console.log(`[WEBHOOK] Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
