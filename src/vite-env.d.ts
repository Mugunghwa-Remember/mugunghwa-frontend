/// <reference types="vite/client" />

declare module "leaflet.markercluster" {
  // minimal type shim for MarkerClusterGroup used in this app
  import * as L from "leaflet";
  export interface MarkerClusterGroupOptions extends L.MarkerOptions {
    chunkedLoading?: boolean;
    spiderfyOnMaxZoom?: boolean;
    showCoverageOnHover?: boolean;
    iconCreateFunction?: (cluster: any) => L.DivIcon;
  }
  export class MarkerClusterGroup extends L.LayerGroup {
    constructor(options?: MarkerClusterGroupOptions);
    addLayer(layer: L.Layer): this;
    clearLayers(): this;
    refreshClusters(): void;
    getChildCount?(): number;
  }
  export default function markerClusterGroup(
    options?: MarkerClusterGroupOptions
  ): MarkerClusterGroup;
}
