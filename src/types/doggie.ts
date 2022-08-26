export interface DoggieData {
  id: string;
  ownerId: string;
  imageUrl: string;
  name: string;
  description: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  iframe: string;
}
