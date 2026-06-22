export interface FluidComp {
  l: string;
  v: string;
}

export interface FluidIndWarn {
  i: string;
  t: string;
}

export interface FluidPop {
  g: string;
  n: string;
}

export interface FluidRef {
  t: string;
  j: string;
  d?: string;
}

export interface PackageData {
  pkg: string[];
  pkgRef: string;
  pkgComp: FluidComp[];
}

export interface FluidItem {
  id: string;
  name: string;
  alias: string;
  cat: string;
  badge: string;
  osm: string;
  img: string;
  deprecated?: boolean;
  pending?: boolean;
  comp: FluidComp[];
  ind: FluidIndWarn[];
  warn: FluidIndWarn[];
  tips: string[];
  ref: FluidRef[];
  pop: FluidPop[];
  packageData?: PackageData;
}
