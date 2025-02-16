import React from 'react';
import { MessageCircle, Video, Bot } from 'lucide-react';

const HeroSection = () => {
  const features = [
    {
      title: "Anonymous Rant",
      description: "Express freely in a safe space with complete privacy",
      action: "Share now",
      icon: MessageCircle
    },
    {
      title: "Video Sessions",
      description: "Direct therapy with flexible scheduling options",
      action: "Book now",
      icon: Video
    },
    {
      title: "AI-Powered Match",
      description: "Get matched with the perfect therapist instantly",
      action: "Get matched",
      icon: Bot
    }
  ];

  return (
    <section className="bg-green-50 text-green-900 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Content */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Healing Without Boundaries
            </h1>
            <p className="text-xl mb-8 text-green-700 max-w-2xl mx-auto">
              Connect with compassionate therapists anonymously. Express freely, heal meaningfully.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition text-lg">
                Start Your Journey
              </button>
              <button className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg hover:bg-green-600 hover:text-white transition text-lg">
                Find Therapists
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <feature.icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center">{feature.title}</h3>
                <p className="text-green-700 mb-6 text-center">{feature.description}</p>
                <button className="w-full text-green-600 font-medium hover:text-green-700 flex items-center justify-center gap-2 group">
                  {feature.action}
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;