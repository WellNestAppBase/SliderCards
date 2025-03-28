import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ThemeComparisonProps {
  themes?: string[];
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
}

const ThemeComparison: React.FC<ThemeComparisonProps> = ({
  themes = ["light", "dark", "system"],
  currentTheme = "system",
  onThemeChange = () => {},
}) => {
  return (
    <Card className="w-full bg-background">
      <CardHeader>
        <CardTitle>Theme Comparison</CardTitle>
        <CardDescription>
          Compare and select different theme options
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={currentTheme} onValueChange={onThemeChange}>
          <TabsList className="grid grid-cols-3 mb-4">
            {themes.map((theme) => (
              <TabsTrigger key={theme} value={theme} className="capitalize">
                {theme}
              </TabsTrigger>
            ))}
          </TabsList>

          {themes.map((theme) => (
            <TabsContent
              key={theme}
              value={theme}
              className="p-4 border rounded-md"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {theme.charAt(0).toUpperCase() + theme.slice(1)} Theme
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-primary text-primary-foreground rounded-md">
                    Primary
                  </div>
                  <div className="p-4 bg-secondary text-secondary-foreground rounded-md">
                    Secondary
                  </div>
                  <div className="p-4 bg-accent text-accent-foreground rounded-md">
                    Accent
                  </div>
                  <div className="p-4 bg-muted text-muted-foreground rounded-md">
                    Muted
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ThemeComparison;
