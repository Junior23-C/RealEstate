interface OrganizationStructuredDataProps {
  name?: string;
  url?: string;
  logo?: string;
}

export function OrganizationStructuredData({ 
  name = "Aliaj Real Estate",
  url = "https://aliaj-re.com",
  logo = "https://aliaj-re.com/logo.png"
}: OrganizationStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "url": url,
    "logo": logo,
    "description": "Premium real estate agency specializing in properties for rent and sale",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-123-4567",
      "contactType": "customer service"
    },
    "sameAs": [
      "https://facebook.com/aliajrealestate",
      "https://twitter.com/aliajrealestate",
      "https://linkedin.com/company/aliajrealestate"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface PropertyStructuredDataProps {
  property: {
    id: string;
    title: string;
    description: string;
    price: number;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    images: { url: string; alt?: string | null }[];
  };
}

export function PropertyStructuredData({ property }: PropertyStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "url": `https://aliaj-re.com/properties/${property.id}`,
    "image": property.images.map(img => img.url),
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "USD"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.address,
      "addressLocality": property.city,
      "addressRegion": property.state,
      "postalCode": property.zipCode,
      "addressCountry": "US"
    },
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.squareFeet,
      "unitText": "square feet"
    },
    "numberOfRooms": property.bedrooms,
    "numberOfBathroomsTotal": property.bathrooms
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}