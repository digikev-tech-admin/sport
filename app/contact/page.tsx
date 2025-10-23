'use client'
import { Mail, Phone, MapPin } from "lucide-react";

const ContactPage = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: ["support@sportadmin.com", "info@sportadmin.com"],
      description: "Send us an email and we'll respond within 24 hours"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["123 Sports Street", "City, State 12345", "United States"],
      description: "Come say hello at our office"
    },
    {
        icon: Phone,
        title: "Call Us",
        details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
        description: "Mon-Fri from 9AM to 6PM EST"
      },
  ];

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Information</h1>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          {/* First Column - First Two Cards */}
          <div className="space-y-6">
            {contactInfo.slice(0, 2).map((info, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#742193] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <info.icon className="h-6 w-6 text-[#742193]" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                    <div className="space-y-1">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                      ))}
                    </div>
                    <p className="text-gray-500 text-xs mt-2">{info.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Second Column - Third Card */}
          <div className="space-y-6">
            {contactInfo.slice(2, 3).map((info, index) => (
              <div key={index + 2} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#742193] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <info.icon className="h-6 w-6 text-[#742193]" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                    <div className="space-y-1">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                      ))}
                    </div>
                    <p className="text-gray-500 text-xs mt-2">{info.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
