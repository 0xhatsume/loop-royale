import { overridableComponent } from "@latticexyz/recs";
import { SetupNetworkResult } from "./setupNetwork";

export type ClientComponents = ReturnType<typeof createClientComponents>;

export function createClientComponents({ components }: SetupNetworkResult) {
  return {
    ...components,
    BmPosition: overridableComponent(components.BmPosition),
    BmPlayer: overridableComponent(components.BmPlayer)
  };
}
