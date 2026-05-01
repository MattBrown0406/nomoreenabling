import { Helmet } from "react-helmet";

interface ItemListItem {
  name: string;
  url: string;
  description?: string;
}

interface ItemListJsonLdProps {
  name: string;
  description?: string;
  items: ItemListItem[];
}

const ItemListJsonLd = ({ name, description, items }: ItemListJsonLdProps) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: item.url,
      name: item.name,
      description: item.description,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
};

export default ItemListJsonLd;
