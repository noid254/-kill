import React from 'react';

const MentorshipPage: React.FC = () => {
    return (
        <div className="p-4 bg-gray-50 min-h-full text-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-900">Mentorship Opportunities</h1>
                <p className="text-gray-600 mt-2 mb-6">Gain experience and grow your skills.</p>
                
                <div className="mx-auto h-32 w-32 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>

                <h2 className="text-xl font-semibold text-gray-800 mt-6">Coming Soon!</h2>
                <p className="text-gray-500 mt-2 leading-relaxed">
                    This section will connect new professionals with mentorships and internships. Experienced providers can list 3-month opportunities for those with skills but little experience. Interns will be able to provide feedback after completion.
                </p>
                <p className="text-sm text-gray-500 mt-4 p-3 bg-gray-100 rounded-lg">
                    New to Niko Soko? We recommend seeking a mentorship to gain experience and boost your profile score!
                </p>
            </div>
        </div>
    );
};

export default MentorshipPage;
