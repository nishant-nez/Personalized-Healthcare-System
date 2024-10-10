interface IPhotos {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
}

export interface IHospital {
  business_status: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: string;
      lng: string;
    };
    viewport: {
      northeast: Location;
      southwest: Location;
    };
  };
  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  name: string;
  opening_hours: {
    open_now: boolean;
  };
  photos: IPhotos[];
  place_id: string;
  plus_code: {
    compound_code: string;
    global_code: string;
  };
  rating: number;
  references: number;
  types: string[];
  user_ratings_total: number;
  photo_url: string;
}

export interface INearestHospital {
  business_status: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: string;
      lng: string;
    };
    viewport: {
      northeast: Location;
      southwest: Location;
    };
  };
  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  name: string;
  opening_hours: {
    open_now: boolean;
  };
  photos: IPhotos[];
  place_id: string;
  plus_code: {
    compound_code: string;
    global_code: string;
  };
  rating: number;
  references: number;
  types: string[];
  user_ratings_total: number;
  photo_url: string;
  // location
  origin_address: string[];
  destination_address: string[];
  distance: {
    text: string;
    value: number;
  };
  duration: {
    text: string;
    value: number;
  };
}
