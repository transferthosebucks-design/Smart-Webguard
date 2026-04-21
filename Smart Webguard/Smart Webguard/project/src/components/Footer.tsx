import React from 'react';
import { Shield, Mail, Globe, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)'
        }}
      ></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-8 w-8 text-red-500" />
              <div>
                <h3 className="text-xl font-bold">Team Wise Coders</h3>
                <p className="text-gray-400 text-sm">Cybersecurity Research Team</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Leading the fight against cyber threats with advanced AI and machine learning 
              technologies. Our mission is to make the digital world safer for everyone.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Threat Detection</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security Audits</a></li>
              <li><a href="#" className="hover:text-white transition-colors">ML Consulting</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Custom Solutions</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2 text-gray-300">
              <p>Email: bklboys149@gmail.com</p>
              <p>Phone: +91 8698037802</p>
              <p>Location: Boisar, Maharashtra, India 401504</p>
              <p className="text-sm text-gray-400 mt-4">
                Available 24/7 for security emergencies
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Team Wise Coders, Maharashtra, India. All rights reserved. | Advanced AI Threat Detection
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Security</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}