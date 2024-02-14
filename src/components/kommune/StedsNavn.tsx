export interface StedsNavn {
  sprak: "nor" | "sma" | "sme" | "smj" | "fkv";
  navn: string;
}

export function getStedsNavn({ navn }: { navn: StedsNavn[] }) {
  return navn.find((n) => n.sprak === "nor")!.navn;
}
