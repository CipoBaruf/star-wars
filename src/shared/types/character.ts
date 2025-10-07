export interface Character {
  name: string;
  birth_year: string;
  eye_color: string;
  gender: string;
  hair_color: string;
  height: string;
  mass: string;
  skin_color: string;
  homeworld: string;
  films: string[];
  species: string[];
  starships: string[];
  vehicles: string[];
  url: string;
}

export interface CharacterPageProps {
  characters: Character[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
}
