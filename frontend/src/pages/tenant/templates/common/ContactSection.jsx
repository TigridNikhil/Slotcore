import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

export default function ContactSection({
  org,
  showMap = true,
  showContact = true,
}) {
  const primaryColor = org.primaryColor || "#000000";

  if (!showMap && !showContact) return null;

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12">
        {/* Contact Info */}
        {showContact && (
          <div className={!showMap ? "md:col-span-2 text-center" : ""}>
            <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto md:mx-0">
              Have questions or need assistance? We are here to help you. Reach
              out to us via phone, email, or visit our location.
            </p>

            <div
              className={`space-y-6 ${
                !showMap ? "flex flex-col items-center" : ""
              }`}
            >
              {org.address && (
                <div className="flex items-start gap-4">
                  <FaMapMarkerAlt
                    className="text-xl mt-1"
                    style={{ color: primaryColor }}
                  />
                  <div>
                    <h4 className="font-bold">Location</h4>
                    <p className="text-gray-400">{org.address}</p>
                  </div>
                </div>
              )}

              {org.contactPhone && (
                <div className="flex items-start gap-4">
                  <FaPhone
                    className="text-xl mt-1"
                    style={{ color: primaryColor }}
                  />
                  <div>
                    <h4 className="font-bold">Phone</h4>
                    <p className="text-gray-400">{org.contactPhone}</p>
                  </div>
                </div>
              )}

              {org.contactEmail && (
                <div className="flex items-start gap-4">
                  <FaEnvelope
                    className="text-xl mt-1"
                    style={{ color: primaryColor }}
                  />
                  <div>
                    <h4 className="font-bold">Email</h4>
                    <p className="text-gray-400">{org.contactEmail}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Map Placeholder */}
        {/* Google Maps Embed */}
        {showMap && (
          <div
            className={`h-80 rounded-lg overflow-hidden relative z-0 ${
              !showContact ? "md:col-span-2" : ""
            }`}
          >
            {org.address ? (
              <iframe
                title="map"
                width="100%"
                height="100%"
                frameBorder="0"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  org.address
                )}&output=embed`}
                allowFullScreen
              ></iframe>
            ) : (
              <div className="h-full w-full bg-gray-800 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FaMapMarkerAlt className="text-4xl mx-auto mb-2" />
                  <p>Map unavailable</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
