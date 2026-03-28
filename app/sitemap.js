export default function sitemap() {
  const base = "https://kisansathi.vercel.app";
  return [
    { url: base,         lastModified: new Date(), changeFrequency: "weekly",  priority: 1   },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/news`,  lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
  ];
}
