import { notFound } from "next/navigation";
import ClientForm from "../../components/ClientForm";
import { updateClientAction } from "../../actions";
import { getClientById } from "@/lib/api";

// This is a simplified way to pass tenantId to a server component.
// In a real app, you might get this from a cookie or other server-side auth context.
const MOCK_TENANT_ID = "c5b6a7d8-e9f0-4g1h-2i3j-k4l5m6n7o8p9";

export default async function EditClientPage({
  params,
}: {
  params: { clientId: string };
}) {
  const { clientId } = params;
  let client;

  try {
    client = await getClientById(MOCK_TENANT_ID, clientId);
  } catch (error) {
    notFound();
  }

  if (!client) {
    notFound();
  }

  const updateClientWithIds = updateClientAction.bind(null, clientId, MOCK_TENANT_ID);

  return <ClientForm client={client} action={updateClientWithIds} />;
}
