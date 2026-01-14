export default function ServiceList({ services, onSelect, loading }) {
  if (loading)
    return (
      <div className="text-gray-500 text-center py-4">Loading services...</div>
    );
  if (services.length === 0)
    return (
      <div className="text-gray-500 text-center py-4">
        No services available.
      </div>
    );

  return (
    <div className="grid gap-4">
      {services.map((service) => (
        <div
          key={service.id}
          onClick={() => onSelect(service)}
          className="border p-4 rounded-lg hover:border-indigo-500 cursor-pointer transition flex justify-between items-center bg-white shadow-sm hover:shadow-md"
        >
          <div>
            <h3 className="font-semibold text-gray-900">{service.name}</h3>
            <div className="text-sm text-gray-500 mt-1">
              <span>{service.durationMin} mins</span>
              <span className="mx-2">•</span>
              <span>${service.price}</span>
            </div>
            {service.description && (
              <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                {service.description}
              </p>
            )}
          </div>
          <span className="text-indigo-600 font-medium px-3 py-1 bg-indigo-50 rounded-full text-sm">
            Select
          </span>
        </div>
      ))}
    </div>
  );
}
