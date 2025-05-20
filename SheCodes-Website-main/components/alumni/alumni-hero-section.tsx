import Image from 'next/image';

const AlumniHeroSection: React.FC = () => {
    const textShadowStyle = '1px 3px 3px rgba(0, 0, 0, 0.4)';

  return (
    <section className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
        <div className="order-2 lg:order-1 flex flex-col justify-center h-full bg-blueSky p-12 md:p-16 lg:p-20 text-center lg:text-left min-h-[50vh] lg:min-h-[65vh] bg-blueSky">
            <blockquote className="space-y-6 mx-auto lg:mx-0"> {/* Limit text width if needed */}
                <p
                className="text-3xl md:text-4xl lg:text-5xl font-bold leading-normal md:leading-normal lg:leading-normal text-white"
                style={{ textShadow: textShadowStyle }}
                >
                “Every step she takes is a path for others to follow”
                </p>
                <footer className="text-lg md:text-xl font-medium text-white opacity-90">
                - SheCodes Society
                </footer>
            </blockquote>
        </div>

        <div className="order-1 lg:order-2 w-full relative h-[45vh] lg:h-auto"> 
           <Image
            src="/documentation/documentation4.jpeg"
            alt="Woman working on laptop at desk" 
            fill
            className="object-cover"
            sizes="(max-width: 1023px) 100vw, 50vw"
            priority
          />
        </div>

        <div
            aria-hidden="true"
            className={`
                hidden lg:block           absolute inset-y-0 left-1/2 
                w-32                       
                z-10 pointer-events-none
                bg-gradient-to-r from-blueSky to-transparent /* Fades right */
            `}
        ></div>

        {/* Gradient Overlay 2: Fades Left (Covers Image Edge) */}
        {/* Starts transparent at right edge of gradient div, fades purple <- transparent over the image */}
        <div
            aria-hidden="true"
            className={`
                hidden lg:block absolute inset-y-0 right-1/2 
                w-32                      
                z-10 pointer-events-none
                bg-gradient-to-l from-blueSky to-transparent /* Fades left */
            `}
        ></div>

      </div>
    </section>
  );
};

export default AlumniHeroSection;