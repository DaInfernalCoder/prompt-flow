
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  ArrowLeft,
  Search,
  RefreshCw,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ResearchStepProps {
  requirements: string;
  brainstorm: string;
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  projectId?: string;
}

export function ResearchStep({
  requirements,
  brainstorm,
  value,
  onChange,
  onNext,
  onBack,
  projectId,
}: ResearchStepProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateResearch = async () => {
    setIsGenerating(true);

    try {
      console.log("Calling generate-research with projectId:", projectId);

      const { data, error } = await supabase.functions.invoke(
        "generate-research",
        {
          body: {
            requirements,
            brainstorm,
            projectId,
          },
        }
      );

      if (error) throw error;

      onChange(data.research);
      toast({
        title: "Research Generated",
        description: "Technical research has been completed successfully.",
      });
    } catch (error) {
      console.error("Error generating research:", error);
      toast({
        title: "Error",
        description: "Failed to generate research. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
          Technical Research
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Our AI will analyze your requirements and brainstorming selections to
          provide comprehensive technical research and recommendations.
        </p>
      </div>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Search className="w-5 h-5 text-orange-500" />
            Research Report
          </CardTitle>
          <CardDescription className="text-gray-400">
            Deep technical analysis of your project requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!value && !isGenerating && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Ready to Research
              </h3>
              <p className="text-gray-400 mb-6">
                Click below to generate comprehensive technical research based
                on your requirements and brainstorming selections.
              </p>
              <Button
                onClick={generateResearch}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Generate Research Report
                <Search className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {isGenerating && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-orange-500 mb-4">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">
                  Analyzing requirements and generating research...
                </span>
              </div>
              <Skeleton className="h-4 w-full bg-gray-700" />
              <Skeleton className="h-4 w-3/4 bg-gray-700" />
              <Skeleton className="h-4 w-1/2 bg-gray-700" />
              <Skeleton className="h-20 w-full bg-gray-700" />
              <Skeleton className="h-4 w-2/3 bg-gray-700" />
            </div>
          )}

          {value && !isGenerating && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-500">
                  ✓ Research completed
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateResearch}
                  className="bg-orange-600 border-orange-600 text-white hover:bg-orange-700 hover:border-orange-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono">
                  {value}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="bg-orange-600 border-orange-600 text-white hover:bg-orange-700 hover:border-orange-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Brainstorm
        </Button>
        <Button
          onClick={handleNext}
          disabled={!value}
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-2 disabled:opacity-50"
        >
          Continue to PRD
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
