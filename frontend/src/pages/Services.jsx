import { useState, useEffect } from 'react';
import axios from '../api/axios';
import ServiceCard from '../components/ServiceCard';

const Services = () => {
  const [feedbackForm, setFeedbackForm] = useState({ name: '', email: '', message: '' });
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [submittedFeedback, setSubmittedFeedback] = useState([]);
  const [submittedContacts, setSubmittedContacts] = useState([]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/labs/feedback', feedbackForm);
      setFeedbackMessage('Feedback submitted successfully!');
      setSubmittedFeedback([...submittedFeedback, feedbackForm]);
      setFeedbackForm({ name: '', email: '', message: '' });
    } catch (error) {
      setFeedbackMessage('Error submitting feedback. Please try again.');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/labs/contact', contactForm);
      setContactMessage('Contact message submitted successfully!');
      setSubmittedContacts([...submittedContacts, contactForm]);
      setContactForm({ name: '', email: '', message: '' });
    } catch (error) {
      setContactMessage('Error submitting contact message. Please try again.');
    }
  };

  const services = [
    {
      title: 'Web Application Security Testing',
      description:
        'Comprehensive security testing for web applications including vulnerability scanning, penetration testing, and security audits.',
      icon: '🌐',
      link: '/labs',
    },
    {
      title: 'Vulnerability Assessment',
      description:
        'Identify and assess security vulnerabilities in your applications and infrastructure with detailed reporting.',
      icon: '🔍',
      link: '/labs',
    },
    {
      title: 'Penetration Testing',
      description:
        'Simulated cyber attacks to test your security defenses and identify potential weaknesses before real attackers do.',
      icon: '🎯',
      link: '/labs',
    },
    {
      title: 'Security Audits',
      description:
        'Thorough security audits of your systems, applications, and processes to ensure compliance and best practices.',
      icon: '📋',
      link: '/labs',
    },
    {
      title: 'Risk Analysis & Reporting',
      description:
        'Detailed risk analysis and comprehensive reporting to help you understand and mitigate security risks.',
      icon: '📊',
      link: '/reports',
    },
    {
      title: 'Security Training & Labs',
      description:
        'Hands-on security training labs where you can learn about vulnerabilities in a safe, controlled environment.',
      icon: '🎓',
      link: '/labs',
    },
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Our Security Services</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive cybersecurity solutions to protect your digital assets and infrastructure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-dark-800 rounded-lg p-8 border border-dark-700">
            <h2 className="text-2xl font-bold text-white mb-4">Feedback</h2>
            <p className="text-gray-400 mb-6">
              Share your thoughts about our services and help us improve.
            </p>
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={feedbackForm.name}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={feedbackForm.email}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <textarea
                placeholder="Your Feedback"
                value={feedbackForm.message}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 h-24 resize-none"
                required
              />
              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-md transition-colors"
              >
                Submit Feedback
              </button>
            </form>
            {feedbackMessage && (
              <p className="mt-4 text-center text-green-400">{feedbackMessage}</p>
            )}
            {submittedFeedback.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Feedback</h3>
                <div className="space-y-4">
                  {submittedFeedback.map((feedback, index) => (
                    <div key={index} className="bg-dark-700 rounded-lg p-4 border border-dark-600">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">{feedback.name}</span>
                        <span className="text-sm text-gray-400">{feedback.email}</span>
                      </div>
                      <div
                        className="text-sm text-gray-300"
                        dangerouslySetInnerHTML={{ __html: feedback.message }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-dark-800 rounded-lg p-8 border border-dark-700">
            <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-gray-400 mb-6">
              Get in touch with our team for inquiries or support.
            </p>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <textarea
                placeholder="Your Message"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 h-24 resize-none"
                required
              />
              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-md transition-colors"
              >
                Send Message
              </button>
            </form>
            {contactMessage && (
              <p className="mt-4 text-center text-green-400">{contactMessage}</p>
            )}
            {submittedContacts.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Messages</h3>
                <div className="space-y-4">
                  {submittedContacts.map((contact, index) => (
                    <div key={index} className="bg-dark-700 rounded-lg p-4 border border-dark-600">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">{contact.name}</span>
                        <span className="text-sm text-gray-400">{contact.email}</span>
                      </div>
                      <div
                        className="text-sm text-gray-300"
                        dangerouslySetInnerHTML={{ __html: contact.message }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;

