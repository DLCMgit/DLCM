import Stripe from "stripe"
import { supabase } from "@/utils/supabase"
import { buffer } from "micro"

export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  const stripe = Stripe(process.env.STRIPE_TEST_SECRET_KEY)
  const sig = req.headers["stripe-signature"]
  const signingSecret = process.env.STRIPE_WEBHOOK_TEST_KEY
  const reqBuffer = await buffer(req)

  let event

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, sig, signingSecret)
  } catch (err) {
    console.log(err)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  async function createdSub(customer) {
    console.log(`subscription created for: ${customer}`)
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_subscribed: true })
        .eq("stripe_customer_id", customer)
    } catch (error) {
      throw error
    }
  }

  async function canceledSub(customer) {
    console.log(`subscription canceled for customer: ${customer}`)
    await supabase
      .from("profiles")
      .update({ is_subscribed: false })
      .eq("stripe_customer_id", customer)

    const { data: profileData, error } = await supabase
      .from("profiles")
      .select()
      .eq("stripe_customer_id", customer)

    const { data: userReleases, error: userReleasesError } = await supabase
      .from("releases")
      .select("*")
      .eq("user_id", profileData[0].id)
      .order("created_at", { ascending: false })

    let releasesToDelete = []
    userReleases.map((release, index) => {
      if (index > 1) {
        releasesToDelete.push(release.id)
      }
    })

    await supabase.from("releases").delete().in("id", releasesToDelete)
  }

  if (event.type == "customer.subscription.created") {
    const customerSubscriptionCreated = event.data.object
    createdSub(customerSubscriptionCreated.customer)
    // Then define and call a function to handle the event customer.subscription.created
  }

  if (event.type == "customer.subscription.deleted") {
    const customerSubscriptionDeleted = event.data.object
    canceledSub(subscriptionScheduleCanceled.customer)
    // Then define and call a function to handle the event customer.subscription.deleted
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send({ data: event.data.object, received: true })
}
