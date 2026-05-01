import { Redirect, type Href } from "expo-router";

/** Rota inicial das tabs: grupo (tabs) não entra na URL; primeira tela é Home. */
export default function TabsIndex() {
  return <Redirect href={"/Home" as Href} />;
}
