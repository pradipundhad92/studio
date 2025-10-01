"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { addClient, updateClient, deleteClient } from "@/lib/api";
import { generateClientProfilePicture } from "@/ai/flows/generate-client-profile-picture";

const clientFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  profilePictureUrl: z.string().optional(),
});

type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
};

export async function createClientAction(
  tenantId: string,
  prevState: any,
  formData: FormData
): Promise<FormState> {
  const validatedFields = clientFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    let profilePictureUrl = validatedFields.data.profilePictureUrl;
    
    // Check for uploaded file - this part is simplified.
    // In a real app, you'd handle file uploads to a storage service.
    const uploadedFile = formData.get("profilePictureUrl");
    let clientData = { ...validatedFields.data };

    if (!uploadedFile || (uploadedFile as File).size === 0) {
        const result = await generateClientProfilePicture({ clientName: validatedFields.data.name });
        clientData.profilePictureUrl = result.profilePictureDataUri;
    } else {
        // Here you would upload the file and get a URL
        // For now, we'll just mock a URL
        clientData.profilePictureUrl = "https://picsum.photos/seed/newclient/200/200";
    }

    await addClient(tenantId, clientData);
    revalidatePath("/dashboard/clients");
    return { success: true, message: "Client created successfully." };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to create client." };
  }
}

export async function updateClientAction(
  clientId: string,
  tenantId: string,
  prevState: any,
  formData: FormData
): Promise<FormState> {
  const validatedFields = clientFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // File upload logic would be here as well for updates
    await updateClient(tenantId, clientId, validatedFields.data);
    revalidatePath("/dashboard/clients");
    revalidatePath(`/dashboard/clients/${clientId}/edit`);
    return { success: true, message: "Client updated successfully." };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update client." };
  }
}

export async function deleteClientAction(tenantId: string, clientId: string) {
    try {
        await deleteClient(tenantId, clientId);
        revalidatePath('/dashboard/clients');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to delete client." };
    }
}
