declare namespace naver.maps {
  class Map {
    constructor(elementId: string, options: MapOptions);
    setCenter(center: LatLng, animated?: boolean): void;
    panTo(center: LatLng, options?: PanOptions): void;
  }

  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
    getPosition(): LatLng;
  }

  interface MapOptions {
    center: LatLng;
    zoom: number;
    minZoom?: number;
    maxZoom?: number;
    tileDuration?: number;
    baseTileOpacity?: number;
    tileSpare?: number;
    mapDataControl?: boolean;
  }

  interface PanOptions {
    duration?: number;
    easing?: string;
  }

  interface MarkerOptions {
    position: LatLng;
    map: Map;
    icon?: MarkerIcon;
  }

  interface MarkerIcon {
    content: string;
    size?: Size;
    anchor?: Point;
  }

  class Size {
    constructor(width: number, height: number);
  }

  class Point {
    constructor(x: number, y: number);
  }

  namespace Event {
    function addListener(
      instance: Map,
      eventName: string,
      listener: (e: any) => void
    ): void;
    function addListener(
      instance: Marker,
      eventName: string,
      listener: (e: any) => void
    ): void;
  }
}
