import Image from 'next/image';
import Link from 'next/link'; 
import { Alumni } from '@/types/alumnis'; 
import { FaEnvelope, FaInstagram, FaLinkedin, FaPhone } from 'react-icons/fa'; 
interface AlumniCardProps {
  alumni: Alumni;
}

const AlumniCard: React.FC<AlumniCardProps> = ({ alumni }) => {
  const iconSize = 20; 
  const iconColor = "border rounded-full cursor-pointer text-gray-600 hover:text-pink p-1"; 

  return (
    <div className="flex flex-col items-center text-center pb-16">
      <div className="relative w-64 h-64 md:w-80 md:h-80 mb-4 rounded-full overflow-hidden shadow-md">
        <Image
          src={alumni.imageSrc}
          alt={alumni.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 144px, 160px" // Corresponds to w-36/h-36 and md:w-40/h-40
        />
      </div>
      <h4 className="text-lg md:text-xl font-semibold text-pink mb-2">{alumni.name}</h4>
      {/* Optional: Display batch or short title */}
      {/* <p className="text-sm text-gray-500 mb-3">Batch {alumni.batch}</p> */}
      <div className="flex space-x-4">
        {alumni.instagram && (
          <a href={alumni.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${alumni.name}'s Email`} className={iconColor}>
            <FaInstagram size={iconSize} className=''/>
          </a>
        )}
        {alumni.linkedin && (
          <a href={alumni.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${alumni.name}'s LinkedIn`} className={iconColor}>
            <FaLinkedin size={iconSize} />
          </a>
        )}
        
      </div>
      {/* You could add the 'story' here, maybe truncated with a "Read More" link */}
      {/* <p className="text-sm text-gray-600 mt-3 line-clamp-3">{alumni.story}</p> */}
    </div>
  );
};

export default AlumniCard;