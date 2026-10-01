import { createFileRoute } from "@tanstack/react-router";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { VesselStatus } from "../components/dashboard/VesselStatus";
import { WaterQuality } from "../components/dashboard/WaterQuality";
import { WasteManagement } from "../components/dashboard/WasteManagement";
import { EnergyReporting } from "../components/dashboard/EnergyReporting";
import { MicroplasticDetection } from "../components/dashboard/MicroplasticDetection";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "SI-CEKAT Dashboard — Smart IoT River Waste Management" },
      { name: "description", content: "Real-time monitoring dashboard for SI-CEKAT autonomous river waste collection system powered by solar and pico-hydro energy." },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="p-3 sm:p-4 md:p-6">
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <VesselStatus />
          <WaterQuality />
          <WasteManagement />
        </div>
        <div className="mt-3 sm:mt-4 grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
          <MicroplasticDetection />
          <EnergyReporting />
        </div>
      </main>
    </div>
  );
}
