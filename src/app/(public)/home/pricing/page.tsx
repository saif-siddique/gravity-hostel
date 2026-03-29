import { Check, Wifi, Coffee, Key, Wind, Shield } from "lucide-react";

export default function RoomsAdvertisementPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            See Our Rooms
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            We offer comfortable rooms for every student. Choose the one that fits your needs best.
          </p>
        </div>

        <div className="space-y-16">
          {/* Standard Room */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="lg:w-2/5 h-64 lg:h-auto relative">
              <img 
                src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop" 
                alt="Standard Room" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Standard Room</h2>
                  <p className="text-gray-500 mt-2">A great choice for a simple and good stay.</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-extrabold text-indigo-600">PKR 15,000</p>
                  <p className="text-sm text-gray-400 font-medium tracking-wide uppercase mt-1">per month</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 my-8">
                <div className="flex items-center text-gray-700">
                  <Wifi className="w-5 h-5 mr-3 text-indigo-500" /> Fast Internet
                </div>
                <div className="flex items-center text-gray-700">
                  <Shield className="w-5 h-5 mr-3 text-indigo-500" /> Safe Lockers
                </div>
                <div className="flex items-center text-gray-700">
                  <Wind className="w-5 h-5 mr-3 text-indigo-500" /> Ceiling Fan
                </div>
                <div className="flex items-center text-gray-700">
                  <Coffee className="w-5 h-5 mr-3 text-indigo-500" /> Shared Kitchen
                </div>
              </div>
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition duration-200">
                Register Student
              </button>
            </div>
          </div>

          {/* Deluxe Room */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row-reverse border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="lg:w-2/5 h-64 lg:h-auto relative">
              <img 
                src="https://images.unsplash.com/photo-1522771731478-44fb9f82de0a?q=80&w=2070&auto=format&fit=crop" 
                alt="Deluxe Room" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Deluxe Room</h2>
                  <p className="text-gray-500 mt-2">More space and better features for you.</p>
                </div>
                <div className="sm:text-right mt-4 sm:mt-0">
                  <p className="text-4xl font-extrabold text-indigo-600">PKR 25,000</p>
                  <p className="text-sm text-gray-400 font-medium tracking-wide uppercase mt-1">per month</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 my-8">
                <div className="flex items-center text-gray-700">
                  <Key className="w-5 h-5 mr-3 text-indigo-500" /> Attached Washroom
                </div>
                <div className="flex items-center text-gray-700">
                  <Wifi className="w-5 h-5 mr-3 text-indigo-500" /> Fast Internet
                </div>
                <div className="flex items-center text-gray-700">
                  <Shield className="w-5 h-5 mr-3 text-indigo-500" /> Daily Cleaning
                </div>
                <div className="flex items-center text-gray-700">
                  <Wind className="w-5 h-5 mr-3 text-indigo-500" /> Air Conditioner (AC)
                </div>
              </div>
              <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition duration-200 shadow-lg">
                Register Student
              </button>
            </div>
          </div>

          {/* Suite Room */}
          <div className="bg-indigo-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row relative">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
            <div className="lg:w-full p-8 lg:p-16 flex flex-col lg:flex-row justify-between items-center relative z-10 gap-8">
              <div className="lg:w-1/2">
                <div className="inline-block bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
                  Best Choice
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">Suite Room</h2>
                <p className="text-indigo-200 text-lg mb-8">
                  Our best room with a lot of space. Study, relax, and live in the best way possible.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center text-indigo-50">
                    <Check className="w-5 h-5 mr-3 text-indigo-400" /> Big Study Desk
                  </div>
                  <div className="flex items-center text-indigo-50">
                    <Check className="w-5 h-5 mr-3 text-indigo-400" /> Free Laundry
                  </div>
                  <div className="flex items-center text-indigo-50">
                    <Check className="w-5 h-5 mr-3 text-indigo-400" /> Tea and Coffee
                  </div>
                  <div className="flex items-center text-indigo-50">
                    <Check className="w-5 h-5 mr-3 text-indigo-400" /> Top Floor Views
                  </div>
                </div>
              </div>
              <div className="lg:w-1/3 w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20">
                <p className="text-indigo-200 mb-2">Starting from</p>
                <p className="text-5xl font-extrabold text-white mb-2">PKR 40,000</p>
                <p className="text-sm text-indigo-200 font-medium tracking-wide uppercase mb-8">per month</p>
                <button className="w-full bg-white text-indigo-900 hover:bg-indigo-50 shadow-[0_0_20px_rgba(255,255,255,0.3)] font-bold py-4 rounded-xl transition duration-200">
                  Register Student
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
