import { useNavigate } from 'react-router-dom';
import { Users, ArrowRight, Globe, Award, Building2, UserCheck, Calendar, TrendingUp, HeadphonesIcon, MapPin } from 'lucide-react';

const SLBFELandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Foreign Employment Staff Management",
      description: "Comprehensive management of SLBFE personnel across all departments and branches nationwide with specialized role assignments."
    },
    {
      icon: <Globe className="w-8 h-8 text-green-600" />,
      title: "Multi-Country Program Management",
      description: "Manage staff assignments for Korea, Japan, Middle East, and other foreign employment programs with country-specific expertise tracking."
    },
    {
      icon: <Award className="w-8 h-8 text-purple-600" />,
      title: "Training & Certification Tracking",
      description: "Track employee certifications, training programs, and skill development for pre-departure training coordinators and specialists."
    },
    {
      icon: <Building2 className="w-8 h-8 text-orange-600" />,
      title: "Branch Network Management",
      description: "Centralized management of 50+ branches nationwide with location-specific staffing, resources, and performance tracking."
    },
    {
      icon: <UserCheck className="w-8 h-8 text-red-600" />,
      title: "Migrant Worker Case Assignment",
      description: "Assign and track SLBFE staff responsible for specific migrant worker cases, ensuring proper oversight and support."
    },
    {
      icon: <Calendar className="w-8 h-8 text-teal-600" />,
      title: "Government Compliance & Audit",
      description: "Maintain compliance with government regulations, track audit requirements, and ensure policy adherence across all operations."
    }
  ];

  const stats = [
    { number: "1,500+", label: "SLBFE Staff Members", color: "text-blue-600" },
    { number: "50+", label: "Branch Offices", color: "text-green-600" },
    { number: "144K+", label: "Workers Deployed (2025)", color: "text-purple-600" },
    { number: "15+", label: "Destination Countries", color: "text-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SLBFE</h1>
                <p className="text-sm text-gray-600">HR Management System</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              SLBFE HR
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Management System
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Streamline human resource management for Sri Lanka's premier foreign employment bureau. 
              Manage staff across 50+ branches, track training programs, and oversee operations that 
              facilitate overseas employment for thousands of Sri Lankan workers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                Access System
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button className="border-2 border-gray-300 hover:border-blue-600 text-gray-800 hover:text-blue-600 px-8 py-4 rounded-lg font-semibold transition-all duration-200">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Specialized HR Solutions for SLBFE
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Purpose-built for Sri Lanka's Bureau of Foreign Employment, managing a diverse workforce 
              dedicated to facilitating overseas employment opportunities for Sri Lankan citizens.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SLBFE Specific Capabilities Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Empowering SLBFE's Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Supporting the bureau that has facilitated over 144,000 overseas employment opportunities in 2025 alone.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Performance Analytics</h3>
              <p className="text-gray-600 mb-4">Track staff performance across different programs - Korea EPS, Japan Technical Training, Middle East placements, and more.</p>
              <div className="text-sm text-blue-600 font-medium">• Program-specific metrics • Branch comparisons • Success rate tracking</div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Multi-Location Management</h3>
              <p className="text-gray-600 mb-4">Seamlessly manage HR operations across all SLBFE branches from Colombo to remote district offices.</p>
              <div className="text-sm text-green-600 font-medium">• Centralized oversight • Location-based reporting • Resource allocation</div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <HeadphonesIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">24/7 Support Integration</h3>
              <p className="text-gray-600 mb-4">Integrate with SLBFE's hotline (1989) and WhatsApp support for comprehensive employee assistance.</p>
              <div className="text-sm text-purple-600 font-medium">• Help desk integration • Emergency protocols • Multi-channel support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Modernize SLBFE's HR Operations?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join the digital transformation of Sri Lanka's leading foreign employment bureau. 
            Streamline operations that support thousands of migrant workers and their families.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Access SLBFE HR System
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">SLBFE HRM</span>
              </div>
              <p className="text-gray-400 mb-4">
                Sri Lanka Bureau of Foreign Employment HR Management System
              </p>
              <p className="text-sm text-gray-500">
                Empowering the workforce behind Sri Lanka's foreign employment sector
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">HR Modules</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Employee Management</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Training Coordination</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Branch Operations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Performance Analytics</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support & Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">User Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Training Materials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">System Updates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Technical Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">SLBFE Contact</h4>
              <div className="space-y-2 text-gray-400">
                <p className="flex items-center">
                  <span className="w-4 h-4 mr-2">📧</span>
                  info_center@slbfe.lk
                </p>
                <p className="flex items-center">
                  <span className="w-4 h-4 mr-2">📞</span>
                  Hotline: 1989
                </p>
                <p className="flex items-center">
                  <span className="w-4 h-4 mr-2">📱</span>
                  WhatsApp: +94 71 9 802 822
                </p>
                <p className="flex items-center">
                  <span className="w-4 h-4 mr-2">🌐</span>
                  www.slbfe.lk
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SLBFE HR Management System. All rights reserved.</p>
            <p className="text-sm mt-1">Supporting Sri Lanka's Bureau of Foreign Employment operations nationwide</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SLBFELandingPage;