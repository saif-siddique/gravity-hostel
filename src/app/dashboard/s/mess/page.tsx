import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import dbConnect from "@/connection/dbconnect";
import { MessModel } from "@/models/Mess.model";

export type MessDay = { _id: string; day: string; morning: string; afternoon: string; evening: string; };

const DEFAULT_MESS = [
    { day: "Mon", morning: "Naan-Chany", afternoon: "Biryani", evening: "Palak-Roti" },
    { day: "Tue", morning: "Paratha-Anda", afternoon: "Daal-Chawal", evening: "Chicken Karahi" },
    { day: "Wed", morning: "Halwa-Puri", afternoon: "Sabzi-Roti", evening: "Beef Qorma" },
    { day: "Thu", morning: "Bread-Butter & Tea", afternoon: "Chicken Pulao", evening: "Mix Sabzi-Roti" },
    { day: "Fri", morning: "Cholay-Kulcha", afternoon: "Biryani", evening: "Fish & Roti" },
    { day: "Sat", morning: "Omelette & Toast", afternoon: "Rajma-Chawal", evening: "Chicken Handi" },
    { day: "Sun", morning: "Pancakes & Honey", afternoon: "BBQ", evening: "Daal-Roti" }
];

async function getMessData(): Promise<MessDay[]> {
    await dbConnect();
    
    let messData = await MessModel.find({}).lean();
    
    // Auto-seed the database if no schedule exists
    if (!messData || messData.length === 0) {
        await MessModel.insertMany(DEFAULT_MESS);
        messData = await MessModel.find({}).lean();
    }
    
    // Ensure chronological order
    const dayOrder = { "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6, "Sun": 7 };
    
    const plainData = messData.map((item: any) => ({
        _id: item._id.toString(),
        day: item.day,
        morning: item.morning,
        afternoon: item.afternoon,
        evening: item.evening
    })).sort((a, b) => (dayOrder[a.day as keyof typeof dayOrder] || 9) - (dayOrder[b.day as keyof typeof dayOrder] || 9));

    return plainData;
}

const Page = () => {
    return (
        <div>
            <div className="px-5 py-3">
                <h1 className="text-2xl font-bold tracking-tight">Mess Detail</h1>
                <p>Your daily mess menu</p>
            </div>
            <Suspense fallback={
                <div className="flex justify-center items-center py-20 text-muted-foreground w-full">
                   <Loader2 className="animate-spin mr-2" /> Loading latest menu from database...
                </div>
            }>
                <MessDataWrapper />
            </Suspense>
        </div>
    );
};

// Async Server Component
async function MessDataWrapper() {
    const data = await getMessData();
    return (
        <div className="my-7 px-2.5">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Day</TableHead>
                        <TableHead>Morning</TableHead>
                        <TableHead>Afternoon</TableHead>
                        <TableHead>Evening</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((d) => (
                        <TableRow key={d._id}>
                            <TableCell className="font-bold">{d.day}</TableCell>
                            <TableCell>{d.morning}</TableCell>
                            <TableCell>{d.afternoon}</TableCell>
                            <TableCell>{d.evening}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default Page;
