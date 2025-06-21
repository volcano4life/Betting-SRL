import { Helmet } from "react-helmet";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/use-page-title";

export default function AboutUsPage() {
  const { t, language } = useLanguage();
  
  usePageTitle('aboutUs.title');

  return (
    <>
      <Helmet>
        <meta name="description" content={t('aboutUs.description')} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-[#222236] mb-6">
                {t('aboutUs.title')}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {t('aboutUs.subtitle')}
              </p>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8">
              <div className="prose prose-lg max-w-none">
                
                {/* Our Story Section */}
                <div className="mb-10">
                  <h2 className="text-2xl md:text-3xl font-semibold text-[#222236] mb-6">
                    {t('aboutUs.ourStory')}
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {t('aboutUs.storyText1')}
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {t('aboutUs.storyText2')}
                  </p>
                </div>

                {/* Our Mission Section */}
                <div className="mb-10">
                  <h2 className="text-2xl md:text-3xl font-semibold text-[#222236] mb-6">
                    {t('aboutUs.ourMission')}
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {t('aboutUs.missionText1')}
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {t('aboutUs.missionText2')}
                  </p>
                </div>

                {/* Our Outlets Section */}
                <div className="mb-10">
                  <h2 className="text-2xl md:text-3xl font-semibold text-[#222236] mb-6">
                    {t('aboutUs.ourOutlets')}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-[#222236] mb-3">
                        Redmoon Aversa
                      </h3>
                      <p className="text-gray-700">
                        {language === 'it' 
                          ? 'Il nostro punto vendita premium ad Aversa, con scommesse sportive live, giochi virtuali e un\'atmosfera accogliente per tutti gli appassionati di scommesse.'
                          : 'Our premium betting outlet in Aversa, featuring live sports betting, virtual games, and a welcoming atmosphere for all betting enthusiasts.'
                        }
                      </p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-[#222236] mb-3">
                        Wincity Trentola-Ducenta
                      </h3>
                      <p className="text-gray-700">
                        {language === 'it'
                          ? 'La nostra sede Wincity a Trentola-Ducenta offre un\'esperienza di scommesse moderna con strutture all\'avanguardia e un\'ampia gamma di opzioni di gioco.'
                          : 'Our Wincity location in Trentola-Ducenta offers a modern betting experience with state-of-the-art facilities and a wide range of gaming options.'
                        }
                      </p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-[#222236] mb-3">
                        Matchpoint Trentola-Ducenta
                      </h3>
                      <p className="text-gray-700">
                        {language === 'it'
                          ? 'Visita la nostra sede Matchpoint a Trentola-Ducenta per un\'esperienza di scommesse sportive premium con quote in tempo reale e personale esperto per guidarti.'
                          : 'Visit our Matchpoint location in Trentola-Ducenta for a premium sports betting experience with real-time odds and expert staff to guide you.'
                        }
                      </p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-[#222236] mb-3">
                        Caffeteria Nini
                      </h3>
                      <p className="text-gray-700">
                        {language === 'it'
                          ? 'Un bar e ristorante accogliente che offre esperienze culinarie e di gioco. Goditi ottimo cibo e bevande mentre scommetti in un\'atmosfera rilassata e sociale.'
                          : 'A welcoming bar and restaurant offering both dining and gaming experiences. Enjoy excellent food and drinks while betting in a relaxed, social atmosphere.'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="border-t pt-8">
                  <h2 className="text-2xl md:text-3xl font-semibold text-[#222236] mb-6">
                    {t('aboutUs.contactUs')}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-[#222236] mb-3">
                        {t('aboutUs.companyInfo')}
                      </h3>
                      <p className="text-gray-700 mb-2">
                        <strong>Betting SRL</strong>
                      </p>
                      <p className="text-gray-700 mb-2">
                        Via Roma 123, Aversa (CE)
                      </p>
                      <p className="text-gray-700">
                        {t('aboutUs.legalNotice')}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#222236] mb-3">
                        {t('aboutUs.responsibleGaming')}
                      </h3>
                      <p className="text-gray-700">
                        {t('aboutUs.responsibleGamingText')}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}