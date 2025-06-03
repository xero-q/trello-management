interface CardMetrics {
  name: string;
  description: string;
}

interface ListMetrics {
  id: string;
  name: string;
  cards: CardMetrics[];
}

interface BoardMetrics {
  id: string;
  lists: ListMetrics[];
}

interface UserMetrics {
  boards: BoardMetrics[];
}

export type { CardMetrics, ListMetrics, BoardMetrics, UserMetrics };
