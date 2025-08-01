import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Helmet } from "react-helmet";
import { getPageTitle, siteConfig } from "@/config/siteConfig";

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title translate="no">{getPageTitle('notFound')}</title>
        <meta name="description" content={`The page you're looking for could not be found on ${siteConfig.name}.`} />
      </Helmet>
      
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
            </div>

            <p className="mt-4 text-sm text-gray-600">
              Did you forget to add the page to the router?
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}