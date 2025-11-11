"use client";
import { Statistic } from "@/components/index";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function StatisticPage() {
  return (
    <ProtectedRoute>
      <div>
        <Statistic />
      </div>
    </ProtectedRoute>
  );
}

export default StatisticPage;
