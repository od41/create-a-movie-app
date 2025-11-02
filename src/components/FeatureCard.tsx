import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon, 
  color = 'blue' 
}): JSX.Element => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
  } as const;

  const iconColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600', 
    purple: 'text-purple-600',
    orange: 'text-orange-600',
  } as const;

  return (
    <div className={`p-6 rounded-lg border-2 ${colorClasses[color]} hover:shadow-lg transition-shadow duration-300`}>
      <div className={`text-4xl mb-4 ${iconColorClasses[color]}`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {title}
      </h3>
      <p className="opacity-80">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
