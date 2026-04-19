import { getOrders, getTrackingInformation, ORDERS } from "@/components/data";
import { createOpenAI } from "@ai-sdk/openai";
import { getVercelOidcToken } from "@vercel/functions/oidc";
import { convertToCoreMessages, streamText } from "ai";
import { checkBotId } from "botid/server";
import { z } from "zod";

export async function POST(request: Request) {
  const { isBot } = await checkBotId();
  if (isBot) {
    return new Response("Access denied", { status: 403 });
  }

  const openai = createOpenAI({
    baseURL: "https://ai-gateway.vercel.sh/v1",
    apiKey: await getVercelOidcToken(),
  });

  const { messages } = await request.json();

  const stream = await streamText({
    model: openai("gpt-4o"),
    system: `\
      - you are a friendly package tracking assistant
      - your responses are concise
      - you do not ever use lists, tables, or bullet points; instead, you provide a single response
    `,
    messages: convertToCoreMessages(messages),
    maxSteps: 5,
    tools: {
      listOrders: {
        description: "list all orders",
        parameters: z.object({}),
        execute: async function ({}) {
          const orders = getOrders();
          return orders;
        },
      },
      viewTrackingInformation: {
        description: "view tracking information for a specific order",
        parameters: z.object({
          orderId: z.string(),
        }),
        execute: async function ({ orderId }) {
          const trackingInformation = getTrackingInformation({ orderId });
          await new Promise((resolve) => setTimeout(resolve, 500));
          return trackingInformation;
        },
      },
    },
  });

  return stream.toDataStreamResponse();
}
