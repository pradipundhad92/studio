import { notFound } from "next/navigation";
import ClientForm from "../../components/ClientForm";
import { updateClientAction } from "../../actions";
import { getClientById } from "@/lib/api";

// This is a simplified way to pass tenantId to a server component.
// In a real app, you might get this from a cookie or other server-side auth context.
const MOCK_TENANT_ID = "68da488d658c115328266179";

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
