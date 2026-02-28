import { getOrders, getTrackingInformation } from "@/components/data";
import { streamText, stepCountIs } from "ai";
import { z } from 'zod/v3';


export async function POST(request: Request) {
  const { messages } = await request.json();

  const stream = streamText({
    model: "openai/gpt-4o",

    system: `\
      - you are a friendly package tracking assistant
      - your responses are concise
      - you do not ever use lists, tables, or bullet points; instead, you provide a single response
    `,

    messages,
    stopWhen: stepCountIs(5),

    tools: {
      listOrders: {
        description: "list all orders",
        inputSchema: z.object({}),
        execute: async function ({}) {
          const orders = getOrders();
          return orders;
        },
      },
      viewTrackingInformation: {
        description: "view tracking information for a specific order",
        inputSchema: z.object({
          orderId: z.string(),
        }),
        execute: async function ({ orderId }) {
          const trackingInformation = getTrackingInformation({ orderId });
          await new Promise((resolve) => setTimeout(resolve, 500));
          return trackingInformation;
        },
      },
    }
  });

  return stream.toUIMessageStreamResponse();
}
