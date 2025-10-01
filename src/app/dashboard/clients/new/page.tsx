"use client";

import ClientForm from "../components/ClientForm";
import { createClientAction } from "../actions";
import { useAuth } from "@/hooks/use-auth";

export default function NewClientPage() {
  const { tenantId } = useAuth();
  
  if (!tenantId) {
    // You can show a loading or error state here
    return <div>Loading or authentication error...</div>;
  }

  const createClientWithTenant = createClientAction.bind(null, tenantId);

  return <ClientForm action={createClientWithTenant} />;
}
