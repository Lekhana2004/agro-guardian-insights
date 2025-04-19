
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import RiskDashboard from "@/components/RiskDashboard";
import DiseaseDetection from "@/components/DiseaseDetection";
import FertilizerRecommendation from "@/components/FertilizerRecommendation";
import LocalizedAdvisory from "@/components/LocalizedAdvisory";

const Index = () => {
  const [location, setLocation] = useState("Karnataka, India");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar location={location} setLocation={setLocation} />
      
      <main className="container mx-auto py-6 px-4">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-agro-green-dark">
            AgroGuard Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Smart agriculture risk assessment and advisory for {location}
          </p>
        </header>

        <Tabs defaultValue="risk" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="risk" className="text-sm md:text-base">
              Risk Assessment
            </TabsTrigger>
            <TabsTrigger value="disease" className="text-sm md:text-base">
              Disease Detection
            </TabsTrigger>
            <TabsTrigger value="fertilizer" className="text-sm md:text-base">
              Fertilizer Advisor
            </TabsTrigger>
            <TabsTrigger value="advisory" className="text-sm md:text-base">
              Local Advisory
            </TabsTrigger>
          </TabsList>

          <TabsContent value="risk">
            <RiskDashboard location={location} />
          </TabsContent>
          
          <TabsContent value="disease">
            <DiseaseDetection />
          </TabsContent>
          
          <TabsContent value="fertilizer">
            <FertilizerRecommendation />
          </TabsContent>
          
          <TabsContent value="advisory">
            <LocalizedAdvisory location={location} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
