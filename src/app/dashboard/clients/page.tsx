import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import ClientTable from "./components/ClientTable";

export default function ClientsPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Clients</CardTitle>
            <CardDescription>Manage your list of clients.</CardDescription>
        </div>
        <Button asChild>
          <Link href="/dashboard/clients/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Client
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <ClientTable />
      </CardContent>
    </Card>
  );
}
