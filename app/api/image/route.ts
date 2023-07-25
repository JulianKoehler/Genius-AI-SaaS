import { increaseFreePromptsCount, isFreeTierPromptLimitReached } from "@/lib/api-limit";
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
    const { prompt, quantity = 1, resolution = "512x512" } = body;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!configuration.apiKey) return new NextResponse("OpenAi API-Key not configured", { status: 500 });
    if (!prompt) return new NextResponse("Prompt are requried", { status: 400 });
    if (!quantity) return new NextResponse("Quantity is requried", { status: 400 });
    if (!resolution) return new NextResponse("Resolution are requried", { status: 400 });

    const isFreeTierExpired = await isFreeTierPromptLimitReached(userId);
    const isPro = await hasValidSubscription();

    if (isFreeTierExpired && !isPro) {
      return new NextResponse("Free trial has expired.", { status: 403 });
    }

    const {
      data: { data },
    } = await openai.createImage({
      prompt,
      n: parseInt(quantity, 10),
      size: resolution,
    });

    if (!isPro) await increaseFreePromptsCount();

    return NextResponse.json(data);
  } catch (error) {
    console.error("[IMAGE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
