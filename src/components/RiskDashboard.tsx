
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Thermometer, Droplets, Wind, AlertTriangle, CloudRain } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface RiskDashboardProps {
  location: string;
}

const weatherData = [
  { day: "Mon", temperature: 32, humidity: 65, rainfall: 0 },
  { day: "Tue", temperature: 30, humidity: 68, rainfall: 0 },
  { day: "Wed", temperature: 31, humidity: 70, rainfall: 5 },
  { day: "Thu", temperature: 29, humidity: 75, rainfall: 15 },
  { day: "Fri", temperature: 28, humidity: 80, rainfall: 8 },
  { day: "Sat", temperature: 30, humidity: 72, rainfall: 0 },
  { day: "Sun", temperature: 33, humidity: 60, rainfall: 0 },
];

const crops = [
  { 
    name: "Rice", 
    riskLevel: 75,
    threats: [
      { name: "Blast Disease", probability: "High", due: "High humidity" },
      { name: "Stem Borer", probability: "Medium", due: "Seasonal pattern" }
    ] 
  },
  { 
    name: "Tomato", 
    riskLevel: 45,
    threats: [
      { name: "Early Blight", probability: "Medium", due: "Temperature fluctuation" },
      { name: "Fruit Worm", probability: "Low", due: "Current growth stage" }
    ] 
  },
  { 
    name: "Wheat", 
    riskLevel: 20,
    threats: [
      { name: "Rust", probability: "Low", due: "Dry conditions" },
      { name: "Aphids", probability: "Very Low", due: "Season not favorable" }
    ] 
  },
];

const getRiskColor = (level: number) => {
  if (level < 30) return "bg-green-500";
  if (level < 60) return "bg-yellow-500";
  return "bg-red-500";
};

const WeatherCard: React.FC<{ title: string; value: string; icon: React.ReactNode; className?: string }> = ({ 
  title, value, icon, className 
}) => (
  <Card className={className}>
    <CardContent className="flex items-center p-4">
      <div className="mr-4 text-gray-500">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const RiskDashboard: React.FC<RiskDashboardProps> = ({ location }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Weather</CardTitle>
            <CardDescription>
              Today's weather conditions in {location}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <WeatherCard 
                title="Temperature" 
                value="32°C" 
                icon={<Thermometer className="w-6 h-6" />} 
                className="bg-orange-50"
              />
              <WeatherCard 
                title="Humidity" 
                value="68%" 
                icon={<Droplets className="w-6 h-6" />} 
                className="bg-blue-50"
              />
              <WeatherCard 
                title="Wind Speed" 
                value="12 km/h" 
                icon={<Wind className="w-6 h-6" />} 
                className="bg-gray-50"
              />
              <WeatherCard 
                title="Rainfall" 
                value="0 mm" 
                icon={<CloudRain className="w-6 h-6" />} 
                className="bg-teal-50"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weather Forecast</CardTitle>
            <CardDescription>7-day weather prediction</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weatherData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#F59E0B" 
                  fillOpacity={1} 
                  fill="url(#temperatureGradient)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#3B82F6" 
                  fillOpacity={1} 
                  fill="url(#humidityGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Crop Risk Assessment</CardTitle>
          <CardDescription>
            Current risk levels for crops in your area
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {crops.map((crop) => (
              <div key={crop.name}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{crop.name}</h3>
                  <span className="text-sm font-medium">
                    Risk Level: {crop.riskLevel}%
                  </span>
                </div>
                <Progress 
                  value={crop.riskLevel} 
                  className={`h-2 ${getRiskColor(crop.riskLevel)}`} 
                />
                
                <div className="mt-4 bg-gray-50 p-3 rounded-md">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Potential Threats:</h4>
                      <ul className="mt-1 space-y-1">
                        {crop.threats.map((threat, idx) => (
                          <li key={idx} className="text-sm flex justify-between">
                            <span>{threat.name}</span>
                            <span className="text-gray-500 text-xs">
                              {threat.probability} ({threat.due})
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskDashboard;
