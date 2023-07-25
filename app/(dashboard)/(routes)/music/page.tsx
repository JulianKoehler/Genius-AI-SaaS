"use client";

import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Music } from "lucide-react";
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

const MusicPage = (props: Props) => {
  const [music, setMusic] = useState<string>();
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
      setMusic(undefined);

      const {
        data: { audio },
      } = await axios.post("/api/music", values);

      setMusic(audio);

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
        title="Music Generation"
        description="Turn your prompt into music"
        Icon={Music}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
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
                        placeholder="E-Guitar solo"
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
          {!music && !isLoading && <Empty label="No music generated" />}
          {music && (
            <audio
              controls
              className="w-full mt-8">
              <source src={music} />
            </audio>
          )}
        </div>
      </div>
    </>
  );
};

export default MusicPage;
