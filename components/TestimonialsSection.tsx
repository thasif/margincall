import React from 'react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      text: "The anonymous rant feature helped me express my feelings without fear. The therapist I was matched with understood me perfectly. It was exactly what I needed to take the first step.",
      author: "Anonymous User",
      category: "Anxiety Management",
      rating: 5
    },
    {
      text: "As a student, I couldn't afford traditional therapy. Margin Call connected me with a pro bono therapist who changed my life. The platform made mental healthcare accessible when I needed it most.",
      author: "College Student",
      category: "Depression Support",
      rating: 5
    },
    {
      text: "The AI matching was spot-on! Found a therapist who specialized in exactly what I needed. The video sessions are so convenient, and the affordable rates made regular therapy possible.",
      author: "Working Professional",
      category: "Work-Life Balance",
      rating: 5
    }
  ];

  return (
    <section className="py-16 bg-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-green-700">Healing Stories</h2>
          <p className="text-green-600 max-w-2xl mx-auto">
            Real experiences from people who found support and healing through Margin Call
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg transition-transform hover:scale-105">
              <div className="mb-4">
                <div className="flex text-yellow-400 mb-2">
                  {'★'.repeat(testimonial.rating)}
                </div>
                <p className="text-green-700 italic leading-relaxed">"{testimonial.text}"</p>
              </div>
              <div className="mt-4 pt-4 border-t border-green-100">
                <p className="font-semibold text-green-800">{testimonial.author}</p>
                <p className="text-sm text-green-600">{testimonial.category}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-2 text-green-700">Join Our Community</h3>
            <p className="text-green-600">Take the first step towards your mental well-being journey</p>
          </div>
          <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition">
            Start Your Journey Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
