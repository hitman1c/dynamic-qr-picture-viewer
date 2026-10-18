export type PictureSource = 'upload' | 'url' | 'default';

export interface Picture {
  id: string;
  imageUrl: string;
  source: PictureSource;
  createdAt: string;
  updatedAt: string;
}

export interface OwnedPicture extends Picture {
  editToken: string;
}

export interface PictureRef {
  id: string;
  editToken: string;
}
