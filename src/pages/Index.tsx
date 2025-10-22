
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import RiskDashboard from "@/components/RiskDashboard";
import DiseaseDetection from "@/components/DiseaseDetection";
import FertilizerRecommendation from "@/components/FertilizerRecommendation";
import LocalizedAdvisory from "@/components/LocalizedAdvisory";
import Chatbot from "@/components/Chatbot";
import { useTranslation } from "react-i18next";

const Index = () => {
  const [location, setLocation] = useState("Karnataka, India");
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar location={location} setLocation={setLocation} />
      
      <main className="container mx-auto py-6 px-4">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-agro-green-dark">
            {t('header_title')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('header_subtitle', { location })}
          </p>
        </header>

        <Tabs defaultValue="risk" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
            <TabsTrigger value="risk" className="text-sm md:text-base">
              {t('tabs.risk')}
            </TabsTrigger>
            <TabsTrigger value="disease" className="text-sm md:text-base">
              {t('tabs.disease')}
            </TabsTrigger>
            <TabsTrigger value="fertilizer" className="text-sm md:text-base">
              {t('tabs.fertilizer')}
            </TabsTrigger>
            <TabsTrigger value="advisory" className="text-sm md:text-base">
              {t('tabs.advisory')}
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-sm md:text-base">
              {t('tabs.chat')}
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
          
          <TabsContent value="chat">
            <Chatbot lang={(i18n.language || 'en').split('-')[0]} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
