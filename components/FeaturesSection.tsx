import React from 'react';
import { MessageCircle, Brain, Lock, Target, Shield } from 'lucide-react';

const FeaturesSection = () => {
  const acronym = [
    { letter: 'M', word: 'eaningful Support' },
    { letter: 'A', word: 'ccessible Care' },
    { letter: 'R', word: 'eal Connection' },
    { letter: 'G', word: 'uided Healing' },
    { letter: 'I', word: 'nnovative Solution' },
    { letter: 'N', word: 'urturing Care' }
  ];

  const features = [
    { icon: MessageCircle, title: "Express Freely", description: "Share your thoughts in a supportive environment" },
    { icon: Brain, title: "AI-Powered", description: "Smart matching with the right therapist" },
    { icon: Lock, title: "Complete Privacy", description: "Secure and confidential support" },
    { icon: Shield, title: "Stay Anonymous", description: "Express yourself without revealing identity" },
    { icon: Target, title: "Affordable Care", description: "Pro bono and low-cost therapy options" }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-green-700">Breaking Barriers to Mental Health</h2>
          <div className="flex justify-center gap-8 flex-wrap">
            {acronym.map(({ letter, word }, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-green-600 font-bold">{letter}</span>
                <span className="text-green-700">{word}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-green-100 rounded-full">
                <feature.icon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-700">{feature.title}</h3>
              <p className="text-green-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
