import situationsData from "@/data/situations.json";
import { Situation } from "@/types";
import SituationFlowClient from "@/components/SituationFlowClient";

const situations = situationsData as Situation[];

export function generateStaticParams() {
  return situations.map((s) => ({ id: s.id }));
}

export const dynamicParams = false;

export default function SituationFlowPage({ params }: { params: { id: string } }) {
  return <SituationFlowClient id={params.id} />;
}
