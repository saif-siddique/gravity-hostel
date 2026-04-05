import { Suspense } from "react";
import MessClient, { MessDay } from "./mess-client";
import { Loader2 } from "lucide-react";
import dbConnect from "@/connection/dbconnect";
import { MessModel } from "@/models/Mess.model";

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
        <div className="px-5 py-5">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Mess Detail
                </h1>
                <p className="text-muted-foreground">Manage daily mess details (Admin)</p>
            </div>
            
            <Suspense fallback={
                <div className="flex justify-center items-center py-20 text-muted-foreground w-full">
                   <Loader2 className="animate-spin mr-2" /> Fetching latest menu...
                </div>
            }>
                <MessDataWrapper />
            </Suspense>
        </div>
    );
};

// Async component retrieves DB info and ships it safely down
async function MessDataWrapper() {
    const data = await getMessData();
    return <MessClient initialData={data} />;
}

export default Page;
