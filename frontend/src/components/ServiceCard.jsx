const ServiceCard = ({ title, description, icon, link }) => {
  return (
    <div className="bg-dark-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border border-dark-700">
      <div className="flex items-center mb-4">
        <span className="text-4xl mr-4">{icon}</span>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
      <p className="text-gray-400 mb-4">{description}</p>
      {link && (
        <a
          href={link}
          className="text-primary-400 hover:text-primary-300 font-medium inline-flex items-center"
        >
          Learn more →
        </a>
      )}
    </div>
  );
};

export default ServiceCard;

