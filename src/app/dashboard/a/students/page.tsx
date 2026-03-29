"use client";
import React, { useEffect, useState } from "react";
import { Search, Eye, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Student {
  _id: string;
  name: string;
  roomNumber: string;
  status: boolean;
}

export default function StudentTable() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/a/data/students");

        if (response.data && response.data.success) {
          setStudents(response.data.students);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredStudents = students.filter((student) => {
    const term = search.toLowerCase();
    const nameMatch = student.name.toLowerCase().includes(term);
    const roomMatch = student.roomNumber
      ? student.roomNumber.toLowerCase().includes(term)
      : false;
    return nameMatch || roomMatch;
  });

  return (
    <div className="w-full p-2 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">All Students</h1>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            onChange={handleSearch}
            value={search}
            placeholder="Search by name or room..."
            className="pl-10"
          />
        </div>
        <div className="h-[65vh] overflow-auto rounded-md border">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium">Name</TableHead>
                <TableHead className="text-center">Room</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-12">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Loading students...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell className="font-semibold py-4">
                      {student.name}
                    </TableCell>

                    <TableCell className="text-center">
                      {student.roomNumber || "Unassigned"}
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge
                        variant={student.status ? "default" : "secondary"}
                        className={`border-none px-3 py-1 ${student.status
                          ? "bg-emerald-500/15 text-emerald-500"
                          : "bg-muted text-muted-foreground"
                          }`}
                      >
                        {student.status ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        onClick={() =>
                          router.push(`/dashboard/a/profile/${student._id}`)
                        }
                        variant="ghost"
                        size="sm"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10">
                    No students found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
