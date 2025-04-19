
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SoilNutrient {
  name: string;
  value: number;
  unit: string;
  status: "Low" | "Medium" | "Optimal" | "High";
  color: string;
}

interface FertilizerRecommendation {
  name: string;
  formula: string;
  applicationRate: string;
  timing: string;
  method: string;
  benefits: string[];
}

const FertilizerRecommendation: React.FC = () => {
  const { toast } = useToast();
  const [cropType, setCropType] = useState("");
  const [soilType, setSoilType] = useState("");
  const [growthStage, setGrowthStage] = useState("");
  const [soilPH, setSoilPH] = useState<number[]>([6.5]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState<FertilizerRecommendation[]>([]);
  const [soilNutrients, setSoilNutrients] = useState<SoilNutrient[]>([]);

  const cropOptions = [
    "Rice", "Wheat", "Maize", "Tomato", "Potato", "Cotton", "Sugarcane", "Chickpea"
  ];

  const soilOptions = [
    "Sandy", "Clay", "Loamy", "Silt", "Black Cotton", "Red Soil", "Alluvial"
  ];

  const growthStageOptions = [
    "Seedling", "Vegetative", "Flowering", "Fruiting", "Maturity"
  ];

  const mockSoilNutrients: SoilNutrient[] = [
    { 
      name: "Nitrogen (N)", 
      value: 25, 
      unit: "kg/ha", 
      status: "Low", 
      color: "bg-red-500" 
    },
    { 
      name: "Phosphorus (P)", 
      value: 15, 
      unit: "kg/ha", 
      status: "Medium", 
      color: "bg-yellow-500" 
    },
    { 
      name: "Potassium (K)", 
      value: 180, 
      unit: "kg/ha", 
      status: "Optimal", 
      color: "bg-green-500" 
    },
    { 
      name: "Organic Matter", 
      value: 1.2, 
      unit: "%", 
      status: "Low", 
      color: "bg-red-500" 
    },
  ];

  const mockRecommendations: FertilizerRecommendation[] = [
    {
      name: "NPK 20-10-10",
      formula: "20% N, 10% P₂O₅, 10% K₂O",
      applicationRate: "250-300 kg/ha",
      timing: "Apply at planting and 30 days after germination",
      method: "Band placement 5cm away from seed rows, 5cm deep",
      benefits: [
        "Promotes vegetative growth",
        "Enhances root development",
        "Improves overall plant vigor"
      ]
    },
    {
      name: "Urea",
      formula: "46-0-0",
      applicationRate: "100-150 kg/ha",
      timing: "Split application: 50% at 30 days, 50% at 60 days",
      method: "Side dressing followed by light irrigation",
      benefits: [
        "High nitrogen for leafy growth",
        "Cost-effective nitrogen source",
        "Quickly available to plants"
      ]
    }
  ];

  const generateRecommendations = () => {
    if (!cropType || !soilType || !growthStage) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setSoilNutrients(mockSoilNutrients);
      setRecommendations(mockRecommendations);
      setIsGenerating(false);
      
      toast({
        title: "Recommendations Ready",
        description: "Fertilizer recommendations based on your inputs",
      });
    }, 1500);
  };

  const resetForm = () => {
    setCropType("");
    setSoilType("");
    setGrowthStage("");
    setSoilPH([6.5]);
    setRecommendations([]);
    setSoilNutrients([]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Crop & Soil Information</CardTitle>
          <CardDescription>
            Enter details about your crop and soil conditions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="crop-type">Crop Type</Label>
              <Select value={cropType} onValueChange={setCropType}>
                <SelectTrigger id="crop-type">
                  <SelectValue placeholder="Select crop" />
                </SelectTrigger>
                <SelectContent>
                  {cropOptions.map((crop) => (
                    <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="soil-type">Soil Type</Label>
              <Select value={soilType} onValueChange={setSoilType}>
                <SelectTrigger id="soil-type">
                  <SelectValue placeholder="Select soil type" />
                </SelectTrigger>
                <SelectContent>
                  {soilOptions.map((soil) => (
                    <SelectItem key={soil} value={soil}>{soil}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="growth-stage">Growth Stage</Label>
              <Select value={growthStage} onValueChange={setGrowthStage}>
                <SelectTrigger id="growth-stage">
                  <SelectValue placeholder="Select growth stage" />
                </SelectTrigger>
                <SelectContent>
                  {growthStageOptions.map((stage) => (
                    <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="soil-ph">Soil pH</Label>
                <span className="text-sm text-gray-500">{soilPH[0]}</span>
              </div>
              <Slider
                id="soil-ph"
                min={4.0}
                max={9.0}
                step={0.1}
                value={soilPH}
                onValueChange={setSoilPH}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Acidic (4.0)</span>
                <span>Neutral (7.0)</span>
                <span>Alkaline (9.0)</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additional-info">Additional Notes (Optional)</Label>
              <Input
                id="additional-info"
                placeholder="Any other information about your field..."
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetForm} disabled={isGenerating}>
            Reset
          </Button>
          <Button onClick={generateRecommendations} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Recommendations"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="lg:col-span-2">
        {recommendations.length > 0 ? (
          <>
            <CardHeader>
              <CardTitle>Fertilizer Recommendations</CardTitle>
              <CardDescription>
                Based on {cropType} growing in {soilType} soil at {growthStage} stage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="soil">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="soil">Soil Analysis</TabsTrigger>
                  <TabsTrigger value="fertilizer">Fertilizer Plan</TabsTrigger>
                </TabsList>
                
                <TabsContent value="soil" className="pt-4">
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-md flex items-start">
                      <AlertCircle className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-700 font-medium">
                          Soil Nutrient Status
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Analysis shows nutrient deficiencies that need to be addressed 
                          with a balanced fertilization plan.
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {soilNutrients.map((nutrient, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{nutrient.name}</span>
                            <span className="text-sm">
                              {nutrient.value} {nutrient.unit} 
                              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs text-white ${nutrient.color}`}>
                                {nutrient.status}
                              </span>
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${nutrient.color}`} 
                              style={{ width: `${Math.min(nutrient.status === "High" ? 100 : nutrient.status === "Optimal" ? 75 : nutrient.status === "Medium" ? 50 : 25, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Soil pH: {soilPH[0]} - {
                          soilPH[0] < 5.5 ? "Acidic" : 
                          soilPH[0] >= 5.5 && soilPH[0] <= 7.5 ? "Optimal" : "Alkaline"
                        }
                      </p>
                      <p className="text-xs text-gray-600">
                        {soilPH[0] < 5.5 ? 
                          "Consider applying agricultural lime to raise pH for better nutrient availability." : 
                          soilPH[0] > 7.5 ? 
                          "Consider applying sulfur or acidifying amendments to lower pH for better nutrient availability." : 
                          "Current pH is optimal for most crops and allows for good nutrient availability."
                        }
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="fertilizer" className="pt-4">
                  <div className="space-y-6">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="border rounded-md p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-medium text-agro-green-dark">
                            {rec.name}
                          </h3>
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {rec.formula}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500">Application Rate</p>
                            <p className="text-sm">{rec.applicationRate}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500">Timing</p>
                            <p className="text-sm">{rec.timing}</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <p className="text-xs text-gray-500">Application Method</p>
                            <p className="text-sm">{rec.method}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-xs text-gray-500">Benefits</p>
                          <ul className="space-y-1">
                            {rec.benefits.map((benefit, idx) => (
                              <li key={idx} className="flex items-start">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                                <span className="text-sm">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="mb-4">
              <img 
                src="https://img.icons8.com/cotton/100/soil--v1.png" 
                alt="Soil and fertilizer" 
                className="w-24 h-24 opacity-50" 
              />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No Recommendations Yet
            </h3>
            <p className="text-gray-500 mb-6 max-w-md">
              Fill out the crop and soil information form to receive personalized 
              fertilizer recommendations based on your specific conditions.
            </p>
            <div className="grid grid-cols-2 gap-4 text-left w-full max-w-md">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Optimized Nutrition</p>
                  <p className="text-xs text-gray-500">Tailored to your crop needs</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Economic Benefits</p>
                  <p className="text-xs text-gray-500">Reduce waste and costs</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Sustainable Practices</p>
                  <p className="text-xs text-gray-500">Environmentally friendly</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Higher Yields</p>
                  <p className="text-xs text-gray-500">Maximize crop production</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FertilizerRecommendation;
