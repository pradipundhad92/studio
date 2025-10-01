"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { getClients } from "@/lib/api";
import type { Client } from "@/lib/types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { deleteClientAction } from "../actions";

export default function ClientTable() {
  const { tenantId } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (tenantId) {
      setLoading(true);
      getClients(tenantId)
        .then((data) => {
          setClients(data);
          setError(null);
        })
        .catch((err) => {
          setError(err.message || "Failed to fetch clients.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [tenantId]);
  
  const handleDeleteConfirmation = (client: Client) => {
    setClientToDelete(client);
  };

  const handleDelete = () => {
    if (!clientToDelete || !tenantId) return;

    startTransition(async () => {
      const result = await deleteClientAction(tenantId, clientToDelete.id);
      if (result.success) {
        setClients(clients.filter(c => c.id !== clientToDelete.id));
        toast({ title: "Success", description: "Client deleted successfully." });
      } else {
        toast({ variant: "destructive", title: "Error", description: result.error });
      }
      setClientToDelete(null);
    });
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive py-4">
        <p>Error: {error}</p>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
        <div className="text-center py-10">
            <h3 className="text-xl font-semibold">No clients yet</h3>
            <p className="text-muted-foreground mt-2">Add your first client to get started.</p>
        </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden sm:table-cell">Phone</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={client.profilePictureUrl} alt={client.name} data-ai-hint="person avatar"/>
                      <AvatarFallback>
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{client.name}</div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {client.email}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {client.phone}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/clients/${client.id}/edit`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteConfirmation(client)} className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AlertDialog open={!!clientToDelete} onOpenChange={(open) => !open && setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the client
              <span className="font-semibold"> {clientToDelete?.name}</span> and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
