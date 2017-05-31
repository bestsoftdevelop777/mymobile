import React, { Component } from "react";
import PlanCarousel from "./PlanCarousel";

import travelInsurancePrices from "../data/travelInsurancePrices";

export default function TravelInsurancePlanCarousel({
  travelDestination,
  recipient,
  travelDuration,
  onSelectPlan
}) {
  const planTitles = ["Basic", "Enhanced", "Superior", "Premier"];
  const getPlanTitle = index => planTitles[index] + " Plan";
  const renderCoverages = plan => null;
  const planPrices =
    travelInsurancePrices[travelDestination][travelDuration][recipient];
  const plans = planTitles.map(p => ({ premium: planPrices[p] }));
  return (
    <PlanCarousel
      getPlanTitle={getPlanTitle}
      renderCoverages={renderCoverages}
      onSelectPlan={planIndex => {
        const price = planPrices[planTitles[planIndex]];
        onSelectPlan(planIndex, price);
      }}
      plans={plans}
    />
  );
}
