"use client";

import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChatCompletionRequestMessage } from "openai";
import axios from "axios";
import toast from "react-hot-toast";

import Heading from "@/components/heading";
import { formSchema } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/empty";
import LoadingComponent from "@/components/loading-component";
import { avatarMap } from "@/components/avatars";

import { cn } from "@/lib/utils";
import { useProModal } from "@/hooks/useProModal";

type Props = {};

const ConversationPage = (props: Props) => {
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  const proModal = useProModal();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      prompt: "",
    },
    resolver: zodResolver(formSchema),
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...messages, userMessage];

      const response = await axios.post("/api/conversation", {
        messages: newMessages,
      });

      setMessages(current => [...current, userMessage, response.data]);

      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Sorry, something went wrong!");
      }
      console.log(error);
    } finally {
      router.refresh(); // Rehydrate the server components to fetch the most recent data from prisma
    }
  };

  return (
    <>
      <Heading
        title="Conversation"
        description="Our most advanced conversation model"
        Icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Ask a question"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2"
                disabled={isLoading}>
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && <LoadingComponent />}
          {messages.length === 0 && !isLoading && <Empty label="No conversation started" />}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map(message => (
              <div
                key={message.content}
                className={cn(
                  "p-8 w-full flex items-start gap-x-4 rounded-lg",
                  message.role === "user" ? "bg-white border border-black/10 " : "bg-muted"
                )}>
                {avatarMap[message.role]}
                <p className="textmd">{message.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ConversationPage;
