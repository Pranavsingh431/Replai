import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, Briefcase, MessageSquare, MessageCircle } from 'lucide-react';

function Landing() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Animated Glow Styles */}
      <style>{`
        @keyframes breathe {
          0%, 100% {
            opacity: 0.15;
            transform: scale(1) translate(0, 0);
          }
          50% {
            opacity: 0.25;
            transform: scale(1.1) translate(20px, -10px);
          }
        }
        
        @keyframes breathe-secondary {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1) translate(0, 0);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.15) translate(-15px, 15px);
          }
        }
        
        .animated-glow-primary {
          animation: breathe 8s ease-in-out infinite;
        }
        
        .animated-glow-secondary {
          animation: breathe-secondary 10s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <header className="border-b border-gray-200 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <img 
            src="/replai.png" 
            alt="Replai" 
            className="h-8 w-auto cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => navigate('/')}
          />
          <button
            onClick={() => navigate('/app')}
            className="text-sm text-gray-600 hover:text-rose-600 transition-colors"
          >
            Sign in
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white relative overflow-hidden">
        {/* Animated ambient glow - breathing effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="animated-glow-primary absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-rose-400 via-pink-400 to-transparent rounded-full blur-3xl"></div>
          <div className="animated-glow-secondary absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-amber-400 via-rose-300 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-20 pb-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div
              className={`transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 leading-tight mb-6">
                Write the right thing,
                <br />
                when it matters.
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-lg">
                Replai helps you reply better in high-stakes conversations.
              </p>
              <button
                onClick={() => navigate('/app')}
                className="group inline-flex items-center space-x-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-500/25 text-white rounded-lg font-medium transition-all duration-300"
              >
                <span>Try Replai</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Right: Chat Mockup */}
            <div
              className={`transition-all duration-1000 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="relative">
                {/* Red-pink gradient glow behind chat */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-400/20 via-pink-400/15 to-transparent blur-3xl scale-110"></div>
                
                <div className="relative bg-white rounded-2xl border border-gray-200 shadow-2xl p-6 max-w-md mx-auto hover:shadow-rose-500/10 hover:shadow-3xl transition-shadow duration-500">
                  {/* Chat messages */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-end">
                      <div className="bg-gray-900 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-xs">
                        <p className="text-sm">Hey! How's your week going?</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-tl-sm px-4 py-2 max-w-xs">
                        <p className="text-sm">Pretty good! Just wrapped up a big project. You?</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-gray-900 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-xs">
                        <p className="text-sm">Nice! I've been meaning to ask...</p>
                      </div>
                    </div>
                  </div>

                  {/* Replai suggestions */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Replai
                      </span>
                    </div>
                    <div className="space-y-2">
                      <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-rose-50 hover:border-rose-200 border border-transparent rounded-lg transition-all duration-300 group hover:shadow-md hover:-translate-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-rose-600 uppercase tracking-wide">Safe</span>
                          <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
                        </div>
                        <p className="text-sm text-gray-900 mt-1">
                          Want to grab coffee this week?
                        </p>
                      </button>
                      <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-rose-50 hover:border-rose-200 border border-transparent rounded-lg transition-all duration-300 group hover:shadow-md hover:-translate-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-rose-600 uppercase tracking-wide">Flirty</span>
                          <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
                        </div>
                        <p className="text-sm text-gray-900 mt-1">
                          I know a great spot. Free Friday?
                        </p>
                      </button>
                      <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-rose-50 hover:border-rose-200 border border-transparent rounded-lg transition-all duration-300 group hover:shadow-md hover:-translate-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-rose-600 uppercase tracking-wide">Bold</span>
                          <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
                        </div>
                        <p className="text-sm text-gray-900 mt-1">
                          Let's do dinner. Tomorrow at 7?
                        </p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Moments */}
      <section className="bg-gradient-to-b from-rose-50/30 to-white">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h2 className="text-sm font-medium text-rose-600 uppercase tracking-wide mb-4 text-center">
              Moments where the right reply matters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {/* Card 1 */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-rose-200 hover:shadow-rose-500/10">
                <div className="mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex justify-start mb-2">
                      <div className="bg-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900">
                        Hey! How are you?
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-gray-900 rounded-lg px-3 py-1.5 text-xs text-white">
                        Good! You?
                      </div>
                    </div>
                    <div className="text-right mt-2">
                      <span className="text-xs text-gray-400">8 hours ago</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  She replied after 8 hours...
                </h3>
                <p className="text-sm text-gray-600">
                  Is she losing interest or just busy?
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-rose-200 hover:shadow-rose-500/10">
                <div className="mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex justify-start mb-2">
                      <div className="bg-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900">
                        We should hang out sometime
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-gray-900 rounded-lg px-3 py-1.5 text-xs text-white">
                        Definitely! When works?
                      </div>
                    </div>
                    <div className="flex justify-center mt-2">
                      <div className="w-1 h-1 bg-rose-400 rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-rose-400 rounded-full animate-pulse mx-1"></div>
                      <div className="w-1 h-1 bg-rose-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  You want to ask her out
                </h3>
                <p className="text-sm text-gray-600">
                  But don't want to sound desperate
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-rose-200 hover:shadow-rose-500/10">
                <div className="mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex justify-end mb-2">
                      <div className="bg-gray-900 rounded-lg px-3 py-1.5 text-xs text-white">
                        That sounds fun!
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-gray-900 rounded-lg px-3 py-1.5 text-xs text-white">
                        When are you free?
                      </div>
                    </div>
                    <div className="text-right mt-2">
                      <span className="text-xs text-rose-500">Read</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  He left you on read
                </h3>
                <p className="text-sm text-gray-600">
                  Do you double text or walk away?
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What it does */}
      <section className="bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 py-24 relative">
          <div
            className={`transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h2 className="text-sm font-medium text-rose-600 uppercase tracking-wide mb-4">
              What it does
            </h2>
            <p className="text-2xl text-gray-900 leading-relaxed max-w-3xl">
              Replai understands the conversation, remembers the person, and suggests replies that actually move things forward.
            </p>
          </div>
        </div>
      </section>

      {/* Human Image Section - Using Unsplash */}
      <section className="bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-32">
          <div
            className={`transition-all duration-1000 delay-450 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="relative rounded-2xl overflow-hidden h-[500px] flex items-center justify-center shadow-2xl">
              {/* Real stock photo from Unsplash */}
              <img 
                src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=2070&auto=format&fit=crop"
                alt="Two people having coffee and looking at their phones"
                className="absolute inset-0 w-full h-full object-cover filter brightness-75"
              />
              
              {/* Subtle dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent"></div>
              
              {/* Overlay text */}
              <div className="relative z-10 text-center">
                <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4">
                  Real conversations.
                  <br />
                  Real moments.
                </h2>
                <div className="w-16 h-1 bg-rose-500 mx-auto mt-6 shadow-lg shadow-rose-500/50"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gradient-to-br from-rose-50/40 via-white to-rose-50/20 relative">
        <div className="max-w-4xl mx-auto px-6 py-24">
          <div
            className={`transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h2 className="text-sm font-medium text-rose-600 uppercase tracking-wide mb-12">
              How it works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
                <div className="text-4xl font-semibold text-gray-900 mb-4 group-hover:text-rose-600 transition-colors duration-300">
                  01
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Paste a chat
                </h3>
                <p className="text-gray-600">
                  Copy your conversation and paste it into Replai.
                </p>
              </div>
              <div className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
                <div className="text-4xl font-semibold text-gray-900 mb-4 group-hover:text-rose-600 transition-colors duration-300">
                  02
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Get 3 replies
                </h3>
                <p className="text-gray-600">
                  AI analyzes the context and generates three options.
                </p>
              </div>
              <div className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
                <div className="text-4xl font-semibold text-gray-900 mb-4 group-hover:text-rose-600 transition-colors duration-300">
                  03
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Choose what feels right
                </h3>
                <p className="text-gray-600">
                  Pick the reply that matches your style and intent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="bg-white border-y border-rose-100">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div
            className={`transition-all duration-1000 delay-600 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <p className="text-center text-sm text-gray-500">
              Used for Tinder, Bumble, Hinge, Instagram, and LinkedIn
            </p>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="bg-gradient-to-b from-white to-rose-50/30 relative">
        <div className="max-w-4xl mx-auto px-6 py-24">
          <div
            className={`transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h2 className="text-sm font-medium text-rose-600 uppercase tracking-wide mb-12">
              Who it's for
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
                <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-rose-100 group-hover:scale-110 transition-all duration-300 shadow-md">
                  <Heart className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Dating & relationships
                </h3>
                <p className="text-sm text-gray-600">
                  From first messages to real dates
                </p>
              </div>
              <div className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
                <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-rose-100 group-hover:scale-110 transition-all duration-300 shadow-md">
                  <Briefcase className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Networking
                </h3>
                <p className="text-sm text-gray-600">
                  Make the right impression
                </p>
              </div>
              <div className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
                <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-rose-100 group-hover:scale-110 transition-all duration-300 shadow-md">
                  <MessageSquare className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Cold messages
                </h3>
                <p className="text-sm text-gray-600">
                  Break through the noise
                </p>
              </div>
              <div className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
                <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-rose-100 group-hover:scale-110 transition-all duration-300 shadow-md">
                  <MessageCircle className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Important talks
                </h3>
                <p className="text-sm text-gray-600">
                  Say what you mean
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-b from-rose-50/30 to-white">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <div
            className={`transition-all duration-1000 delay-800 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              Ready to reply better?
            </h2>
            <button
              onClick={() => navigate('/app')}
              className="group inline-flex items-center space-x-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-500/25 text-white rounded-lg font-medium transition-all duration-300"
            >
              <span>Try Replai</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <div className="flex items-center space-x-3">
              <img src="/replai.png" alt="Replai" className="h-6 w-auto opacity-60" />
              <span>© 2026 Replai</span>
            </div>
            
            {/* Legal Links */}
            <div className="flex items-center space-x-6">
              <a href="/contact" className="hover:text-rose-600 transition-colors">
                Contact
              </a>
              <a href="/terms" className="hover:text-rose-600 transition-colors">
                Terms
              </a>
              <a href="/privacy" className="hover:text-rose-600 transition-colors">
                Privacy
              </a>
              <a href="/refunds" className="hover:text-rose-600 transition-colors">
                Refunds
              </a>
              <a href="/shipping" className="hover:text-rose-600 transition-colors">
                Shipping
              </a>
            </div>
            
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/app')}
                className="hover:text-rose-600 transition-colors"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
