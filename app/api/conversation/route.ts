import { isFreeTierPromptLimitReached, increaseFreePromptsCount } from "@/lib/api-limit";
import { hasValidSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!configuration.apiKey) return new NextResponse("OpenAi API-Key not configured", { status: 500 });
    if (!messages) return new NextResponse("Messages are requried", { status: 400 });

    const isFreeTierExpired = await isFreeTierPromptLimitReached(userId);
    const isPro = await hasValidSubscription();

    if (isFreeTierExpired && !isPro) {
      return new NextResponse("Free trial has expired.", { status: 403 });
    }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
    });

    if (!isPro) await increaseFreePromptsCount();

    return NextResponse.json(response.data.choices[0].message);
  } catch (error) {
    console.error("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
