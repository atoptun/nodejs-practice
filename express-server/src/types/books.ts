export interface Book {
  id: number;
  title: string;
  author: string;
  year?: number;
}

export interface CreateBookBody {
  title: string;
  author: string;
}

export interface UpdateBookBody {
  title?: string;
  author?: string;
  year?: number;
}
