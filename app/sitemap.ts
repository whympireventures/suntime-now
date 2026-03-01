import { MetadataRoute } from "next";
import { CITIES, getAllCountrySlugs } from "@/lib/cities";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://sunrisesunset.info"; // Update with your domain

  const cityPages = CITIES.map((city) => ({
    url: `${baseUrl}/sun/${city.countrySlug}/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: city.population && city.population > 1000000 ? 0.9 : 0.7,
  }));

  const countryPages = getAllCountrySlugs().map((slug) => ({
    url: `${baseUrl}/sun/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...countryPages,
    ...cityPages,
  ];
}
