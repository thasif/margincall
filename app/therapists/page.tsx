'use client';

import React, { useState } from 'react';
import { Search, MapPin, Star, Filter, Clock, Calendar } from 'lucide-react';
import Image from 'next/image';

const therapists = [
    {
        id: 1,
        name: "Dr. Li Wei Chen",
        title: "Clinical Psychologist",
        license: "Ph.D, Licensed Psychologist",
        location: "Singapore",
        rating: 4.9,
        reviews: 127,
        experience: "12 years",
        specialties: ["Anxiety", "Depression", "Trauma", "PTSD"],
        languages: ["English", "Mandarin", "Hokkien"],
        nextAvailable: "Tomorrow",
        priceRange: "$10-15",
        proBono: true,
        imageUrl: "/api/placeholder/100/100",
    },
    {
        id: 2,
        name: "Dr. Priya Sharma",
        title: "Psychiatrist",
        license: "MD, Board Certified Psychiatrist",
        location: "Mumbai, India",
        rating: 4.8,
        reviews: 98,
        experience: "15 years",
        specialties: ["Anxiety", "Depression", "ADHD", "Bipolar Disorder"],
        languages: ["English", "Hindi", "Marathi"],
        nextAvailable: "This week",
        priceRange: "$12-15",
        proBono: false,
        imageUrl: "/api/placeholder/100/100",
    },
    {
        id: 3,
        name: "Made Dewi Astuti",
        title: "Licensed Clinical Social Worker",
        license: "LCSW",
        location: "Bali, Indonesia",
        rating: 4.9,
        reviews: 156,
        experience: "8 years",
        specialties: ["Family Therapy", "Relationship Issues", "Grief"],
        languages: ["English", "Indonesian", "Balinese"],
        nextAvailable: "Today",
        priceRange: "$10-12",
        proBono: true,
        imageUrl: "/api/placeholder/100/100",
    },
    {
        license: "Ph.D, Licensed Psychologist",
        location: "Boston, MA",
        rating: 4.7,
        reviews: 89,
        experience: "20 years",
        specialties: ["Anxiety", "Depression", "OCD", "Eating Disorders"],
        languages: ["English", "French"],
        nextAvailable: "This week",
        priceRange: "$130-180",
        proBono: false,
        imageUrl: "/api/placeholder/100/100",
    },
    {
        id: 5,
        name: "Maria Rodriguez",
        title: "Marriage and Family Therapist",
        license: "LMFT",
        location: "Los Angeles, CA",
        rating: 4.8,
        reviews: 112,
        experience: "10 years",
        specialties: ["Couples Therapy", "Family Conflicts", "Parenting"],
        languages: ["English", "Spanish"],
        nextAvailable: "Tomorrow",
        priceRange: "$100-140",
        proBono: true,
        imageUrl: "/api/placeholder/100/100",
    },
    {
        id: 6,
        name: "Dr. David Kim",
        title: "Psychiatrist",
        license: "MD, Board Certified Psychiatrist",
        location: "Seattle, WA",
        rating: 4.9,
        reviews: 78,
        experience: "14 years",
        specialties: ["Depression", "Anxiety", "ADHD", "Sleep Disorders"],
        languages: ["English", "Korean"],
        nextAvailable: "This week",
        priceRange: "$160-200",
        proBono: false,
        imageUrl: "/api/placeholder/100/100",
    },
    {
        id: 7,
        name: "Rachel Greene",
        title: "Licensed Professional Counselor",
        license: "LPC",
        location: "Denver, CO",
        rating: 4.8,
        reviews: 94,
        experience: "7 years",
        specialties: ["Stress", "Anxiety", "Life Transitions", "Career Counseling"],
        languages: ["English"],
        nextAvailable: "Today",
        priceRange: "$80-120",
        proBono: true,
        imageUrl: "/api/placeholder/100/100",
    },
    {
        id: 8,
        name: "Dr. Lisa Thompson",
        title: "Clinical Psychologist",
        license: "Ph.D, Licensed Psychologist",
        location: "Austin, TX",
        rating: 4.7,
        reviews: 86,
        experience: "11 years",
        specialties: ["Trauma", "PTSD", "Anxiety", "Depression"],
        languages: ["English"],
        nextAvailable: "Tomorrow",
        priceRange: "$110-160",
        proBono: false,
        imageUrl: "/api/placeholder/100/100",
    },
    {
        id: 9,
        name: "Dr. Robert Patel",
        title: "Psychiatrist",
        license: "MD, Board Certified Psychiatrist",
        location: "Miami, FL",
        rating: 4.9,
        reviews: 134,
        experience: "18 years",
        specialties: ["Bipolar Disorder", "Schizophrenia", "Depression"],
        languages: ["English", "Hindi", "Gujarati"],
        nextAvailable: "This week",
        priceRange: "$140-190",
        proBono: true,
        imageUrl: "/api/placeholder/100/100",
    },
    {
        id: 10,
        name: "Amanda Foster",
        title: "Licensed Clinical Social Worker",
        license: "LCSW",
        location: "Portland, OR",
        rating: 4.8,
        reviews: 91,
        experience: "9 years",
        specialties: ["Anxiety", "Depression", "LGBTQ+ Issues", "Gender Identity"],
        languages: ["English"],
        nextAvailable: "Today",
        priceRange: "$90-130",
        proBono: true,
        imageUrl: "/api/placeholder/100/100",
    }
];

export default function TherapistListPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

    const filteredTherapists = therapists.filter(therapist => {
        const matchesSearch = therapist.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            therapist.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            therapist.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

        if (selectedSpecialties.length === 0) return matchesSearch;

        return matchesSearch && therapist.specialties.some(s => selectedSpecialties.includes(s));
    });

    const allSpecialties = Array.from(new Set(therapists.flatMap(t => t.specialties)));

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">Find Your Therapist</h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-6">
                {/* Search and Filter Bar */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name, location, or specialty..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="relative">
                                <select
                                    className="appearance-none px-4 py-2 pr-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                                    onChange={(e) => setSelectedSpecialties(Array.from(e.target.selectedOptions, option => option.value))}
                                    multiple={false}
                                >
                                    <option value="">All Specialties</option>
                                    {allSpecialties.map(specialty => (
                                        <option key={specialty} value={specialty}>{specialty}</option>
                                    ))}
                                </select>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
                                <Filter className="w-5 h-5" />
                                Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Therapist Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredTherapists.map((therapist) => (
                        <div key={therapist.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    <Image
                                        src={therapist.imageUrl}
                                        alt={"therapist.name"}
                                        width={100}
                                        height={100}
                                        className="w-20 h-20 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900">{therapist.name}</h3>
                                                <p className="text-gray-600">{therapist.title}</p>
                                                <p className="text-sm text-gray-500">{therapist.license}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                                <span className="font-semibold">{therapist.rating}</span>
                                                <span className="text-gray-500">({therapist.reviews})</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center gap-2 text-gray-600">
                                            <MapPin className="w-4 h-4" />
                                            <span>{therapist.location}</span>
                                        </div>

                                        <div className="mt-2 flex items-center gap-2 text-gray-600">
                                            <Clock className="w-4 h-4" />
                                            <span>{therapist.experience} experience</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="flex flex-wrap gap-2">
                                        {therapist.specialties.map((specialty, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                                            >
                                                {specialty}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-gray-600">Next Available</div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-green-600" />
                                            <span className="font-medium">{therapist.nextAvailable}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-600">Session Fee</div>
                                        <div className="font-medium">{therapist.priceRange}</div>
                                        {therapist.proBono && (
                                            <div className="text-sm text-green-600">Pro bono available</div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-4">
                                    <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                                        Book Session
                                    </button>
                                    <button className="flex-1 border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition">
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}