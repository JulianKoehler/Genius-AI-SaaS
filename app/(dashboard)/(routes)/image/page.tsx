"use client";

import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DownloadIcon, ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import Heading from "@/components/heading";
import { formSchema, quantityOptions, resolutionOptions } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/empty";
import LoadingComponent from "@/components/loading-component";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";

type Props = {};

const ImagePage = (props: Props) => {
  const [images, setImages] = useState<string[]>([]);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      prompt: "",
      quantity: "1",
      resolution: "512x512",
    },
    resolver: zodResolver(formSchema),
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setImages([]);
      const { data } = await axios.post("/api/image", values);

      const urls = data.map((image: { url: string }) => image.url);

      setImages(urls);
      form.reset();
    } catch (error: any) {
      // TODO: Open Pro Modal
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <>
      <Heading
        title="Image Generation"
        description="Turn your promt into an image"
        Icon={ImageIcon}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
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
                  <FormItem className="col-span-12 lg:col-span-6">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="A picture of a cat on the moon"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="quantity"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {quantityOptions.map(option => (
                          <SelectItem
                            key={option.value}
                            value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                name="resolution"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resolutionOptions.map(option => (
                          <SelectItem
                            key={option.value}
                            value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
          {isLoading && <LoadingComponent imagePage />}
          {images.length === 0 && !isLoading && <Empty label="No images generated" />}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8">
            {images.map(src => (
              <Card
                key={src}
                className="rounded-lg overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src={src}
                    alt="response"
                    fill
                  />
                </div>
                <CardFooter className="p-2">
                  <Button
                    onClick={() => window.open(src)}
                    variant="secondary"
                    className="w-full">
                    <DownloadIcon className="w-4 h-4 mr-2">Download</DownloadIcon>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ImagePage;
