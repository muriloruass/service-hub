import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header / Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Service Hub</span>
            </div>
            <div className="flex gap-4">
              <Link
                to="/marketplace"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
              >
                Services
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Your Trusted{' '}
            <span className="text-blue-600">Service Hub</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Welcome to our Service Hub — a one-stop platform connecting you with trusted
            Brazilian service providers. Here, you'll find a wide range of professionals,
            all reviewed and rated by customers to help you make confident choices.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/marketplace"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              Browse Services
            </Link>
            <Link
              to="/signup?type=client"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Join as Client
            </Link>
            <Link
              to="/signup?type=provider"
              className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
            >
              Join as Provider
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Service Hub?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Easy Discovery</h3>
              <p className="text-gray-600">
                Whether you're looking for a relaxing massage, home services, technical
                support, or operational assistance, our platform makes it easy to discover
                and hire the right expert for your needs.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2">Verified Reviews</h3>
              <p className="text-gray-600">
                All professionals are reviewed and rated by real customers, helping you
                make confident choices for your service needs.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2">Direct Connection</h3>
              <p className="text-gray-600">
                Explore, compare, and connect — everything you need, all in one place.
                Find the perfect professional for your specific requirements.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <p className="text-lg text-gray-700 mb-8">
            Whether you're looking for a relaxing massage, home services, technical support, 
            or operational assistance, our platform makes it easy to discover and hire the 
            right expert for your needs.
          </p>
          <p className="text-lg text-gray-700 font-medium">
            Explore, compare, and connect — everything you need, all in one place.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Join our community today and start connecting with trusted service providers.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/marketplace"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-medium"
            >
              Explore Services
            </Link>
            <Link
              to="/signup?type=client"
              className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Join as Client
            </Link>
            <Link
              to="/signup?type=provider"
              className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Join as Provider
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2025 Service Hub. All rights reserved.</p>
          <p className="text-gray-400 text-sm mt-2">
            Connecting you with trusted Brazilian service providers
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;