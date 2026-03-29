import { UserPlus, CheckCircle2, Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const actions = [
  {
    title: "Register Student",
    description: "Add new student",
    icon: <UserPlus className="h-5 w-5 text-slate-400" />,
    iconBg: "bg-slate-900/50 border-slate-800",
  },
  {
    title: "Mark Attendance",
    description: "Take today's attendance",
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    title: "Manage Rooms",
    description: "View and assign rooms",
    icon: <Home className="h-5 w-5 text-blue-500" />,
    iconBg: "bg-blue-500/10 border-blue-500/20",
  },
];

export function QuickActions() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-white tracking-tight">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <Card 
            key={index} 
            className="bg-[#020617] border-slate-800 hover:bg-slate-900/50 transition-colors cursor-pointer"
          >
            <CardContent className="p-5 flex items-start gap-4">
              <div className={`p-3 rounded-xl border ${action.iconBg} flex items-center justify-center`}>
                {action.icon}
              </div>
              <div className="space-y-1 pt-1">
                <h3 className="font-semibold text-white leading-none">
                  {action.title}
                </h3>
                <p className="text-sm text-slate-400">
                  {action.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}