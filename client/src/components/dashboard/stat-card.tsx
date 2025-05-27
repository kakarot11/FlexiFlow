import { ArrowDown, ArrowUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
  changePercentage?: number;
  changeText?: string;
  linkText?: string;
  linkHref?: string;
}

export function StatCard({
  title,
  value,
  icon,
  iconBgColor,
  changePercentage,
  changeText,
  linkText,
  linkHref = "#",
}: StatCardProps) {
  const isPositiveChange = changePercentage && changePercentage > 0;
  
  return (
    <Card>
      <CardContent className="px-5 py-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${iconBgColor}`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-muted-foreground truncate">{title}</dt>
              <dd>
                <div className="text-lg font-semibold text-foreground">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
        
        {(changePercentage !== undefined || changeText || linkText) && (
          <div className="mt-4">
            <div className="flex items-center justify-between">
              {(changePercentage !== undefined || changeText) && (
                <span className={`text-xs font-medium flex items-center ${
                  isPositiveChange ? 'text-green-600' : 'text-muted-foreground'
                }`}>
                  {changePercentage !== undefined && (
                    isPositiveChange 
                      ? <ArrowUp className="mr-1 h-3 w-3" /> 
                      : <ArrowDown className="mr-1 h-3 w-3" />
                  )}
                  {changeText || `${Math.abs(changePercentage)}% from last week`}
                </span>
              )}
              
              {linkText && (
                <a 
                  href={linkHref} 
                  className="text-xs text-primary hover:text-primary/80"
                >
                  {linkText}
                </a>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
