"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

import type { Client } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";

const clientFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  profilePictureUrl: z.any().optional(),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

type ClientFormProps = {
  client?: Client | null;
  action: (prevState: any, formData: FormData) => Promise<any>;
};

export default function ClientForm({ client, action }: ClientFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [formState, formAction] = useFormState(action, {
    success: false,
    message: "",
  });

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: client?.name || "",
      email: client?.email || "",
      phone: client?.phone || "",
    },
  });

  useEffect(() => {
    if (formState.message) {
      if (formState.success) {
        toast({
          title: "Success!",
          description: formState.message,
        });
        router.push("/dashboard/clients");
      } else {
        toast({
          variant: "destructive",
          title: "An error occurred",
          description: formState.message,
        });
      }
    }
  }, [formState, toast, router]);

  function SubmitButton() {
    const { formState: { isSubmitting } } = form;
    return (
        <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
    )
  }

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{client ? "Edit Client" : "Add New Client"}</CardTitle>
            <CardDescription>
              Fill in the details below to {client ? "update the" : "create a new"} client.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="(123) 456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="profilePictureUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                   <FormControl>
                    <Input type="file" {...form.register("profilePictureUrl")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
                <Link href="/dashboard/clients">Cancel</Link>
            </Button>
            <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}
