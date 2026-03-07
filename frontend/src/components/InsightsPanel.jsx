import Card from "./ui/Card";
import { Lightbulb } from "lucide-react";

export default function InsightsPanel({ insights }) {
  if (!insights || insights.length === 0) return null;

  return (
    <Card title="Smart Insights">
      <div className="space-y-4">

        {insights.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-indigo-50 border border-indigo-100"
          >
            <div className="flex items-start gap-3">

              <Lightbulb className="text-indigo-500 mt-1" size={18} />

              <div>
                <p className="font-semibold text-slate-800">
                  {item.message}
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  {item.recommendation}
                </p>
              </div>

            </div>
          </div>
        ))}

      </div>
    </Card>
  );
}