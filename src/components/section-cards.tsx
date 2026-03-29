"use client"
import {
  IconSchool,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CircleDollarSign, Mail, School } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

interface IDashboardStats {
  amount: number;    
  seat: number;     
  student: number;  
  complaint: number; 
}


export function SectionCards() {
  const [data, setData] = useState<IDashboardStats>({
    seat: 0,
    amount: 0,
    student: 0,
    complaint: 0,
  })
  useEffect(() => {
    async function fetchCardData() {
      try {
        const response = await axios.get(
          `/api/a/data/dashboard-card`,
        );

        if (!response.data.success) {
          toast.error(response.data.message)
        }
        else {
          setData(response.data.data)
        }
      } catch (error) {
        toast.error("Failed to fetch students");
      } finally {
      }
    }
    fetchCardData();
  }, []);
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.amount} PKR
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <CircleDollarSign />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total Amount Collected <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Stat of 1 month
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Student</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.student}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconSchool />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total number of active student <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            We need Advertisement to grow.
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Available Seats</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.seat}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <School />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total Number of Seats <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">The total number of Empty seats </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Complaints</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.complaint}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <Mail />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total Pending complaints<IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Solve the problem of our students</div>
        </CardFooter>
      </Card>
    </div>
  );
}
