"use client";

import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { VideoIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";

import Heading from "@/components/heading";
import { formSchema } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/empty";
import LoadingComponent from "@/components/loading-component";
import { useProModal } from "@/hooks/useProModal";

type Props = {};

const VideoPage = (props: Props) => {
  const [video, setVideo] = useState<string>();
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
      setVideo(undefined);

      const { data } = await axios.post("/api/video", values);

      setVideo(data[0]);

      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Sorry, something went wrong!");
      }
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <>
      <Heading
        title="Video Generation"
        description="Turn your prompt into a video"
        Icon={VideoIcon}
        iconColor="text-orange-700"
        bgColor="bg-orange-700/10"
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
                        placeholder="Giraffe walking on the streets of New York"
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
          {!video && !isLoading && <Empty label="No video generated" />}
          {video && (
            <video
              controls
              className="w- aspect-video mt-8 rounded-lg border bg-black">
              <source src={video} />
            </video>
          )}
        </div>
      </div>
    </>
  );
};

export default VideoPage;
