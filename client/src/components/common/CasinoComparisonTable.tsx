import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, Star } from "lucide-react";
import RatingStars from "./RatingStars";
import { useState } from "react";
import PromoCodeModal from "./PromoCodeModal";

interface CasinoComparisonItem {
  id: number;
  name: string;
  logo: string;
  rating: number;
  welcomeBonus: string;
  promoCode?: string;
  minDeposit: string;
  wagering: string;
  paymentMethods: string[];
  features: {
    liveCasino: boolean;
    sportsBetting: boolean;
    mobileFriendly: boolean;
    italianSupport: boolean;
  };
}

interface CasinoComparisonTableProps {
  casinos: CasinoComparisonItem[];
}

export default function CasinoComparisonTable({ casinos }: CasinoComparisonTableProps) {
  const [promoModalData, setPromoModalData] = useState<{
    open: boolean;
    casino?: string;
    promoCode?: string;
  }>({
    open: false
  });

  const handleShowPromoCode = (casino: string, promoCode: string) => {
    setPromoModalData({
      open: true,
      casino,
      promoCode
    });
  };

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[180px]">Casino</TableHead>
              <TableHead className="text-center">Rating</TableHead>
              <TableHead className="text-center">Welcome Bonus</TableHead>
              <TableHead className="text-center">Min Deposit</TableHead>
              <TableHead className="text-center">Wagering</TableHead>
              <TableHead className="text-center">Features</TableHead>
              <TableHead className="w-[120px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {casinos.map((casino) => (
              <TableRow key={casino.id}>
                <TableCell>
                  <div className="flex flex-col items-center text-center">
                    <img 
                      src={casino.logo} 
                      alt={casino.name} 
                      className="h-12 object-contain mb-2" 
                    />
                    <span className="font-bold text-sm">{casino.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center">
                    <RatingStars rating={casino.rating} size="sm" />
                    <span className="text-sm font-medium mt-1">{casino.rating.toFixed(1)}/10</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="text-sm font-medium">{casino.welcomeBonus}</div>
                  {casino.promoCode && (
                    <Button 
                      variant="link" 
                      className="text-xs p-0 h-auto text-primary underline"
                      onClick={() => handleShowPromoCode(casino.name, casino.promoCode!)}
                    >
                      Show Code
                    </Button>
                  )}
                </TableCell>
                <TableCell className="text-center text-sm">{casino.minDeposit}</TableCell>
                <TableCell className="text-center text-sm">{casino.wagering}</TableCell>
                <TableCell>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center">
                      {casino.features.liveCasino ? (
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span>Live Casino</span>
                    </div>
                    <div className="flex items-center">
                      {casino.features.sportsBetting ? (
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span>Sports</span>
                    </div>
                    <div className="flex items-center">
                      {casino.features.mobileFriendly ? (
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span>Mobile</span>
                    </div>
                    <div className="flex items-center">
                      {casino.features.italianSupport ? (
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span>IT Support</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Button size="sm" className="w-full mb-1">
                    Visit Site
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {promoModalData.casino && promoModalData.promoCode && (
        <PromoCodeModal
          open={promoModalData.open}
          onOpenChange={(open) => setPromoModalData({ ...promoModalData, open })}
          title="Exclusive Bonus Code"
          description="Use this code during registration to claim your bonus"
          promoCode={promoModalData.promoCode}
          casino={promoModalData.casino}
          expiryDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()} // 30 days from now
        />
      )}
    </>
  );
}